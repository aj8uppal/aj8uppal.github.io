/**
 * Thin WebGL2 helpers: shader compilation, framebuffer targets, fullscreen
 * blits. Everything here is stateless-ish and reusable.
 */

export function createContext(canvas) {
  const opts = {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    desynchronized: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false,
    premultipliedAlpha: true,
  };
  const gl = canvas.getContext('webgl2', opts);
  if (!gl) return null;

  // Float render targets give us real HDR for the bloom chain. We degrade
  // gracefully to half-float, then to 8-bit if the GPU refuses both.
  const extFloat = gl.getExtension('EXT_color_buffer_float');
  const extHalf = gl.getExtension('EXT_color_buffer_half_float');
  const extLinearHalf = gl.getExtension('OES_texture_float_linear');
  gl.__hdr = !!(extFloat || extHalf);
  gl.__linearFloat = !!extLinearHalf || !!extFloat;
  return gl;
}

export function compileShader(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    const numbered = src
      .split('\n')
      .map((l, i) => `${String(i + 1).padStart(3)}| ${l}`)
      .join('\n');
    console.error(`Shader compile failed:\n${log}\n${numbered}`);
    gl.deleteShader(sh);
    throw new Error('Shader compile failed: ' + log);
  }
  return sh;
}

export class Program {
  constructor(gl, vsSrc, fsSrc, name = 'program') {
    this.gl = gl;
    this.name = name;
    const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      throw new Error(`Link failed (${name}): ` + gl.getProgramInfoLog(p));
    }
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    this.handle = p;

    this.uniforms = Object.create(null);
    const nu = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < nu; i++) {
      const info = gl.getActiveUniform(p, i);
      const base = info.name.replace(/\[0\]$/, '');
      this.uniforms[base] = gl.getUniformLocation(p, info.name);
    }
    this.attribs = Object.create(null);
    const na = gl.getProgramParameter(p, gl.ACTIVE_ATTRIBUTES);
    for (let i = 0; i < na; i++) {
      const info = gl.getActiveAttrib(p, i);
      this.attribs[info.name] = gl.getAttribLocation(p, info.name);
    }
  }
  use() {
    this.gl.useProgram(this.handle);
    return this;
  }
  u(name) {
    return this.uniforms[name];
  }
  set1f(n, a) { const l = this.uniforms[n]; if (l) this.gl.uniform1f(l, a); return this; }
  set2f(n, a, b) { const l = this.uniforms[n]; if (l) this.gl.uniform2f(l, a, b); return this; }
  set3f(n, a, b, c) { const l = this.uniforms[n]; if (l) this.gl.uniform3f(l, a, b, c); return this; }
  set4f(n, a, b, c, d) { const l = this.uniforms[n]; if (l) this.gl.uniform4f(l, a, b, c, d); return this; }
  set1i(n, a) { const l = this.uniforms[n]; if (l) this.gl.uniform1i(l, a); return this; }
  setMat3(n, m) { const l = this.uniforms[n]; if (l) this.gl.uniformMatrix3fv(l, false, m); return this; }
  setTex(n, tex, unit) {
    const l = this.uniforms[n];
    if (!l) return this;
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(l, unit);
    return this;
  }
}

/** A colour-only render target with configurable precision and filtering. */
export class RenderTarget {
  constructor(gl, w, h, { float = true, linear = true, wrap = null } = {}) {
    this.gl = gl;
    this.width = Math.max(1, w | 0);
    this.height = Math.max(1, h | 0);
    this.float = float && gl.__hdr;
    this.linear = linear;
    this.wrapMode = wrap || gl.CLAMP_TO_EDGE;
    this.tex = gl.createTexture();
    this.fbo = gl.createFramebuffer();
    this._alloc();
  }
  _alloc() {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    const internal = this.float ? gl.RGBA16F : gl.RGBA8;
    const type = this.float ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE;
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, this.width, this.height, 0, gl.RGBA, type, null);
    const filt = this.linear ? gl.LINEAR : gl.NEAREST;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filt);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filt);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, this.wrapMode);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, this.wrapMode);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.tex, 0);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE && this.float) {
      // Fall back to 8-bit if float attachments are unsupported here.
      this.float = false;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      this._alloc();
      return;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }
  resize(w, h) {
    w = Math.max(1, w | 0);
    h = Math.max(1, h | 0);
    if (w === this.width && h === this.height) return;
    this.width = w;
    this.height = h;
    this._alloc();
  }
  bind(clear = false) {
    const gl = this.gl;
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);
    gl.viewport(0, 0, this.width, this.height);
    if (clear) {
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    }
    return this;
  }
  dispose() {
    this.gl.deleteTexture(this.tex);
    this.gl.deleteFramebuffer(this.fbo);
  }
}

/** Fullscreen triangle used by all post-processing passes. */
export class ScreenQuad {
  constructor(gl) {
    this.gl = gl;
    this.vao = gl.createVertexArray();
    const buf = gl.createBuffer();
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    // Oversized triangle covering the viewport (fewer verts, no diagonal seam).
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
  }
  draw() {
    const gl = this.gl;
    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
}

export const SCREEN_VS = `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;
