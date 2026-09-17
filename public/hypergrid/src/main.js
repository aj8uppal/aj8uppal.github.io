/**
 * Entry point: wires the subsystems together, owns the canvas and the frame
 * loop, and maps user settings onto the renderer.
 */

import { createContext } from './render/gl.js';
import { GlowRenderer } from './render/glow.js';
import { PostFX } from './render/post.js';
import { Camera } from './render/camera.js';
import { Input } from './input/input.js';
import { audio } from './audio/audio.js';
import { MusicEngine } from './audio/music.js';
import { Game, STATE } from './game/game.js';
import { UI } from './ui/ui.js';
import { save } from './game/save.js';
import { QUALITY } from './game/config.js';
import { clamp } from './core/math.js';

const canvas = document.getElementById('game');
const loading = document.getElementById('loading');
const gl = createContext(canvas);

if (!gl) {
  showFatal(
    'WEBGL 2 REQUIRED',
    'This game needs WebGL 2. Try a current version of Chrome, Edge, Firefox or Safari, and make sure hardware acceleration is enabled.'
  );
} else {
  boot();
}

function showFatal(title, detail) {
  const el = document.getElementById('fatal');
  el.querySelector('h1').textContent = title;
  el.querySelector('p').textContent = detail;
  el.classList.add('visible');
  if (loading) loading.classList.add('hidden');
}

function boot() {
  let renderer, post;
  try {
    renderer = new GlowRenderer(gl, 48000);
    post = new PostFX(gl);
  } catch (err) {
    console.error(err);
    showFatal('SHADER COMPILATION FAILED', String(err && err.message ? err.message : err));
    return;
  }

  const camera = new Camera();
  const input = new Input(canvas);
  const music = new MusicEngine(audio);
  const game = new Game(audio, music, input, camera);
  const ui = new UI(game, audio, music, input);
  // Touch-first devices get different hints, controls and camera framing.
  const coarse = matchMedia('(pointer: coarse)');

  game.onGameOver = (entry) => {
    ui.lastResult = entry;
    // Let the death animation breathe before the results land.
    setTimeout(() => ui.onGameOver(), 900);
  };

  // An invite link (?join=ABCD) drops straight into the friend's lobby.
  const params = new URLSearchParams(location.search);
  const inviteCode = params.get('join');
  if (inviteCode) {
    params.delete('join');
    const clean = location.pathname + (params.toString() ? `?${params}` : '') + location.hash;
    history.replaceState(null, '', clean);
    ui.joinFromLink(inviteCode);
  }
  window.addEventListener('pagehide', () => ui.leaveSession());

  // ------------------------------------------------------------- settings

  let renderScale = 1;
  ui.onSettingsChanged = (s) => {
    const q = QUALITY[s.quality] || QUALITY.high;
    renderScale = q.renderScale;
    post.bloomAmount = 0.82 * s.bloom;
    post.streakAmount = q.streak * clamp(s.bloom, 0, 1.6);
    post.chroma = 0.0016 * s.chromatic;
    post.grain = 0.022 * s.grain;
    post.scanline = s.crt * 0.32;
    post.barrel = s.crt * 0.1;
    post.threshold = 0.88;
    resize(true);
  };

  // --------------------------------------------------------------- resize

  let dpr = 1;
  function resize(force = false) {
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    // Cap the device pixel ratio: a 3x retina phone does not need 3x fill rate.
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const pw = Math.max(320, Math.round(w * dpr * renderScale));
    const ph = Math.max(240, Math.round(h * dpr * renderScale));
    if (!force && pw === canvas.width && ph === canvas.height) return;
    canvas.width = pw;
    canvas.height = ph;
    const q = QUALITY[save.settings.quality] || QUALITY.high;
    post.resize(pw, ph, q.bloomMips);
    game.setCssViewport(w, h);
    game.resize(pw, ph, true);
  }

  // Settings drive the render scale, so they must be applied once `resize`
  // exists — then a forced resize picks up the resulting target sizes.
  ui.applyAll(save.settings);
  resize(true);

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);
  window.addEventListener('resize', () => resize());
  window.addEventListener('orientationchange', () => setTimeout(() => resize(true), 120));
  resize(true);

  // ---------------------------------------------------------- audio unlock

  let audioStarted = false;
  const unlock = () => {
    if (audioStarted) return;
    audioStarted = true;
    audio.init();
    audio.setVolumes({
      master: save.settings.masterVolume,
      sfx: save.settings.sfxVolume,
      music: save.settings.musicVolume,
    });
    music.setMode('menu');
    music.start('menu');
    document.getElementById('audio-hint')?.classList.add('hidden');
  };
  if (coarse.matches) {
    const hint = document.getElementById('audio-hint');
    if (hint) hint.textContent = 'TAP ANYWHERE TO ENABLE SOUND';
  }
  for (const ev of ['pointerdown', 'keydown', 'touchstart']) {
    window.addEventListener(ev, unlock, { once: false, passive: true });
  }

  // ------------------------------------------------------------- lifecycle

  // Browsers stop requestAnimationFrame in a background tab. Solo, that is a
  // pause. Online, the host *is* the world, so a timer keeps simulating and
  // streaming (audio keeps running too: an audible tab is not throttled).
  let hiddenTicker = null;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (game.online && game.state !== STATE.MENU) {
        last = performance.now();
        hiddenTicker = setInterval(() => step(performance.now(), false), 1000 / 30);
        return;
      }
      if (game.state === STATE.PLAYING) {
        game.pause();
        ui.show('pause');
      }
      audio.suspend();
    } else {
      if (hiddenTicker) {
        clearInterval(hiddenTicker);
        hiddenTicker = null;
        last = performance.now();
      }
      if (audioStarted) audio.resume();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.code === 'KeyF' && !e.repeat && !e.metaKey && !e.ctrlKey) toggleFullscreen();
    if (e.code === 'KeyM' && !e.repeat) {
      audio.enabled = !audio.enabled;
      audio.setVolumes({});
    }
  });

  function toggleFullscreen() {
    const el = document.documentElement;
    if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  }
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  fullscreenBtn?.addEventListener('click', toggleFullscreen);
  // iPhone Safari has no element fullscreen; don't offer a button that can't work.
  if (!document.fullscreenEnabled && fullscreenBtn) fullscreenBtn.hidden = true;

  // ---------------------------------------------------------------- touch

  const portrait = matchMedia('(orientation: portrait)');
  const body = document.body;
  const setClass = (name, on) => { if (body.classList.contains(name) !== on) body.classList.toggle(name, on); };

  // On-screen buttons feed the same actions as Space and Escape. pointerdown
  // rather than click: a thumb mid-fight should not wait for touchend.
  const press = (id, action) => {
    document.getElementById(id)?.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      input.tap(action);
    });
  };
  press('touch-bomb', 'bomb');
  press('touch-menu', 'pause');
  document.getElementById('rotate-dismiss')?.addEventListener('click', () => body.classList.add('portrait-ok'));
  // iOS Safari ignores user-scalable=no; stop pinch gestures zooming the page.
  document.addEventListener('gesturestart', (e) => e.preventDefault());

  // Starting a run from a tap is a user gesture, which is the only moment a
  // phone browser lets a page go fullscreen and hold landscape (Android).
  ui.onPlay = () => {
    if (!coarse.matches || !document.fullscreenEnabled || document.fullscreenElement) return;
    document.documentElement.requestFullscreen({ navigationUI: 'hide' })
      .then(() => screen.orientation?.lock?.('landscape'))
      .catch(() => {});
  };

  function syncTouchState() {
    const touch = input.scheme === 'touch' || (coarse.matches && performance.now() - input.touchSeenAt < 6e4);
    const inRun = game.state === STATE.PLAYING || game.state === STATE.DYING || game.state === STATE.PAUSED;
    setClass('touch-device', coarse.matches || input.touchSeenAt > 0);
    setClass('in-game', inRun);
    setClass('touch-play', touch && inRun && !ui.current);

    // One stick when this player only flies or only shoots.
    const ship = game.localShip();
    if (!game.mode.canShoot) input.touchMode = 'move';
    else if (ship.localMove && !ship.localGun) input.touchMode = 'move';
    else if (ship.localGun && !ship.localMove) input.touchMode = 'aim';
    else input.touchMode = 'split';

    // A solo run turned to portrait pauses behind the rotate prompt.
    if (portrait.matches && body.classList.contains('touch-device') && !body.classList.contains('portrait-ok')
        && !game.online && game.state === STATE.PLAYING && !ui.current) {
      game.pause();
      ui.show('pause');
    }
  }

  // ------------------------------------------------------------------ loop

  let last = performance.now();
  let fps = 60;
  let fpsAccum = 0;
  let fpsFrames = 0;
  let frame = 0;

  if (loading) loading.classList.add('hidden');

  function tick(now) {
    requestAnimationFrame(tick);
    if (hiddenTicker) return;
    step(now, true);
  }

  function step(now, render) {
    const rawDt = (now - last) / 1000;
    last = now;
    // Clamp: a backgrounded tab must not teleport the simulation.
    const dt = Math.min(Math.max(rawDt, 0), 1 / 20);

    fpsAccum += rawDt;
    fpsFrames++;
    if (fpsAccum >= 0.3) {
      fps = fpsFrames / fpsAccum;
      fpsAccum = 0;
      fpsFrames = 0;
    }
    frame++;

    // --- input & simulation
    const aimFrom = game.localShip();
    input.update(camera, aimFrom.x, aimFrom.y);
    ui.update(dt);
    syncTouchState();
    // Online the run continues behind a menu; the ship must not act on it.
    if (ui.current && game.online) input.neutralize();
    game.update(dt);
    input.endFrame();
    if (!render) return;

    // --- render
    const viewMat = camera.build();
    post.beginScene();
    renderer.begin(viewMat, camera.worldPerPixel);
    game.draw(renderer);
    if (body.classList.contains('touch-play')) drawTouchSticks(renderer);
    renderer.flush();

    post.flash = game.flash;
    post.flashColor = game.flashColor;
    post.shockAmp = game.shockAmp;
    post.shock = game.shockPos;
    post.fade = 1;
    post.render(canvas.width, canvas.height);

    ui.updateHud(fps);
  }

  function drawTouchSticks(r) {
    const accent = game.localShip().style.accent;
    const ring = [0.86, 0.96, 1];
    const R = input.stickRadius * camera.worldPerPixel;
    const mode = input.touchMode;
    const zones = [];
    if (mode !== 'aim') zones.push({ stick: input.leftStick, label: 'MOVE', fx: mode === 'move' ? 0.5 : 0.18 });
    if (mode !== 'move') zones.push({ stick: input.rightStick, label: 'AIM + FIRE', fx: mode === 'aim' ? 0.5 : 0.82 });
    const teach = game.runTime < 6 ? 1 - Math.max(0, game.runTime - 4) / 2 : 0;
    for (const { stick, label, fx } of zones) {
      if (stick.active) {
        const o = camera.screenToWorld(stick.ox, stick.oy);
        const p = camera.screenToWorld(stick.x, stick.y);
        r.circle(o.x, o.y, R, 1.6, ring, 0.28, 32, 3.0);
        const dx = p.x - o.x, dy = p.y - o.y;
        const d = Math.hypot(dx, dy);
        const k = d > R ? R / d : 1;
        const kx = o.x + dx * k, ky = o.y + dy * k;
        if (d > R * 0.1) r.seg(o.x, o.y, kx, ky, 1.4, accent, 0.25, 2.6);
        r.circle(kx, ky, R * 0.3, 2.0, accent, 0.55, 20, 3.0);
      } else {
        const px = canvas.width * fx;
        const py = canvas.height * 0.76;
        const o = camera.screenToWorld(px, py);
        r.circle(o.x, o.y, R, 1.3, ring, 0.1 + teach * 0.2, 32, 3.0);
        if (teach > 0) {
          const px = label.length > 5 ? 9.5 : 12;
          r.text(label, o.x, o.y, px * camera.worldPerPixel * (canvas.height / innerHeight), ring, {
            align: 0, baseline: 0, intensity: teach * 0.7, width: 0.1, tracking: 0.8,
          });
        }
      }
    }
  }

  requestAnimationFrame(tick);

  // Expose a few handles for debugging without leaking them into gameplay.
  window.__hypergrid = { game, ui, audio, music, post, renderer, camera, input };
}
