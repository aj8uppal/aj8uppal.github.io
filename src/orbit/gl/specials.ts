/**
 * Blockhold's voxel planet (water, roads, trees, towers) and the asteroid belt.
 * The other built worlds are in bodies.ts.
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
  // Blocks are full size with the seams drawn on: a real 2% gap between
  // blocks went sub-pixel at viewing distance and flickered as the world spun.
  const box = new THREE.BoxGeometry(size, size, size);
  const mat = new THREE.ShaderMaterial({
    uniforms: { ...lightUniforms(light), uInvSize: { value: 1 / size } },
    vertexShader: /* glsl */ `
      uniform float uInvSize;
      varying vec3 vColor;
      varying vec3 vN;
      varying vec3 vWorld;
      varying vec3 vLocal;
      void main() {
        vColor = instanceColor;
        vLocal = position * uInvSize;
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
      varying vec3 vLocal;
      uniform vec3 uLightPos;
      uniform vec3 uLightColor;
      void main() {
        vec3 L = normalize(uLightPos - vWorld);
        float d = max(dot(normalize(vN), L), 0.0);
        vec3 col = vColor * uLightColor * (0.05 + d * 1.05);
        // Distance to the nearest edge of this face, in blocks. The seam is
        // anti-aliased, and once it is thinner than a pixel it fades to the
        // share of the pixel it covers instead of popping.
        vec3 q = abs(vLocal);
        float hi = max(q.x, max(q.y, q.z));
        float lo = min(q.x, min(q.y, q.z));
        float e = 0.5 - (q.x + q.y + q.z - hi - lo);
        float w = max(fwidth(e), 1e-5);
        const float line = 0.012;
        float seam = (1.0 - smoothstep(line - w, line + w, e)) * min(1.0, line / w);
        gl_FragColor = vec4(col * (1.0 - seam * 0.6), 1.0);
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
  const geo = base.index ? base.toNonIndexed() : base;
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
