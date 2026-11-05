/**
 * The worlds that are not a texture on a sphere.
 *
 *   grid   Hypergrid: a cube-mapped neon grid that ripples under explosions.
 *   voxel  Blockhold: an actual voxel planet, with water, roads, trees, towers.
 *   swarm  murmuration: particle ribbons flowing over a sphere, on a beat.
 *   ball   Boundary: a cricket ball, seam and all.
 *   debris Rift Clash: the shattered rock ring around its planet.
 */
import * as THREE from 'three';
import { lightUniforms, type Body, type Light } from './planet';

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Hypergrid ─────────────────────────────────────────────────────────── */

export function createGrid(key: string, radius: number, light: Light, quality: number): Body {
  const group = new THREE.Group();
  const ripples = Array.from({ length: 6 }, () => new THREE.Vector4(0, 1, 0, -100));
  const u = {
    uTime: { value: 0 },
    uRadius: { value: radius },
    uRipples: { value: ripples },
    ...lightUniforms(light),
  };
  const gridVertex = /* glsl */ `
    uniform float uTime;
    uniform float uRadius;
    uniform vec4 uRipples[6];
    varying vec3 vObj;
    varying vec3 vWorld;
    varying vec3 vN;
    varying float vAmp;
    void main() {
      vec3 n = normalize(position);
      float disp = 0.0, amp = 0.0;
      for (int i = 0; i < 6; i++) {
        vec4 r = uRipples[i];
        float age = uTime - r.w;
        if (age < 0.0 || age > 5.0) continue;
        float ang = acos(clamp(dot(n, r.xyz), -1.0, 1.0));
        float d = ang - age * 0.85;
        float env = exp(-d * d * 14.0) * exp(-age * 0.8);
        disp += sin(d * 26.0) * env * 0.05;
        amp += env + exp(-ang * ang * 40.0) * exp(-age * 4.0) * 2.0;
      }
      vAmp = amp;
      vObj = n;
      vec4 w = modelMatrix * vec4(n * uRadius * (1.0 + disp), 1.0);
      vWorld = w.xyz;
      vN = normalize(mat3(modelMatrix) * n);
      gl_Position = projectionMatrix * viewMatrix * w;
    }`;
  const gridFragment = /* glsl */ `
    precision highp float;
    varying vec3 vObj;
    varying vec3 vWorld;
    varying vec3 vN;
    varying float vAmp;
    uniform float uTime;
    uniform float uLightMode;
    uniform vec3 uLightPos;
    void main() {
      vec3 a = abs(vObj);
      vec2 f;
      if (a.x >= a.y && a.x >= a.z) f = vObj.yz / a.x;
      else if (a.y >= a.z) f = vObj.xz / a.y;
      else f = vObj.xy / a.z;
      f = atan(f) * 1.27324; // equal-angle cube map: even cells
      vec2 g = f * 7.0;
      vec2 w = fwidth(g) * 1.2;
      vec2 l = abs(fract(g - 0.5) - 0.5) / w;
      float line = 1.0 - min(min(l.x, l.y), 1.0);
      vec2 g2 = f * 28.0;
      vec2 w2 = fwidth(g2);
      vec2 l2 = abs(fract(g2 - 0.5) - 0.5) / w2;
      float fine = (1.0 - min(min(l2.x, l2.y), 1.0)) * 0.22;
      vec3 V = normalize(cameraPosition - vWorld);
      vec3 N = normalize(vN);
      float fres = pow(1.0 - max(dot(N, V), 0.0), 2.0);
      vec3 L = normalize(uLightPos - vWorld);
      float lit = 0.55 + 0.45 * max(dot(N, L), 0.0);
      vec3 base = vec3(0.16, 0.36, 1.0);
      vec3 hot = vec3(0.45, 1.0, 0.72);
      vec3 col = mix(base, hot, clamp(vAmp * 0.6, 0.0, 1.0)) * (line * 1.6 + fine) * (0.7 + vAmp * 2.2) * lit;
      col += vec3(0.02, 0.05, 0.16) * (0.4 + fres * 2.5);
      col += vec3(0.25, 0.45, 1.0) * fres * fres * 0.6;
      gl_FragColor = vec4(col, 1.0);
    }`;
  const seg = quality > 0.6 ? 160 : 96;
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, seg, seg / 2),
    new THREE.ShaderMaterial({
      vertexShader: gridVertex,
      fragmentShader: gridFragment,
      uniforms: u,
    }),
  );
  group.add(mesh);

  // Small glowing enemies skimming the surface.
  const count = 26;
  const geo = new THREE.InstancedBufferGeometry();
  geo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, 1, 0], 3),
  );
  geo.setIndex([0, 1, 2, 0, 2, 3]);
  const r = rng(7);
  const axes: number[] = [];
  const params: number[] = [];
  for (let i = 0; i < count; i++) {
    const v = new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).normalize();
    axes.push(v.x, v.y, v.z);
    params.push(r() * Math.PI * 2, 0.25 + r() * 0.5, Math.floor(r() * 3), 1.12 + r() * 0.18);
  }
  geo.setAttribute('aAxis', new THREE.InstancedBufferAttribute(new Float32Array(axes), 3));
  geo.setAttribute('aParam', new THREE.InstancedBufferAttribute(new Float32Array(params), 4));
  geo.instanceCount = count;
  const shapes = new THREE.Mesh(
    geo,
    new THREE.ShaderMaterial({
      uniforms: { uTime: u.uTime, uRadius: u.uRadius },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute vec3 aAxis;
        attribute vec4 aParam;
        uniform float uTime;
        uniform float uRadius;
        varying vec2 vQ;
        varying float vShape;
        void main() {
          vec3 ax = aAxis;
          vec3 t = normalize(cross(ax, abs(ax.y) < 0.9 ? vec3(0, 1, 0) : vec3(1, 0, 0)));
          vec3 b = cross(ax, t);
          float th = aParam.x + uTime * aParam.y;
          vec3 c = (t * cos(th) + b * sin(th)) * uRadius * aParam.w;
          vec4 mv = modelViewMatrix * vec4(c, 1.0);
          float s = uRadius * 0.055;
          float rot = uTime * (1.0 + aParam.z);
          vec2 p = position.xy;
          p = mat2(cos(rot), -sin(rot), sin(rot), cos(rot)) * p;
          mv.xy += p * s;
          vQ = position.xy;
          vShape = aParam.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vQ;
        varying float vShape;
        void main() {
          float d;
          vec3 col;
          if (vShape < 0.5) { d = abs(abs(vQ.x) + abs(vQ.y) - 0.7); col = vec3(0.3, 0.75, 1.0); }
          else if (vShape < 1.5) { d = abs(max(abs(vQ.x), abs(vQ.y)) - 0.62); col = vec3(0.4, 1.0, 0.5); }
          else { d = abs(length(vQ) - 0.62); col = vec3(1.0, 0.35, 0.8); }
          float a = smoothstep(0.16, 0.0, d);
          gl_FragColor = vec4(col * a * 2.4, a);
        }`,
    }),
  );
  shapes.frustumCulled = false;
  group.add(shapes);

  let next = 0;
  let slot = 0;
  const rr = rng(11);
  return {
    key,
    radius,
    group,
    update(time, dt) {
      u.uTime.value = time;
      mesh.rotation.y += 0.08 * dt;
      if (time > next) {
        const v = new THREE.Vector3(rr() * 2 - 1, rr() * 2 - 1, rr() * 2 - 1).normalize();
        ripples[slot]!.set(v.x, v.y, v.z, time);
        slot = (slot + 1) % ripples.length;
        next = time + 0.6 + rr() * 1.1;
      }
    },
  };
}

/* ── Blockhold ─────────────────────────────────────────────────────────── */

function hash3(x: number, y: number, z: number) {
  let h = (x * 374761393 + y * 668265263 + z * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x: number, y: number, z: number) {
  const xi = Math.floor(x),
    yi = Math.floor(y),
    zi = Math.floor(z);
  const xf = x - xi,
    yf = y - yi,
    zf = z - zi;
  const s = (t: number) => t * t * (3 - 2 * t);
  const u = s(xf),
    v = s(yf),
    w = s(zf);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  return l(
    l(l(c(0, 0, 0), c(1, 0, 0), u), l(c(0, 1, 0), c(1, 1, 0), u), v),
    l(l(c(0, 0, 1), c(1, 0, 1), u), l(c(0, 1, 1), c(1, 1, 1), u), v),
    w,
  );
}
function fbm(x: number, y: number, z: number) {
  let a = 0.5,
    s = 0;
  for (let i = 0; i < 4; i++) {
    s += a * vnoise(x, y, z);
    x = x * 2.03 + 5.1;
    y = y * 2.03 + 1.7;
    z = z * 2.03 + 9.3;
    a *= 0.5;
  }
  return s;
}

export function createVoxel(key: string, radius: number, light: Light): Body {
  const R = 15;
  const size = radius / R;
  const sea = R + 0.35;
  const height = new Map<string, number>();
  const H = (x: number, y: number, z: number) => {
    const k = x + ',' + y + ',' + z;
    let h = height.get(k);
    if (h === undefined) {
      const l = Math.hypot(x, y, z) || 1;
      const n = fbm((x / l) * 2.1 + 3, (y / l) * 2.1, (z / l) * 2.1);
      h = R - 1.2 + n * 5.2;
      height.set(k, h);
    }
    return h;
  };
  const solid = (x: number, y: number, z: number) => {
    const d = Math.hypot(x, y, z);
    return d <= Math.max(H(x, y, z), sea);
  };
  const road = new THREE.Vector3(0.3, 0.9, 0.2).normalize();
  const cells: { p: THREE.Vector3; c: THREE.Color }[] = [];
  const col = (hex: number) => new THREE.Color(hex);
  const top: { x: number; y: number; z: number; land: boolean; h: number }[] = [];
  const M = R + 5;
  for (let x = -M; x <= M; x++)
    for (let y = -M; y <= M; y++)
      for (let z = -M; z <= M; z++) {
        if (!solid(x, y, z)) continue;
        if (
          solid(x + 1, y, z) &&
          solid(x - 1, y, z) &&
          solid(x, y + 1, z) &&
          solid(x, y - 1, z) &&
          solid(x, y, z + 1) &&
          solid(x, y, z - 1)
        )
          continue;
        const d = Math.hypot(x, y, z);
        const h = H(x, y, z);
        const water = d > h;
        const dir = new THREE.Vector3(x, y, z).normalize();
        const lon = Math.atan2(dir.z, dir.x);
        const onRoad = Math.abs(dir.dot(road) + 0.06 * Math.sin(lon * 3)) < 0.045;
        const alt = h - sea;
        let c: THREE.Color;
        const j = hash3(x, y, z);
        if (water) c = col(d > sea - 0.2 && h > sea - 1.4 ? 0x5cb8f0 : 0x3b8fdc);
        else if (onRoad && alt < 2.6) c = col(j > 0.5 ? 0xe2cc92 : 0xd6bd80);
        else if (alt < 0.45) c = col(0xead79c);
        else if (alt < 2.2) c = col(j > 0.5 ? 0x74c24c : 0x63b23f);
        else if (alt < 3.0) c = col(j > 0.5 ? 0x4f9a36 : 0x5aa83c);
        else if (alt < 3.6) c = col(j > 0.5 ? 0x9a9fa4 : 0x8b9095);
        else c = col(0xf2f5f8);
        cells.push({ p: new THREE.Vector3(x, y, z), c });
        if (!water && d > h - 1.0) top.push({ x, y, z, land: !onRoad, h: alt });
      }
  // Trees and towers stand along each cell's dominant axis.
  const rr = rng(3);
  const axisOf = (x: number, y: number, z: number) => {
    const ax = Math.abs(x),
      ay = Math.abs(y),
      az = Math.abs(z);
    if (ax >= ay && ax >= az) return new THREE.Vector3(Math.sign(x), 0, 0);
    if (ay >= az) return new THREE.Vector3(0, Math.sign(y), 0);
    return new THREE.Vector3(0, 0, Math.sign(z));
  };
  let towers = 0;
  for (const t of top) {
    if (!t.land || t.h < 0.6 || t.h > 3.0) continue;
    const up = axisOf(t.x, t.y, t.z);
    const base = new THREE.Vector3(t.x, t.y, t.z);
    if (rr() < 0.075) {
      cells.push({ p: base.clone().add(up), c: col(0x7a5434) });
      cells.push({ p: base.clone().addScaledVector(up, 2), c: col(0x2f7d32) });
      cells.push({ p: base.clone().addScaledVector(up, 3), c: col(0x3d9440) });
    } else if (towers < 9 && rr() < 0.012) {
      towers++;
      for (let k = 1; k <= 4; k++)
        cells.push({ p: base.clone().addScaledVector(up, k), c: col(k % 2 ? 0xb9bcc2 : 0xa6aab0) });
      cells.push({
        p: base.clone().addScaledVector(up, 5),
        c: col(towers % 2 ? 0x3d7bd9 : 0xd9473d),
      });
    }
  }
  const box = new THREE.BoxGeometry(size * 0.98, size * 0.98, size * 0.98);
  const mat = new THREE.ShaderMaterial({
    uniforms: { ...lightUniforms(light) },
    vertexShader: /* glsl */ `
      varying vec3 vColor;
      varying vec3 vN;
      varying vec3 vWorld;
      void main() {
        vColor = instanceColor;
        vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vWorld = w.xyz;
        vN = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying vec3 vColor;
      varying vec3 vN;
      varying vec3 vWorld;
      uniform vec3 uLightPos;
      uniform vec3 uLightColor;
      void main() {
        vec3 L = normalize(uLightPos - vWorld);
        float d = max(dot(normalize(vN), L), 0.0);
        gl_FragColor = vec4(vColor * uLightColor * (0.05 + d * 1.05), 1.0);
      }`,
  });
  const mesh = new THREE.InstancedMesh(box, mat, cells.length);
  const m = new THREE.Matrix4();
  cells.forEach((cell, i) => {
    m.makeTranslation(cell.p.x * size, cell.p.y * size, cell.p.z * size);
    mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, cell.c);
  });
  mesh.instanceMatrix.needsUpdate = true;
  const group = new THREE.Group();
  const spin = new THREE.Group();
  spin.rotation.z = 0.35;
  spin.add(mesh);
  group.add(spin);
  return {
    key,
    radius,
    group,
    update(_t, dt) {
      mesh.rotation.y += 0.07 * dt;
    },
  };
}

/* ── murmuration ───────────────────────────────────────────────────────── */

export function createSwarm(key: string, radius: number, quality: number): Body {
  const strands = 34;
  const per = quality > 0.6 ? 2400 : 900;
  const n = strands * per;
  const aStrand = new Float32Array(n);
  const aT = new Float32Array(n);
  const aSeed = new Float32Array(n * 3);
  const r = rng(5);
  for (let i = 0; i < n; i++) {
    aStrand[i] = Math.floor(i / per);
    aT[i] = r();
    aSeed[i * 3] = r();
    aSeed[i * 3 + 1] = r();
    aSeed[i * 3 + 2] = r();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  geo.setAttribute('aStrand', new THREE.BufferAttribute(aStrand, 1));
  geo.setAttribute('aT', new THREE.BufferAttribute(aT, 1));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(aSeed, 3));
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius * 2);
  const u = {
    uTime: { value: 0 },
    uBeat: { value: 0 },
    uRadius: { value: radius },
    uScale: { value: 1 },
  };
  const pts = new THREE.Points(
    geo,
    new THREE.ShaderMaterial({
      uniforms: u,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aStrand;
        attribute float aT;
        attribute vec3 aSeed;
        uniform float uTime;
        uniform float uBeat;
        uniform float uRadius;
        uniform float uScale;
        varying vec3 vColor;
        varying float vA;
        vec3 h3(float x) { return fract(sin(vec3(x * 12.9898, x * 78.233, x * 37.719)) * 43758.5453); }
        void main() {
          vec3 hs = h3(aStrand + 1.0);
          vec3 ax = normalize(hs * 2.0 - 1.0);
          float drift = uTime * (0.04 + hs.y * 0.05);
          ax = normalize(vec3(ax.x * cos(drift) - ax.z * sin(drift), ax.y, ax.x * sin(drift) + ax.z * cos(drift)));
          vec3 t = normalize(cross(ax, abs(ax.y) < 0.95 ? vec3(0, 1, 0) : vec3(1, 0, 0)));
          vec3 b = cross(ax, t);
          float speed = (0.1 + hs.z * 0.16) * (hs.x > 0.5 ? 1.0 : -1.0);
          float th = aT * 6.2831 + uTime * speed;
          vec3 p = t * cos(th) + b * sin(th);
          p += ax * (0.34 * sin(th * 2.0 + uTime * 0.6 + hs.x * 9.0) + (aSeed.x - 0.5) * 0.045 * (1.0 + hs.z * 2.0));
          p += (aSeed - 0.5) * 0.022;
          p = normalize(p);
          float rad = uRadius * (1.0 + 0.12 * sin(th * 3.0 + uTime + hs.y * 6.0) + (aSeed.y - 0.5) * 0.05);
          rad *= 1.0 + uBeat * 0.07 * (0.4 + aSeed.z);
          vec4 mv = modelViewMatrix * vec4(p * rad, 1.0);
          float bright = pow(aSeed.z, 4.0) * (0.4 + 0.6 * hs.y);
          float along = 0.5 + 0.5 * sin(th * 1.0 + hs.x * 6.0);
          vColor = mix(vec3(0.42, 0.2, 1.0), vec3(1.0, 0.9, 1.0), clamp(bright + along * 0.35, 0.0, 1.0)) * (0.7 + uBeat * 0.7) * (0.4 + along * 0.8);
          vA = 0.35 + bright * 0.65;
          gl_PointSize = (0.8 + bright * 1.8) * uScale * 24.0 / -mv.z;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec3 vColor;
        varying float vA;
        void main() {
          vec2 q = gl_PointCoord * 2.0 - 1.0;
          float d = dot(q, q);
          if (d > 1.0) discard;
          float a = exp(-d * 3.5) * vA;
          gl_FragColor = vec4(vColor * a * 1.35, a);
        }`,
    }),
  );
  const group = new THREE.Group();
  group.add(pts);
  // A faint core so the swarm has a body.
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(radius * 0.86, 48, 24),
    new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vW;
        void main() { vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec3 vN; varying vec3 vW;
        void main() { float f = max(dot(normalize(vN), normalize(cameraPosition - vW)), 0.0); gl_FragColor = vec4(vec3(0.16, 0.06, 0.4) * pow(f, 3.0) * 0.25, 1.0); }`,
    }),
  );
  group.add(core);
  return {
    key,
    radius,
    group,
    update(time) {
      u.uTime.value = time;
      // 112 bpm, with a softer off-beat.
      const beat = (time * 112) / 60;
      const ph = beat % 1;
      const accent = Math.floor(beat) % 2 === 0 ? 1 : 0.55;
      u.uBeat.value = Math.exp(-ph * 7) * accent;
      u.uScale.value =
        window.devicePixelRatio > 1 ? Math.min(window.devicePixelRatio, 2) * 0.75 : 1;
    },
  };
}

/* ── Boundary ──────────────────────────────────────────────────────────── */

export function createBall(key: string, radius: number, light: Light): Body {
  const u = { ...lightUniforms(light), uTime: { value: 0 } };
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 128, 64),
    new THREE.ShaderMaterial({
      uniforms: u,
      vertexShader: /* glsl */ `
        varying vec3 vObj; varying vec3 vN; varying vec3 vW;
        void main() { vObj = normalize(position); vN = normalize(mat3(modelMatrix) * normal); vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec3 vObj; varying vec3 vN; varying vec3 vW;
        uniform vec3 uLightPos; uniform vec3 uLightColor;
        float h(vec3 p) { p = fract(p * 0.3183 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
        float n3(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
          return mix(mix(mix(h(i), h(i + vec3(1,0,0)), f.x), mix(h(i + vec3(0,1,0)), h(i + vec3(1,1,0)), f.x), f.y),
                     mix(mix(h(i + vec3(0,0,1)), h(i + vec3(1,0,1)), f.x), mix(h(i + vec3(0,1,1)), h(i + vec3(1,1,1)), f.x), f.y), f.z); }
        void main() {
          vec3 o = vObj;
          float s = o.y;
          float phi = atan(o.z, o.x);
          float grain = n3(o * 22.0) * 0.5 + n3(o * 70.0) * 0.5;
          float scuff = smoothstep(0.62, 0.8, n3(o * 5.0 + 2.0));
          vec3 leather = mix(vec3(0.55, 0.05, 0.04), vec3(0.78, 0.13, 0.09), grain);
          leather = mix(leather, vec3(0.55, 0.22, 0.16), scuff * 0.45);
          // The main seam: a raised ridge with a stitch row either side.
          float ridge = exp(-pow(s / 0.012, 2.0));
          float groove = exp(-pow((abs(s) - 0.045) / 0.006, 2.0));
          float row = exp(-pow((abs(s) - 0.03) / 0.011, 2.0));
          float dash = smoothstep(0.4, 0.15, abs(fract(phi * 30.0 + sign(s) * 0.25 + s * 9.0) - 0.5));
          float stitch = row * dash;
          // A quieter quarter seam.
          float q = exp(-pow(o.x / 0.008, 2.0)) * (1.0 - smoothstep(0.0, 0.12, abs(s) - 0.3) * 0.0);
          vec3 col = leather;
          col = mix(col, col * 0.35, groove * 0.8 + q * 0.5);
          col = mix(col, vec3(0.5, 0.08, 0.06), ridge * 0.6);
          col = mix(col, vec3(1.0, 0.96, 0.86), stitch);
          vec3 N = normalize(vN);
          vec3 L = normalize(uLightPos - vW);
          vec3 V = normalize(cameraPosition - vW);
          float d = max(dot(N, L), 0.0);
          float shine = (0.4 + 0.6 * (1.0 - grain)) * (1.0 - scuff * 0.7);
          float sp = pow(max(dot(N, normalize(L + V)), 0.0), 160.0) * shine * 0.7 + pow(max(dot(N, normalize(L + V)), 0.0), 18.0) * shine * 0.04;
          vec3 c = col * col * uLightColor * (0.05 + d * 1.1) + uLightColor * sp;
          c += vec3(0.8, 0.9, 0.4) * pow(1.0 - max(dot(N, V), 0.0), 4.0) * 0.08;
          gl_FragColor = vec4(c, 1.0);
        }`,
    }),
  );
  const tilt = new THREE.Group();
  tilt.add(mesh);
  const group = new THREE.Group();
  group.add(tilt);
  // Keep the seam across the face, the way a seam bowler holds it: the ball
  // spins about the seam's own axis, so the seam stays put and the stitches run.
  const view = new THREE.Vector3();
  const axis = new THREE.Vector3();
  const Y = new THREE.Vector3(0, 1, 0);
  const q = new THREE.Quaternion();
  return {
    key,
    radius,
    group,
    update(time, dt, camera) {
      mesh.rotation.y += 1.4 * dt;
      view.copy(camera.position).sub(group.position).normalize();
      axis.crossVectors(view, Y).normalize();
      axis
        .applyAxisAngle(view, 0.55 + Math.sin(time * 0.3) * 0.08)
        .addScaledVector(view, 0.42)
        .normalize();
      q.setFromUnitVectors(Y, axis);
      tilt.quaternion.slerp(q, Math.min(1, dt * 4 + 0.02));
    },
  };
}

/* ── Rift Clash debris ─────────────────────────────────────────────────── */

export function createDebris(radius: number, light: Light, quality: number): THREE.Object3D {
  const count = quality > 0.6 ? 420 : 160;
  const geo = new THREE.IcosahedronGeometry(1, 0);
  const mat = new THREE.ShaderMaterial({
    uniforms: { ...lightUniforms(light) },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vW;
      void main() {
        vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.0);
        vW = w.xyz;
        vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying vec3 vN; varying vec3 vW;
      uniform vec3 uLightPos; uniform vec3 uLightColor;
      void main() {
        vec3 N = normalize(vN);
        vec3 L = normalize(uLightPos - vW);
        vec3 V = normalize(cameraPosition - vW);
        float d = max(dot(N, L), 0.0);
        float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
        vec3 c = vec3(0.09, 0.07, 0.14) * uLightColor * (0.1 + d) + vec3(1.0, 0.25, 0.95) * rim * 0.9;
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const r = rng(9);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const data: { a: number; d: number; y: number; s: number; w: number; rot: THREE.Euler }[] = [];
  for (let i = 0; i < count; i++) {
    const big = r() < 0.05;
    data.push({
      a: r() * Math.PI * 2,
      d: radius * (1.45 + r() * 0.75 + (big ? -0.2 : 0)),
      y: (r() - 0.5) * radius * (big ? 0.5 : 0.18),
      s: radius * (big ? 0.035 + r() * 0.035 : 0.005 + r() * r() * 0.022),
      w: 0.05 + r() * 0.08,
      rot: new THREE.Euler(r() * 6, r() * 6, r() * 6),
    });
  }
  const ring = new THREE.Group();
  ring.rotation.set(0.32, 0, -0.18);
  ring.add(mesh);
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  ring.userData.update = (time: number) => {
    data.forEach((o, i) => {
      const a = o.a + time * o.w * ((radius * 1.6) / o.d);
      p.set(Math.cos(a) * o.d, o.y, Math.sin(a) * o.d);
      e.set(o.rot.x + time * 0.3, o.rot.y + time * 0.2, o.rot.z);
      q.setFromEuler(e);
      s.setScalar(o.s);
      m.compose(p, q, s);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  return ring;
}

/* ── The belt ──────────────────────────────────────────────────────────── */

export function createBelt(inner: number, outer: number, light: Light, quality: number) {
  const count = quality > 0.6 ? 2600 : 900;
  const base = new THREE.IcosahedronGeometry(1, 1);
  const pos = base.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const k = 0.75 + vnoise(v.x * 1.7 + 3, v.y * 1.7, v.z * 1.7) * 0.5;
    v.multiplyScalar(k);
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  base.computeVertexNormals();
  const geo = base.toNonIndexed();
  geo.computeVertexNormals();
  const mat = new THREE.ShaderMaterial({
    uniforms: { ...lightUniforms(light), uGrow: { value: 1 } },
    vertexShader: /* glsl */ `
      varying vec3 vN; varying vec3 vW; varying vec3 vC;
      uniform float uGrow;
      void main() {
        vec4 w = modelMatrix * instanceMatrix * vec4(position * uGrow, 1.0);
        vW = w.xyz;
        vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal);
        vC = instanceColor;
        gl_Position = projectionMatrix * viewMatrix * w;
      }`,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying vec3 vN; varying vec3 vW; varying vec3 vC;
      uniform vec3 uLightPos; uniform vec3 uLightColor;
      void main() {
        vec3 N = normalize(vN);
        vec3 L = normalize(uLightPos - vW);
        vec3 V = normalize(cameraPosition - vW);
        float d = max(dot(N, L), 0.0);
        float rim = pow(1.0 - max(dot(N, V), 0.0), 4.0) * max(dot(V, -L), 0.0);
        vec3 c = vC * uLightColor * (0.025 + d * 0.9) + vec3(1.0, 0.7, 0.45) * rim * 0.5;
        gl_FragColor = vec4(c, 1.0);
      }`,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  const r = rng(21);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const a = r() * Math.PI * 2;
    const t = r();
    const d = inner + (outer - inner) * (t * 0.5 + r() * 0.5);
    p.set(Math.cos(a) * d, (r() - 0.5) * (r() - 0.5) * 9, Math.sin(a) * d);
    q.setFromEuler(new THREE.Euler(r() * 6, r() * 6, r() * 6));
    const big = r() < 0.03;
    s.set(1 + r() * 0.6, 0.7 + r() * 0.5, 1 + r() * 0.4).multiplyScalar(
      big ? 0.5 + r() * 0.8 : 0.05 + r() * r() * 0.3,
    );
    m.compose(p, q, s);
    mesh.setMatrixAt(i, m);
    const g = 0.16 + r() * 0.16;
    c.setRGB(g * (1.05 + r() * 0.15), g, g * (0.9 + r() * 0.1));
    mesh.setColorAt(i, c);
  }
  mesh.frustumCulled = false;
  mesh.userData.grow = mat.uniforms.uGrow;
  return mesh;
}
