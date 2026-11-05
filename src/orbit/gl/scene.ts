/**
 * The system: renderer, post-processing, the black hole, eight worlds on their
 * orbits, the belt, Earth and the Moon, and the stars that streak when you fly.
 */
import * as THREE from 'three';
import {
  BloomEffect,
  ChromaticAberrationEffect,
  EffectComposer,
  EffectPass,
  NoiseEffect,
  RenderPass,
  ToneMappingEffect,
  ToneMappingMode,
  VignetteEffect,
  BlendFunction,
} from 'postprocessing';
import { createBlackHole, DISK_OUT, type BlackHole } from './blackhole';

const DISK_LENS = DISK_OUT + 4;
import { createPlanet, type Body, type Light } from './planet';
import {
  createBall,
  createBelt,
  createDebris,
  createGrid,
  createSwarm,
  createVoxel,
} from './specials';
import { texture } from './textures';
import { worlds } from '../worlds';

export const EARTH = new THREE.Vector3(-760, 70, 1180);
export const MOON_OFFSET = new THREE.Vector3(26, 4, -12);
export const SUN_DIR = new THREE.Vector3(0.82, 0.12, -0.56).normalize();
export const BELT = { inner: 158, outer: 186 };

export interface Tier {
  name: 'high' | 'mid' | 'low';
  dpr: number;
  bhScale: number;
  steps: number;
  msaa: number;
  quality: number;
}

export function pickTier(): Tier {
  const mobile =
    matchMedia('(pointer: coarse)').matches || Math.min(screen.width, screen.height) < 600;
  const dpr = window.devicePixelRatio || 1;
  if (mobile)
    return {
      name: 'low',
      dpr: Math.min(dpr, 1.5),
      bhScale: 0.45,
      steps: 120,
      msaa: 0,
      quality: 0.4,
    };
  return { name: 'high', dpr: Math.min(dpr, 1.75), bhScale: 0.62, steps: 240, msaa: 4, quality: 1 };
}

export function downgrade(t: Tier): Tier | null {
  if (t.name === 'high')
    return {
      name: 'mid',
      dpr: Math.min(t.dpr, 1.25),
      bhScale: 0.5,
      steps: 170,
      msaa: 0,
      quality: 0.7,
    };
  if (t.name === 'mid')
    return { name: 'low', dpr: 1, bhScale: 0.4, steps: 110, msaa: 0, quality: 0.4 };
  return null;
}

/** World-space body record the camera director can aim at. */
export interface Placed {
  key: string;
  body: Body;
  orbit: number;
  phase: number;
  incline: number;
  speed: number;
  index: number;
}

export interface System {
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  bh: BlackHole;
  placed: Placed[];
  earth: Body;
  moon: Body;
  diskLight: Light;
  sunLight: Light;
  /** Per-frame knobs the director sets. */
  fx: {
    speed: number;
    velocity: THREE.Vector3;
    disk: number;
    orbits: number;
    sun: number;
    exposure: number;
    belt: number;
    /** The world the camera is holding on, if any. */
    focus: string;
  };
  setTier(t: Tier): void;
  compile(): void;
  resize(): void;
  frame(time: number, dt: number): void;
  bodyPosition(key: string, out: THREE.Vector3): THREE.Vector3;
  dispose(): void;
}

function makeStars(count: number) {
  const geo = new THREE.InstancedBufferGeometry();
  geo.setAttribute(
    'position',
    new THREE.Float32BufferAttribute([0, -1, 0, 1, -1, 0, 1, 1, 0, 0, 1, 0], 3),
  );
  geo.setIndex([0, 1, 2, 0, 2, 3]);
  const pos = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = Math.random() * 300;
    pos[i * 3 + 1] = Math.random() * 300;
    pos[i * 3 + 2] = Math.random() * 300;
    seed[i] = Math.random();
  }
  geo.setAttribute('aPos', new THREE.InstancedBufferAttribute(pos, 3));
  geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 1));
  geo.instanceCount = count;
  const u = {
    uCam: { value: new THREE.Vector3() },
    uVel: { value: new THREE.Vector3() },
    uBox: { value: 300 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uStretch: { value: 0.11 },
    uGain: { value: 1 },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms: u,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      attribute vec3 aPos;
      attribute float aSeed;
      uniform vec3 uCam;
      uniform vec3 uVel;
      uniform float uBox;
      uniform vec2 uRes;
      uniform float uStretch;
      varying float vA;
      varying float vAcross;
      varying vec3 vColor;
      void main() {
        vec3 rel = mod(aPos - uCam + uBox * 0.5, uBox) - uBox * 0.5;
        vec3 wp = uCam + rel;
        vec4 c0 = projectionMatrix * viewMatrix * vec4(wp, 1.0);
        vec4 c1 = projectionMatrix * viewMatrix * vec4(wp - uVel * uStretch, 1.0);
        float behind = step(c0.w, 0.05);
        c1.w = max(c1.w, 0.05);
        vec2 s0 = c0.xy / max(c0.w, 0.05) * uRes * 0.5;
        vec2 s1 = c1.xy / c1.w * uRes * 0.5;
        vec2 d = s1 - s0;
        float len = length(d);
        if (len > 900.0) { d *= 900.0 / len; len = 900.0; }
        vec2 dn = len > 0.001 ? d / len : vec2(1.0, 0.0);
        vec2 nn = vec2(-dn.y, dn.x);
        float dist = length(rel);
        float w = (0.6 + aSeed * 0.9) * clamp(30.0 / dist, 0.5, 1.6);
        vec2 p = s0 + d * position.x + nn * position.y * w + dn * (position.x - 0.5) * w * 2.0;
        gl_Position = vec4(p / (uRes * 0.5) * c0.w, c0.z, c0.w);
        float fade = smoothstep(uBox * 0.5, uBox * 0.32, dist) * smoothstep(2.0, 8.0, dist);
        vA = fade * (1.0 - behind) * (0.12 + pow(aSeed, 3.0) * 0.6) * (1.0 + min(len, 300.0) * 0.012) / (1.0 + len * 0.0035);
        vAcross = position.y;
        vColor = mix(vec3(0.7, 0.82, 1.0), vec3(1.0, 0.86, 0.7), fract(aSeed * 7.13));
      }`,
    fragmentShader: /* glsl */ `
      precision highp float;
      varying float vA;
      varying float vAcross;
      varying vec3 vColor;
      uniform float uGain;
      void main() {
        float a = (1.0 - vAcross * vAcross) * vA * uGain;
        gl_FragColor = vec4(vColor * a * 2.0, a);
      }`,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.frustumCulled = false;
  mesh.renderOrder = 5;
  return { mesh, u };
}

function makeNebula(
  key: 'nebulaViolet' | 'nebulaAmber' | 'nebulaBlue',
  pos: THREE.Vector3,
  size: number,
  gain: number,
) {
  const u = {
    uMap: { value: texture(key, { mips: true }) },
    uSize: { value: new THREE.Vector2(size, size * 0.667) },
    uGain: { value: gain },
    uRot: { value: Math.random() * 6.28 },
  };
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      uniforms: u,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        uniform vec2 uSize;
        uniform float uRot;
        varying vec2 vUv;
        varying float vFade;
        void main() {
          vUv = uv;
          vec4 mv = modelViewMatrix * vec4(0.0, 0.0, 0.0, 1.0);
          vec2 p = position.xy * uSize;
          p = mat2(cos(uRot), -sin(uRot), sin(uRot), cos(uRot)) * p;
          mv.xy += p;
          vFade = smoothstep(uSize.x * 0.25, uSize.x * 0.9, -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform sampler2D uMap;
        uniform float uGain;
        varying vec2 vUv;
        varying float vFade;
        void main() {
          vec3 c = texture2D(uMap, vUv).rgb;
          gl_FragColor = vec4(c * uGain * vFade, 1.0);
        }`,
    }),
  );
  mesh.position.copy(pos);
  mesh.frustumCulled = false;
  mesh.renderOrder = -10;
  return mesh;
}

function makeOrbit(radius: number, incline: number, color: string) {
  const n = 384;
  const pos = new Float32Array(n * 3);
  const ang = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * radius;
    pos[i * 3 + 1] = Math.sin(a) * Math.sin(incline) * radius;
    pos[i * 3 + 2] = Math.sin(a) * radius * Math.cos(incline);
    ang[i] = a;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aAng', new THREE.BufferAttribute(ang, 1));
  const u = {
    uPhase: { value: 0 },
    uColor: { value: new THREE.Color(color) },
    uAlpha: { value: 1 },
  };
  const line = new THREE.LineLoop(
    geo,
    new THREE.ShaderMaterial({
      uniforms: u,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute float aAng;
        uniform float uPhase;
        varying float vT;
        void main() {
          float d = mod(uPhase - aAng, 6.2831853);
          vT = d;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform vec3 uColor;
        uniform float uAlpha;
        varying float vT;
        void main() {
          float trail = exp(-vT * 1.4);
          float a = (0.1 + trail * 0.9) * uAlpha;
          gl_FragColor = vec4(uColor * a, a);
        }`,
    }),
  );
  line.frustumCulled = false;
  return { line, u };
}

export function createSystem(canvas: HTMLCanvasElement, initial: Tier): System {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    stencil: false,
    depth: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 1);
  let tier = initial;
  renderer.setPixelRatio(tier.dpr);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.05, 9000);
  camera.position.set(0, 2, 26);
  const scene = new THREE.Scene();

  const sky = texture('sky', { mips: false });
  const bh = createBlackHole(sky);

  // The lensed sky, drawn behind everything from the half-res pass.
  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      uniforms: { uTex: { value: bh.target.texture } },
      depthTest: false,
      depthWrite: false,
      vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.99999, 1.0); }`,
      fragmentShader: /* glsl */ `precision highp float; uniform sampler2D uTex; varying vec2 vUv; void main() { gl_FragColor = vec4(texture2D(uTex, vUv).rgb, 1.0); }`,
    }),
  );
  back.frustumCulled = false;
  back.renderOrder = -1000;
  scene.add(back);

  const diskLight: Light = {
    mode: 0,
    pos: new THREE.Vector3(0, 0, 0),
    dir: new THREE.Vector3(),
    color: new THREE.Color(1.0, 0.9, 0.8).multiplyScalar(0.95),
  };
  const sunLight: Light = {
    mode: 1,
    pos: new THREE.Vector3(),
    dir: SUN_DIR.clone(),
    color: new THREE.Color(1.0, 0.97, 0.92).multiplyScalar(1.0),
  };

  // Nebulae hang far outside the system, where they read as depth, not decals.
  scene.add(makeNebula('nebulaViolet', new THREE.Vector3(-900, 260, -1500), 1500, 0.55));
  scene.add(makeNebula('nebulaAmber', new THREE.Vector3(1400, -200, 600), 1300, 0.42));
  scene.add(makeNebula('nebulaBlue', new THREE.Vector3(-300, -380, 1900), 1400, 0.5));
  scene.add(makeNebula('nebulaViolet', new THREE.Vector3(-1500, 420, 2100), 1100, 0.35));
  scene.add(makeNebula('nebulaAmber', new THREE.Vector3(200, 600, -1800), 1200, 0.3));

  const placed: Placed[] = [];
  const orbits: { u: { uPhase: { value: number }; uAlpha: { value: number } }; p: Placed }[] = [];
  worlds.forEach((w, index) => {
    const s = w.planet;
    let body: Body;
    if (s.kind === 'grid') body = createGrid(w.key, s.radius, diskLight, tier.quality);
    else if (s.kind === 'voxel') body = createVoxel(w.key, s.radius, diskLight);
    else if (s.kind === 'swarm') body = createSwarm(w.key, s.radius, tier.quality);
    else if (s.kind === 'ball') body = createBall(w.key, s.radius, diskLight);
    else
      body = createPlanet({
        key: w.key,
        radius: s.radius,
        map: s.map as never,
        light: diskLight,
        atmosphere: s.atmosphere,
        glow: s.glow,
        glowMode: s.map === 'ember' ? 1 : s.map === 'rift' ? 2 : s.map === 'ice' ? 3 : 0,
        glowGain: s.map === 'ice' ? 0.9 : s.map === 'rift' ? 1.1 : 2.2,
        waterMode: s.kind === 'ocean' ? 2 : 0,
        clouds: s.clouds ? 'clouds' : undefined,
        rings: s.rings ? { inner: 1.45, outer: 2.55, tint: '#bfefff', tilt: 0.42 } : undefined,
        tilt: s.tilt,
        spin: s.spin,
        atmosphereIntensity: s.kind === 'ocean' ? 1.25 : 1,
      });
    if (s.kind === 'rift') {
      const debris = createDebris(s.radius, diskLight, tier.quality);
      body.group.add(debris);
      const inner = body.update;
      body.update = (t, dt, c) => {
        inner(t, dt, c);
        (debris.userData.update as (t: number) => void)(t);
      };
    }
    scene.add(body.group);
    const p: Placed = {
      key: w.key,
      body,
      orbit: s.orbit,
      phase: s.phase,
      incline: s.incline,
      speed: 0.9 / Math.pow(s.orbit, 1.5),
      index,
    };
    placed.push(p);
    const o = makeOrbit(s.orbit, s.incline, w.accent);
    scene.add(o.line);
    orbits.push({ u: o.u, p });
  });

  const belt = createBelt(BELT.inner, BELT.outer, diskLight, tier.quality);
  scene.add(belt);

  const earth = createPlanet({
    key: 'earth',
    radius: 6,
    map: tier.quality > 0.6 ? 'earthDay' : 'earthDayLo',
    night: 'earthNight',
    clouds: 'clouds',
    water: 'earthWater',
    waterMode: 1,
    light: sunLight,
    atmosphere: '#5aa6ff',
    atmosphereIntensity: 1.1,
    cloudGain: 0.55,
    tilt: 0.41,
    spin: 0.012,
    segments: 160,
  });
  earth.group.position.copy(EARTH);
  earth.surface.rotation.y = 2.6;
  scene.add(earth.group);
  const moon = createPlanet({
    key: 'moon',
    radius: 1.65,
    map: 'moon',
    light: sunLight,
    atmosphere: '#000000',
    atmosphereIntensity: 0,
    tilt: 0.05,
    spin: 0.004,
    segments: 192,
    detail: 1,
  });
  moon.group.position.copy(EARTH).add(MOON_OFFSET);
  scene.add(moon.group);

  const stars = makeStars(initial.quality > 0.6 ? 1300 : 700);
  scene.add(stars.mesh);

  // Post: bloom carries the disk and atmospheres; aberration and grain scale
  // with how fast the camera is moving.
  let composer: EffectComposer;
  let bloom: BloomEffect;
  let ca: ChromaticAberrationEffect;
  let noise: NoiseEffect;
  let tone: ToneMappingEffect;
  const buildComposer = () => {
    composer?.dispose();
    composer = new EffectComposer(renderer, {
      frameBufferType: THREE.HalfFloatType,
      multisampling: tier.msaa,
    });
    composer.addPass(new RenderPass(scene, camera));
    bloom = new BloomEffect({
      mipmapBlur: true,
      intensity: 1.0,
      luminanceThreshold: 0.82,
      luminanceSmoothing: 0.35,
      radius: 0.78,
    });
    ca = new ChromaticAberrationEffect({
      offset: new THREE.Vector2(0.0004, 0.0004),
      radialModulation: true,
      modulationOffset: 0.25,
    });
    noise = new NoiseEffect({ premultiply: true, blendFunction: BlendFunction.SCREEN });
    noise.blendMode.opacity.value = 0.045;
    tone = new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC });
    const vignette = new VignetteEffect({ darkness: 0.62, offset: 0.28 });
    composer.addPass(new EffectPass(camera, bloom, tone));
    composer.addPass(new EffectPass(camera, ca, vignette, noise));
  };
  buildComposer();

  const fx = {
    speed: 0,
    velocity: new THREE.Vector3(),
    disk: 1,
    orbits: 0,
    sun: 0,
    exposure: 1,
    belt: 0,
    focus: '',
  };

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(tier.dpr);
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    bh.resize(w * tier.dpr, h * tier.dpr, tier.bhScale);
    stars.u.uRes.value.set(w * tier.dpr, h * tier.dpr);
  };
  resize();

  const tmp = new THREE.Vector3();
  const focusDir = new THREE.Vector3();
  const bodyPosition = (key: string, out: THREE.Vector3) => {
    if (key === 'earth') return out.copy(EARTH);
    if (key === 'moon') return out.copy(EARTH).add(MOON_OFFSET);
    const p = placed.find((x) => x.key === key);
    if (!p) return out.set(0, 0, 0);
    return out.copy(p.body.group.position);
  };

  let simTime = 0;
  return {
    renderer,
    camera,
    bh,
    placed,
    earth,
    moon,
    diskLight,
    sunLight,
    fx,
    compile() {
      renderer.compile(scene, camera);
    },
    setTier(t) {
      const rebuild = t.msaa !== tier.msaa;
      tier = t;
      bh.material.uniforms.uSteps!.value = t.steps;
      if (rebuild) buildComposer();
      resize();
    },
    resize,
    bodyPosition,
    frame(time, dt) {
      simTime = time;
      bh.material.uniforms.uSteps!.value = tier.steps;
      for (const p of placed) {
        const a = p.phase + simTime * p.speed;
        p.body.group.position.set(
          Math.cos(a) * p.orbit,
          Math.sin(a) * Math.sin(p.incline) * p.orbit,
          Math.sin(a) * p.orbit * Math.cos(p.incline),
        );
        p.body.update(time, dt, camera);
      }
      for (const o of orbits) {
        o.u.uPhase.value =
          (((o.p.phase + simTime * o.p.speed) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        o.u.uAlpha.value = 0.1 + fx.orbits * 0.9;
      }
      earth.update(time, dt, camera);
      moon.update(time, dt, camera);
      belt.rotation.y = time * 0.004;
      (belt.userData.grow as { value: number }).value = fx.belt;
      belt.visible = fx.belt > 0.01;

      // Nothing behind the hole may draw over its shadow or its lensed disk:
      // the hole is a background pass, so hide what it should be hiding.
      const camD = camera.position.length();
      const focus = fx.focus ? placed.find((p) => p.key === fx.focus) : undefined;
      let focusD = 0;
      let focusAng = 0;
      if (focus) {
        focusDir.copy(focus.body.group.position).sub(camera.position);
        focusD = focusDir.length();
        focusDir.divideScalar(focusD);
        focusAng = Math.asin(Math.min(1, (focus.body.radius * 2.4) / focusD));
      }
      for (const p of placed) {
        const g = p.body.group;
        tmp.copy(g.position).sub(camera.position);
        const pd = tmp.length();
        const cos = -tmp.dot(camera.position) / (pd * camD);
        const ang = Math.acos(Math.min(1, Math.max(-1, cos)));
        const zone = Math.atan((DISK_LENS + p.body.radius) / camD);
        let hidden = pd > camD && ang < zone;
        // Nothing else may wander across the world we are looking at.
        if (focus && p !== focus && pd > focusD * 0.6) {
          const a = Math.acos(Math.min(1, tmp.dot(focusDir) / pd));
          if (a < focusAng + Math.asin(Math.min(1, (p.body.radius * 1.5) / pd))) hidden = true;
        }
        g.visible = !hidden;
      }

      const u = bh.material.uniforms;
      u.uTime!.value = time;
      u.uDiskTime!.value = time;
      u.uDisk!.value = fx.disk;
      u.uSun!.value = fx.sun;
      u.uSunDir!.value.copy(SUN_DIR);

      stars.u.uCam.value.copy(camera.position);
      stars.u.uVel.value.copy(fx.velocity);
      tmp.copy(fx.velocity);

      const s = Math.min(fx.speed / 240, 1);
      ca.offset.set(0.0004 + s * 0.006, 0.0004 + s * 0.0045);
      bloom.intensity = 1.0 + s * 0.5;
      renderer.toneMappingExposure = fx.exposure;

      camera.updateMatrixWorld();
      bh.render(renderer, camera);
      composer.render(dt);
    },
    dispose() {
      composer.dispose();
      bh.dispose();
      renderer.dispose();
    },
  };
}
