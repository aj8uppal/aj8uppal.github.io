/**
 * Uniform-grid spatial hash.
 *
 * Built from intrusive linked lists inside typed arrays: no per-frame
 * allocation, no Map lookups. Rebuilt from scratch each frame, which is far
 * cheaper than incremental updates for a few hundred fast-moving entities.
 */

export class SpatialHash {
  constructor(cellSize = 64, maxItems = 4096) {
    this.cellSize = cellSize;
    this.cols = 1;
    this.rows = 1;
    this.minX = 0;
    this.minY = 0;
    this.cells = new Int32Array(1);
    this.next = new Int32Array(maxItems);
    this.itemX = new Float32Array(maxItems);
    this.itemY = new Float32Array(maxItems);
    this.itemR = new Float32Array(maxItems);
    this.itemRef = new Array(maxItems);
    this.itemIdx = new Int32Array(maxItems);
    this.count = 0;
    this.maxItems = maxItems;
  }

  configure(minX, minY, maxX, maxY, cellSize) {
    this.cellSize = cellSize;
    this.minX = minX;
    this.minY = minY;
    this.cols = Math.max(1, Math.ceil((maxX - minX) / cellSize) + 1);
    this.rows = Math.max(1, Math.ceil((maxY - minY) / cellSize) + 1);
    const n = this.cols * this.rows;
    if (this.cells.length !== n) this.cells = new Int32Array(n);
  }

  clear() {
    this.cells.fill(-1);
    this.count = 0;
  }

  /** `sub` lets one object register several hit points (snake segments). */
  insert(ref, x, y, radius, sub = 0) {
    if (this.count >= this.maxItems) return;
    const i = this.count++;
    this.itemX[i] = x;
    this.itemY[i] = y;
    this.itemR[i] = radius;
    this.itemRef[i] = ref;
    this.itemIdx[i] = sub;
    const cx = Math.max(0, Math.min(this.cols - 1, ((x - this.minX) / this.cellSize) | 0));
    const cy = Math.max(0, Math.min(this.rows - 1, ((y - this.minY) / this.cellSize) | 0));
    const c = cy * this.cols + cx;
    this.next[i] = this.cells[c];
    this.cells[c] = i;
  }

  /**
   * Visit every item whose circle overlaps (x,y,radius).
   * `cb(ref, subIndex, itemX, itemY, itemRadius)` — return true to stop.
   */
  query(x, y, radius, cb) {
    const cs = this.cellSize;
    const c0 = Math.max(0, Math.min(this.cols - 1, ((x - radius - this.minX) / cs) | 0));
    const c1 = Math.max(0, Math.min(this.cols - 1, ((x + radius - this.minX) / cs) | 0));
    const r0 = Math.max(0, Math.min(this.rows - 1, ((y - radius - this.minY) / cs) | 0));
    const r1 = Math.max(0, Math.min(this.rows - 1, ((y + radius - this.minY) / cs) | 0));
    for (let r = r0; r <= r1; r++) {
      const base = r * this.cols;
      for (let c = c0; c <= c1; c++) {
        let i = this.cells[base + c];
        while (i !== -1) {
          const dx = this.itemX[i] - x;
          const dy = this.itemY[i] - y;
          const rr = this.itemR[i] + radius;
          if (dx * dx + dy * dy <= rr * rr) {
            if (cb(this.itemRef[i], this.itemIdx[i], this.itemX[i], this.itemY[i], this.itemR[i]) === true) return;
          }
          i = this.next[i];
        }
      }
    }
  }
}
