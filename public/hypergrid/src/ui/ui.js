/**
 * UI controller.
 *
 * Menus are data-driven and rendered to DOM so text stays crisp and
 * accessible, while the game itself renders behind them through the bloom
 * pipeline. Every screen is fully navigable with keyboard, gamepad *and*
 * mouse/touch — the focus model is shared, so a hover and a d-pad move are the
 * same event as far as the menu is concerned.
 */

import { commafy, formatTime, clamp, clamp01 } from '../core/math.js';
import { MODE_LIST, SOLO_MODES, ONLINE_MODES, MODES, QUALITY, SCORING, PLAYER_STYLES } from '../game/config.js';
import { save } from '../game/save.js';
import { STATE } from '../game/game.js';
import { NetSession } from '../net/session.js';
import { inviteUrl } from '../net/config.js';

const QUALITY_KEYS = Object.keys(QUALITY);
const CALLSIGN_RE = /[^A-Z0-9 -]/g;

export class UI {
  constructor(game, audio, music, input) {
    this.game = game;
    this.audio = audio;
    this.music = music;
    this.input = input;

    this.root = document.getElementById('overlay');
    this.hud = document.getElementById('hud');
    this.current = null;
    this.focus = 0;
    this.items = [];
    this.navCooldown = 0;
    this.selectedMode = 'evolved';
    this.lastResult = null;

    this.session = null;
    this.netError = '';
    this.joinCode = '';
    this.copied = 0;
    this.refreshTimer = 0;

    if (!save.settings.callsign) {
      save.updateSettings({ callsign: `PILOT ${Math.floor(100 + Math.random() * 900)}` });
    }

    this._cacheHud();
    this._buildScreens();
    this.show('title');
  }

  get callsign() {
    return (save.settings.callsign || 'PILOT').toUpperCase().replace(CALLSIGN_RE, '').trim().slice(0, 10) || 'PILOT';
  }

  // ------------------------------------------------------------------- HUD

  _cacheHud() {
    this.el = {
      score: document.getElementById('hud-score'),
      mult: document.getElementById('hud-mult'),
      multBar: document.getElementById('hud-mult-bar'),
      lives: document.getElementById('hud-lives'),
      bombs: document.getElementById('hud-bombs'),
      best: document.getElementById('hud-best'),
      timer: document.getElementById('hud-timer'),
      timerWrap: document.getElementById('hud-timer-wrap'),
      wave: document.getElementById('hud-wave'),
      waveWrap: document.getElementById('hud-wave-wrap'),
      fps: document.getElementById('hud-fps'),
      modeName: document.getElementById('hud-mode'),
      bombHint: document.getElementById('hud-bomb-hint'),
      net: document.getElementById('hud-net'),
      banner: document.getElementById('net-banner'),
      touchBomb: document.getElementById('touch-bomb'),
      touchBombCount: document.getElementById('touch-bomb-count'),
    };
    this._touchBombs = -1;
    this._netHudKey = '';
  }

  updateHud(fps) {
    const g = this.game;
    const playing = g.state === STATE.PLAYING || g.state === STATE.DYING || g.state === STATE.PAUSED;
    this.hud.classList.toggle('visible', playing);

    const s = this.session;
    let banner = '';
    if (g.online && s) {
      if (!s.isHost && s.stalled && g.state !== STATE.GAMEOVER) banner = 'WAITING FOR THE HOST…';
      else if (s.isHost && s.partnerLost && g.state !== STATE.GAMEOVER) banner = `PARTNER DISCONNECTED · ROOM ${s.code}`;
    }
    this.el.banner.textContent = banner;
    this.el.banner.classList.toggle('hidden', !banner);
    if (!playing) return;

    this.el.score.textContent = commafy(Math.round(g.displayScore));
    this.el.mult.textContent = `x${g.multiplier}`;
    this.el.mult.classList.toggle('hot', g.multiplier >= 10);

    // Single source of truth — this bar must track the real requirement.
    const need = Math.max(1, SCORING.geomsForMultiplier(g.multiplier));
    const atMax = g.multiplier >= SCORING.maxMultiplier;
    this.el.multBar.style.transform = `scaleX(${atMax ? 1 : clamp01(g.geomProgress / need)})`;

    if (g.lives === Infinity || g.mode.lives === Infinity) {
      this.el.lives.innerHTML = '<span class="inf">&#8734;</span>';
    } else {
      this.el.lives.innerHTML = renderIcons(g.lives, 'life');
    }
    this.el.bombs.innerHTML = renderIcons(g.bombs, 'bomb');
    this.el.bombHint.classList.toggle('dim', g.bombs <= 0);
    if (this.el.touchBomb && this._touchBombs !== g.bombs) {
      this._touchBombs = g.bombs;
      this.el.touchBombCount.textContent = String(g.bombs);
      this.el.touchBomb.classList.toggle('empty', g.bombs <= 0);
      // Modes that never grant bombs don't need the button at all.
      this.el.touchBomb.classList.toggle('hidden', g.mode.bombs === 0 && g.bombs === 0);
    }

    this.el.best.textContent = commafy(Math.max(save.highScore(g.mode.id), g.score));
    this.el.modeName.textContent = g.mode.name;

    const timed = g.mode.timeLimit > 0;
    this.el.timerWrap.classList.toggle('hidden', !timed);
    if (timed) {
      const left = Math.max(0, g.mode.timeLimit - g.runTime);
      this.el.timer.textContent = formatTime(left);
      this.el.timer.classList.toggle('urgent', left < 15);
    }

    const waves = g.mode.id === 'waves';
    this.el.waveWrap.classList.toggle('hidden', !waves);
    if (waves) this.el.wave.textContent = String(g.director.wave);

    this._updateNetHud();

    this.el.fps.classList.toggle('hidden', !save.settings.showFps);
    if (save.settings.showFps) {
      this.el.fps.textContent = `${Math.round(fps)} FPS  ·  ${g.enemies.count} E  ·  ${g.particles.count} P`;
    }
  }

  /** Crew chips: who is who, whether their ship is up, and the round-trip time. */
  _updateNetHud() {
    const g = this.game;
    const s = this.session;
    const show = g.online && !!s;
    this.el.net.classList.toggle('hidden', !show);
    if (!show) return;
    const parts = [];
    for (let seat = 0; seat < 2; seat++) {
      const name = s.names[seat] || (seat === 0 ? 'HOST' : 'GUEST');
      const role = s.roleOf(seat);
      const shipIdx = g.mode.id === 'copilot' ? 0 : seat;
      const ship = g.players[shipIdx];
      let status = '';
      if (seat === s.peerSeat && !s.peerPresent) status = 'OFFLINE';
      else if (ship && ship.out) status = 'OUT';
      else if (ship && !ship.alive) status = 'RESPAWNING';
      const color = g.mode.id === 'copilot' ? PLAYER_STYLES[0].css : PLAYER_STYLES[seat].css;
      parts.push(`${seat}|${name}|${role}|${status}|${color}`);
    }
    const ping = s.peerPresent && s.rtt ? Math.round(s.rtt) : 0;
    const key = parts.join('/') + `/${ping}`;
    if (key === this._netHudKey) return;
    this._netHudKey = key;
    this.el.net.innerHTML = parts.map((p) => {
      const [seat, name, role, status, color] = p.split('|');
      const you = Number(seat) === s.localSeat ? ' <em>YOU</em>' : '';
      return `<div class="crew${status ? ' down' : ''}" style="--accent:${color}"><i></i><span class="crew-name">${esc(name)}${you}</span><span class="crew-role">${role}${status ? ` · ${status}` : ''}</span></div>`;
    }).join('') + (ping ? `<div class="ping">${ping} MS</div>` : '');
  }

  // --------------------------------------------------------------- screens

  _buildScreens() {
    this.screens = {
      title: {
        title: '',
        className: 'title-screen',
        items: [
          { label: 'PLAY', action: () => this.show('modes') },
          { label: 'MULTIPLAYER', detail: 'Play online with a friend', action: () => this.show('multiplayer') },
          { label: 'LEADERBOARDS', action: () => this.show('scores') },
          { label: 'HOW TO PLAY', action: () => this.show('help') },
          { label: 'SETTINGS', action: () => this.show('settings') },
        ],
        footer: matchMedia('(pointer: coarse)').matches
          ? 'TAP TO SELECT · TWO THUMBSTICKS IN GAME · BEST IN LANDSCAPE'
          : 'ARROWS / WASD · ENTER TO SELECT · GAMEPAD SUPPORTED',
      },

      modes: {
        title: 'SELECT MODE',
        className: 'modes-screen',
        back: 'title',
        items: SOLO_MODES.map((m) => ({
          label: m.name,
          detail: m.blurb,
          badge: () => {
            const hs = save.highScore(m.id);
            return hs ? `BEST ${commafy(hs)}` : 'NO RECORD';
          },
          action: () => this.startGame(m.id),
          onFocus: () => { this.selectedMode = m.id; },
        })),
        footer: 'ESC TO GO BACK',
      },

      multiplayer: {
        title: 'MULTIPLAYER',
        className: 'multiplayer-screen',
        back: 'title',
        initialFocus: 1,
        items: [
          textItem('CALLSIGN', () => save.settings.callsign, (v) => save.updateSettings({ callsign: v }), {
            max: 10, filter: (v) => v.toUpperCase().replace(CALLSIGN_RE, ''), placeholder: 'YOUR NAME',
          }),
          ...ONLINE_MODES.map((m) => ({
            label: `HOST ${m.name}`,
            detail: m.blurb,
            action: () => this.hostGame(m.id),
          })),
          { label: 'JOIN A FRIEND', detail: 'Enter the four-letter room code they give you', action: () => this.show('join') },
          { label: 'BACK', action: () => this.show('title') },
        ],
        footer: 'ONLINE PLAY USES A SMALL RELAY SERVER · NO ACCOUNT NEEDED',
      },

      join: {
        title: 'JOIN A FRIEND',
        className: 'join-screen',
        back: 'multiplayer',
        autofocus: true,
        items: [
          textItem('ROOM CODE', () => this.joinCode, (v) => { this.joinCode = v; }, {
            max: 4, filter: (v) => v.toUpperCase().replace(/[^A-Z]/g, ''), placeholder: 'ABCD', code: true,
            submit: () => this.joinGame(this.joinCode),
          }),
          { label: 'JOIN', action: () => this.joinGame(this.joinCode) },
          { label: 'BACK', action: () => this.show('multiplayer') },
        ],
        footer: 'OR OPEN THE INVITE LINK YOUR FRIEND SENT',
      },

      connecting: {
        title: 'CONNECTING',
        className: 'connecting-screen',
        custom: () => '<div class="net-status"><div class="spinner"></div><p>REACHING THE RELAY…</p></div>',
        back: () => { this.leaveSession(); return 'multiplayer'; },
        items: [{ label: 'CANCEL', action: () => { this.leaveSession(); this.show('multiplayer'); } }],
      },

      lobby: {
        title: 'LOBBY',
        className: 'lobby-screen',
        custom: () => this.renderLobby(),
        back: () => { this.askConfirm('LEAVE THE LOBBY?', () => { this.leaveSession(); this.show('multiplayer'); }); return undefined; },
        items: [],
        dynamicItems: () => this.lobbyItems(),
      },

      netmenu: {
        title: 'MENU',
        className: 'pause-screen',
        custom: () => this.session ? `<p class="net-note">The run keeps going while this menu is open.<br>ROOM <b>${esc(this.session.code)}</b></p>` : '',
        back: () => null,
        items: [
          { label: 'RESUME', action: () => this.hide() },
          { label: 'SETTINGS', action: () => this.show('settings') },
          { label: 'LEAVE GAME', danger: true, action: () => this.askConfirm('LEAVE THIS GAME?', () => { this.leaveSession(); this.show('multiplayer'); }) },
        ],
      },

      netgameover: {
        title: 'GAME OVER',
        className: 'gameover-screen',
        custom: () => this.renderNetResult(),
        items: [],
        dynamicItems: () => this.netGameOverItems(),
      },

      neterror: {
        title: 'DISCONNECTED',
        className: 'neterror-screen',
        custom: () => `<p class="net-error">${esc(this.netError || 'The connection was lost.')}</p>`,
        back: 'multiplayer',
        items: [
          { label: 'MULTIPLAYER MENU', action: () => this.show('multiplayer') },
          { label: 'MAIN MENU', action: () => this.show('title') },
        ],
      },

      settings: {
        title: 'SETTINGS',
        className: 'settings-screen',
        back: () => {
          if (this.game.state === STATE.PAUSED) return 'pause';
          if (this.game.online && this.game.state !== STATE.MENU) return 'netmenu';
          return 'title';
        },
        items: [
          slider('MASTER VOLUME', 'masterVolume', 0, 1, 0.05, this),
          slider('SOUND EFFECTS', 'sfxVolume', 0, 1, 0.05, this),
          slider('MUSIC', 'musicVolume', 0, 1, 0.05, this),
          choice('GRAPHICS QUALITY', 'quality', QUALITY_KEYS, this, (v) => v.toUpperCase()),
          slider('BLOOM', 'bloom', 0, 2, 0.1, this),
          slider('SCREEN SHAKE', 'screenShake', 0, 2, 0.1, this),
          slider('GRID WARP', 'gridWarp', 0, 2, 0.1, this),
          slider('CHROMATIC ABERRATION', 'chromatic', 0, 2, 0.1, this),
          slider('FILM GRAIN', 'grain', 0, 2, 0.1, this),
          slider('CRT SCANLINES', 'crt', 0, 1, 0.1, this),
          toggle('REDUCE FLASHING', 'reducedFlash', this),
          toggle('COLOURBLIND PALETTE', 'colorblind', this),
          toggle('AUTO-FIRE', 'autoFire', this),
          toggle('INVERT AIM', 'invertAim', this),
          toggle('CONTROLLER RUMBLE', 'vibration', this),
          slider('STICK DEADZONE', 'deadzone', 0.05, 0.5, 0.01, this),
          toggle('SHOW FPS', 'showFps', this),
          { label: 'RESET TO DEFAULTS', action: () => this.resetSettings(), danger: true },
        ],
        footer: 'LEFT / RIGHT TO ADJUST · ESC TO GO BACK',
      },

      scores: {
        title: 'LEADERBOARDS',
        className: 'scores-screen',
        back: 'title',
        custom: () => this.renderScores(),
        items: [
          ...MODE_LIST.map((m) => ({
            label: m.name,
            action: () => { this.scoreMode = m.id; this.refresh(); this.audio.ui('select'); },
            onFocus: () => { this.scoreMode = m.id; this.refresh(); },
            compact: true,
          })),
          { label: 'CLEAR ALL SCORES', action: () => this.askConfirm('CLEAR ALL SCORES?', () => { save.clearScores(); this.show('scores'); }), danger: true, compact: true },
        ],
        footer: 'ESC TO GO BACK',
      },

      help: {
        title: 'HOW TO PLAY',
        className: 'help-screen',
        back: 'title',
        custom: () => HELP_HTML,
        items: [{ label: 'BACK', action: () => this.show('title') }],
      },

      pause: {
        title: 'PAUSED',
        className: 'pause-screen',
        back: () => { this.game.resume(); return null; },
        items: [
          { label: 'RESUME', action: () => { this.game.resume(); this.hide(); } },
          { label: 'RESTART', action: () => this.askConfirm('RESTART THIS RUN?', () => this.startGame(this.game.mode.id)) },
          { label: 'SETTINGS', action: () => this.show('settings') },
          { label: 'QUIT TO MENU', action: () => this.askConfirm('QUIT TO MENU?', () => { this.game.quitToMenu(); this.show('title'); }) },
        ],
      },

      gameover: {
        title: 'GAME OVER',
        className: 'gameover-screen',
        custom: () => this.renderResult(),
        items: [
          { label: 'PLAY AGAIN', action: () => this.startGame(this.game.mode.id) },
          { label: 'CHANGE MODE', action: () => { this.game.quitToMenu(); this.show('modes'); } },
          { label: 'MAIN MENU', action: () => { this.game.quitToMenu(); this.show('title'); } },
        ],
      },

      confirm: {
        title: '',
        className: 'confirm-screen',
        items: [],
      },
    };
    this.scoreMode = 'evolved';
  }

  show(name) {
    if (name === this.current) return;
    if (this.current && this.current !== 'confirm') this.previous = this.current;
    this.current = name;
    const screen = this.screens[name];
    this.focus = (screen && screen.initialFocus) || 0;
    this.render();
    if (screen && screen.autofocus) this.applyFocus(true);
    this.root.classList.toggle('active', name !== null);
    document.body.classList.toggle('menu-open', name !== null);
    this.game.showTitle = name === 'title';
  }

  hide() {
    this._blurInputs();
    this.current = null;
    this.root.innerHTML = '';
    this.root.classList.remove('active');
    document.body.classList.remove('menu-open');
    this.game.showTitle = false;
  }

  refresh() {
    if (this.current) this.render();
  }

  render() {
    const screen = this.screens[this.current];
    if (!screen) return;
    const root = this.root;
    const hadInputFocus = document.activeElement && document.activeElement.tagName === 'INPUT';
    root.innerHTML = '';

    const panel = document.createElement('div');
    panel.className = `panel ${screen.className || ''}`;

    if (this.current === 'title') {
      const logo = document.createElement('div');
      logo.className = 'logo';
      logo.innerHTML = `<h1>HYPER<span>GRID</span></h1><p class="tagline">A TWIN-STICK VECTOR SHOOTER</p>`;
      panel.appendChild(logo);
    } else if (screen.title) {
      const h = document.createElement('h2');
      h.textContent = screen.title;
      panel.appendChild(h);
    }

    if (screen.custom) {
      const c = document.createElement('div');
      c.className = 'custom';
      c.innerHTML = screen.custom();
      panel.appendChild(c);
    }

    this.items = screen.dynamicItems ? screen.dynamicItems() : screen.items || [];
    const list = document.createElement('div');
    list.className = 'menu';
    this.items.forEach((item, i) => list.appendChild(this._renderItem(item, i)));
    panel.appendChild(list);

    if (screen.footer) {
      const f = document.createElement('div');
      f.className = 'footer';
      f.textContent = screen.footer;
      panel.appendChild(f);
    }

    root.appendChild(panel);
    this.itemEls = Array.from(list.children);
    this.applyFocus(hadInputFocus);
  }

  _renderItem(item, i) {
    const el = document.createElement('div');
    el.className = 'item' + (item.danger ? ' danger' : '') + (item.compact ? ' compact' : '') + (item.disabled ? ' disabled' : '');
    el.tabIndex = -1;

    const label = document.createElement('span');
    label.className = 'label';
    label.textContent = typeof item.label === 'function' ? item.label() : item.label;
    el.appendChild(label);

    if (item.type === 'slider') {
      el.classList.add('has-value');
      const v = document.createElement('span');
      v.className = 'value';
      v.innerHTML = `<button class="arrow" data-dir="-1" aria-label="Decrease">&#9664;</button><span class="bar"><span style="transform:scaleX(${item.norm()})"></span></span><span class="num">${item.display()}</span><button class="arrow" data-dir="1" aria-label="Increase">&#9654;</button>`;
      el.appendChild(v);
    } else if (item.type === 'toggle') {
      el.classList.add('has-value');
      const v = document.createElement('span');
      v.className = 'value';
      v.innerHTML = `<span class="switch ${item.get() ? 'on' : ''}"><i></i></span>`;
      el.appendChild(v);
    } else if (item.type === 'choice') {
      el.classList.add('has-value');
      const v = document.createElement('span');
      v.className = 'value';
      v.innerHTML = `<button class="arrow" data-dir="-1" aria-label="Previous">&#9664;</button><span class="num wide">${item.display()}</span><button class="arrow" data-dir="1" aria-label="Next">&#9654;</button>`;
      el.appendChild(v);
    } else if (item.type === 'text') {
      el.classList.add('has-value', 'has-input');
      const input = document.createElement('input');
      input.type = 'text';
      input.id = `field-${item.label.toLowerCase().replace(/\W+/g, '-')}`;
      input.className = 'text-field' + (item.opts.code ? ' code' : '');
      input.value = item.get() || '';
      input.maxLength = item.opts.max;
      input.placeholder = item.opts.placeholder || '';
      input.autocomplete = 'off';
      input.spellcheck = false;
      input.setAttribute('aria-label', item.label);
      input.addEventListener('input', () => {
        const v = item.opts.filter(input.value).slice(0, item.opts.max);
        if (v !== input.value) input.value = v;
        item.set(v);
      });
      input.addEventListener('focus', () => {
        if (this.focus !== i) { this.focus = i; this.applyFocus(true); }
      });
      el.appendChild(input);
    } else if (item.badge) {
      el.classList.add('has-badge');
      const b = document.createElement('span');
      b.className = 'badge';
      b.textContent = item.badge();
      el.appendChild(b);
    }

    if (item.detail) {
      const d = document.createElement('span');
      d.className = 'detail';
      d.textContent = typeof item.detail === 'function' ? item.detail() : item.detail;
      el.appendChild(d);
    }

    // Real mice only: a touch "hover" that restyles the row makes iOS Safari
    // swallow the tap that should have activated it.
    el.addEventListener('pointerenter', (ev) => {
      if (ev.pointerType !== 'mouse') return;
      if (this.focus !== i) {
        this.focus = i;
        this.applyFocus(false);
        this.audio.ui('move');
        if (item.onFocus) item.onFocus();
      }
    });
    el.addEventListener('click', (ev) => {
      if (ev.target.tagName === 'INPUT') return;
      const arrow = ev.target.closest('.arrow');
      this.focus = i;
      if (arrow) this.adjust(Number(arrow.dataset.dir));
      else this.activate();
    });
    return el;
  }

  applyFocus(focusInput = true) {
    if (!this.itemEls) return;
    this.focus = clamp(this.focus, 0, Math.max(0, this.itemEls.length - 1));
    this.itemEls.forEach((el, i) => el.classList.toggle('focused', i === this.focus));
    const el = this.itemEls[this.focus];
    if (!el) return;
    if (el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    const input = el.querySelector('input');
    if (input && focusInput) {
      if (document.activeElement !== input) {
        input.focus({ preventScroll: true });
        input.setSelectionRange(input.value.length, input.value.length);
      }
    } else {
      this._blurInputs();
    }
  }

  _blurInputs() {
    const a = document.activeElement;
    if (a && a.tagName === 'INPUT') a.blur();
  }

  // ------------------------------------------------------------- navigation

  update(dt) {
    this.copied = Math.max(0, this.copied - dt);

    if (!this.current) {
      // In-game: only the pause key matters.
      if (this.input.pressed('pause')) {
        if (this.game.online) {
          this.show('netmenu');
        } else {
          this.game.pause();
          this.show('pause');
        }
      }
      return;
    }

    // Keep lobby details (ping, arrivals) live without rebuilding every frame.
    if (this.current === 'lobby' || this.current === 'netgameover') {
      this.refreshTimer -= dt;
      if (this.refreshTimer <= 0) {
        this.refreshTimer = 1;
        this.refresh();
      }
    }

    this.navCooldown -= dt;
    const held = (a) => this.input.down(a);
    const hit = (a) => this.input.pressed(a);
    const typing = document.activeElement && document.activeElement.tagName === 'INPUT';

    let dy = 0;
    if (hit('up') || hit('aimUp')) dy = -1;
    else if (hit('down') || hit('aimDown')) dy = 1;
    else if (this.navCooldown <= 0 && !typing) {
      if (held('up') || held('aimUp')) dy = -1;
      else if (held('down') || held('aimDown')) dy = 1;
    }
    if (dy !== 0) {
      this.navCooldown = 0.14;
      this.move(dy);
    }

    if (!typing) {
      let dx = 0;
      if (hit('left') || hit('aimLeft')) dx = -1;
      else if (hit('right') || hit('aimRight')) dx = 1;
      else if (this.navCooldown <= 0) {
        if (held('left') || held('aimLeft')) dx = -1;
        else if (held('right') || held('aimRight')) dx = 1;
      }
      if (dx !== 0) {
        this.navCooldown = 0.12;
        this.adjust(dx);
      }
    }

    if (hit('confirm')) this.activate();
    if (hit('pause') || hit('cancel')) this.back();
  }

  move(dir) {
    if (!this.items.length) return;
    this.focus = (this.focus + dir + this.items.length) % this.items.length;
    this.applyFocus(true);
    this.audio.ui('move');
    const item = this.items[this.focus];
    if (item && item.onFocus) item.onFocus();
  }

  adjust(dir) {
    const item = this.items[this.focus];
    if (!item) return;
    if (item.type === 'slider' || item.type === 'choice') {
      item.step(dir);
      this.audio.ui('move');
      this.render();
    }
  }

  activate() {
    const item = this.items[this.focus];
    if (!item || item.disabled) return;
    if (item.type === 'toggle') {
      item.set(!item.get());
      this.audio.ui('select');
      this.render();
      return;
    }
    if (item.type === 'slider' || item.type === 'choice') {
      item.step(1);
      this.audio.ui('move');
      this.render();
      return;
    }
    if (item.type === 'text') {
      this.audio.ui('select');
      if (item.opts.submit) item.opts.submit();
      else this.move(1);
      return;
    }
    this.audio.ui('select');
    if (item.action) item.action();
  }

  back() {
    const screen = this.screens[this.current];
    if (!screen) return;
    if (this.current === 'confirm') {
      this.audio.ui('back');
      this.show(this.confirmReturn || 'title');
      return;
    }
    if (!screen.back) return;
    this.audio.ui('back');
    const target = typeof screen.back === 'function' ? screen.back() : screen.back;
    if (target === undefined) return;
    if (target) this.show(target);
    else this.hide();
  }

  askConfirm(question, action) {
    this.confirmReturn = this.current;
    this.screens.confirm.title = question;
    this.screens.confirm.items = [
      { label: 'CONFIRM', action: () => { action(); }, danger: true },
      { label: 'CANCEL', action: () => this.show(this.confirmReturn) },
    ];
    this.current = null;
    this.show('confirm');
    this.focus = 1;
    this.applyFocus();
  }

  // ------------------------------------------------------------------ hooks

  startGame(modeId) {
    this.hide();
    if (this.onPlay) this.onPlay();
    this.game.start(modeId);
  }

  onGameOver() {
    if (this.game.state !== STATE.GAMEOVER) return;
    this.show(this.game.online ? 'netgameover' : 'gameover');
  }

  resetSettings() {
    const callsign = save.settings.callsign;
    const s = save.resetSettings();
    save.updateSettings({ callsign });
    this.applyAll(s);
    this.render();
    this.audio.ui('select');
  }

  applyAll(s) {
    this.audio.setVolumes({ master: s.masterVolume, sfx: s.sfxVolume, music: s.musicVolume });
    this.game.applySettings(s);
    if (this.onSettingsChanged) this.onSettingsChanged(s);
  }

  // ----------------------------------------------------------- multiplayer

  _newSession() {
    this.leaveSession();
    const session = new NetSession(this.game);
    this.session = session;
    session.onChange = () => {
      if (this.session !== session) return;
      if (this.current === 'lobby' || this.current === 'netgameover') this.refresh();
    };
    session.onStart = () => {
      if (this.session !== session) return;
      this.hide();
      if (this.onPlay) this.onPlay();
      this.game.start(session.mode, session);
    };
    session.onLobby = () => {
      if (this.session !== session) return;
      this.game.quitToMenu();
      this.show('lobby');
    };
    session.onEnd = (message) => {
      if (this.session !== session) return;
      this.session = null;
      if (this.game.online) this.game.quitToMenu();
      if (message) {
        this.netError = message;
        this.current = null;
        this.show('neterror');
      }
    };
    return session;
  }

  async hostGame(modeId) {
    const session = this._newSession();
    this.show('connecting');
    try {
      await session.host(modeId, this.callsign);
      if (this.session === session) this.show('lobby');
    } catch (err) {
      this._netFailure(session, err);
    }
  }

  async joinGame(code) {
    code = String(code || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (code.length !== 4) {
      this.netError = '';
      this.audio.ui('back');
      return;
    }
    const session = this._newSession();
    this.show('connecting');
    try {
      await session.join(code, this.callsign);
      if (this.session === session) this.show('lobby');
    } catch (err) {
      this._netFailure(session, err);
    }
  }

  /** Entry point for an invite link (?join=CODE). */
  joinFromLink(code) {
    this.joinCode = String(code).toUpperCase().replace(/[^A-Z]/g, '').slice(0, 4);
    if (this.joinCode.length === 4) this.joinGame(this.joinCode);
  }

  _netFailure(session, err) {
    if (this.session !== session) return;
    session.onEnd = null;
    session.leave();
    this.session = null;
    this.netError = err && err.message ? err.message : 'Could not connect.';
    this.current = null;
    this.show('neterror');
  }

  leaveSession() {
    const s = this.session;
    if (!s) return;
    this.session = null;
    s.onEnd = null;
    s.leave();
    if (this.game.online || this.game.state !== STATE.MENU) this.game.quitToMenu();
  }

  lobbyItems() {
    const s = this.session;
    if (!s) return [{ label: 'BACK', action: () => this.show('multiplayer') }];
    const items = [];
    items.push({
      type: 'choice',
      label: 'MODE',
      display: () => MODES[s.mode].name,
      step: () => s.setMode(s.mode === 'coop' ? 'copilot' : 'coop'),
    });
    if (s.mode === 'copilot') {
      items.push({
        label: 'SWAP ROLES',
        detail: () => `${s.names[s.pilot] || '—'} flies · ${s.names[s.pilot === 0 ? 1 : 0] || '—'} shoots`,
        action: () => s.swapRoles(),
      });
    }
    items.push({
      label: () => (this.copied > 0 ? 'LINK COPIED' : 'COPY INVITE LINK'),
      detail: 'Send it to your friend — it opens straight into this lobby',
      action: () => this.copyInvite(),
    });
    if (s.isHost) {
      items.push({
        label: s.peerPresent ? 'START' : 'WAITING FOR A FRIEND…',
        disabled: !s.peerPresent,
        action: () => s.startGame(),
      });
    } else {
      items.push({ label: 'WAITING FOR THE HOST TO START', disabled: true });
    }
    items.push({ label: 'LEAVE', danger: true, action: () => { this.leaveSession(); this.show('multiplayer'); } });
    return items;
  }

  async copyInvite() {
    const s = this.session;
    if (!s) return;
    const url = inviteUrl(s.code);
    try {
      await navigator.clipboard.writeText(url);
      this.copied = 2;
    } catch {
      this.copied = 0;
      this.showInviteText = true;
    }
    this.refresh();
  }

  renderLobby() {
    const s = this.session;
    if (!s) return '';
    const seats = [0, 1].map((seat) => {
      const present = seat === s.localSeat || s.peerPresent;
      const color = s.mode === 'copilot' ? PLAYER_STYLES[0].css : PLAYER_STYLES[seat].css;
      if (!present) {
        return `<div class="seat empty"><span class="seat-name">OPEN SEAT</span><span class="seat-role">SHARE THE CODE TO FILL IT</span></div>`;
      }
      const tags = [seat === 0 ? 'HOST' : 'GUEST', s.roleOf(seat)];
      if (seat === s.localSeat) tags.push('YOU');
      return `<div class="seat" style="--accent:${color}"><i></i><span class="seat-name">${esc(s.names[seat] || '…')}</span><span class="seat-role">${tags.join(' · ')}</span></div>`;
    }).join('');
    const ping = s.peerPresent && s.rtt ? `<span class="lobby-ping">${Math.round(s.rtt)} MS</span>` : '';
    const url = inviteUrl(s.code);
    return `<div class="lobby">
      <div class="room"><span>ROOM CODE</span><b>${esc(s.code)}</b>${ping}</div>
      <div class="seats">${seats}</div>
      <p class="lobby-mode">${esc(MODES[s.mode].blurb)}</p>
      ${this.showInviteText ? `<p class="invite-url">${esc(url)}</p>` : ''}
    </div>`;
  }

  netGameOverItems() {
    const s = this.session;
    if (!s) {
      return [{ label: 'MULTIPLAYER MENU', action: () => { this.game.quitToMenu(); this.show('multiplayer'); } }];
    }
    const items = [];
    if (s.isHost) {
      items.push({ label: s.peerPresent ? 'PLAY AGAIN' : 'PLAY AGAIN · PARTNER OFFLINE', disabled: !s.peerPresent, action: () => s.startGame() });
      items.push({ label: 'BACK TO LOBBY', action: () => { this.game.quitToMenu(); s.returnToLobby(); this.show('lobby'); } });
    } else {
      items.push({ label: 'WAITING FOR THE HOST', disabled: true });
    }
    items.push({ label: 'LEAVE', danger: true, action: () => { this.leaveSession(); this.show('multiplayer'); } });
    return items;
  }

  renderNetResult() {
    const g = this.game;
    const s = this.session;
    const names = s ? s.names : ['HOST', 'GUEST'];
    let html = '';
    if (g.newRecord) html += `<div class="record">NEW TEAM BEST</div>`;
    html += `<div class="final-score">${commafy(g.score)}</div>`;
    html += `<div class="result-grid">
      <div><span>MODE</span><b>${g.mode.name}</b></div>
      <div><span>PEAK MULTIPLIER</span><b>x${g.peakMultiplier}</b></div>
      <div><span>SURVIVED</span><b>${formatTime(g.runTime)}</b></div>
      <div style="--accent:${PLAYER_STYLES[0].css}" class="crew-kills"><span>${esc(names[0] || 'HOST')} KILLS</span><b>${commafy(g.killsBy[0])}</b></div>
      <div style="--accent:${PLAYER_STYLES[g.mode.id === 'copilot' ? 0 : 1].css}" class="crew-kills"><span>${esc(names[1] || 'GUEST')} KILLS</span><b>${commafy(g.killsBy[1])}</b></div>
      <div><span>RANK</span><b>${g.lastRank > 0 ? `#${g.lastRank}` : '—'}</b></div>
    </div>`;
    return html;
  }

  // ----------------------------------------------------------------- views

  renderScores() {
    const mode = MODES[this.scoreMode] || MODES.evolved;
    const rows = save.scores(mode.id);
    let html = `<div class="score-head">${mode.name}${mode.online ? ' · TEAM SCORES' : ''}</div>`;
    if (!rows.length) {
      html += `<div class="empty">NO RUNS RECORDED YET</div>`;
    } else {
      html += '<div class="table-wrap"><table class="score-table"><thead><tr><th>#</th><th>SCORE</th><th>MULT</th><th>TIME</th><th>KILLS</th><th>DATE</th></tr></thead><tbody>';
      rows.forEach((r, i) => {
        const d = new Date(r.date);
        html += `<tr class="${i === 0 ? 'top' : ''}"><td>${i + 1}</td><td>${commafy(r.score)}</td><td>x${r.mult}</td><td>${formatTime(r.time)}</td><td>${r.kills}</td><td>${d.toLocaleDateString()}</td></tr>`;
      });
      html += '</tbody></table></div>';
    }
    const st = save.data.stats;
    html += `<div class="stats">LIFETIME · ${commafy(st.totalKills)} KILLS · ${commafy(st.totalScore)} POINTS · ${st.gamesPlayed} RUNS · BEST MULT x${st.bestMultiplier} · ${formatTime(st.playtime)} PLAYED</div>`;
    return html;
  }

  renderResult() {
    const g = this.game;
    const r = this.lastResult || { score: g.score, mult: g.peakMultiplier, time: g.runTime, kills: g.kills };
    const rank = g.lastRank;
    const acc = g.shotsFired > 0 ? Math.round((g.shotsHit / g.shotsFired) * 100) : 0;
    let html = '';
    if (g.newRecord) html += `<div class="record">NEW PERSONAL BEST</div>`;
    html += `<div class="final-score">${commafy(r.score)}</div>`;
    html += `<div class="result-grid">
      <div><span>MODE</span><b>${g.mode.name}</b></div>
      <div><span>PEAK MULTIPLIER</span><b>x${r.mult}</b></div>
      <div><span>SURVIVED</span><b>${formatTime(r.time)}</b></div>
      <div><span>KILLS</span><b>${commafy(r.kills)}</b></div>
      <div><span>ACCURACY</span><b>${clamp(acc, 0, 100)}%</b></div>
      <div><span>RANK</span><b>${rank > 0 ? `#${rank}` : '—'}</b></div>
    </div>`;
    return html;
  }
}

// ------------------------------------------------------------ item builders

function textItem(label, get, set, opts) {
  return { type: 'text', label, get, set, opts };
}

function slider(label, key, min, max, step, ui) {
  return {
    type: 'slider',
    label,
    get: () => save.settings[key],
    norm: () => clamp01((save.settings[key] - min) / (max - min)),
    display: () => {
      const v = save.settings[key];
      return max <= 1.001 && min >= 0 ? `${Math.round(v * 100)}%` : v.toFixed(v < 1 ? 2 : 1);
    },
    step: (dir) => {
      const v = clamp(round(save.settings[key] + dir * step, step), min, max);
      save.updateSettings({ [key]: v });
      ui.applyAll(save.settings);
    },
  };
}

function toggle(label, key, ui) {
  return {
    type: 'toggle',
    label,
    get: () => !!save.settings[key],
    set: (v) => {
      save.updateSettings({ [key]: v });
      ui.applyAll(save.settings);
    },
    step: () => {
      save.updateSettings({ [key]: !save.settings[key] });
      ui.applyAll(save.settings);
    },
  };
}

function choice(label, key, options, ui, fmt = (v) => v) {
  return {
    type: 'choice',
    label,
    get: () => save.settings[key],
    display: () => fmt(save.settings[key]),
    step: (dir) => {
      const i = options.indexOf(save.settings[key]);
      const n = (i + dir + options.length) % options.length;
      save.updateSettings({ [key]: options[n] });
      ui.applyAll(save.settings);
    },
  };
}

function round(v, step) {
  const inv = 1 / step;
  return Math.round(v * inv) / inv;
}

function renderIcons(n, cls) {
  const count = Math.min(n, 9);
  let html = '';
  for (let i = 0; i < count; i++) html += `<i class="${cls}"></i>`;
  if (n > 9) html += `<span class="more">+${n - 9}</span>`;
  if (n <= 0) html += `<span class="none">—</span>`;
  return html;
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

const HELP_HTML = `
<div class="help-grid">
  <section>
    <h3>CONTROLS</h3>
    <dl>
      <dt>MOVE</dt><dd>WASD · Left stick · Thumb on the left half of the screen</dd>
      <dt>AIM &amp; FIRE</dt><dd>Mouse · Arrow keys · IJKL · Right stick · Thumb on the right half</dd>
      <dt>BOMB</dt><dd>Space · Shift · Right-click · A/B/LB/LT · The bomb button</dd>
      <dt>PAUSE</dt><dd>Esc · P · Start · The pause button</dd>
      <dt>TOUCH</dt><dd>A stick appears wherever your thumb lands. If you only fly or only shoot (Co-Pilot, Pacifism) the whole screen is that stick.</dd>
    </dl>
  </section>
  <section>
    <h3>SCORING</h3>
    <p>Every kill drops <b class="c-geom">green geoms</b>. Fly near them and they lock on to your ship &mdash; every one raises your multiplier, and every point you score is multiplied by it.</p>
    <p>Dying resets the multiplier to x1, so the deeper you push the more you have to lose. The first extra life and bomb arrive at 75,000 points; each one after that costs progressively more.</p>
  </section>
  <section>
    <h3>MULTIPLAYER</h3>
    <dl>
      <dt>CO-OP</dt><dd>Two ships in one arena. Score, multiplier, bombs and spare ships are shared. A ship that dies with no spares left is out until the team earns an extra life.</dd>
      <dt>CO-PILOT</dt><dd>One ship, two people: the pilot flies, the gunner aims and fires. Either of you can bomb. Swap roles in the lobby.</dd>
      <dt>JOINING</dt><dd>One player hosts and shares the four-letter code or invite link. If the connection drops, rejoin with the same code to pick the run back up.</dd>
    </dl>
  </section>
  <section>
    <h3>THE ENEMY</h3>
    <dl class="enemies">
      <dt class="c-grunt">DIAMOND</dt><dd>Hunts you directly. Simple, relentless, arrives in swarms.</dd>
      <dt class="c-wanderer">WANDERER</dt><dd>Drifts aimlessly and never targets you &mdash; but it will still kill you.</dd>
      <dt class="c-weaver">WEAVER</dt><dd>Pursues you and sidesteps your bullets. Lead your shots.</dd>
      <dt class="c-pinwheel">PINWHEEL</dt><dd>Ricochets around the arena at speed, ignoring you entirely.</dd>
      <dt class="c-snake">SNAKE</dt><dd>A segmented chain. Shots sever it from the hit point back; kill the head to take the whole body.</dd>
      <dt class="c-blackhole">BLACK HOLE</dt><dd>Devours enemies, debris and you. Overloads into a burst of seekers. Takes many hits &mdash; and pays handsomely.</dd>
      <dt class="c-rocket">ROCKET</dt><dd>Locks a heading, then charges straight across the arena.</dd>
      <dt class="c-nest">NEST</dt><dd>Stationary hatchery. Kill it before the seekers pile up.</dd>
    </dl>
  </section>
  <section>
    <h3>SOLO MODES</h3>
    <dl>
      <dt>EVOLVED</dt><dd>The full arsenal, endless escalation. Three lives, three bombs.</dd>
      <dt>DEADLINE</dt><dd>Three minutes, unlimited lives. Pure aggression.</dd>
      <dt>PACIFISM</dt><dd>No weapons. Fly through the blue gates to detonate them; chain them for big multipliers.</dd>
      <dt>WAVES</dt><dd>Rockets stream in from every edge in escalating volleys.</dd>
      <dt>KING</dt><dd>You may only fire &mdash; and can only survive &mdash; inside the shrinking rings.</dd>
    </dl>
  </section>
</div>`;
