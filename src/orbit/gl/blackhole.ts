/**
 * The sky: a Schwarzschild black hole at the origin, its accretion disk, and a
 * lensed panorama behind it, drawn as one full-screen pass at reduced
 * resolution and composited behind the rest of the scene.
 *
 * Units are Schwarzschild radii (r_s = 1). Photon paths are integrated with the
 * usual trick for a point mass: in flat coordinates a light ray around a
 * Schwarzschild mass obeys  a = -1.5 h^2 r / |r|^5,  where h = |r x v| is
 * conserved. That one line reproduces the shadow (radius ~2.6 r_s), the photon
 * ring at 1.5 r_s, and the lensed far side of the disk arching over the top.
 *
 * Rays that never come close are not marched at all: they take the weak-field
 * deflection 2 r_s / b analytically, which matches the integrator at the hand-
 * off radius, so the boundary does not show.
 */
import * as THREE from 'three';

export const DISK_IN = 2.6;
export const DISK_OUT = 12.0;

const vertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}`;

const fragment = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform mat4 uProjInv;
uniform mat4 uCamWorld;
uniform vec3 uCamPos;
uniform float uTime;
uniform float uDiskTime;
uniform sampler2D uSky;
uniform mat3 uSkyRot;
uniform float uSkyGain;
uniform float uStarGain;
uniform float uDisk;
uniform int uSteps;
uniform float uPixel;
uniform vec3 uSunDir;
uniform float uSun;

#define PI 3.14159265359
const float R_IN = ${DISK_IN.toFixed(2)};
const float R_OUT = ${DISK_OUT.toFixed(2)};
const float R_MARCH = 42.0;

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

vec3 starLayer(vec3 d, float scale, float density, float gain, float fp) {
  vec3 p = d * scale;
  vec3 c = floor(p);
  vec3 col = vec3(0.0);
  // Check the cell and its neighbours on the dominant axes so stars near a
  // cell wall are not clipped.
  for (int k = 0; k < 2; k++) {
    vec3 cell = c + (k == 0 ? vec3(0.0) : step(0.5, fract(p)) * 2.0 - 1.0);
    vec3 h = hash33(cell);
    if (h.x > density) continue;
    vec3 sp = cell + hash33(cell + 7.1);
    // Distance from the ray to the star on the unit sphere, in cell units.
    vec3 sd = normalize(sp);
    float ang = length(sd - d) * scale; // chord: acos loses precision near 1
    float px = fp * scale;
    float b = pow(h.y, 9.0) * 7.0 + 0.06;
    float tw = 0.75 + 0.25 * sin(uTime * (1.0 + h.z * 3.0) + h.y * 40.0);
    float g = exp(-ang * ang / (px * px * 1.1)) * b * tw;
    vec3 tint = mix(vec3(0.62, 0.75, 1.0), vec3(1.0, 0.82, 0.62), h.z);
    col += tint * g * gain;
  }
  return col;
}

vec3 sky(vec3 d, float fp) {
  vec3 sd = uSkyRot * d;
  vec2 uv = vec2(atan(sd.z, sd.x) / (2.0 * PI) + 0.5, asin(clamp(sd.y, -1.0, 1.0)) / PI + 0.5);
  vec3 col = texture2D(uSky, uv).rgb;
  col *= uSkyGain; // sRGB texture: the sampler already returns linear values
  col += starLayer(d, 110.0, 0.05, uStarGain, fp);
  col += starLayer(d, 280.0, 0.022, uStarGain * 0.7, fp);
  if (uSun > 0.0) {
    float s = max(dot(d, uSunDir), 0.0);
    col += vec3(1.0, 0.93, 0.82) * (pow(s, 4000.0) * 60.0 + pow(s, 90.0) * 0.5 + pow(s, 12.0) * 0.06) * uSun;
  }
  return col;
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
  float alpha = clamp((0.25 + dens) * edge * 1.1, 0.0, 0.97);
  return vec4(col * uDisk, alpha * edge);
}

void main() {
  vec2 ndc = vUv * 2.0 - 1.0;
  vec4 v = uProjInv * vec4(ndc, 1.0, 1.0);
  vec3 rd = normalize((uCamWorld * vec4(v.xyz / v.w, 0.0)).xyz);
  vec3 ro = uCamPos;

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
    float fpw = sqrt(max(length(dFdx(d)) * length(dFdy(d)), 1e-12));
    gl_FragColor = vec4(col + sky(d, clamp(fpw, uPixel * 0.3, uPixel * 2.0)) * trans, 1.0);
    return;
  }

  vec3 p = ro;
  if (dot(ro, ro) > R_MARCH * R_MARCH) p = ro + rd * (tca - sqrt(R_MARCH * R_MARCH - b * b));
  vec3 vel = rd;
  float glow = 0.0;
  bool escaped = false;
  for (int i = 0; i < 400; i++) {
    if (i >= uSteps) break;
    float r2 = dot(p, p);
    float r = sqrt(r2);
    if (r < 1.0) { trans = 0.0; break; }
    if (r > R_MARCH + 1.0 && dot(p, vel) > 0.0) { escaped = true; break; }
    float dt = clamp(0.07 * (r - 0.85) * r * 0.55, 0.018, 2.2);
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
  // Size stars by the lens map's own footprint, so a magnified star brightens
  // instead of smearing into a dash.
  float fp = sqrt(max(length(dFdx(outDir)) * length(dFdy(outDir)), 1e-12));
  fp = clamp(fp, uPixel * 0.3, uPixel * 2.0);
  if (escaped || trans > 0.0) {
    float r = length(p);
    if (r >= 1.0) col += trans * sky(outDir, fp);
  }
  col += vec3(1.0, 0.62, 0.3) * glow * 0.05 * uDisk;
  gl_FragColor = vec4(col, 1.0);
}`;

export interface BlackHole {
  target: THREE.WebGLRenderTarget;
  material: THREE.ShaderMaterial;
  render(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera): void;
  resize(w: number, h: number, scale: number): void;
  dispose(): void;
}

export function createBlackHole(sky: THREE.Texture): BlackHole {
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    depthTest: false,
    depthWrite: false,
    uniforms: {
      uProjInv: { value: new THREE.Matrix4() },
      uCamWorld: { value: new THREE.Matrix4() },
      uCamPos: { value: new THREE.Vector3() },
      uTime: { value: 0 },
      uDiskTime: { value: 0 },
      uSky: { value: sky },
      uSkyRot: {
        value: new THREE.Matrix3().setFromMatrix4(
          new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(1.05, 0.4, 0.55)),
        ),
      },
      uSkyGain: { value: 0.8 },
      uStarGain: { value: 0.9 },
      uDisk: { value: 1.0 },
      uSteps: { value: 220 },
      uPixel: { value: 0.001 },
      uSunDir: { value: new THREE.Vector3(1, 0, 0) },
      uSun: { value: 0 },
    },
  });
  const scene = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  scene.add(quad);
  const ortho = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const target = new THREE.WebGLRenderTarget(2, 2, {
    type: THREE.HalfFloatType,
    depthBuffer: false,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
  });

  return {
    target,
    material,
    render(renderer, camera) {
      const u = material.uniforms;
      u.uProjInv!.value.copy(camera.projectionMatrixInverse);
      u.uCamWorld!.value.copy(camera.matrixWorld);
      u.uCamPos!.value.copy(camera.position);
      u.uPixel!.value =
        (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)) / Math.max(1, target.height);
      renderer.setRenderTarget(target);
      renderer.render(scene, ortho);
      renderer.setRenderTarget(null);
    },
    resize(w, h, scale) {
      target.setSize(Math.max(2, Math.round(w * scale)), Math.max(2, Math.round(h * scale)));
    },
    dispose() {
      target.dispose();
      material.dispose();
      quad.geometry.dispose();
    },
  };
}
