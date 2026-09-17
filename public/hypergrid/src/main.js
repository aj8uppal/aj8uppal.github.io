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
  document.getElementById('fullscreen-btn')?.addEventListener('click', toggleFullscreen);

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
    if (input.scheme === 'touch') drawTouchSticks(renderer);
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
    for (const stick of [input.leftStick, input.rightStick]) {
      if (!stick.active) continue;
      const o = camera.screenToWorld(stick.ox, stick.oy);
      const p = camera.screenToWorld(stick.x, stick.y);
      const rr = input.stickRadius * camera.worldPerPixel;
      r.circle(o.x, o.y, rr, 2.0, accent, 0.35, 28, 3.2);
      const dx = p.x - o.x, dy = p.y - o.y;
      const d = Math.hypot(dx, dy);
      const k = d > rr ? rr / d : 1;
      r.dot(o.x + dx * k, o.y + dy * k, rr * 0.34, accent, 0.8, 2.6);
    }
  }

  requestAnimationFrame(tick);

  // Expose a few handles for debugging without leaking them into gameplay.
  window.__hypergrid = { game, ui, audio, music, post, renderer, camera, input };
}
