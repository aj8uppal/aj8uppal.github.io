/**
 * Unified input.
 *
 * Four schemes feed one abstract state (move vector, aim vector, fire, bomb):
 *   - Keyboard: WASD/ZQSD move, arrows or IJKL aim (classic twin-stick)
 *   - Mouse: aim at cursor, hold to fire
 *   - Gamepad: dual analogue sticks + triggers, with rumble
 *   - Touch: floating thumbsticks, left half moves, right half aims and fires.
 *     When this player only flies or only shoots (Co-Pilot, Pacifism) the
 *     whole screen becomes that one stick.
 *
 * The active scheme is whichever was touched most recently, so switching from
 * pad to mouse mid-run just works.
 */

import { clamp, clamp01, len } from '../core/math.js';

const KEY_ACTIONS = {
  KeyW: 'up', ArrowUp: 'aimUp', KeyS: 'down', ArrowDown: 'aimDown',
  KeyA: 'left', ArrowLeft: 'aimLeft', KeyD: 'right', ArrowRight: 'aimRight',
  KeyI: 'aimUp', KeyK: 'aimDown', KeyJ: 'aimLeft', KeyL: 'aimRight',
  Space: 'bomb', ShiftLeft: 'bomb', ShiftRight: 'bomb',
  Escape: 'pause', KeyP: 'pause',
  Enter: 'confirm', NumpadEnter: 'confirm',
  Backspace: 'cancel',
  KeyR: 'restart',
  KeyM: 'mute',
  KeyF: 'fullscreen',
};

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    // Event-driven (keyboard/mouse) and polled (gamepad) actions are kept in
    // separate sets and unioned on read. Mixing them lets a connected-but-idle
    // gamepad clear an action the keyboard just raised.
    this.actions = new Set();
    this.padActions = new Set();
    this.prevDown = new Set();
    // Presses are also buffered as events. Sampling held-state alone loses a
    // tap that begins and ends between two frames — which is exactly what
    // happens to a quick menu press on a machine dropping frames.
    this.pressBuffer = new Set();

    this.moveX = 0; this.moveY = 0;
    this.aimX = 0; this.aimY = 0;   // unit vector, (0,0) when not aiming
    this.aimActive = false;
    this.firing = false;
    this.autoFire = false;

    this.mouseX = 0; this.mouseY = 0;
    this.mouseDown = false;
    this.mouseInside = false;
    this.mouseMovedAt = -1e9;

    this.scheme = 'keyboard';   // keyboard | mouse | gamepad | touch
    this.gamepadIndex = -1;
    this.deadzone = 0.22;
    this.invertAim = false;
    this.vibration = true;

    this.touchEnabled = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.touches = new Map();
    this.leftStick = { id: null, ox: 0, oy: 0, x: 0, y: 0, active: false };
    this.rightStick = { id: null, ox: 0, oy: 0, x: 0, y: 0, active: false };
    // Stick travel is chosen in CSS pixels (thumb-sized on any screen density)
    // and converted to canvas pixels, which is the space touches arrive in.
    this.stickRadiusCss = 60;
    this.stickRadius = 60;
    this.touchMode = 'split';   // split | move | aim
    this.touchSeenAt = -1e9;

    this._bind();
  }

  _bind() {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      // Typing a callsign or room code must not fly the ship or move the
      // menu focus. Only the keys that leave the field get through.
      if (isEditable(e.target)) {
        const pass = { Enter: 'confirm', NumpadEnter: 'confirm', Escape: 'cancel', ArrowUp: 'aimUp', ArrowDown: 'aimDown' }[e.code];
        if (pass) { this.actions.add(pass); this.pressBuffer.add(pass); }
        return;
      }
      const a = KEY_ACTIONS[e.code];
      if (a || e.code.startsWith('Key') || e.code.startsWith('Arrow') || e.code === 'Space') {
        if (e.code === 'Space' || e.code.startsWith('Arrow') || e.code === 'Tab') e.preventDefault();
      }
      this.keys.add(e.code);
      if (a) {
        this.actions.add(a);
        this.pressBuffer.add(a);
        if (a !== 'pause' && a !== 'confirm' && a !== 'cancel') this.scheme = 'keyboard';
      }
      this.actions.add('any');
      this.pressBuffer.add('any');
    }, { passive: false });

    window.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
      const a = KEY_ACTIONS[e.code];
      if (a) this.actions.delete(a);
      if (e.code === 'Escape') this.actions.delete('cancel');
    });

    window.addEventListener('blur', () => {
      this.keys.clear();
      this.actions.clear();
      this.padActions.clear();
      this.pressBuffer.clear();
      this.mouseDown = false;
      this.touches.clear();
      for (const stick of [this.leftStick, this.rightStick]) { stick.active = false; stick.id = null; }
    });

    const c = this.canvas;
    window.addEventListener('touchstart', () => {
      this.touchSeenAt = performance.now();
      this.scheme = 'touch';
    }, { capture: true, passive: true });
    const syntheticMouse = () => performance.now() - this.touchSeenAt < 1000;

    c.addEventListener('mousemove', (e) => {
      if (syntheticMouse()) return;
      const r = c.getBoundingClientRect();
      this.mouseX = (e.clientX - r.left) * (c.width / r.width);
      this.mouseY = (e.clientY - r.top) * (c.height / r.height);
      this.mouseInside = true;
      this.mouseMovedAt = performance.now();
      this.scheme = 'mouse';
    });
    c.addEventListener('mouseleave', () => { this.mouseInside = false; });
    c.addEventListener('mousedown', (e) => {
      if (syntheticMouse()) return;
      if (e.button === 0) { this.mouseDown = true; this.scheme = 'mouse'; }
      if (e.button === 2) { this.actions.add('bomb'); this.pressBuffer.add('bomb'); }
      this.actions.add('any');
      this.pressBuffer.add('any');
    });
    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouseDown = false;
      if (e.button === 2) this.actions.delete('bomb');
    });
    c.addEventListener('contextmenu', (e) => e.preventDefault());

    // ---- touch: floating thumbsticks
    const toCanvas = (t) => {
      const r = c.getBoundingClientRect();
      return [(t.clientX - r.left) * (c.width / r.width), (t.clientY - r.top) * (c.height / r.height)];
    };
    const onTouchStart = (e) => {
      this.scheme = 'touch';
      const r = c.getBoundingClientRect();
      this.stickRadiusCss = clamp(Math.min(r.width, r.height) * 0.15, 46, 80);
      this.stickRadius = this.stickRadiusCss * (c.width / r.width);
      for (const t of e.changedTouches) {
        const [x, y] = toCanvas(t);
        let stick = null;
        if (this.touchMode === 'move') stick = this.leftStick;
        else if (this.touchMode === 'aim') stick = this.rightStick;
        else stick = x < c.width * 0.5 ? this.leftStick : this.rightStick;
        // A second finger on a side that already has a stick is ignored rather
        // than yanking the stick to a new origin mid-manoeuvre.
        if (stick.id === null) {
          stick.id = t.identifier;
          stick.ox = x; stick.oy = y; stick.x = x; stick.y = y;
          stick.active = true;
        }
        this.touches.set(t.identifier, { x, y });
      }
      this.actions.add('any');
      this.pressBuffer.add('any');
      e.preventDefault();
    };
    const onTouchMove = (e) => {
      const R = this.stickRadius;
      for (const t of e.changedTouches) {
        const [x, y] = toCanvas(t);
        this.touches.set(t.identifier, { x, y });
        for (const stick of [this.leftStick, this.rightStick]) {
          if (stick.id !== t.identifier) continue;
          stick.x = x; stick.y = y;
          // The base follows a thumb that runs past the rim, so reversing
          // direction responds immediately instead of first crossing back.
          const dx = x - stick.ox, dy = y - stick.oy;
          const d = Math.hypot(dx, dy);
          if (d > R) {
            stick.ox = x - (dx / d) * R;
            stick.oy = y - (dy / d) * R;
          }
        }
      }
      e.preventDefault();
    };
    const onTouchEnd = (e) => {
      for (const t of e.changedTouches) {
        this.touches.delete(t.identifier);
        for (const stick of [this.leftStick, this.rightStick]) {
          if (stick.id === t.identifier) { stick.id = null; stick.active = false; stick.x = stick.ox; stick.y = stick.oy; }
        }
      }
      e.preventDefault();
    };
    c.addEventListener('touchstart', onTouchStart, { passive: false });
    c.addEventListener('touchmove', onTouchMove, { passive: false });
    c.addEventListener('touchend', onTouchEnd, { passive: false });
    c.addEventListener('touchcancel', onTouchEnd, { passive: false });

    window.addEventListener('gamepadconnected', (e) => {
      this.gamepadIndex = e.gamepad.index;
      this.scheme = 'gamepad';
    });
    window.addEventListener('gamepaddisconnected', (e) => {
      if (this.gamepadIndex === e.gamepad.index) this.gamepadIndex = -1;
    });
  }

  _applyDeadzone(x, y) {
    const m = len(x, y);
    if (m < this.deadzone) return [0, 0, 0];
    // Rescale so output ramps from 0 at the deadzone edge to 1 at full tilt.
    const scaled = Math.min(1, (m - this.deadzone) / (1 - this.deadzone));
    return [(x / m) * scaled, (y / m) * scaled, scaled];
  }

  pollGamepad() {
    if (!navigator.getGamepads) return null;
    const pads = navigator.getGamepads();
    let pad = this.gamepadIndex >= 0 ? pads[this.gamepadIndex] : null;
    if (!pad || !pad.connected) {
      pad = null;
      for (const p of pads) {
        if (p && p.connected) { pad = p; this.gamepadIndex = p.index; break; }
      }
    }
    return pad;
  }

  /** Update derived state. `camera` converts mouse pixels to world space. */
  update(camera, playerX, playerY) {
    this.gamepadState = null;
    const pad = this.pollGamepad();
    if (!pad) this.padActions.clear();

    let mx = 0, my = 0, ax = 0, ay = 0, aimActive = false, fire = false;

    // --- gamepad
    if (pad) {
      const [lx, ly, lm] = this._applyDeadzone(pad.axes[0] || 0, pad.axes[1] || 0);
      const [rx, ry, rm] = this._applyDeadzone(pad.axes[2] || 0, pad.axes[3] || 0);
      const btn = (i) => pad.buttons[i] && (pad.buttons[i].pressed || pad.buttons[i].value > 0.4);
      const active = lm > 0 || rm > 0 || pad.buttons.some((b) => b.pressed);
      if (active) this.scheme = 'gamepad';
      if (this.scheme === 'gamepad') {
        mx = lx; my = -ly;
        if (rm > 0) { ax = rx; ay = -ry; aimActive = true; fire = true; }
        if (btn(7) || btn(5)) fire = true;     // RT / RB
        if (btn(12)) { ay = 1; ax = 0; aimActive = true; fire = true; }
        if (btn(13)) { ay = -1; ax = 0; aimActive = true; fire = true; }
        if (btn(14)) { ax = -1; ay = 0; aimActive = true; fire = true; }
        if (btn(15)) { ax = 1; ay = 0; aimActive = true; fire = true; }
        this._padAction('bomb', btn(0) || btn(1) || btn(6) || btn(4));
        this._padAction('pause', btn(9));
        this._padAction('confirm', btn(0));
        this._padAction('cancel', btn(1));
        this.gamepadState = pad;
      }
    }

    // --- keyboard movement always contributes
    const k = this.keys;
    let kx = 0, ky = 0;
    if (k.has('KeyA') || k.has('KeyQ')) kx -= 1;
    if (k.has('KeyD')) kx += 1;
    if (k.has('KeyW') || k.has('KeyZ')) ky += 1;
    if (k.has('KeyS')) ky -= 1;
    if (kx || ky) {
      const m = len(kx, ky) || 1;
      mx = kx / m; my = ky / m;
      if (this.scheme === 'gamepad') this.scheme = 'keyboard';
    }

    // --- keyboard aim (arrows / IJKL) takes priority over the mouse
    let akx = 0, aky = 0;
    if (k.has('ArrowLeft') || k.has('KeyJ')) akx -= 1;
    if (k.has('ArrowRight') || k.has('KeyL')) akx += 1;
    if (k.has('ArrowUp') || k.has('KeyI')) aky += 1;
    if (k.has('ArrowDown') || k.has('KeyK')) aky -= 1;
    if (akx || aky) {
      const m = len(akx, aky) || 1;
      ax = akx / m; ay = aky / m;
      aimActive = true;
      fire = true;
      if (this.scheme !== 'keyboard') this.scheme = 'keyboard';
    }

    // --- mouse aim
    if (!aimActive && (this.scheme === 'mouse' || this.scheme === 'keyboard') && this.mouseInside && camera) {
      const w = camera.screenToWorld(this.mouseX, this.mouseY);
      const dx = w.x - playerX;
      const dy = w.y - playerY;
      const m = len(dx, dy);
      if (m > 1e-3) {
        ax = dx / m; ay = dy / m;
        aimActive = true;
      }
      if (this.mouseDown) fire = true;
    }

    // --- touch sticks
    if (this.scheme === 'touch') {
      const R = this.stickRadius;
      const L = this.leftStick;
      if (L.active) {
        const dx = L.x - L.ox, dy = L.y - L.oy;
        const m = len(dx, dy);
        const dead = R * 0.12;
        if (m > dead) {
          // Rescale past the deadzone so small, deliberate nudges still move.
          const s = Math.min(1, (m - dead) / (R - dead));
          mx = (dx / m) * s;
          my = (-dy / m) * s;
        } else {
          mx = 0; my = 0;
        }
      }
      const A = this.rightStick;
      if (A.active) {
        const dx = A.x - A.ox, dy = A.y - A.oy;
        const m = len(dx, dy);
        if (m > R * 0.18) { ax = dx / m; ay = -dy / m; aimActive = true; fire = true; }
        else { fire = true; aimActive = this.aimActive; ax = this.aimX; ay = this.aimY; }
      }
    }

    if (this.invertAim && aimActive) { ax = -ax; ay = -ay; }

    this.moveX = clamp(mx, -1, 1);
    this.moveY = clamp(my, -1, 1);
    if (aimActive) { this.aimX = ax; this.aimY = ay; }
    this.aimActive = aimActive;
    this.firing = fire || this.autoFire;
  }

  /**
   * Zero the gameplay controls for this frame. Online the world keeps running
   * behind a menu, and a ship must not fly off while you adjust a setting.
   */
  neutralize() {
    this.moveX = 0;
    this.moveY = 0;
    this.firing = false;
    this.suppressed = true;
  }

  _padAction(name, down) {
    if (down) this.padActions.add(name);
    else this.padActions.delete(name);
  }

  /** A one-frame press from an on-screen button. */
  tap(action) {
    this.pressBuffer.add(action);
  }

  down(action) { return this.actions.has(action) || this.padActions.has(action); }
  pressed(action) {
    if (this.suppressed && action === 'bomb') return false;
    if (this.pressBuffer.has(action)) return true;
    return this.down(action) && !this.prevDown.has(action);
  }
  released(action) { return !this.down(action) && this.prevDown.has(action); }

  anyPressed() {
    if (this.pressBuffer.size > 0) return true;
    for (const a of this.padActions) if (!this.prevDown.has(a)) return true;
    return this.mouseDown && !this._prevMouseDown;
  }

  endFrame() {
    this.prevDown.clear();
    for (const a of this.actions) this.prevDown.add(a);
    for (const a of this.padActions) this.prevDown.add(a);
    this.prevDown.delete('any');
    this.actions.delete('any');
    this.pressBuffer.clear();
    this.suppressed = false;
    this._prevMouseDown = this.mouseDown;
  }

  rumble(strong = 0.5, weak = 0.3, duration = 120) {
    if (!this.vibration) return;
    const pad = this.pollGamepad();
    if (!pad) {
      // Phones: only the big moments, kept short. (Android; iOS ignores it.)
      if (this.scheme === 'touch' && strong >= 0.6 && navigator.vibrate) {
        navigator.vibrate(Math.round(Math.min(duration, 90) * strong));
      }
      return;
    }
    const act = pad.vibrationActuator;
    if (act && act.playEffect) {
      act.playEffect('dual-rumble', {
        startDelay: 0,
        duration,
        strongMagnitude: clamp01(strong),
        weakMagnitude: clamp01(weak),
      }).catch(() => {});
    }
  }
}

function isEditable(el) {
  if (!el || !el.tagName) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable;
}
