/**
 * Worlds that are built, not painted: each one borrows the shape of its game.
 *
 *   createHexGlobe  Seventide's globe edition is a round world of hex tiles
 *                   with twelve pentagons, so this is a Goldberg polyhedron:
 *                   the dual of a subdivided icosahedron, with the twelve
 *                   pentagons lit as wellsprings.
 *   createCube      Cubit is 2048 in a 3×3×3 cube; its tiles, in its colours,
 *                   with the layers fanning apart the way Space peeks inside.
 *   createPaper     Eyeshot is graph paper and a coral arm: a planet ruled in
 *                   latitude and longitude, an angle drawn on it, and a
 *                   protractor ring that sweeps to the target and locks.
 */
import * as THREE from 'three';
import { lightUniforms, type Body, type Light } from './planet';

function hash3(x: number, y: number, z: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
const litVertex = /* glsl */ `
attribute vec3 color;
attribute float aGlow;
attribute float aWater;
varying vec3 vColor;
varying float vGlow;
varying float vWater;
varying vec3 vN;
varying vec3 vWorld;
void main() {
  vColor = color;
  vGlow = aGlow;
  vWater = aWater;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const litFragment = /* glsl */ `
precision highp float;
varying vec3 vColor;
varying float vGlow;
varying float vWater;
varying vec3 vN;
varying vec3 vWorld;
uniform vec3 uLightPos;
uniform vec3 uLightColor;
uniform vec3 uGlowColor;
uniform float uTime;
void main() {
  vec3 N = normalize(vN);
  vec3 L = normalize(uLightPos - vWorld);
  vec3 V = normalize(cameraPosition - vWorld);
  float ndl = dot(N, L);
  float d = clamp((ndl + 0.1) / 1.1, 0.0, 1.0);
  // A cool sky fill keeps the night side readable, and a rim lifts the limb.
  vec3 col = vColor * (uLightColor * d + vec3(0.11, 0.14, 0.17));
  col += vec3(0.32, 0.55, 0.62) * pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.4;
  vec3 H = normalize(L + V);
  col += uLightColor * pow(max(dot(N, H), 0.0), 90.0) * vWater * 0.9 * step(0.0, ndl);
  float night = 1.0 - smoothstep(-0.25, 0.2, ndl);
  float pulse = 0.8 + 0.2 * sin(uTime * 1.7 + vWorld.x * 0.3);
  col += uGlowColor * vGlow * pulse * (0.6 + night * 1.4);
  gl_FragColor = vec4(col, 1.0);
}`;

export function createHexGlobe(key: string, radius: number, light: Light): Body {
  // Frequency 4: 162 tiles (150 hexagons, 12 pentagons), the game's own globe.
  const ico = new THREE.IcosahedronGeometry(1, 3);
  const pos = ico.getAttribute('position');
  const verts: THREE.Vector3[] = [];
  const ids = new Map<string, number>();
  const tri: number[] = [];
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i).normalize();
    const k = `${Math.round(v.x * 1e4)},${Math.round(v.y * 1e4)},${Math.round(v.z * 1e4)}`;
    let id = ids.get(k);
    if (id === undefined) {
      id = verts.length;
      verts.push(v);
      ids.set(k, id);
    }
    tri.push(id);
  }
  ico.dispose();
  const centroids: THREE.Vector3[] = [];
  const around: number[][] = verts.map(() => []);
  const near: Set<number>[] = verts.map(() => new Set());
  for (let f = 0; f < tri.length / 3; f++) {
    const a = tri[f * 3]!,
      b = tri[f * 3 + 1]!,
      c = tri[f * 3 + 2]!;
    centroids.push(new THREE.Vector3().add(verts[a]!).add(verts[b]!).add(verts[c]!).normalize());
    for (const [p, q, r] of [
      [a, b, c],
      [b, c, a],
      [c, a, b],
    ] as const) {
      around[p]!.push(f);
      near[p]!.add(q).add(r);
    }
  }

  // The game's layout: a 27-tile continent around the three pentagons of one
  // icosahedron face (its wellsprings), four 5-tile isles grown from the sea
  // pentagons farthest apart, and the other five pentagons as lighthouse islets.
  const pents = verts.map((_, i) => i).filter((i) => near[i]!.size === 5);
  const want = new THREE.Vector3(0.35, 0.3, 0.88).normalize();
  let face: number[] = [];
  let best = -2;
  for (const a of pents)
    for (const b of pents)
      for (const c of pents) {
        if (!(a < b && b < c)) continue;
        const close = (p: number, q: number) => verts[p]!.dot(verts[q]!) > 0.4;
        if (!close(a, b) || !close(b, c) || !close(a, c)) continue;
        const m = new THREE.Vector3().add(verts[a]!).add(verts[b]!).add(verts[c]!).normalize();
        if (m.dot(want) > best) {
          best = m.dot(want);
          face = [a, b, c];
        }
      }
  const middle = new THREE.Vector3();
  for (const f of face) middle.add(verts[f]!);
  middle.normalize();
  const kind: string[] = verts.map(() => 'deep');
  const land = new Set<number>();
  verts
    .map((v, i) => ({ i, d: Math.acos(Math.min(1, v.dot(middle))) + hash3(v.x, v.y, v.z) * 0.12 }))
    .sort((x, y) => x.d - y.d)
    .slice(0, 27)
    .forEach(({ i }) => land.add(i));
  for (const f of face) land.add(f);
  const deck = [
    ...Array<string>(5).fill('wheat'),
    ...Array<string>(5).fill('forest'),
    ...Array<string>(5).fill('pasture'),
    ...Array<string>(4).fill('clay'),
    ...Array<string>(4).fill('stone'),
    'desert',
  ];
  let dealt = 0;
  [...land]
    .sort((x, y) => hash3(x, 1, 2) - hash3(y, 1, 2))
    .forEach((i) => {
      kind[i] = face.includes(i) ? 'well' : (deck[dealt++ % deck.length] ?? 'pasture');
    });
  const sea = pents.filter((p) => !land.has(p));
  const isles: number[] = [];
  while (isles.length < 4) {
    let pick = -1;
    let far = -1;
    for (const p of sea) {
      if (isles.includes(p)) continue;
      const others = [middle, ...isles.map((q) => verts[q]!)];
      const d = Math.min(...others.map((o) => Math.acos(Math.min(1, verts[p]!.dot(o)))));
      if (d > far) {
        far = d;
        pick = p;
      }
    }
    isles.push(pick);
  }
  const types = ['wheat', 'forest', 'pasture', 'clay', 'stone'];
  isles.forEach((p, n) => {
    const tiles = [p, ...[...near[p]!].sort((x, y) => hash3(x, n, 3) - hash3(y, n, 3)).slice(0, 4)];
    tiles.forEach((i, k) => {
      land.add(i);
      kind[i] = types[(k + n) % types.length]!;
    });
  });
  for (const p of sea) if (!isles.includes(p)) kind[p] = 'light';
  verts.forEach((_, i) => {
    if (kind[i] === 'deep' && [...near[i]!].some((j) => land.has(j))) kind[i] = 'shallow';
  });
  const palette: Record<string, [number, number, number]> = {
    deep: [0x1d6478, 0, 0.6],
    shallow: [0x34aeb0, 0.002, 0.8],
    desert: [0xe7d19a, 0.016, 0],
    well: [0x58d8cf, 0.03, 0],
    light: [0xd9d4c8, 0.022, 0],
    pasture: [0x93c24a, 0.024, 0],
    wheat: [0xf0ad38, 0.024, 0],
    forest: [0x3f7d32, 0.034, 0],
    clay: [0xbd6f45, 0.04, 0],
    stone: [0x9d9a96, 0.07, 0],
  };

  const P: number[] = [];
  const Nn: number[] = [];
  const C: number[] = [];
  const G: number[] = [];
  const W: number[] = [];
  const col = new THREE.Color();
  const push = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    c: THREE.Vector3,
    color: THREE.Color,
    glow: number,
    water: number,
    flat?: THREE.Vector3,
  ) => {
    const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
    if (n.dot(a) < 0) [b, c] = [c, b];
    if (flat) n.copy(flat);
    else n.subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize();
    for (const p of [a, b, c]) {
      P.push(p.x * radius, p.y * radius, p.z * radius);
      Nn.push(n.x, n.y, n.z);
      C.push(color.r, color.g, color.b);
      G.push(glow);
      W.push(water);
    }
  };
  /** A cone (top 0) or a straight prism from `b` along `up`, wound outward. */
  const prism = (
    b: THREE.Vector3,
    up: THREE.Vector3,
    u: THREE.Vector3,
    v: THREE.Vector3,
    rBase: number,
    rTop: number,
    h: number,
    sides: number,
    color: THREE.Color,
  ) => {
    const ring = (r: number, lift: number) =>
      Array.from({ length: sides }, (_, j) => {
        const a = (j / sides) * Math.PI * 2 + Math.PI / sides;
        return b
          .clone()
          .addScaledVector(u, Math.cos(a) * r)
          .addScaledVector(v, Math.sin(a) * r)
          .addScaledVector(up, lift);
      });
    const lo = ring(rBase, 0);
    const hi = rTop > 0 ? ring(rTop, h) : null;
    const apex = b.clone().addScaledVector(up, h);
    const face = (a: THREE.Vector3, c: THREE.Vector3, d: THREE.Vector3) => {
      const nn = new THREE.Vector3().subVectors(c, a).cross(new THREE.Vector3().subVectors(d, a));
      nn.normalize();
      for (const p of [a, c, d]) {
        P.push(p.x * radius, p.y * radius, p.z * radius);
        Nn.push(nn.x, nn.y, nn.z);
        C.push(color.r, color.g, color.b);
        G.push(0);
        W.push(0);
      }
    };
    for (let j = 0; j < sides; j++) {
      const j2 = (j + 1) % sides;
      if (hi) {
        face(lo[j]!, lo[j2]!, hi[j2]!);
        face(lo[j]!, hi[j2]!, hi[j]!);
      } else face(lo[j]!, lo[j2]!, apex);
    }
  };
  const t1 = new THREE.Vector3();
  const t2 = new THREE.Vector3();
  verts.forEach((n, i) => {
    t1.set(n.y, -n.x, 0);
    if (t1.lengthSq() < 1e-6) t1.set(0, n.z, -n.y);
    t1.normalize();
    t2.crossVectors(n, t1);
    const ring = around[i]!.map((f) => centroids[f]!)
      .map((c) => ({ c, a: Math.atan2(c.dot(t2), c.dot(t1)) }))
      .sort((x, y) => x.a - y.a)
      .map((x) => x.c);
    const k = kind[i]!;
    const [hex, h, water] = palette[k]!;
    col.set(hex);
    // A little per-tile variation so the field reads as tiles, not a decal.
    col.offsetHSL(0, 0, (hash3(n.x * 9, n.y * 9, n.z * 9) - 0.5) * 0.06);
    const top = 1 + h;
    const bevel = water ? 0 : 0.006;
    const centre = n.clone().multiplyScalar(top);
    const inner = ring.map((c) => c.clone().lerp(n, 0.12).normalize().multiplyScalar(top));
    const outer = ring.map((c) => c.clone().multiplyScalar(top - bevel));
    // Walls run below the sea, so a raised tile at the limb never floats.
    const base = ring.map((c) => c.clone().multiplyScalar(0.95));
    const rim = col.clone().multiplyScalar(0.82);
    const wall = col.clone().multiplyScalar(0.62);
    const glow = k === 'well' ? 0.35 : k === 'light' ? 0.18 : 0;
    const wet = water;
    for (let j = 0; j < ring.length; j++) {
      const j2 = (j + 1) % ring.length;
      push(centre, inner[j]!, inner[j2]!, col, glow, wet, n);
      push(inner[j]!, outer[j]!, outer[j2]!, rim, glow * 0.6, wet);
      push(inner[j]!, outer[j2]!, inner[j2]!, rim, glow * 0.6, wet);
      if (!wet) {
        push(outer[j]!, base[j]!, base[j2]!, wall, 0, 0);
        push(outer[j]!, base[j2]!, outer[j2]!, wall, 0, 0);
      }
    }
    // A few props so the globe reads as the board it is: woods, peaks and
    // the odd hamlet with its red roof.
    const at = (dx: number, dy: number) =>
      centre.clone().addScaledVector(t1, dx).addScaledVector(t2, dy);
    const r0 = hash3(n.x * 31, n.y * 31, n.z * 31);
    if (k === 'forest')
      for (let q = 0; q < 3; q++) {
        const a = r0 * 6.28 + q * 2.09;
        const tree = col
          .clone()
          .set(0x2c6a2a)
          .offsetHSL(0, 0, (q - 1) * 0.03);
        prism(at(Math.cos(a) * 0.065, Math.sin(a) * 0.065), n, t1, t2, 0.034, 0, 0.1, 7, tree);
      }
    else if (k === 'stone') {
      prism(at(0.02, -0.02), n, t1, t2, 0.07, 0, 0.11, 5, col.clone().set(0x8d8b88));
      prism(at(-0.06, 0.04), n, t1, t2, 0.045, 0, 0.07, 5, col.clone().set(0x7d7b78));
    } else if ((k === 'wheat' || k === 'pasture') && r0 < 0.4) {
      const spot = at(0.03, 0.02);
      prism(spot, n, t1, t2, 0.036, 0.036, 0.034, 4, col.clone().set(0xefe6d2));
      prism(
        spot.clone().addScaledVector(n, 0.034),
        n,
        t1,
        t2,
        0.052,
        0,
        0.042,
        4,
        col.clone().set(0xb5473a),
      );
    }
  });
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(Nn, 3));
  geo.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
  geo.setAttribute('aGlow', new THREE.Float32BufferAttribute(G, 1));
  geo.setAttribute('aWater', new THREE.Float32BufferAttribute(W, 1));
  const uniforms = {
    ...lightUniforms(light),
    uGlowColor: { value: new THREE.Color('#5ff0e4').multiplyScalar(0.9) },
    uTime: { value: 0 },
  };
  const mesh = new THREE.Mesh(
    geo,
    new THREE.ShaderMaterial({ vertexShader: litVertex, fragmentShader: litFragment, uniforms }),
  );
  const group = new THREE.Group();
  const axis = new THREE.Group();
  axis.rotation.z = 0.3;
  axis.add(mesh);
  group.add(axis);
  return {
    key,
    radius,
    group,
    update(time, dt) {
      mesh.rotation.y += 0.05 * dt;
      uniforms.uTime.value = time;
    },
  };
}

/* Cubit's tiles: value → face colour and the ink its number is printed in. */
const TILES: [number, string, string][] = [
  [2, '#eceef2', '#1d2333'],
  [4, '#c7ecf6', '#1d2333'],
  [8, '#9fdcf0', '#13202e'],
  [16, '#a3ecd2', '#13202e'],
  [32, '#a8e8a0', '#13202e'],
  [64, '#e2f29a', '#13202e'],
  [128, '#fbe58c', '#2a1a08'],
  [256, '#ffc45c', '#2a1405'],
  [512, '#ff7f66', '#ffffff'],
  [1024, '#ff69da', '#ffffff'],
];

/** A box with rounded edges: a subdivided cube pushed out from an inner box. */
function roundedBox(size: number, round: number, seg = 6) {
  const geo = new THREE.BoxGeometry(size, size, size, seg, seg, seg);
  const p = geo.getAttribute('position');
  const n = geo.getAttribute('normal');
  const h = size / 2 - round;
  const v = new THREE.Vector3();
  const c = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    c.set(
      Math.max(-h, Math.min(h, v.x)),
      Math.max(-h, Math.min(h, v.y)),
      Math.max(-h, Math.min(h, v.z)),
    );
    v.sub(c).normalize();
    n.setXYZ(i, v.x, v.y, v.z);
    v.multiplyScalar(round).add(c);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  return geo;
}

function tileAtlas() {
  const cell = 128;
  const cv = document.createElement('canvas');
  cv.width = cell * 4;
  cv.height = cell * 4;
  const g = cv.getContext('2d')!;
  draw(g, cell);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  // The numbers are set in the page's face once it has loaded.
  void document.fonts?.ready.then(() => {
    g.clearRect(0, 0, cv.width, cv.height);
    draw(g, cell);
    tex.needsUpdate = true;
  });
  return tex;
}

function draw(g: CanvasRenderingContext2D, cell: number) {
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  TILES.forEach(([v, , ink], i) => {
    const x = (i % 4) * cell + cell / 2;
    const y = Math.floor(i / 4) * cell + cell / 2 + 4;
    const size = v >= 1000 ? 40 : v >= 100 ? 50 : 64;
    g.font = `800 ${size}px "Geist Variable", system-ui, sans-serif`;
    g.fillStyle = ink;
    g.fillText(String(v), x, y);
  });
}

export function createCube(key: string, radius: number, light: Light): Body {
  const gap = radius * 0.62;
  const size = gap * 0.84;
  const geo = roundedBox(size, size * 0.2);
  // A believable late-game board: big tiles in the corners, small ones filling in.
  const board: [number, number, number, number][] = [
    [-1, 1, -1, 7],
    [1, 1, -1, 9],
    [0, 1, 0, 2],
    [-1, 1, 1, 0],
    [1, 1, 1, 1],
    [-1, 0, -1, 6],
    [0, 0, -1, 8],
    [1, 0, 0, 2],
    [-1, 0, 1, 0],
    [1, 0, 1, 3],
    [-1, -1, -1, 5],
    [0, -1, -1, 4],
    [1, -1, -1, 3],
    [-1, -1, 0, 1],
    [0, -1, 1, 0],
    [1, -1, 1, 2],
  ];
  const tileIndex = new Float32Array(board.map((b) => b[3]));
  geo.setAttribute('aTile', new THREE.InstancedBufferAttribute(tileIndex, 1));
  const uniforms = {
    ...lightUniforms(light),
    uAtlas: { value: tileAtlas() },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: /* glsl */ `
      attribute float aTile;
      varying vec3 vColor;
      varying vec3 vN;
      varying vec3 vWorld;
      varying vec2 vUv;
      varying float vTile;
      void main() {
        vColor = instanceColor;
        vUv = uv;
        vTile = aTile;
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
      varying vec2 vUv;
      varying float vTile;
      uniform vec3 uLightPos;
      uniform vec3 uLightColor;
      uniform sampler2D uAtlas;
      void main() {
        vec3 N = normalize(vN);
        vec3 L = normalize(uLightPos - vWorld);
        vec3 V = normalize(cameraPosition - vWorld);
        float cx = mod(vTile, 4.0);
        float cy = floor(vTile / 4.0);
        vec2 uv = (vec2(cx, cy) + vec2(vUv.x, 1.0 - vUv.y)) / 4.0;
        vec4 ink = texture2D(uAtlas, vec2(uv.x, 1.0 - uv.y));
        vec3 base = mix(vColor, ink.rgb, ink.a);
        float d = clamp((dot(N, L) + 0.25) / 1.25, 0.0, 1.0);
        vec3 col = base * uLightColor * (0.16 + d * 0.95);
        vec3 H = normalize(L + V);
        col += uLightColor * pow(max(dot(N, H), 0.0), 60.0) * 0.35;
        float rim = pow(1.0 - max(dot(N, V), 0.0), 3.0);
        col += vColor * rim * 0.35;
        // The two biggest tiles glow, as they do in the game.
        col += vColor * step(7.5, vTile) * 0.45;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const mesh = new THREE.InstancedMesh(geo, mat, board.length);
  board.forEach((b, i) => mesh.setColorAt(i, new THREE.Color(TILES[b[3]]![1])));
  const cage = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(gap * 3, gap * 3, gap * 3)),
    new THREE.LineBasicMaterial({ color: 0x9fb4ff, transparent: true, opacity: 0.22 }),
  );
  const spin = new THREE.Group();
  spin.add(mesh, cage);
  const group = new THREE.Group();
  const axis = new THREE.Group();
  axis.rotation.set(0.42, 0, 0.18);
  axis.add(spin);
  group.add(axis);
  const m = new THREE.Matrix4();
  const place = (spread: number) => {
    board.forEach(([x, y, z], i) => {
      const s = gap * (1 + spread);
      m.makeTranslation(x * s, y * s, z * s);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  place(0);
  return {
    key,
    radius,
    group,
    update(time, dt) {
      spin.rotation.y += 0.09 * dt;
      // Every so often the layers fan apart, as Space does in the game.
      const wave = Math.pow(0.5 + 0.5 * Math.sin(time * 0.45), 8);
      place(wave * 0.42);
    },
  };
}

export function createPaper(key: string, radius: number, light: Light): Body {
  const uniforms = {
    ...lightUniforms(light),
    uTime: { value: 0 },
    uAngle: { value: 0 },
    uLock: { value: 0 },
  };
  const surface = new THREE.Mesh(
    new THREE.SphereGeometry(radius, 128, 64),
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: /* glsl */ `
        varying vec3 vObj;
        varying vec3 vN;
        varying vec3 vWorld;
        void main() {
          vObj = normalize(position);
          vec4 w = modelMatrix * vec4(position, 1.0);
          vWorld = w.xyz;
          vN = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * viewMatrix * w;
        }`,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec3 vObj;
        varying vec3 vN;
        varying vec3 vWorld;
        uniform vec3 uLightPos;
        uniform vec3 uLightColor;
        uniform float uAngle;
        uniform float uLock;
        const float PI = 3.14159265;
        float line(float a, float stepA, float w) {
          float x = a / stepA;
          float d = abs(fract(x - 0.5) - 0.5) * stepA;
          float aa = fwidth(a) * 1.2;
          return 1.0 - smoothstep(w, w + aa, d);
        }
        float arm(vec3 X, vec3 P0, vec3 T, float len, float w) {
          vec3 n = normalize(cross(P0, T));
          float off = abs(dot(X, n));
          float along = atan(dot(X, T), dot(X, P0));
          float aa = fwidth(off) * 1.2;
          return (1.0 - smoothstep(w, w + aa, off)) * step(0.0, along) * step(along, len);
        }
        void main() {
          vec3 N = normalize(vN);
          vec3 L = normalize(uLightPos - vWorld);
          float lon = atan(vObj.z, vObj.x);
          float lat = asin(clamp(vObj.y, -1.0, 1.0));
          vec3 paper = vec3(0.965, 0.95, 0.915);
          float minor = max(line(lon * cos(lat), PI / 36.0, 0.0015), line(lat, PI / 36.0, 0.0015));
          float major = max(line(lon, PI / 6.0, 0.0028), line(lat, PI / 6.0, 0.0028));
          vec3 c = mix(paper, vec3(0.78, 0.84, 0.91), minor * 0.8);
          c = mix(c, vec3(0.55, 0.66, 0.8), major);
          // The challenge: an ink arm, a coral arm, and the angle between them.
          vec3 P0 = normalize(vec3(0.15, 0.05, 1.0));
          vec3 T0 = normalize(cross(vec3(0.0, 1.0, 0.0), P0));
          vec3 B0 = cross(P0, T0);
          vec3 Ta = T0;
          vec3 Tb = normalize(T0 * cos(uAngle) + B0 * sin(uAngle));
          float ink = arm(vObj, P0, Ta, 0.95, 0.006);
          float coral = arm(vObj, P0, Tb, 0.95, 0.006);
          float dotP = 1.0 - smoothstep(0.018, 0.024, acos(clamp(dot(vObj, P0), -1.0, 1.0)));
          vec3 coralC = vec3(0.9, 0.33, 0.25);
          c = mix(c, vec3(0.11, 0.14, 0.2), max(ink, dotP));
          c = mix(c, coralC, coral);
          float d = clamp((dot(N, L) + 0.2) / 1.2, 0.0, 1.0);
          vec3 col = c * uLightColor * (0.1 + d * 0.95);
          col += coralC * coral * (0.25 + uLock * 1.6);
          gl_FragColor = vec4(col, 1.0);
        }`,
    }),
  );
  const ringU = { uAngle: uniforms.uAngle, uLock: uniforms.uLock };
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(radius * 1.38, radius * 1.62, 360, 1),
    new THREE.ShaderMaterial({
      uniforms: ringU,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader: /* glsl */ `
        varying vec2 vP;
        void main() {
          vP = position.xy;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        precision highp float;
        varying vec2 vP;
        uniform float uAngle;
        uniform float uLock;
        const float PI = 3.14159265;
        void main() {
          float r = length(vP);
          float a = atan(vP.y, vP.x);
          float inner = ${(radius * 1.38).toFixed(4)};
          float outer = ${(radius * 1.62).toFixed(4)};
          float t = (r - inner) / (outer - inner);
          float deg = mod(degrees(a) + 360.0, 360.0);
          float step5 = abs(mod(deg + 2.5, 5.0) - 2.5);
          float step30 = abs(mod(deg + 15.0, 30.0) - 15.0);
          float aa = fwidth(deg) * 1.2;
          float minor = (1.0 - smoothstep(0.12, 0.12 + aa, step5)) * step(0.72, t);
          float major = (1.0 - smoothstep(0.22, 0.22 + aa, step30)) * step(0.4, t);
          float edge = 1.0 - smoothstep(0.0, 0.05, abs(t - 0.98));
          vec3 col = vec3(0.92, 0.94, 0.98) * max(max(minor, major), edge) * 0.75;
          float alpha = max(max(minor, major), edge) * 0.8;
          // The coral sweep, 0 → target, at the inner edge.
          float sweep = step(0.0, a) * step(a, uAngle) * smoothstep(0.0, 0.05, t) * (1.0 - smoothstep(0.3, 0.36, t));
          vec3 coral = vec3(0.98, 0.38, 0.28);
          col += coral * sweep * (0.9 + uLock * 1.4);
          alpha = max(alpha, sweep * 0.85);
          gl_FragColor = vec4(col * alpha, alpha);
        }`,
      blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
    }),
  );
  ring.rotation.x = -Math.PI / 2 + 0.38;
  ring.renderOrder = 3;
  const group = new THREE.Group();
  const axis = new THREE.Group();
  axis.rotation.z = -0.22;
  axis.add(surface, ring);
  group.add(axis);
  const target = THREE.MathUtils.degToRad(117);
  return {
    key,
    radius,
    group,
    update(time, dt) {
      surface.rotation.y += 0.035 * dt;
      // A round of the game: sweep toward the target, lock, hold, start over.
      const cycle = 9;
      const t = (time % cycle) / cycle;
      const e = Math.min(1, t / 0.45);
      const ease = 1 - Math.pow(1 - e, 3);
      const over = Math.sin(Math.min(1, t / 0.45) * Math.PI) * 0.06;
      uniforms.uAngle.value = target * ease + over * (1 - ease);
      uniforms.uLock.value = t > 0.45 && t < 0.62 ? Math.sin(((t - 0.45) / 0.17) * Math.PI) : 0;
    },
  };
}
