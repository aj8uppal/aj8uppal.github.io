/**
 * The sky: a Schwarzschild black hole at the origin, its accretion disk, and a
 * lensed panorama behind it.
 *
 * It is drawn in two passes. The ray march runs at reduced resolution and
 * writes two images: the light it picked up (disk and photon-sphere glow, plus
 * how much sky still shows through) and the bend, how far each ray's escape
 * direction is from where it started. The sky itself is drawn at full
 * resolution behind the rest of the scene: each pixel takes its own exact
 * camera ray, adds the interpolated bend and looks up the stars there. The lens
 * map is smooth almost everywhere, so a quarter-size march loses nothing a
 * visitor can see, and the stars stay one screen pixel wide on a 3x phone
 * instead of being magnified out of a small buffer.
 *
 * Units are Schwarzschild radii (r_s = 1). Photon paths are integrated with the
 * usual trick for a point mass: in flat coordinates a light ray around a
 * Schwarzschild mass obeys  a = -1.5 h^2 r / |r|^5,  where h = |r x v| is
 * conserved. That one line reproduces the shadow (radius ~2.6 r_s), the photon
 * ring at 1.5 r_s, and the lensed far side of the disk arching over the top.
 *
 * Rays that never come close are not marched at all: they take the weak-field
 * deflection 2 r_s / b analytically. Rays that are marched only bend inside
 * the march sphere, so each also takes, analytically, the share of 2 r_s / b
 * that a straight path would pick up outside it (half on the way in, half on
 * the way out). Without that share the sky jumped by ~2.7 degrees at the
 * hand-off radius. The disk starts at the innermost stable orbit, 3 r_s.
 */
import * as THREE from 'three';

export const DISK_IN = 3.0;
export const DISK_OUT = 12.0;

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const common = /* glsl */ `
#define PI 3.14159265359
float hash13(vec3 p3) {
  p3 = fract(p3 * 0.1031);
  p3 += dot(p3, p3.zyx + 31.32);
  return fract((p3.x + p3.y) * p3.z);
}
vec3 hash33(vec3 p3) {
  p3 = fract(p3 * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yxz + 33.33);
  return fract((p3.xxy + p3.yxx) * p3.zyx);
}
float noise3(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash13(i), hash13(i + vec3(1, 0, 0)), f.x),
                 mix(hash13(i + vec3(0, 1, 0)), hash13(i + vec3(1, 1, 0)), f.x), f.y),
             mix(mix(hash13(i + vec3(0, 0, 1)), hash13(i + vec3(1, 0, 1)), f.x),
                 mix(hash13(i + vec3(0, 1, 1)), hash13(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}
float fbm3(vec3 p) {
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 4; i++) { s += a * noise3(p); p = p * 2.03 + 11.7; a *= 0.5; }
  return s;
}
`;

/**
 * Stars sit on a cube-map grid: each face is an n x n grid of cells, and a cell
 * holds at most one star, kept a quarter-cell clear of its walls, so one cell
 * lookup draws it whole. Each layer fades out where its cells would be only a
 * few pixels wide, so a low-resolution screen gets fewer, cleaner stars rather
 * than a field of aliasing.
 */
const skyChunk = /* glsl */ `
uniform sampler2D uSky;
uniform mat3 uSkyRot;
uniform float uSkyGain;
uniform float uStarGain;
uniform float uTime;
uniform vec3 uSunDir;
uniform float uSun;
// Device pixels per star-size unit, so a star keeps one size in CSS pixels
// from a 1x monitor to a 3x phone instead of shrinking to a speck.
uniform float uStarPx;

vec3 starGrid(vec3 d, float n, float density, float gain, float fp, float sharp, float peak) {
  vec3 a = abs(d);
  vec2 uv;
  float face;
  float m;
  if (a.x >= a.y && a.x >= a.z) { uv = d.zy / a.x; face = d.x > 0.0 ? 1.0 : 2.0; m = a.x; }
  else if (a.y >= a.z) { uv = d.xz / a.y; face = d.y > 0.0 ? 3.0 : 4.0; m = a.y; }
  else { uv = d.xy / a.z; face = d.z > 0.0 ? 5.0 : 6.0; m = a.z; }
  vec2 g = (uv * 0.5 + 0.5) * n;
  vec2 cell = floor(g);
  vec3 key = vec3(cell, face * 1013.0 + n);
  vec3 h = hash33(key);
  // A pixel's footprint in cells: a face unit spans between m and m^2 radians.
  float pxc = fp * n * 0.5 / (m * sqrt(m)) * uStarPx;
  float fade = smoothstep(0.42, 0.16, pxc);
  if (h.x > density || fade <= 0.0) return vec3(0.0);
  vec2 sp = cell + 0.25 + hash33(key + 7.1).xy * 0.5;
  vec2 dc = g - sp;
  vec2 o = dc / max(pxc, 1e-5);
  // Fade out before the cell wall, so a big star is never cut square.
  float win = smoothstep(0.25, 0.14, max(abs(dc.x), abs(dc.y)));
  float b = pow(h.y, sharp) * peak + 0.14;
  float tw = 0.75 + 0.25 * sin(uTime * (1.0 + h.z * 3.0) + h.y * 40.0);
  vec3 tint = mix(vec3(0.62, 0.75, 1.0), vec3(1.0, 0.82, 0.62), h.z);
  return tint * exp(-dot(o, o) / 1.1) * b * tw * gain * fade * win;
}

vec3 skyBand(vec3 d) {
  vec3 sd = uSkyRot * d;
  vec2 uv = vec2(atan(sd.z, sd.x) / (2.0 * PI) + 0.5, asin(clamp(sd.y, -1.0, 1.0)) / PI + 0.5);
  return texture2D(uSky, uv).rgb;
}

vec3 sky(vec3 d, float fp) {
  vec3 band = skyBand(d);
  vec3 col = band * uSkyGain; // sRGB texture: the sampler already returns linear values
  col += starGrid(d, 220.0, 0.06, uStarGain, fp, 6.0, 7.0);
  col += starGrid(d, 560.0, 0.05, uStarGain * 0.8, fp, 7.0, 4.0);
  // The Milky Way is made of stars: a fine, faint grain where the band is
  // bright, which only resolves on a sharp screen.
  float lum = dot(band, vec3(0.3, 0.55, 0.15));
  float dense = smoothstep(0.015, 0.16, lum);
  col += starGrid(d, 1100.0, 0.08 + dense * 0.5, uStarGain * (0.25 + dense * 0.35), fp, 14.0, 1.2);
  if (uSun > 0.0) {
    float s = max(dot(d, uSunDir), 0.0);
    col += vec3(1.0, 0.93, 0.82) * (pow(s, 4000.0) * 60.0 + pow(s, 90.0) * 0.5 + pow(s, 12.0) * 0.06) * uSun;
  }
  return col;
}
`;

const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
layout(location = 0) out vec4 oLight;
layout(location = 1) out vec4 oBend;
uniform mat4 uProjInv;
uniform mat4 uCamWorld;
uniform vec3 uCamPos;
uniform float uDiskTime;
uniform float uDisk;
uniform int uSteps;
uniform vec2 uTexel;

const float R_IN = ${DISK_IN.toFixed(2)};
const float R_OUT = ${DISK_OUT.toFixed(2)};
const float R_MARCH = 42.0;
${common}
uniform sampler2D uSky;
uniform mat3 uSkyRot;
uniform float uSkyGain;
vec3 skyBand(vec3 d) {
  vec3 sd = uSkyRot * d;
  vec2 uv = vec2(atan(sd.z, sd.x) / (2.0 * PI) + 0.5, asin(clamp(sd.y, -1.0, 1.0)) / PI + 0.5);
  return texture2D(uSky, uv).rgb * uSkyGain;
}

vec3 blackbody(float t) {
  // A hand-fitted ramp: deep red, amber, warm white, a touch of blue at the top.
  t = clamp(t, 0.0, 1.7);
  vec3 c = mix(vec3(0.5, 0.05, 0.01), vec3(1.0, 0.36, 0.06), smoothstep(0.0, 0.45, t));
  c = mix(c, vec3(1.0, 0.72, 0.36), smoothstep(0.4, 0.95, t));
  c = mix(c, vec3(1.0, 0.95, 0.88), smoothstep(0.95, 1.35, t));
  c = mix(c, vec3(0.8, 0.9, 1.0), smoothstep(1.35, 1.7, t));
  return c;
}

vec4 disk(vec3 p, vec3 dir) {
  float r = length(p.xz);
  if (r < R_IN || r > R_OUT) return vec4(0.0);
  float phi = atan(p.z, p.x);
  // Keplerian shear: inner material laps the outer.
  // Shear winds any pattern into hairlines over time, so two layers with
  // staggered clocks cross-fade and each resets while it is invisible.
  float omega = 2.2 * pow(r, -1.5);
  const float T = 14.0;
  float t1 = mod(uDiskTime, T);
  float t2 = mod(uDiskTime + T * 0.5, T);
  float w = abs(t1 / T * 2.0 - 1.0);
  float a1 = phi - t1 * omega;
  float a2 = phi - t2 * omega;
  vec2 q1 = vec2(cos(a1), sin(a1));
  vec2 q2 = vec2(cos(a2), sin(a2));
  float n = mix(fbm3(vec3(q1 * 1.6, r * 0.75)), fbm3(vec3(q2 * 1.6, r * 0.75) + 19.0), w);
  float streak = mix(fbm3(vec3(q1 * 3.2, r * 5.5) + 3.0), fbm3(vec3(q2 * 3.2, r * 5.5) + 41.0), w);
  float dens = smoothstep(0.18, 0.95, n * 0.75 + streak * 0.7);
  float edge = smoothstep(R_IN, R_IN + 0.45, r) * (1.0 - smoothstep(R_OUT * 0.55, R_OUT, r));
  // Novikov-Thorne-ish emissivity, peaking just outside the inner edge.
  float x = R_IN / r;
  float flux = pow(x, 2.4) * (1.0 - sqrt(x) * 0.82);
  // Relativistic beaming: material orbits counter-clockwise about +y.
  vec3 vel = normalize(vec3(-p.z, 0.0, p.x));
  float beta = sqrt(0.5 / r);
  float cosT = dot(vel, -dir);
  float gamma = 1.0 / sqrt(1.0 - beta * beta);
  float dop = 1.0 / (gamma * (1.0 - beta * cosT));
  float grav = sqrt(max(1.0 - 1.0 / r, 0.0));
  float shift = dop * grav;
  float temp = (0.35 + 0.9 * x) * shift;
  vec3 col = blackbody(temp) * flux * pow(shift, 3.2) * 8.0 * (0.3 + dens * 0.9);
  // Opaque where it is dense, so the shadow does not show through the near side.
  float alpha = clamp((0.6 + dens) * 1.1, 0.0, 1.0) * edge;
  return vec4(col * uDisk, alpha);
}

vec3 ray(vec2 ndc) {
  vec4 v = uProjInv * vec4(ndc, 1.0, 1.0);
  return normalize((uCamWorld * vec4(v.xyz / v.w, 0.0)).xyz);
}

// One photon path: the light it picks up (rgb), how much sky shows through
// (a), and the bend from rd to where it leaves for the sky.
vec4 trace(vec3 ro, vec3 rd, int steps, out vec3 bend, out bool lost) {
  lost = false;
  vec3 col = vec3(0.0);
  float trans = 1.0;

  vec3 L = cross(ro, rd);
  float h2 = dot(L, L);
  float b = sqrt(h2);
  float tca = -dot(ro, rd);
  bool enters = b < R_MARCH && (dot(ro, ro) < R_MARCH * R_MARCH || tca > 0.0);

  if (!enters) {
    // Weak field: bend toward the hole by 2/b and look up the sky.
    vec3 toward = normalize(-(ro + rd * tca));
    float defl = tca > 0.0 ? 2.0 / max(b, 1.0) : 0.0;
    vec3 d = normalize(rd + toward * defl);
    // The disk seen from far away is small but bright: intersect it straight.
    if (ro.y * rd.y < 0.0) {
      float t = -ro.y / rd.y;
      vec3 hit = ro + rd * t;
      vec4 dc = disk(hit, rd);
      col += dc.rgb * dc.a;
      trans *= 1.0 - dc.a;
    }
    bend = d - rd;
    return vec4(col, trans);
  }

  // The bending a straight path at impact b gets outside the march sphere:
  // 2/b in total, less the chord inside, T(2R^2 + b^2) / (b R^3).
  float bs = max(b, 1e-3);
  float T = sqrt(max(R_MARCH * R_MARCH - h2, 0.0));
  float halfOut = 0.5 * max(2.0 / bs - T * (2.0 * R_MARCH * R_MARCH + h2) / (bs * R_MARCH * R_MARCH * R_MARCH), 0.0);
  vec3 p = ro;
  vec3 vel = rd;
  if (dot(ro, ro) > R_MARCH * R_MARCH) {
    p = ro + rd * (tca - sqrt(R_MARCH * R_MARCH - b * b));
    vel = normalize(rd + normalize(-(ro + rd * tca)) * halfOut);
  }
  float glow = 0.0;
  bool escaped = false;
  for (int i = 0; i < 400; i++) {
    if (i >= steps) break;
    float r2 = dot(p, p);
    float r = sqrt(r2);
    if (r < 1.0) { trans = 0.0; break; }
    if (r > R_MARCH + 1.0 && dot(p, vel) > 0.0) { escaped = true; break; }
    float dt = clamp(0.07 * (r - 0.85) * r * 0.55, 0.018, 3.6);
    vec3 acc = -1.5 * h2 * p / (r2 * r2 * r);
    vec3 prev = p;
    vel += acc * dt;
    p += vel * dt;
    glow += exp(-abs(r - 1.5) * 9.0) * dt;
    if (prev.y * p.y < 0.0) {
      float t = prev.y / (prev.y - p.y);
      vec3 hit = mix(prev, p, t);
      vec4 dc = disk(hit, normalize(vel));
      col += trans * dc.rgb * dc.a;
      trans *= 1.0 - dc.a;
      if (trans < 0.01) break;
    }
  }
  vec3 outDir = normalize(vel);
  if (escaped) {
    // The other half, on the way back out to the sky.
    vec3 perp = p - outDir * dot(p, outDir);
    if (dot(perp, perp) > 1e-6) outDir = normalize(outDir - normalize(perp) * halfOut);
  }
  // Still circling when the step budget ran out: no reliable direction.
  lost = !escaped && trans >= 0.01 && length(p) >= 1.0;
  float skyT = (escaped || trans > 0.0) && length(p) >= 1.0 ? trans : 0.0;
  // The photon-sphere glow belongs to light that got away; the shadow stays black.
  if (escaped) col += vec3(1.0, 0.62, 0.3) * glow * 0.05 * uDisk;
  // The shadow has no sky behind it; a zero bend keeps its edge texels tame.
  bend = skyT > 0.0 ? outDir - rd : vec3(0.0);
  return vec4(col, skyT);
}

void main() {
  vec2 ndc = vUv * 2.0 - 1.0;
  vec3 ro = uCamPos;
  vec3 rd = ray(ndc);
  vec3 bend;
  bool lost;
  vec4 light = trace(ro, rd, uSteps, bend, lost);
  // At the shadow's rim the whole sky is squeezed into a few pixels: next-door
  // rays leave for opposite sides of it, so a bend interpolated between them
  // draws a sawtooth. Rays near the critical b = 3*sqrt(3)/2 ~ 2.6 r_s look up
  // the sky here instead (its glow: no star survives being squeezed this
  // hard), from five samples spread across the pixel along the one direction
  // b changes, and hand the composite nothing to add.
  float b = length(cross(ro, rd));
  if (b > 2.2 && b < 3.4) {
    float pa = length(ray(ndc + vec2(uTexel.x, 0.0)) - rd);
    // One march pixel in impact parameter. The chaos is a few pixels wide:
    // two inside the rim, five outside, where the sky still wraps round.
    float db = length(ro) * pa;
    float x = (b - 2.598) / db;
    if (lost || (x > -2.5 && x < 5.0)) {
      vec3 e = ro - rd * dot(ro, rd);
      e = e / max(length(e), 1e-6);
      vec3 sum = light.rgb + light.a * skyBand(normalize(rd + bend));
      vec3 tb;
      bool tl;
      for (int k = 0; k < 4; k++) {
        vec3 r = normalize(rd + e * ((float(k) - 1.5) / 3.0 * 1.3 * pa));
        // The full budget: the ring's glow is light that got away, and a
        // sample cut short would dim it.
        vec4 l = trace(ro, r, uSteps, tb, tl);
        sum += l.rgb + l.a * skyBand(normalize(r + tb));
      }
      light = vec4(sum / 5.0, 0.0);
    }
  }
  oLight = light;
  oBend = vec4(bend, 0.0);
}`;

/**
 * The full-resolution sky, drawn behind the scene: this pixel's own camera ray,
 * bent by the interpolated lens map, then stars and the band looked up there.
 * Stars are sized by the lens map's own footprint, so a magnified star grows
 * instead of smearing into a dash.
 */
const composite = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform sampler2D uLight;
uniform sampler2D uBend;
uniform mat4 uProjInv;
uniform mat4 uCamWorld;
uniform float uPixel;
${common}
${skyChunk}
void main() {
  vec2 ndc = vUv * 2.0 - 1.0;
  vec4 v = uProjInv * vec4(ndc, 1.0, 1.0);
  vec3 rd = normalize((uCamWorld * vec4(v.xyz / v.w, 0.0)).xyz);
  vec4 light = texture2D(uLight, vUv);
  vec3 d = normalize(rd + texture2D(uBend, vUv).xyz);
  float fp = sqrt(max(length(dFdx(d)) * length(dFdy(d)), 1e-14));
  fp = clamp(fp, uPixel * 0.6, uPixel * 3.0);
  vec3 col = light.rgb;
  if (light.a > 0.002) col += light.a * sky(d, fp);
  gl_FragColor = vec4(col, 1.0);
}`;

export interface BlackHole {
  target: THREE.WebGLRenderTarget;
  material: THREE.ShaderMaterial;
  /** The full-resolution sky, to draw first in the main scene. */
  back: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  render(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, height: number): void;
  resize(w: number, h: number, scale: number): void;
  dispose(): void;
}

export function createBlackHole(sky: THREE.Texture): BlackHole {
  const proj = { value: new THREE.Matrix4() };
  const world = { value: new THREE.Matrix4() };
  const time = { value: 0 };
  const skyUniforms = {
    uTime: time,
    uSky: { value: sky },
    uSkyRot: {
      value: new THREE.Matrix3().setFromMatrix4(
        new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(1.05, 0.4, 0.55)),
      ),
    },
    uSkyGain: { value: 0.8 },
    uStarGain: { value: 0.9 },
    uStarPx: { value: 1 },
  };
  const material = new THREE.ShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader: vertex,
    fragmentShader: fragment,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uProjInv: proj,
      uCamWorld: world,
      uCamPos: { value: new THREE.Vector3() },
      uDiskTime: { value: 0 },
      uDisk: { value: 1.0 },
      uSteps: { value: 220 },
      uTexel: { value: new THREE.Vector2(1, 1) },
      uSunDir: { value: new THREE.Vector3(1, 0, 0) },
      uSun: { value: 0 },
      ...skyUniforms,
    },
  });
  const scene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  scene.add(quad);
  const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  // Light (rgb) with sky transmittance (a), and the bend (xyz). Half floats
  // hold a bend of a few hundredths to 1e-5 rad, far under a pixel.
  const target = new THREE.WebGLRenderTarget(2, 2, {
    count: 2,
    type: THREE.HalfFloatType,
    depthBuffer: false,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  });

  const back = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    new THREE.ShaderMaterial({
      vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.99999, 1.0); }`,
      fragmentShader: composite,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uLight: { value: target.textures[0] },
        uBend: { value: target.textures[1] },
        uProjInv: proj,
        uCamWorld: world,
        uPixel: { value: 0.001 },
        ...skyUniforms,
        uSunDir: material.uniforms.uSunDir!,
        uSun: material.uniforms.uSun!,
      },
    }),
  );
  back.frustumCulled = false;
  back.renderOrder = -1000;

  return {
    target,
    material,
    back,
    render(renderer, camera, height) {
      const u = material.uniforms;
      proj.value.copy(camera.projectionMatrixInverse);
      world.value.copy(camera.matrixWorld);
      u.uCamPos!.value.copy(camera.position);
      back.material.uniforms.uPixel!.value =
        (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)) / Math.max(1, height);
      renderer.setRenderTarget(target);
      renderer.render(scene, ortho);
      renderer.setRenderTarget(null);
    },
    resize(w, h, scale) {
      target.setSize(Math.max(2, Math.round(w * scale)), Math.max(2, Math.round(h * scale)));
      material.uniforms.uTexel!.value.set(2 / target.width, 2 / target.height);
    },
    dispose() {
      target.dispose();
      material.dispose();
      quad.geometry.dispose();
      back.material.dispose();
      back.geometry.dispose();
    },
  };
}
