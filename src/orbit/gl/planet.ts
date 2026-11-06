/**
 * Textured worlds: one surface shader for every mapped planet, a scattering
 * shell for the atmosphere, and an optional ring system.
 *
 * Planets in the system are lit by the accretion disk at the origin (a point
 * light); Earth and the Moon are lit by a distant sun (a direction). The same
 * uniforms carry both, switched by uLightMode.
 */
import * as THREE from 'three';
import { promote, texture, type TextureKey } from './textures';

export interface Light {
  mode: 0 | 1;
  pos: THREE.Vector3;
  dir: THREE.Vector3;
  color: THREE.Color;
}

export interface Body {
  key: string;
  radius: number;
  /** Positioned in world space by the system each frame. */
  group: THREE.Group;
  update(time: number, dt: number, camera: THREE.Camera): void;
}

export const lightUniforms = (light: Light) => ({
  uLightMode: { value: light.mode },
  uLightPos: { value: light.pos },
  uLightDir: { value: light.dir },
  uLightColor: { value: light.color },
});

const surfaceVertex = /* glsl */ `
varying vec3 vWorld;
varying vec3 vN;
varying vec2 vUv;
varying vec3 vObj;
void main() {
  vUv = uv;
  vObj = normalize(position);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vN = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const surfaceFragment = /* glsl */ `
precision highp float;
varying vec3 vWorld;
varying vec3 vN;
varying vec2 vUv;
varying vec3 vObj;
uniform sampler2D uMap;
uniform sampler2D uNight;
uniform sampler2D uClouds;
uniform sampler2D uWater;
uniform float uHasNight;
uniform float uHasClouds;
uniform float uWaterMode;
uniform float uLightMode;
uniform vec3 uLightPos;
uniform vec3 uLightDir;
uniform vec3 uLightColor;
uniform vec3 uAtmo;
uniform vec3 uGlow;
uniform float uGlowMode;
uniform float uGlowGain;
uniform float uCloudShift;
// Per-body offset, mirror and repeat of the shared cloud map, so two ocean
// worlds never wear the same weather.
uniform vec3 uCloudSeed;
uniform float uTime;
uniform float uExposure;
uniform float uCloudGain;
uniform float uDetail;
uniform float uLoaded;
uniform float uStyle;
uniform vec3 uStyleColor;
float dh(vec3 p) { p = fract(p * 0.3183 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float dn(vec3 x) { vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(dh(i), dh(i + vec3(1,0,0)), f.x), mix(dh(i + vec3(0,1,0)), dh(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(dh(i + vec3(0,0,1)), dh(i + vec3(1,0,1)), f.x), mix(dh(i + vec3(0,1,1)), dh(i + vec3(1,1,1)), f.x), f.y), f.z); }

vec3 toSrgb(vec3 c) { return pow(max(c, 0.0), vec3(1.0 / 2.2)); }

void main() {
  vec3 N = normalize(vN);
  vec3 L = uLightMode > 0.5 ? normalize(uLightDir) : normalize(uLightPos - vWorld);
  vec3 V = normalize(cameraPosition - vWorld);
  float ndl = dot(N, L);
  // Until the map arrives, a dim body in the world's own colour, not a black hole.
  vec3 c = mix(uAtmo * 0.12 + 0.02, texture2D(uMap, vUv).rgb, uLoaded);
  vec3 s = toSrgb(c);

  // Near the poles an equirect map pinches; ease toward a blurred tone there.
  float pole = smoothstep(0.86, 0.985, abs(vObj.y));
  c = mix(c, texture2D(uMap, vec2(vUv.x, vUv.y), 6.0).rgb, pole);

  if (uDetail > 0.0) {
    // Close up, the map runs out of pixels; regolith noise carries the surface.
    float g = dn(vObj * 160.0) * 0.5 + dn(vObj * 420.0) * 0.3 + dn(vObj * 1100.0) * 0.2;
    c *= mix(1.0, 0.7 + g * 0.6, uDetail);
  }
  float wrap = clamp((ndl + 0.12) / 1.12, 0.0, 1.0);
  float day = smoothstep(-0.1, 0.25, ndl);
  vec3 col = c * uLightColor * wrap;
  // A whisper of fill so a night side still has a silhouette, and a glowing
  // world's lava never floats free of its planet.
  col += c * (uGlowMode > 0.5 && uGlowMode < 1.5 ? 0.05 : 0.012);

  float water = 0.0;
  if (uWaterMode > 1.5) water = smoothstep(0.08, 0.22, s.b - max(s.r, s.g * 0.85));
  else if (uWaterMode > 0.5) water = texture2D(uWater, vUv).r;
  vec3 H = normalize(L + V);
  float nh = max(dot(N, H), 0.0);
  // A tight glint: a wide lobe read as a blown-out blob once bloom took it.
  col += uLightColor * (pow(nh, 280.0) * 1.1 + pow(nh, 48.0) * 0.025) * water * day;

  float cloud = 0.0;
  if (uHasClouds > 0.5) {
    vec2 cuv = vec2(vUv.x * uCloudSeed.z + uCloudSeed.x + uCloudShift, uCloudSeed.y > 0.5 ? 1.0 - vUv.y : vUv.y);
    cloud = texture2D(uClouds, cuv).r;
    float shadow = texture2D(uClouds, cuv + vec2(0.0025, 0.0012)).r;
    col *= 1.0 - shadow * 0.5 * day;
    col = mix(col, uLightColor * wrap * 0.92, cloud * uCloudGain);
  }

  float glow = 0.0;
  if (uGlowMode > 2.5) glow = smoothstep(0.18, 0.42, min(s.g, s.b) - s.r);
  else if (uGlowMode > 1.5) glow = smoothstep(0.72, 0.95, s.r) * smoothstep(0.3, 0.6, min(s.r, s.b) - s.g);
  else if (uGlowMode > 0.5) glow = smoothstep(0.8, 0.95, s.r) * smoothstep(0.32, 0.08, s.b) * smoothstep(0.25, 0.6, s.r - s.g);
  float night = 1.0 - smoothstep(-0.3, 0.12, ndl);
  float pulse = 0.85 + 0.15 * sin(uTime * 1.3 + vUv.x * 40.0);
  col += uGlow * glow * uGlowGain * (0.18 + night * 1.1) * pulse;

  if (uHasNight > 0.5) {
    vec3 lights = texture2D(uNight, vUv).rgb;
    col += lights * vec3(1.0, 0.72, 0.42) * night * 2.2 * (1.0 - cloud * 0.85);
  }

  vec3 sea = toSrgb(c);
  float wet = smoothstep(0.06, 0.2, sea.b - max(sea.r, sea.g * 0.9));
  if (uStyle > 3.5 && uStyle < 4.5) {
    // Restoration: colour lives only inside two slowly breathing caps; outside
    // them the world is grey moonlight, and the growing edge burns gold.
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    vec3 grey = lum * vec3(0.5, 0.58, 0.78) * 0.8;
    float best = -1.0;
    float ring = 0.0;
    for (int k = 0; k < 2; k++) {
      float fk = float(k);
      vec3 cc = normalize(vec3(cos(1.3 + fk * 3.4), 0.35 - fk * 0.7, sin(1.3 + fk * 3.4)));
      float r = 0.55 + 0.42 * sin(uTime * 0.11 + fk * 2.1);
      float ang = acos(clamp(dot(vObj, cc), -1.0, 1.0));
      float edge = ang - r;
      best = max(best, -edge);
      ring += exp(-pow(edge / 0.028, 2.0));
    }
    float lit = smoothstep(-0.02, 0.05, best);
    col = mix(grey, col * 1.08, lit);
    col += uStyleColor * min(ring, 1.0) * (0.7 + night * 1.4);
  } else if (uStyle > 4.5 && uStyle < 5.5) {
    // Seasons: a year every minute. Autumn warms the land; winter snows in
    // from the poles, never across the sea at the equator.
    float year = uTime * 0.105;
    float autumn = smoothstep(0.1, 0.9, sin(year)) ;
    float winter = smoothstep(0.2, 0.95, sin(year - 1.6));
    vec3 warm = col * vec3(1.25, 0.86, 0.5);
    col = mix(col, warm, autumn * 0.75 * (1.0 - wet));
    float lat = abs(vObj.y) + (dn(vObj * 9.0) - 0.5) * 0.18;
    float snow = smoothstep(0.92 - winter * 0.3, 0.98 - winter * 0.3, lat);
    col = mix(col, uLightColor * wrap * vec3(0.92, 0.96, 1.0), snow * mix(0.95, 0.55, wet));
  } else if (uStyle > 5.5) {
    // Lanterns: warm points scattered on the sea (6) or on land (7), bright on
    // the night side and faint by day.
    float K = uStyle > 6.5 ? 46.0 : 64.0;
    vec3 q = vObj * K;
    vec3 i = floor(q);
    vec3 f = fract(q);
    vec3 h = vec3(dh(i), dh(i + 17.1), dh(i + 41.7));
    float on = step(dh(i + 7.3), uStyle > 6.5 ? 0.16 : 0.22);
    float mask = uStyle > 6.5 ? 1.0 - wet : wet;
    float d = length(f - (0.2 + h * 0.6));
    float px = max(fwidth(q.x) + fwidth(q.y), 0.0001);
    float core = smoothstep(0.09 + px, 0.0, d);
    float flick = 0.75 + 0.25 * sin(uTime * (2.0 + h.x * 3.0) + h.y * 30.0);
    col += uStyleColor * core * on * mask * flick * (0.02 + night * 2.6);
  }

  float fres = pow(1.0 - max(dot(N, V), 0.0), 2.5);
  col += uAtmo * fres * smoothstep(-0.25, 0.5, ndl) * 0.32;
  gl_FragColor = vec4(col * uExposure, 1.0);
}`;

const shellVertex = /* glsl */ `
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const shellFragment = /* glsl */ `
precision highp float;
varying vec3 vWorld;
uniform vec3 uCenter;
uniform float uRadius;
uniform float uShell;
uniform float uLightMode;
uniform vec3 uLightPos;
uniform vec3 uLightDir;
uniform vec3 uLightColor;
uniform vec3 uAtmo;
uniform float uIntensity;
void main() {
  vec3 ro = cameraPosition - uCenter;
  vec3 rd = normalize(vWorld - cameraPosition);
  float tca = -dot(ro, rd);
  vec3 cp = ro + rd * tca;
  float h = length(cp);
  float Rs = uShell, Rp = uRadius;
  float tS = sqrt(max(Rs * Rs - h * h, 0.0));
  float tP = h < Rp ? sqrt(Rp * Rp - h * h) : 0.0;
  float path = h < Rp ? max(tS - tP, 0.0) : 2.0 * tS;
  float alt = max(h - Rp, 0.0) / (Rs - Rp);
  float dens = exp(-alt * 3.2) * path / (Rs - Rp);
  vec3 L = uLightMode > 0.5 ? normalize(uLightDir) : normalize(uLightPos - uCenter);
  vec3 sp = h < Rp ? ro + rd * (tca - tP) : cp;
  float mu = dot(normalize(sp), L);
  float lit = smoothstep(-0.32, 0.3, mu);
  float dusk = exp(-pow(mu * 3.2, 2.0));
  vec3 color = mix(uAtmo, vec3(1.0, 0.52, 0.26), dusk * 0.55);
  float fwd = pow(max(dot(rd, L), 0.0), 8.0);
  float face = h < Rp ? 0.35 : 1.0;
  float I = dens * (lit * 0.55 * face + fwd * 3.0 * smoothstep(-0.7, 0.15, mu)) * uIntensity;
  gl_FragColor = vec4(color * uLightColor * I, 1.0);
}`;

const ringVertex = /* glsl */ `
varying vec3 vLocal;
varying vec3 vWorld;
void main() {
  vLocal = position;
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

const ringFragment = /* glsl */ `
precision highp float;
varying vec3 vLocal;
varying vec3 vWorld;
uniform float uInner;
uniform float uOuter;
uniform vec3 uCenter;
uniform float uRadius;
uniform float uLightMode;
uniform vec3 uLightPos;
uniform vec3 uLightDir;
uniform vec3 uLightColor;
uniform vec3 uTint;
float h11(float x) { return fract(sin(x * 127.1) * 43758.5453); }
float n11(float x) { float i = floor(x); float f = fract(x); f = f * f * (3.0 - 2.0 * f); return mix(h11(i), h11(i + 1.0), f); }
void main() {
  float r = length(vLocal.xy);
  float t = (r - uInner) / (uOuter - uInner);
  // Each band set fades to its mean as it nears a pixel wide, so the fine
  // rings never shimmer at a distance.
  float fw = fwidth(t);
  float b1 = mix(n11(t * 38.0), 0.5, smoothstep(0.25, 0.8, fw * 38.0));
  float b2 = mix(n11(t * 113.0), 0.5, smoothstep(0.25, 0.8, fw * 113.0));
  float bands = b1 * 0.6 + b2 * 0.4;
  float gap = smoothstep(0.02, 0.06, abs(t - 0.62));
  float a = bands * gap * smoothstep(0.0, 0.06, t) * (1.0 - smoothstep(0.9, 1.0, t));
  vec3 L = uLightMode > 0.5 ? normalize(uLightDir) : normalize(uLightPos - vWorld);
  // Planet shadow on the rings.
  vec3 o = vWorld - uCenter;
  float tc = -dot(o, L);
  float d = length(o + L * tc);
  float shadow = tc > 0.0 ? smoothstep(uRadius * 0.92, uRadius * 1.04, d) : 1.0;
  vec3 col = uTint * (0.35 + 0.65 * bands) * uLightColor * shadow * 0.9;
  gl_FragColor = vec4(col * a, a * 0.85);
}`;

export interface PlanetOptions {
  key: string;
  radius: number;
  map: TextureKey;
  light: Light;
  atmosphere: string;
  atmosphereIntensity?: number;
  glow?: string;
  glowMode?: 0 | 1 | 2 | 3;
  glowGain?: number;
  waterMode?: 0 | 1 | 2;
  water?: TextureKey;
  clouds?: TextureKey;
  night?: TextureKey;
  rings?: { inner: number; outer: number; tint: string; tilt?: number };
  cloudGain?: number;
  detail?: number;
  tilt?: number;
  spin?: number;
  segments?: number;
  /** 4 restoration caps, 5 seasons, 6 lanterns on water, 7 lanterns on land. */
  style?: 0 | 4 | 5 | 6 | 7;
  styleColor?: string;
  /** Sample the map with hard texels (pixel-art worlds). */
  nearest?: boolean;
}

const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1);
blank.needsUpdate = true;

function cloudSeed(key: string) {
  if (key === 'earth') return new THREE.Vector3(0, 0, 1);
  let h = 2166136261;
  for (const ch of key) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  const u = (h >>> 0) / 4294967296;
  return new THREE.Vector3(u, u > 0.5 ? 1 : 0, 1 + (((h >>> 8) & 1) as number));
}

export function createPlanet(o: PlanetOptions): Body & { surface: THREE.Mesh } {
  const group = new THREE.Group();
  const axis = new THREE.Group();
  axis.rotation.z = o.tilt ?? 0;
  group.add(axis);
  const seg = o.segments ?? 128;
  const uniforms = {
    uMap: { value: texture(o.map, o.nearest ? { nearest: true } : {}) },
    uNight: { value: o.night ? texture(o.night) : blank },
    uClouds: { value: o.clouds ? texture(o.clouds, { color: false }) : blank },
    uWater: { value: o.water ? texture(o.water, { color: false }) : blank },
    uHasNight: { value: o.night ? 1 : 0 },
    uHasClouds: { value: o.clouds ? 1 : 0 },
    uWaterMode: { value: o.waterMode ?? 0 },
    uAtmo: { value: new THREE.Color(o.atmosphere) },
    uGlow: { value: new THREE.Color(o.glow ?? '#000000') },
    uGlowMode: { value: o.glowMode ?? 0 },
    uGlowGain: { value: o.glowGain ?? 2.5 },
    uCloudShift: { value: 0 },
    uCloudSeed: { value: cloudSeed(o.key) },
    uTime: { value: 0 },
    uExposure: { value: 1 },
    uCloudGain: { value: o.cloudGain ?? 0.75 },
    uDetail: { value: o.detail ?? 0 },
    uLoaded: { value: 0 },
    uStyle: { value: o.style ?? 0 },
    uStyleColor: { value: new THREE.Color(o.styleColor ?? '#ffb45a') },
    ...lightUniforms(o.light),
  };
  const surface = new THREE.Mesh(
    new THREE.SphereGeometry(o.radius, seg, seg / 2),
    new THREE.ShaderMaterial({
      vertexShader: surfaceVertex,
      fragmentShader: surfaceFragment,
      uniforms,
    }),
  );
  axis.add(surface);

  const shellR = o.radius * 1.075;
  const shellU = {
    uCenter: { value: new THREE.Vector3() },
    uRadius: { value: o.radius },
    uShell: { value: shellR },
    uAtmo: { value: new THREE.Color(o.atmosphere) },
    uIntensity: { value: o.atmosphereIntensity ?? 1 },
    ...lightUniforms(o.light),
  };
  const shell = new THREE.Mesh(
    new THREE.SphereGeometry(shellR, 96, 48),
    new THREE.ShaderMaterial({
      vertexShader: shellVertex,
      fragmentShader: shellFragment,
      uniforms: shellU,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  shell.renderOrder = 2;
  group.add(shell);

  let ringU: Record<string, THREE.IUniform> | null = null;
  if (o.rings) {
    const inner = o.radius * o.rings.inner;
    const outer = o.radius * o.rings.outer;
    ringU = {
      uInner: { value: inner },
      uOuter: { value: outer },
      uCenter: { value: new THREE.Vector3() },
      uRadius: { value: o.radius },
      uTint: { value: new THREE.Color(o.rings.tint) },
      ...lightUniforms(o.light),
    };
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(inner, outer, 256, 1),
      new THREE.ShaderMaterial({
        vertexShader: ringVertex,
        fragmentShader: ringFragment,
        uniforms: ringU,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.CustomBlending,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneMinusSrcAlphaFactor,
      }),
    );
    ring.rotation.x = -Math.PI / 2 + (o.rings.tilt ?? 0);
    ring.renderOrder = 3;
    axis.add(ring);
  }

  let loaded = false;
  void (uniforms.uMap.value as THREE.Texture & { ready?: Promise<void> }).ready?.then(() => {
    loaded = true;
  });
  const center = new THREE.Vector3();
  let near = false;
  return {
    key: o.key,
    radius: o.radius,
    group,
    surface,
    update(time, dt, camera) {
      surface.rotation.y += (o.spin ?? 0.05) * dt;
      uniforms.uTime.value = time;
      if (loaded && uniforms.uLoaded.value < 1)
        uniforms.uLoaded.value = Math.min(1, uniforms.uLoaded.value + Math.max(dt, 0.016) * 1.5);
      uniforms.uCloudShift.value = (time * 0.0016) % 1;
      group.getWorldPosition(center);
      // Full-size maps only once the camera is close enough to see texels.
      if (!near && camera.position.distanceTo(center) < o.radius * 8) {
        near = true;
        promote([o.map, o.night, o.clouds, o.water]);
      }
      shellU.uCenter.value.copy(center);
      if (ringU) ringU.uCenter!.value.copy(center);
    },
  };
}
