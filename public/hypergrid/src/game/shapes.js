/**
 * Vector art. Every shape is defined in unit space (roughly radius 1) and is
 * scaled by the entity's radius at draw time. Contours are `{p, c}` where `p`
 * is a flat [x,y,...] path and `c` marks it closed.
 */

const S = (...contours) =>
  contours.map((c) => ({ p: Float32Array.from(c.p), c: c.c !== false }));

const ring = (n, r, rot = 0, squash = 1) => {
  const p = [];
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    p.push(Math.cos(a) * r, Math.sin(a) * r * squash);
  }
  return p;
};

const star = (points, outer, inner, rot = 0) => {
  const p = [];
  for (let i = 0; i < points * 2; i++) {
    const a = rot + (i / (points * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? outer : inner;
    p.push(Math.cos(a) * r, Math.sin(a) * r);
  }
  return p;
};

// --------------------------------------------------------------------- ship

export const SHIP = S(
  { p: [1.15, 0, -0.55, 0.78, -0.22, 0, -0.55, -0.78] },
  { p: [-0.22, 0, -0.95, 0.42, -0.78, 0, -0.95, -0.42], c: true },
);

export const SHIP_WINGS = S(
  { p: [0.25, 0.5, -0.35, 0.95], c: false },
  { p: [0.25, -0.5, -0.35, -0.95], c: false },
);

// ------------------------------------------------------------------ enemies

export const GRUNT = S(
  { p: [0, 1.0, 0.86, 0, 0, -1.0, -0.86, 0] },
  { p: [0, 0.48, 0.42, 0, 0, -0.48, -0.42, 0] },
);

export const WANDERER = S(
  { p: ring(6, 1.0, Math.PI / 6) },
  { p: ring(6, 0.52, 0) },
  { p: [0, 1.0, 0, 0.52], c: false },
  { p: [0.87, -0.5, 0.45, -0.26], c: false },
  { p: [-0.87, -0.5, -0.45, -0.26], c: false },
);

export const WEAVER = S(
  { p: [0, 1.05, 0.34, 0.34, 1.05, 0, 0.34, -0.34, 0, -1.05, -0.34, -0.34, -1.05, 0, -0.34, 0.34] },
  { p: [0, 0.42, 0.42, 0, 0, -0.42, -0.42, 0] },
);

export const PINWHEEL = S(
  { p: [0, 0, 0.35, 0.95, 1.0, 0.72, 0.62, 0.18], c: true },
  { p: [0, 0, -0.35, 0.95, -1.0, 0.72, -0.62, 0.18], c: true },
  { p: [0, 0, 0.35, -0.95, 1.0, -0.72, 0.62, -0.18], c: true },
  { p: [0, 0, -0.35, -0.95, -1.0, -0.72, -0.62, -0.18], c: true },
);

export const SNAKE_HEAD = S(
  { p: [1.1, 0, 0.1, 0.85, -0.8, 0.45, -0.8, -0.45, 0.1, -0.85] },
  { p: [0.45, 0.28, 0.72, 0.1], c: false },
  { p: [0.45, -0.28, 0.72, -0.1], c: false },
);

export const SNAKE_BODY = S(
  { p: [0, 0.9, 0.78, 0, 0, -0.9, -0.78, 0] },
);

export const BLACKHOLE = S(
  { p: star(8, 1.0, 0.56) },
  { p: ring(12, 0.52) },
);

export const ROCKET = S(
  { p: [1.25, 0, -0.5, 0.45, -0.3, 0, -0.5, -0.45] },
  { p: [-0.3, 0.3, -0.95, 0.68], c: false },
  { p: [-0.3, -0.3, -0.95, -0.68], c: false },
);

export const NEST = S(
  { p: ring(4, 1.05, Math.PI / 4) },
  { p: ring(4, 0.7, 0) },
  { p: ring(4, 0.32, Math.PI / 4) },
);

export const SEEKER = S(
  { p: [0, 1.0, 0.9, -0.62, -0.9, -0.62] },
);

export const GEOM = S(
  { p: [0, 1.0, 0.62, 0, 0, -1.0, -0.62, 0] },
);

export const GATE_CAP = S(
  { p: ring(6, 1.0) },
);

// --------------------------------------------------------------------- misc

export const CROSSHAIR = S(
  { p: [-1, 0, -0.38, 0], c: false },
  { p: [1, 0, 0.38, 0], c: false },
  { p: [0, -1, 0, -0.38], c: false },
  { p: [0, 1, 0, 0.38], c: false },
  { p: ring(4, 0.3, Math.PI / 4) },
);

export const BOMB_ICON = S(
  { p: ring(8, 1.0) },
  { p: star(4, 0.62, 0.22) },
);

export const LIFE_ICON = S(
  { p: [1.0, 0, -0.5, 0.7, -0.2, 0, -0.5, -0.7] },
);

export { ring, star };
