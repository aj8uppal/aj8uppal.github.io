/**
 * Scroll is the throttle. Every section that carries `data-shot` is a station:
 * while its sticky stage is pinned the camera holds on that station's shot
 * (drifting a little with progress), and in the viewport of scroll between two
 * stations it flies from one to the other.
 *
 * Framing uses lens shift rather than aiming off-centre: shifting the
 * projection moves a planet beside the copy without changing its perspective,
 * and the black hole pass reads the same inverse projection, so the lensing
 * stays put.
 */
import * as THREE from 'three';
import { BELT, EARTH, MOON_OFFSET, SUN_DIR, type System } from './scene';
import { worlds } from '../worlds';

export interface Pose {
  pos: THREE.Vector3;
  quat: THREE.Quaternion;
  fov: number;
  shift: THREE.Vector2;
  disk: number;
  orbits: number;
  sun: number;
  exposure: number;
  belt: number;
}

const pose = (): Pose => ({
  pos: new THREE.Vector3(),
  quat: new THREE.Quaternion(),
  fov: 40,
  shift: new THREE.Vector2(),
  disk: 1,
  orbits: 0,
  sun: 0,
  exposure: 1,
  belt: 0,
});

const UP = new THREE.Vector3(0, 1, 0);
const m4 = new THREE.Matrix4();
function look(out: Pose, from: THREE.Vector3, to: THREE.Vector3, roll = 0) {
  out.pos.copy(from);
  m4.lookAt(from, to, UP);
  out.quat.setFromRotationMatrix(m4);
  if (roll)
    out.quat.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), roll));
}

function smoother(t: number) {
  t = Math.min(1, Math.max(0, t));
  return t * t * t * (t * (t * 6 - 15) + 10);
}

interface Station {
  el: HTMLElement;
  shot: string;
  start: number;
  end: number;
}

export interface Director {
  measure(): void;
  /** Target pose for a scroll position, plus which station is nearest. */
  at(
    y: number,
    time: number,
    out: Pose,
  ): { index: number; key: string; travel: number; local: number };
  stations: Station[];
}

export function createDirector(sys: System, root: HTMLElement, pointer: THREE.Vector2): Director {
  const stations: Station[] = [...root.querySelectorAll<HTMLElement>('[data-shot]')].map((el) => ({
    el,
    shot: el.dataset.shot!,
    start: 0,
    end: 0,
  }));

  const portrait = () => window.innerWidth / window.innerHeight < 0.85;
  const P = new THREE.Vector3();
  const T = new THREE.Vector3();
  const C = new THREE.Vector3();
  const o = new THREE.Vector3();
  const tg = new THREE.Vector3();

  function distanceFor(radius: number, size: number, fov: number) {
    const half = THREE.MathUtils.degToRad(fov) / 2;
    const ang = Math.atan(size * Math.tan(half));
    return radius / Math.sin(ang);
  }

  function shot(key: string, t: number, time: number, out: Pose) {
    out.disk = 1;
    out.orbits = 0;
    out.sun = 0;
    out.exposure = 1;
    out.belt = 0;
    out.shift.set(0, 0);
    const narrow = portrait();
    if (key === 'hero') {
      out.fov = narrow ? 58 : 36;
      const az = -0.42 + pointer.x * 0.1 + Math.sin(time * 0.05) * 0.04;
      const el = 0.075 + pointer.y * 0.04 + t * 0.05;
      const d = (narrow ? 30 : 27) + t * 6;
      C.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d);
      look(out, C, T.set(0, 0, 0), -0.06);
      out.shift.set(0, narrow ? 0.18 : 0.1);
      return;
    }
    if (key === 'system') {
      out.fov = narrow ? 60 : 42;
      out.orbits = 1;
      out.belt = 1;
      const az = 0.5 + t * 0.35 + time * 0.004;
      const el = 0.62 - t * 0.06;
      const d = narrow ? 640 : 430;
      C.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d);
      look(out, C, T.set(0, 0, 0));
      out.shift.set(narrow ? 0 : 0.38, narrow ? 0.5 : 0.02);
      return;
    }
    if (key.startsWith('world:')) {
      const wk = key.slice(6);
      const i = worlds.findIndex((w) => w.key === wk);
      const w = worlds[i]!;
      const s = w.planet.shot;
      sys.bodyPosition(wk, P);
      o.set(P.x, 0, P.z).normalize();
      tg.crossVectors(UP, o);
      const az = s.az + (t - 0.5) * s.swing;
      const el = s.el + (t - 0.5) * 0.08;
      out.fov = narrow ? 48 : 34;
      // Portrait screens are width-bound: keep the world within ~70% of the width.
      const aspect = window.innerWidth / window.innerHeight;
      const size = narrow ? Math.min(s.size * 0.62, 0.7 * aspect) : s.size;
      const extent = w.planet.extent ?? 1;
      const d = distanceFor(w.planet.radius * extent, size, out.fov);
      C.copy(P)
        .addScaledVector(o, Math.cos(el) * Math.cos(az) * d)
        .addScaledVector(tg, Math.cos(el) * Math.sin(az) * d)
        .addScaledVector(UP, Math.sin(el) * d);
      look(out, C, P, (i % 2 ? 1 : -1) * 0.05);
      // The capture sits low on the far side; the world rises behind it.
      const side = i % 2 === 0 ? 1 : -1;
      out.shift.set(narrow ? 0 : side * 0.5, narrow ? 0.44 : 0.24);
      out.orbits = 0.15;
      return;
    }
    if (key === 'belt') {
      out.fov = narrow ? 66 : 52;
      const r = (BELT.inner + BELT.outer) / 2;
      const a = 2.1 + t * 0.32;
      C.set(Math.cos(a) * r, 13 - t * 3, Math.sin(a) * r);
      out.belt = 1;
      const ahead = a + 0.32;
      T.set(Math.cos(ahead) * (r - 10), 0, Math.sin(ahead) * (r - 10));
      look(out, C, T, 0.08);
      out.shift.set(0, narrow ? 0.1 : 0.12);
      out.orbits = 0.2;
      return;
    }
    if (key === 'earth') {
      out.fov = narrow ? 50 : 34;
      out.sun = 1;
      out.disk = 1;
      const az = 1.0 + (t - 0.5) * 0.35;
      // Camera direction: rotate the sun direction about the vertical.
      o.copy(SUN_DIR)
        .applyAxisAngle(UP, az)
        .setY(0.18 - t * 0.08)
        .normalize();
      const d = distanceFor(6, narrow ? 0.36 : 0.78, out.fov);
      C.copy(EARTH).addScaledVector(o, d);
      look(out, C, EARTH, -0.04);
      out.shift.set(narrow ? 0 : 0.42, narrow ? 0.5 : 0.0);
      return;
    }
    if (key === 'origin') {
      // Earthrise: just above the Moon's limb, Earth on the horizon.
      out.fov = narrow ? 54 : 40;
      out.sun = 1;
      const moon = T.copy(EARTH).add(MOON_OFFSET);
      const toEarth = o.copy(EARTH).sub(moon).normalize();
      const side = tg.crossVectors(toEarth, UP).normalize();
      const up = new THREE.Vector3().crossVectors(side, toEarth).normalize();
      const lift = 1.65 * (1.012 + t * 0.01);
      C.copy(moon)
        .addScaledVector(up, lift)
        .addScaledVector(toEarth, -1.2 - t * 0.6)
        .addScaledVector(side, 0.4);
      const aim = P.copy(EARTH).addScaledVector(up, 2.2 + t * 1.2);
      look(out, C, aim, 0.12);
      out.shift.set(narrow ? 0 : -0.24, narrow ? 0.3 : 0.0);
      return;
    }
    if (key === 'contact') {
      out.fov = narrow ? 56 : 38;
      out.orbits = 0.6;
      const az = 2.6 + t * 0.4 + pointer.x * 0.05;
      const el = 0.26 + t * 0.08;
      const d = (narrow ? 60 : 46) + t * 10;
      C.set(Math.sin(az) * Math.cos(el) * d, Math.sin(el) * d, Math.cos(az) * Math.cos(el) * d);
      look(out, C, T.set(0, 0, 0), 0.04);
      out.shift.set(narrow ? 0 : -0.28, narrow ? 0.2 : 0.06);
      return;
    }
  }

  const a = pose();
  const b = pose();
  const qa = new THREE.Quaternion();

  function measure() {
    const vh = window.innerHeight;
    for (const s of stations) {
      const r = s.el.getBoundingClientRect();
      const top = r.top + window.scrollY;
      s.start = top;
      s.end = Math.max(top, top + r.height - vh);
    }
  }

  function at(y: number, time: number, out: Pose) {
    const n = stations.length;
    let i = 0;
    while (i < n - 1 && y > stations[i]!.end) {
      if (y < stations[i + 1]!.start) break;
      i++;
    }
    const s = stations[i]!;
    if (y <= s.end || i === n - 1) {
      const span = s.end - s.start;
      const local = span > 1 ? Math.min(1, Math.max(0, (y - s.start) / span)) : 0;
      shot(s.shot, local, time, out);
      return { index: i, key: s.shot, travel: 0, local };
    }
    const next = stations[i + 1]!;
    const u = (y - s.end) / Math.max(1, next.start - s.end);
    shot(s.shot, 1, time, a);
    shot(next.shot, 0, time, b);
    // Position leads slightly, so the next world is in frame by the time its
    // copy has settled rather than half a second after.
    const e = smoother(Math.min(1, u * 1.2));
    const dist = a.pos.distanceTo(b.pos);
    out.pos.lerpVectors(a.pos, b.pos, e);
    // Arc up and away from the hole so a hop between worlds never threads it.
    const lift = Math.sin(Math.PI * e) * Math.min(dist * 0.22, 90);
    out.pos.y += lift;
    const r = Math.hypot(out.pos.x, out.pos.z);
    if (r < 18 && Math.abs(out.pos.y) < 10) out.pos.y += (18 - r) * 0.8;
    qa.copy(a.quat).slerp(b.quat, smoother(Math.min(1, u * 1.15)));
    out.quat.copy(qa);
    const jump = Math.min(1, dist / 260);
    out.fov = THREE.MathUtils.lerp(a.fov, b.fov, e) + Math.sin(Math.PI * e) * 22 * jump;
    out.shift.lerpVectors(a.shift, b.shift, e);
    out.disk = THREE.MathUtils.lerp(a.disk, b.disk, e);
    out.orbits = THREE.MathUtils.lerp(a.orbits, b.orbits, e);
    out.sun = THREE.MathUtils.lerp(a.sun, b.sun, e);
    out.exposure = THREE.MathUtils.lerp(a.exposure, b.exposure, e);
    out.belt = THREE.MathUtils.lerp(a.belt, b.belt, e);
    return {
      index: u < 0.5 ? i : i + 1,
      key: u < 0.5 ? s.shot : next.shot,
      travel: u,
      local: u < 0.5 ? 1 : 0,
    };
  }

  measure();
  return { measure, at, stations };
}

export { pose as createPose };
