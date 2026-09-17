/**
 * Post-processing chain.
 *
 *   scene (RGBA16F, additive)
 *     -> prefilter (soft-knee threshold, half res)
 *     -> downsample mip chain  (Call of Duty 13-tap partial Karis average)
 *     -> upsample with 3x3 tent, accumulating additively
 *     -> optional anamorphic horizontal streak
 *     -> composite: chromatic aberration, ACES tonemap, vignette,
 *        scanlines/barrel CRT, grain, flash & fade
 *
 * The bloom is what sells the "vector emitter" look: the renderer writes
 * values well above 1.0 and the tonemapper rolls them into white-hot cores.
 */

import { Program, RenderTarget, ScreenQuad, SCREEN_VS } from './gl.js';

const PREFILTER_FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform vec4 uCurve;   // threshold, threshold-knee, 2*knee, 0.25/knee
uniform float uClamp;
out vec4 outColor;

vec3 sampleBox(vec2 uv) {
  vec4 o = uTexel.xyxy * vec4(-1.0, -1.0, 1.0, 1.0);
  vec3 s = texture(uTex, uv + o.xy).rgb + texture(uTex, uv + o.zy).rgb
         + texture(uTex, uv + o.xw).rgb + texture(uTex, uv + o.zw).rgb;
  return s * 0.25;
}

void main() {
  vec3 c = sampleBox(vUv);
  c = min(c, vec3(uClamp));
  float br = max(c.r, max(c.g, c.b));
  // Soft knee so the bloom ramps in smoothly instead of popping.
  float rq = clamp(br - uCurve.x, 0.0, uCurve.z);
  rq = (rq * rq) * uCurve.w;
  float contrib = max(rq, br - uCurve.y) / max(br, 1e-5);
  outColor = vec4(c * contrib, 1.0);
}`;

const DOWN_FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexel;
out vec4 outColor;

void main() {
  vec2 t = uTexel;
  vec3 a = texture(uTex, vUv + vec2(-2.0 * t.x,  2.0 * t.y)).rgb;
  vec3 b = texture(uTex, vUv + vec2( 0.0,        2.0 * t.y)).rgb;
  vec3 c = texture(uTex, vUv + vec2( 2.0 * t.x,  2.0 * t.y)).rgb;
  vec3 d = texture(uTex, vUv + vec2(-2.0 * t.x,  0.0)).rgb;
  vec3 e = texture(uTex, vUv).rgb;
  vec3 f = texture(uTex, vUv + vec2( 2.0 * t.x,  0.0)).rgb;
  vec3 g = texture(uTex, vUv + vec2(-2.0 * t.x, -2.0 * t.y)).rgb;
  vec3 h = texture(uTex, vUv + vec2( 0.0,       -2.0 * t.y)).rgb;
  vec3 i = texture(uTex, vUv + vec2( 2.0 * t.x, -2.0 * t.y)).rgb;
  vec3 j = texture(uTex, vUv + vec2(-t.x,  t.y)).rgb;
  vec3 k = texture(uTex, vUv + vec2( t.x,  t.y)).rgb;
  vec3 l = texture(uTex, vUv + vec2(-t.x, -t.y)).rgb;
  vec3 m = texture(uTex, vUv + vec2( t.x, -t.y)).rgb;

  vec3 res = e * 0.125;
  res += (a + c + g + i) * 0.03125;
  res += (b + d + f + h) * 0.0625;
  res += (j + k + l + m) * 0.125;
  outColor = vec4(res, 1.0);
}`;

const UP_FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform float uRadius;
uniform float uStrength;   // per-level weight; < 1 tightens the bloom
out vec4 outColor;

void main() {
  vec2 t = uTexel * uRadius;
  vec3 a = texture(uTex, vUv + vec2(-t.x,  t.y)).rgb;
  vec3 b = texture(uTex, vUv + vec2( 0.0,  t.y)).rgb;
  vec3 c = texture(uTex, vUv + vec2( t.x,  t.y)).rgb;
  vec3 d = texture(uTex, vUv + vec2(-t.x,  0.0)).rgb;
  vec3 e = texture(uTex, vUv).rgb;
  vec3 f = texture(uTex, vUv + vec2( t.x,  0.0)).rgb;
  vec3 g = texture(uTex, vUv + vec2(-t.x, -t.y)).rgb;
  vec3 h = texture(uTex, vUv + vec2( 0.0, -t.y)).rgb;
  vec3 i = texture(uTex, vUv + vec2( t.x, -t.y)).rgb;

  vec3 res = e * 0.25;
  res += (b + d + f + h) * 0.125;
  res += (a + c + g + i) * 0.0625;
  outColor = vec4(res * uStrength, 1.0);
}`;

const STREAK_FS = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uTexel;
uniform vec2 uDir;
uniform float uSpread;
out vec4 outColor;

void main() {
  vec3 sum = vec3(0.0);
  float wsum = 0.0;
  for (int i = -8; i <= 8; i++) {
    float fi = float(i);
    float w = exp(-fi * fi / 26.0);
    sum += texture(uTex, vUv + uDir * uTexel * fi * uSpread).rgb * w;
    wsum += w;
  }
  outColor = vec4(sum / wsum, 1.0);
}`;

const COMPOSITE_FS = `#version 300 es
precision highp float;
in vec2 vUv;

uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform sampler2D uStreak;
uniform vec2 uResolution;
uniform float uBloomAmount;
uniform float uStreakAmount;
uniform float uExposure;
uniform float uChroma;
uniform float uVignette;
uniform float uGrain;
uniform float uScanline;
uniform float uBarrel;
uniform float uTime;
uniform float uFlash;
uniform vec3 uFlashColor;
uniform float uFade;
uniform float uSaturation;
uniform float uHueRetention;
uniform float uShockAmp;      // radial ripple from bombs / deaths
uniform vec3 uShock;          // x, y (uv space), radius

out vec4 outColor;

// ACES filmic approximation (Narkowicz).
vec3 aces(vec3 x) {
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}
float aces1(float x) {
  const float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

/**
 * Per-channel ACES desaturates highlights toward white, which is right for
 * film and wrong for a neon vector game: a bright saturated blue enemy turns
 * into a white blob. Tonemapping the peak channel and rescaling the original
 * ratio preserves hue exactly; blending the two keeps hot cores blowing out
 * to white while the bodies stay coloured.
 */
vec3 tonemap(vec3 c, float hueMix) {
  float peak = max(c.r, max(c.g, c.b));
  vec3 ratio = c / max(peak, 1e-5);
  vec3 hueSafe = ratio * aces1(peak);
  return mix(aces(c), hueSafe, hueMix);
}

float hash(vec2 p) {
  p = fract(p * vec2(443.897, 441.423));
  p += dot(p, p.yx + 19.19);
  return fract((p.x + p.y) * p.x);
}

vec2 barrel(vec2 uv, float k) {
  vec2 c = uv - 0.5;
  float r2 = dot(c, c);
  return 0.5 + c * (1.0 + k * r2);
}

vec3 sanitize(vec3 c) {
  // Defence in depth against a runaway emitter overflowing the half-float
  // target. NaN fails every comparison, so greaterThanEqual identifies it
  // without isnan(); the bvec form of mix() selects rather than interpolates,
  // which matters because arithmetic on NaN would just propagate it.
  bvec3 finite = greaterThanEqual(c, vec3(0.0));
  return min(mix(vec3(0.0), c, finite), vec3(64.0));
}

void main() {
  vec2 uv = vUv;

  // CRT curvature.
  if (uBarrel > 0.0001) uv = barrel(uv, uBarrel);

  // Expanding shock ring warps the image outward briefly.
  if (uShockAmp > 0.0001) {
    vec2 d = uv - uShock.xy;
    d.x *= uResolution.x / uResolution.y;
    float dist = length(d);
    float ring = exp(-pow((dist - uShock.z) * 14.0, 2.0));
    uv += normalize(d + 1e-6) * ring * uShockAmp;
  }

  vec2 cc = uv - 0.5;
  float r2 = dot(cc, cc);

  // Chromatic aberration grows toward the edges of the frame.
  float ca = uChroma * (0.35 + r2 * 2.2);
  vec2 off = cc * ca;

  vec3 scene;
  scene.r = texture(uScene, uv + off).r;
  scene.g = texture(uScene, uv).g;
  scene.b = texture(uScene, uv - off).b;

  vec3 bloom;
  bloom.r = texture(uBloom, uv + off * 1.15).r;
  bloom.g = texture(uBloom, uv).g;
  bloom.b = texture(uBloom, uv - off * 1.15).b;

  vec3 col = sanitize(scene) + sanitize(bloom) * uBloomAmount;

  if (uStreakAmount > 0.0001) {
    vec3 st = texture(uStreak, uv).rgb;
    col += st * uStreakAmount * vec3(0.62, 0.82, 1.35);
  }

  col *= uExposure;
  col = tonemap(col, uHueRetention);

  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = mix(vec3(l), col, uSaturation);

  // Flash (bomb / death) before vignette so it also lights the corners.
  col += uFlashColor * uFlash;

  if (uScanline > 0.0001) {
    float sl = 0.5 + 0.5 * sin(uv.y * uResolution.y * 3.14159);
    col *= 1.0 - uScanline * (1.0 - sl) * 0.85;
    // Faint aperture-grille tint.
    float m = mod(gl_FragCoord.x, 3.0);
    vec3 mask = m < 1.0 ? vec3(1.06, 0.97, 0.97) : (m < 2.0 ? vec3(0.97, 1.06, 0.97) : vec3(0.97, 0.97, 1.06));
    col *= mix(vec3(1.0), mask, uScanline);
  }

  float vig = 1.0 - uVignette * smoothstep(0.18, 0.78, r2);
  col *= vig;

  if (uGrain > 0.0001) {
    float n = hash(gl_FragCoord.xy + fract(uTime) * 137.0);
    col += (n - 0.5) * uGrain;
  }

  col *= uFade;

  // Black outside the curved screen edge.
  if (uBarrel > 0.0001) {
    vec2 e = step(vec2(0.0), uv) * step(uv, vec2(1.0));
    col *= e.x * e.y;
  }

  // Linear -> sRGB.
  col = pow(max(col, vec3(0.0)), vec3(1.0 / 2.2));
  outColor = vec4(col, 1.0);
}`;

export class PostFX {
  constructor(gl) {
    this.gl = gl;
    this.quad = new ScreenQuad(gl);
    this.pPrefilter = new Program(gl, SCREEN_VS, PREFILTER_FS, 'prefilter');
    this.pDown = new Program(gl, SCREEN_VS, DOWN_FS, 'down');
    this.pUp = new Program(gl, SCREEN_VS, UP_FS, 'up');
    this.pStreak = new Program(gl, SCREEN_VS, STREAK_FS, 'streak');
    this.pComposite = new Program(gl, SCREEN_VS, COMPOSITE_FS, 'composite');

    this.scene = new RenderTarget(gl, 2, 2, { float: true, linear: true });
    this.mips = [];
    this.streakA = new RenderTarget(gl, 2, 2, { float: true, linear: true });
    this.streakB = new RenderTarget(gl, 2, 2, { float: true, linear: true });
    this.width = 2;
    this.height = 2;
    this.mipCount = 6;

    // Tunables driven by the settings menu.
    this.threshold = 0.88;
    this.knee = 0.55;
    this.bloomAmount = 0.82;
    this.bloomRadius = 1.0;
    this.levelWeight = 0.68;
    this.streakAmount = 0.12;
    this.exposure = 1.22;
    this.chroma = 0.0016;
    this.vignette = 0.46;
    this.grain = 0.022;
    this.scanline = 0.0;
    this.barrel = 0.0;
    this.saturation = 1.06;
    this.hueRetention = 0.55;
    this.flash = 0;
    this.flashColor = [1, 1, 1];
    this.fade = 1;
    this.shock = [0.5, 0.5, 0];
    this.shockAmp = 0;
    this.clampValue = 9.0;
  }

  resize(w, h, mipCount = 6) {
    w = Math.max(2, w | 0);
    h = Math.max(2, h | 0);
    this.mipCount = Math.max(2, Math.min(8, mipCount));
    if (w === this.width && h === this.height && this.mips.length === this.mipCount) return;
    this.width = w;
    this.height = h;
    this.scene.resize(w, h);

    const gl = this.gl;
    for (const m of this.mips) m.dispose();
    this.mips = [];
    let mw = w, mh = h;
    for (let i = 0; i < this.mipCount; i++) {
      mw = Math.max(1, mw >> 1);
      mh = Math.max(1, mh >> 1);
      this.mips.push(new RenderTarget(gl, mw, mh, { float: true, linear: true }));
      if (mw <= 2 || mh <= 2) break;
    }
    this.streakA.resize(Math.max(1, w >> 2), Math.max(1, h >> 2));
    this.streakB.resize(Math.max(1, w >> 2), Math.max(1, h >> 2));
  }

  beginScene() {
    const gl = this.gl;
    this.scene.bind(true);
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  /** Run bloom + composite, writing to the default framebuffer. */
  render(targetW, targetH) {
    const gl = this.gl;
    gl.disable(gl.BLEND);

    const mips = this.mips;
    // --- Prefilter into mip 0.
    const thr = this.threshold;
    const knee = Math.max(this.knee, 1e-4);
    mips[0].bind(false);
    this.pPrefilter.use();
    this.pPrefilter.setTex('uTex', this.scene.tex, 0);
    this.pPrefilter.set2f('uTexel', 1 / this.scene.width, 1 / this.scene.height);
    this.pPrefilter.set4f('uCurve', thr, thr - knee, 2 * knee, 0.25 / knee);
    this.pPrefilter.set1f('uClamp', this.clampValue);
    this.quad.draw();

    // --- Downsample chain.
    this.pDown.use();
    for (let i = 1; i < mips.length; i++) {
      mips[i].bind(false);
      this.pDown.setTex('uTex', mips[i - 1].tex, 0);
      this.pDown.set2f('uTexel', 1 / mips[i - 1].width, 1 / mips[i - 1].height);
      this.quad.draw();
    }

    // --- Upsample, accumulating additively back down the chain.
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    this.pUp.use();
    this.pUp.set1f('uRadius', this.bloomRadius);
    // Weighting each level below 1 makes the contribution of the widest mips
    // decay geometrically (w^k by the time they reach mip 0). Adding every
    // level at full strength — the textbook approach — produces a soft film
    // haze that swallows a vector game's colour.
    this.pUp.set1f('uStrength', this.levelWeight);
    for (let i = mips.length - 1; i > 0; i--) {
      mips[i - 1].bind(false);
      this.pUp.setTex('uTex', mips[i].tex, 0);
      this.pUp.set2f('uTexel', 1 / mips[i].width, 1 / mips[i].height);
      this.quad.draw();
    }
    gl.disable(gl.BLEND);

    // --- Anamorphic streak: two wide horizontal passes at quarter res.
    if (this.streakAmount > 0.001) {
      this.pStreak.use();
      this.streakA.bind(false);
      this.pStreak.setTex('uTex', mips[2] ? mips[2].tex : mips[0].tex, 0);
      this.pStreak.set2f('uTexel', 1 / this.streakA.width, 1 / this.streakA.height);
      this.pStreak.set2f('uDir', 1, 0);
      this.pStreak.set1f('uSpread', 1.7);
      this.quad.draw();

      this.streakB.bind(false);
      this.pStreak.setTex('uTex', this.streakA.tex, 0);
      this.pStreak.set2f('uTexel', 1 / this.streakB.width, 1 / this.streakB.height);
      this.pStreak.set2f('uDir', 1, 0);
      this.pStreak.set1f('uSpread', 5.5);
      this.quad.draw();
    }

    // --- Composite to screen.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, targetW, targetH);
    const p = this.pComposite;
    p.use();
    p.setTex('uScene', this.scene.tex, 0);
    p.setTex('uBloom', mips[0].tex, 1);
    p.setTex('uStreak', this.streakB.tex, 2);
    p.set2f('uResolution', targetW, targetH);
    p.set1f('uBloomAmount', this.bloomAmount);
    p.set1f('uStreakAmount', this.streakAmount);
    p.set1f('uExposure', this.exposure);
    p.set1f('uChroma', this.chroma);
    p.set1f('uVignette', this.vignette);
    p.set1f('uGrain', this.grain);
    p.set1f('uScanline', this.scanline);
    p.set1f('uBarrel', this.barrel);
    p.set1f('uTime', performance.now() * 0.001);
    p.set1f('uFlash', this.flash);
    p.set3f('uFlashColor', this.flashColor[0], this.flashColor[1], this.flashColor[2]);
    p.set1f('uFade', this.fade);
    p.set1f('uSaturation', this.saturation);
    p.set1f('uHueRetention', this.hueRetention);
    p.set1f('uShockAmp', this.shockAmp);
    p.set3f('uShock', this.shock[0], this.shock[1], this.shock[2]);
    this.quad.draw();
  }
}
