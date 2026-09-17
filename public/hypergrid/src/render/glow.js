/**
 * GlowRenderer — every visible thing in the game is a glowing capsule.
 *
 * Lines, ship hulls, enemy outlines, bullets, particles, the warping grid and
 * even text all funnel into a single instanced draw call. Each instance is a
 * line segment with a round cap, shaded as a bright white-hot core wrapped in
 * a coloured halo. Additive blending into an HDR target, then bloom, gives the
 * signature vector-arcade look.
 *
 * Instance layout (10 floats):
 *   0-3  p0.xy, p1.xy      segment endpoints in world space
 *   4-5  glowRadius, coreRadius
 *   6-9  r, g, b, intensity
 */

import { Program, SCREEN_VS } from './gl.js';
import { drawText, measureText } from './font.js';

const FLOATS_PER_INSTANCE = 10;

const VS = `#version 300 es
precision highp float;

layout(location = 0) in vec2 aCorner;   // static quad corner in [-1,1]
layout(location = 1) in vec4 aSeg;      // p0.xy, p1.xy
layout(location = 2) in vec2 aShape;    // glow radius, core radius
layout(location = 3) in vec4 aColor;    // rgb + intensity

uniform mat3 uView;
uniform float uMinGlow;   // world units per pixel * k, keeps hairlines visible
uniform float uMinCore;

out vec2 vLocal;      // position in segment space (x along, y across)
out float vHalfLen;
out float vGlow;
out float vCore;
out vec4 vColor;

void main() {
  vec2 d = aSeg.zw - aSeg.xy;
  float L = length(d);
  vec2 dir = L > 1e-5 ? d / L : vec2(1.0, 0.0);
  vec2 nrm = vec2(-dir.y, dir.x);

  float glow = max(aShape.x, uMinGlow);
  float core = max(aShape.y, uMinCore);
  float halfLen = L * 0.5;

  vec2 mid = (aSeg.xy + aSeg.zw) * 0.5;
  vec2 local = vec2(aCorner.x * (halfLen + glow), aCorner.y * glow);
  vec2 world = mid + dir * local.x + nrm * local.y;

  vLocal = local;
  vHalfLen = halfLen;
  vGlow = glow;
  vCore = core;
  vColor = aColor;

  vec3 clip = uView * vec3(world, 1.0);
  gl_Position = vec4(clip.xy, 0.0, 1.0);
}`;

const FS = `#version 300 es
precision highp float;

in vec2 vLocal;
in float vHalfLen;
in float vGlow;
in float vCore;
in vec4 vColor;

uniform float uPx;        // world units per pixel, for analytic AA
uniform float uExposure;

out vec4 outColor;

void main() {
  // Distance to the capsule axis.
  float d = length(vec2(max(abs(vLocal.x) - vHalfLen, 0.0), vLocal.y));

  // Tight cubic halo. A wider falloff washes the whole frame out once a few
  // hundred emitters overlap, so the bloom pass provides the wide glow and
  // the primitive itself stays compact.
  float t = clamp(1.0 - d / vGlow, 0.0, 1.0);
  float halo = t * t * t;

  // Hot core, antialiased against the pixel footprint.
  float aa = max(uPx * 0.9, 1e-6);
  float core = 1.0 - smoothstep(vCore - aa, vCore + aa, d);

  // Hue is carried by the primitive; only the very centre pushes toward
  // white, and only a little. Letting the core desaturate here turns every
  // enemy into an identical white blob once bloom is applied.
  vec3 tint = vColor.rgb;
  vec3 rgb = tint * (halo * 0.45 + core * 1.0) + vec3(1.0) * core * 0.15;
  rgb *= vColor.a * uExposure;

  outColor = vec4(rgb, 1.0);
}`;

export class GlowRenderer {
  constructor(gl, maxInstances = 40000) {
    this.gl = gl;
    this.max = maxInstances;
    this.program = new Program(gl, VS, FS, 'glow');

    this.data = new Float32Array(maxInstances * FLOATS_PER_INSTANCE);
    this.count = 0;
    this.overflow = 0;

    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    // Static unit quad.
    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    const idx = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    // Dynamic instance stream.
    this.instBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instBuf);
    gl.bufferData(gl.ARRAY_BUFFER, this.data.byteLength, gl.DYNAMIC_DRAW);
    const stride = FLOATS_PER_INSTANCE * 4;
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 4, gl.FLOAT, false, stride, 0);
    gl.vertexAttribDivisor(1, 1);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 2, gl.FLOAT, false, stride, 16);
    gl.vertexAttribDivisor(2, 1);
    gl.enableVertexAttribArray(3);
    gl.vertexAttribPointer(3, 4, gl.FLOAT, false, stride, 24);
    gl.vertexAttribDivisor(3, 1);

    gl.bindVertexArray(null);

    this.view = new Float32Array(9);
    this.pxScale = 1;       // world units per device pixel
    this.exposure = 1;
    this.globalAlpha = 1;
    this.widthScale = 1;
  }

  /**
   * @param {Float32Array} viewMat3 world -> clip
   * @param {number} worldPerPixel used for hairline clamping and AA
   */
  begin(viewMat3, worldPerPixel) {
    this.view.set(viewMat3);
    this.pxScale = worldPerPixel;
    this.count = 0;
    this.overflow = 0;
  }

  /**
   * Core primitive. `width` is the hot-core thickness in world units;
   * `glowScale` multiplies it to obtain the halo radius.
   */
  seg(x0, y0, x1, y1, width, color, intensity = 1, glowScale = 3.0) {
    if (this.count >= this.max) { this.overflow++; return; }
    // Clamp: a runaway intensity overflows the half-float target to Infinity,
    // which the tonemapper turns into NaN and the driver into black pixels.
    const a = Math.min(intensity * this.globalAlpha, 64);
    if (!(a > 0.001)) return;
    const w = width * this.widthScale;
    const i = this.count++ * FLOATS_PER_INSTANCE;
    const d = this.data;
    d[i] = x0; d[i + 1] = y0; d[i + 2] = x1; d[i + 3] = y1;
    d[i + 4] = w * 0.5 * glowScale;
    d[i + 5] = w * 0.5;
    d[i + 6] = color[0]; d[i + 7] = color[1]; d[i + 8] = color[2];
    d[i + 9] = a;
  }

  /** A soft round emitter — a zero-length capsule. */
  dot(x, y, radius, color, intensity = 1, glowScale = 2.6) {
    this.seg(x, y, x, y, radius * 2, color, intensity, glowScale);
  }

  /** Polyline through a flat [x,y,x,y,...] array. */
  poly(pts, closed, width, color, intensity = 1, glowScale = 3.0) {
    const n = pts.length;
    for (let i = 0; i < n - 2; i += 2) {
      this.seg(pts[i], pts[i + 1], pts[i + 2], pts[i + 3], width, color, intensity, glowScale);
    }
    if (closed && n >= 4) {
      this.seg(pts[n - 2], pts[n - 1], pts[0], pts[1], width, color, intensity, glowScale);
    }
  }

  /**
   * Draw a shape definition (array of flat contours) transformed by
   * position / rotation / scale. This is how every enemy is rendered.
   */
  shape(def, x, y, rot, scale, width, color, intensity = 1, glowScale = 3.0, scaleY = null) {
    const cs = Math.cos(rot) * scale;
    const sn = Math.sin(rot) * scale;
    const sy = scaleY === null ? 1 : scaleY / (scale || 1);
    for (let c = 0; c < def.length; c++) {
      const pts = def[c].p;
      const closed = def[c].c;
      const n = pts.length;
      let px = 0, py = 0, fx = 0, fy = 0;
      for (let i = 0; i < n; i += 2) {
        const lx = pts[i];
        const ly = pts[i + 1] * (scaleY === null ? 1 : sy);
        const wx = x + lx * cs - ly * sn;
        const wy = y + lx * sn + ly * cs;
        if (i === 0) { fx = wx; fy = wy; }
        else this.seg(px, py, wx, wy, width, color, intensity, glowScale);
        px = wx; py = wy;
      }
      if (closed && n >= 4) this.seg(px, py, fx, fy, width, color, intensity, glowScale);
    }
  }

  circle(x, y, radius, width, color, intensity = 1, segments = 0, glowScale = 3.0, rot = 0) {
    const n = segments || Math.max(10, Math.min(64, Math.ceil(radius / Math.max(this.pxScale, 1e-4) / 6)));
    let px = x + Math.cos(rot) * radius;
    let py = y + Math.sin(rot) * radius;
    for (let i = 1; i <= n; i++) {
      const a = rot + (i / n) * Math.PI * 2;
      const nx = x + Math.cos(a) * radius;
      const ny = y + Math.sin(a) * radius;
      this.seg(px, py, nx, ny, width, color, intensity, glowScale);
      px = nx; py = ny;
    }
  }

  arc(x, y, radius, a0, a1, width, color, intensity = 1, segments = 16, glowScale = 3.0) {
    let px = x + Math.cos(a0) * radius;
    let py = y + Math.sin(a0) * radius;
    for (let i = 1; i <= segments; i++) {
      const a = a0 + ((a1 - a0) * i) / segments;
      const nx = x + Math.cos(a) * radius;
      const ny = y + Math.sin(a) * radius;
      this.seg(px, py, nx, ny, width, color, intensity, glowScale);
      px = nx; py = ny;
    }
  }

  text(str, x, y, size, color, opts) {
    drawText(this, str, x, y, size, color, opts);
  }
  measure(str, size, tracking = 0) {
    return measureText(str, size, tracking);
  }

  flush() {
    if (this.count === 0) return;
    const gl = this.gl;
    const p = this.program;
    p.use();
    p.setMat3('uView', this.view);
    p.set1f('uPx', this.pxScale);
    p.set1f('uExposure', this.exposure);
    p.set1f('uMinGlow', this.pxScale * 1.55);
    p.set1f('uMinCore', this.pxScale * 0.52);

    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.data, 0, this.count * FLOATS_PER_INSTANCE);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0, this.count);
    gl.bindVertexArray(null);

    this.count = 0;
  }
}

/** Build a shape definition from an array of contours: [{points:[...], closed:bool}] */
export function defShape(contours) {
  return contours.map((c) => ({ p: Float32Array.from(c.p || c.points || c), c: c.c !== undefined ? c.c : c.closed !== false }));
}

/** Regular n-gon contour helper. */
export function ngon(n, radius, rot = 0, squash = 1) {
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    p.push(Math.cos(a) * radius, Math.sin(a) * radius * squash);
  }
  return p;
}

export { SCREEN_VS };
