/**
 * Camera: builds the world->clip matrix and owns screen shake.
 *
 * Shake uses the "trauma" model: impulses add trauma, trauma decays linearly,
 * and the applied offset is proportional to trauma^2 sampled from value noise.
 * Squaring keeps small hits subtle while big hits are violent.
 */

import { clamp, clamp01, damp, noise1 } from '../core/math.js';

export class Camera {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.viewHalfH = 500;
    this.baseHalfH = 500;
    this.zoom = 1;
    this.targetZoom = 1;
    this.rot = 0;

    this.trauma = 0;
    this.traumaDecay = 1.5;
    this.shakeAmount = 1;
    this.shakeSeedX = Math.random() * 1000;
    this.shakeSeedY = Math.random() * 1000;
    this.shakeSeedR = Math.random() * 1000;
    this.time = 0;

    this.shakeX = 0;
    this.shakeY = 0;

    this.aspect = 16 / 9;
    this.pixelWidth = 1280;
    this.pixelHeight = 720;
    this.matrix = new Float32Array(9);
    this.worldPerPixel = 1;
    this.maxOffset = 46;
    this.maxRot = 0.028;
  }

  addTrauma(amount) {
    this.trauma = clamp01(this.trauma + amount * this.shakeAmount);
  }

  setViewport(pixelWidth, pixelHeight, worldHalfH) {
    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;
    this.aspect = pixelWidth / Math.max(1, pixelHeight);
    this.baseHalfH = worldHalfH;
  }

  update(dt) {
    this.time += dt;
    this.trauma = Math.max(0, this.trauma - this.traumaDecay * dt);

    const s = this.trauma * this.trauma;
    const f = this.time * 22;
    this.shakeX = noise1(this.shakeSeedX + f) * this.maxOffset * s;
    this.shakeY = noise1(this.shakeSeedY + f) * this.maxOffset * s;
    this.rot = noise1(this.shakeSeedR + f * 0.8) * this.maxRot * s;

    this.zoom = damp(this.zoom, this.targetZoom, 4.5, dt);
    this.x = damp(this.x, this.targetX, 6.5, dt);
    this.y = damp(this.y, this.targetY, 6.5, dt);
  }

  /** Recompute the world->clip matrix. */
  build() {
    const halfH = this.baseHalfH / this.zoom;
    const halfW = halfH * this.aspect;
    this.viewHalfH = halfH;
    this.worldPerPixel = (halfH * 2) / Math.max(1, this.pixelHeight);

    const sx = 1 / halfW;
    const sy = 1 / halfH;
    const cs = Math.cos(this.rot);
    const sn = Math.sin(this.rot);
    const cx = this.x + this.shakeX;
    const cy = this.y + this.shakeY;

    const a = sx * cs;
    const c = -sx * sn;
    const b = sy * sn;
    const d = sy * cs;

    const m = this.matrix;
    m[0] = a; m[1] = b; m[2] = 0;
    m[3] = c; m[4] = d; m[5] = 0;
    m[6] = -(a * cx + c * cy);
    m[7] = -(b * cx + d * cy);
    m[8] = 1;
    return m;
  }

  /** Screen pixel -> world coordinates (ignores shake, which is intentional). */
  screenToWorld(px, py, out = { x: 0, y: 0 }) {
    const halfH = this.baseHalfH / this.zoom;
    const halfW = halfH * this.aspect;
    const nx = (px / this.pixelWidth) * 2 - 1;
    const ny = 1 - (py / this.pixelHeight) * 2;
    out.x = this.x + nx * halfW;
    out.y = this.y + ny * halfH;
    return out;
  }

  worldToScreenUV(wx, wy, out = { x: 0, y: 0 }) {
    const halfH = this.baseHalfH / this.zoom;
    const halfW = halfH * this.aspect;
    out.x = clamp((wx - this.x) / halfW * 0.5 + 0.5, -1, 2);
    out.y = clamp((wy - this.y) / halfH * 0.5 + 0.5, -1, 2);
    return out;
  }

  reset(x = 0, y = 0) {
    this.x = this.targetX = x;
    this.y = this.targetY = y;
    this.zoom = this.targetZoom = 1;
    this.trauma = 0;
    this.shakeX = this.shakeY = this.rot = 0;
  }
}
