/**
 * Boots the homepage: the WebGL system behind the page, smooth scroll, and the
 * pieces of UI that listen to where the camera is.
 *
 * Reduced motion is a separate path, not a slower one: no smooth scroll, no
 * flights (the camera cuts to each station as its section arrives), no orbital
 * motion, no grain, no aberration. Without WebGL 2 the page keeps its static
 * backdrop and every section still reads; nothing here is load-bearing for
 * content.
 */
import * as THREE from 'three';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createSystem, downgrade, pickTier, type System, type Tier } from './gl/scene';
import { createDirector, createPose, type Director } from './gl/director';
import { worlds } from './worlds';
import { initReveals } from './ui/reveal';
import { initMedia } from './ui/media';
import { initBelt } from './ui/belt';
import { initCursor } from './ui/cursor';
import { initSound } from './ui/sound';
import { initCounters } from './ui/counters';

gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const root = document.documentElement;
clearTimeout((window as unknown as { __orbitFailsafe?: number }).__orbitFailsafe);
root.classList.add('js');
if (reduce.matches) root.classList.add('reduce');

function webgl2() {
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch {
    return false;
  }
}

const pointer = new THREE.Vector2();
const pointerTarget = new THREE.Vector2();
addEventListener(
  'pointermove',
  (e) => {
    pointerTarget.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
  },
  { passive: true },
);

let lenis: Lenis | null = null;
if (!reduce.matches) {
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, touchMultiplier: 1.2 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
const scrollY = () => (lenis ? lenis.scroll : window.scrollY);

/* In-page links travel through the scroll engine so the camera flies there. */
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href')!.slice(1);
  const el = id ? document.getElementById(id) : document.body;
  if (!el) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(el, { duration: 2.2, easing: (t) => 1 - Math.pow(1 - t, 4) });
  else el.scrollIntoView();
  history.replaceState(null, '', '#' + id);
  if (el.hasAttribute('tabindex') || el.matches('h1,h2,h3,section'))
    el.focus({ preventScroll: true });
});

initReveals(reduce.matches);
initMedia(reduce.matches);
initBelt(reduce.matches, scrollY);
initCounters(reduce.matches);
initCursor(reduce.matches);
initSound();

const canvas = document.querySelector<HTMLCanvasElement>('#orbit-canvas');
const hudSector = document.querySelector<HTMLElement>('[data-hud="sector"]');
const rail = [...document.querySelectorAll<HTMLAnchorElement>('[data-rail]')];
const labels = [...document.querySelectorAll<HTMLElement>('[data-label]')];
const systemList = document.querySelector<HTMLElement>('.system__list');
// Measured on resize, never per frame: the list moves only vertically.
let listRight = 0;
const measureList = () => {
  listRight = systemList ? systemList.getBoundingClientRect().right + 16 : 0;
};
measureList();
addEventListener('resize', measureList);
document.fonts?.ready.then(measureList);

/* Pointing at a world in the index lights its label in the scene. */
document.querySelectorAll<HTMLElement>('[data-world]').forEach((a) => {
  const label = labels.find((l) => l.dataset.label === a.dataset.world);
  if (!label) return;
  a.addEventListener('pointerenter', () => label.classList.add('is-hot'));
  a.addEventListener('pointerleave', () => label.classList.remove('is-hot'));
  a.addEventListener('focus', () => label.classList.add('is-hot'));
  a.addEventListener('blur', () => label.classList.remove('is-hot'));
});

function reveal() {
  root.classList.add('ready');
}

if (!canvas || !webgl2()) {
  root.classList.add('no-gl');
  reveal();
} else {
  boot(canvas).catch((err) => {
    console.error(err);
    root.classList.add('no-gl');
    reveal();
  });
}

async function boot(canvas: HTMLCanvasElement) {
  let tier: Tier = pickTier();
  const sys: System = createSystem(canvas, tier);
  root.classList.remove('no-gl');
  const director: Director = createDirector(sys, document.body, pointer);
  const target = createPose();
  if (import.meta.env.DEV) Object.assign(window, { __orbit: { sys, director } });
  const cam = sys.camera;

  // The words are already on screen; the scene fades in behind them once the
  // sky has arrived, or after a moment regardless.
  const { texture } = await import('./gl/textures');
  const sky = texture('sky', { mips: false });
  await Promise.race([sky.ready, new Promise((r) => setTimeout(r, 1200))]);

  // Compile everything once while the loader is still up.
  sys.compile();

  const remeasure = () => {
    sys.resize();
    director.measure();
    ScrollTrigger.refresh();
  };
  addEventListener('resize', remeasure);
  document.fonts?.ready.then(() => director.measure());
  new ResizeObserver(() => director.measure()).observe(document.body);

  let ignite = reduce.matches ? 1 : 0;
  const start = performance.now();
  let last = start;
  let frames = 0;
  let fpsT = start;
  let slow = 0;
  const prev = new THREE.Vector3();
  const smoothVel = new THREE.Vector3();
  const base = { pos: new THREE.Vector3(), quat: new THREE.Quaternion() };
  let firstFrame = true;
  let lastKey = '';
  let time = 0;
  const accent = getComputedStyle(root).getPropertyValue('--accent').trim();
  const accents = new Map(worlds.map((w) => ['world:' + w.key, w.accent]));
  const of = String(worlds.length).padStart(2, '0');
  const sectorNames = new Map<string, string>([
    ['hero', 'The singularity'],
    ['system', 'The system'],
    ...worlds.map(
      (w, i) =>
        ['world:' + w.key, `World ${String(i + 1).padStart(2, '0')} / ${of} · ${w.name}`] as [
          string,
          string,
        ],
    ),
    ['belt', 'The belt'],
    ['earth', 'Earth'],
    ['origin', 'Origin'],
    ['contact', 'Open channel'],
  ]);
  const tmp = new THREE.Vector3();

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduce.matches) time += dt;
    pointer.lerp(pointerTarget, reduce.matches ? 1 : 1 - Math.exp(-dt * 3));

    const info = director.at(scrollY(), time, target);

    // Ignition: the disk lights from nothing and the camera settles in.
    if (ignite < 1) ignite = Math.min(1, (now - start) / 2600);
    const ig = 1 - Math.pow(1 - ignite, 3);
    if (info.index === 0 && ignite < 1) target.pos.multiplyScalar(1 + (1 - ig) * 0.9);

    const k = reduce.matches || firstFrame ? 1 : 1 - Math.exp(-dt * 7);
    if (reduce.matches) {
      // Cut, don't fly, and don't swing: hold the nearest station's middle
      // shot for as long as that station is on screen.
      const s = director.stations[info.index]!;
      director.at((s.start + s.end) / 2, 0, target);
    }
    // The smoothed pose lives apart from the camera. Parallax is applied on top
    // each frame and never fed back into the smoothing: fed back, its resting
    // size scales with 1/dt, so any frame-time wobble shook the whole view.
    base.pos.lerp(target.pos, k);
    base.quat.slerp(target.quat, k);
    cam.position.copy(base.pos);
    cam.quaternion.copy(base.quat);
    if (!reduce.matches) {
      cam.rotateY(-pointer.x * 0.012);
      cam.rotateX(pointer.y * 0.008);
    }
    cam.fov += (target.fov - cam.fov) * k;
    cam.updateProjectionMatrix();
    const shift = new THREE.Vector2(
      THREE.MathUtils.lerp(cam.userData.sx ?? target.shift.x, target.shift.x, k),
      THREE.MathUtils.lerp(cam.userData.sy ?? target.shift.y, target.shift.y, k),
    );
    cam.userData.sx = shift.x;
    cam.userData.sy = shift.y;
    cam.projectionMatrix.elements[8] = -shift.x;
    cam.projectionMatrix.elements[9] = -shift.y;
    cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();

    // Velocity from the smoothed pose, filtered: a raw finite difference
    // carries every frame-time hiccup into the warp streaks and FOV.
    const raw = tmp.copy(base.pos).sub(prev).divideScalar(Math.max(dt, 1e-3));
    prev.copy(base.pos);
    if (firstFrame) raw.set(0, 0, 0);
    smoothVel.lerp(raw, firstFrame ? 1 : 1 - Math.exp(-dt * 12));
    const vel = tmp.copy(smoothVel);
    const speed = vel.length();
    sys.fx.velocity.copy(reduce.matches ? vel.set(0, 0, 0) : vel);
    sys.fx.speed = reduce.matches ? 0 : speed;
    sys.fx.disk = target.disk * (0.08 + 0.92 * ig);
    sys.fx.orbits += (target.orbits - sys.fx.orbits) * (reduce.matches ? 1 : 1 - Math.exp(-dt * 3));
    sys.fx.sun = target.sun;
    sys.fx.belt = target.belt;
    sys.fx.focus = info.travel === 0 && info.key.startsWith('world:') ? info.key.slice(6) : '';
    sys.fx.exposure = target.exposure * (0.5 + 0.5 * ig);

    sys.frame(time, reduce.matches ? 0 : dt);
    firstFrame = false;

    // HUD and chrome that track the camera.
    frames++;
    if (now - fpsT > 500) {
      const fps = (frames * 1000) / (now - fpsT);
      root.dataset.fps = fps.toFixed(0);
      // Adaptive quality: step down once if we are clearly struggling.
      if (now - start > 4000) {
        slow = fps < 42 ? slow + 1 : 0;
        if (slow >= 4) {
          const next = downgrade(tier);
          if (next) {
            tier = next;
            sys.setTier(tier);
            director.measure();
          }
          slow = 0;
        }
      }
      frames = 0;
      fpsT = now;
    }
    if (info.key !== lastKey) {
      lastKey = info.key;
      if (hudSector) hudSector.textContent = sectorNames.get(info.key) ?? '';
      root.style.setProperty('--accent', accents.get(info.key) ?? accent);
      root.dataset.station = info.key.replace(':', '-');
      if (!firstFrame)
        document.dispatchEvent(new CustomEvent('orbit:station', { detail: info.key }));
      for (const r of rail) r.toggleAttribute('aria-current', r.dataset.rail === info.key);
    }

    // System labels ride their planets while the overview is on screen.
    const sysStation = director.stations.find((s) => s.shot === 'system');
    if (sysStation && labels.length) {
      const y = scrollY();
      const vh = innerHeight;
      const vis = Math.max(
        0,
        1 -
          Math.abs(y - (sysStation.start + sysStation.end) / 2) /
            ((sysStation.end - sysStation.start) / 2 + vh * 0.6),
      );
      // Labels never sit on the index they duplicate.
      for (const l of labels) {
        sys.bodyPosition(l.dataset.label!, tmp).project(cam);
        const x = (tmp.x * 0.5 + 0.5) * innerWidth;
        const yy = (-tmp.y * 0.5 + 0.5) * innerHeight;
        const on = tmp.z < 1 && vis > 0.02 && x > listRight && x < innerWidth - 140;
        l.style.transform = `translate3d(${x.toFixed(1)}px, ${yy.toFixed(1)}px, 0)`;
        l.style.opacity = on ? String(Math.min(1, vis * 1.6)) : '0';
        l.style.pointerEvents = on && vis > 0.5 ? 'auto' : 'none';
      }
    }
    if (!document.hidden) requestAnimationFrame(frame);
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      last = performance.now();
      requestAnimationFrame(frame);
    }
  });
  requestAnimationFrame((t) => {
    frame(t);
    reveal();
  });
  if (reduce.matches) reduce.addEventListener('change', () => location.reload());
}
