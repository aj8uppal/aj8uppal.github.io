/** Scene textures, hashed by Vite. Provenance is in ../textures/manifest.json. */
import * as THREE from 'three';
import sky from '../textures/sky.webp?url';
import saltline from '../textures/saltline.webp?url';
import clouds from '../textures/clouds.webp?url';
import ice from '../textures/ice.webp?url';
import emberdeep from '../textures/emberdeep.webp?url';
import seventide from '../textures/seventide.webp?url';
import harvest from '../textures/harvest.webp?url';
import lumen from '../textures/lumen.webp?url';
import lanternwake from '../textures/lanternwake.webp?url';
import lanternRoads from '../textures/lantern-roads.webp?url';
import moon from '../textures/moon.webp?url';
import nebulaViolet from '../textures/nebula-violet.webp?url';
import nebulaAmber from '../textures/nebula-amber.webp?url';
import nebulaBlue from '../textures/nebula-blue.webp?url';
import earthDay from '../textures/earth-day.webp?url';
import earthDayLo from '../textures/earth-day-lo.webp?url';
import earthNight from '../textures/earth-night.webp?url';
import earthWater from '../textures/earth-water.webp?url';
import saltline512 from '../textures/saltline-512.webp?url';
import clouds512 from '../textures/clouds-512.webp?url';
import ice512 from '../textures/ice-512.webp?url';
import emberdeep512 from '../textures/emberdeep-512.webp?url';
import seventide512 from '../textures/seventide-512.webp?url';
import harvest512 from '../textures/harvest-512.webp?url';
import lumen512 from '../textures/lumen-512.webp?url';
import lanternwake512 from '../textures/lanternwake-512.webp?url';
import lanternRoads512 from '../textures/lantern-roads-512.webp?url';
import moon512 from '../textures/moon-512.webp?url';
import earthDay512 from '../textures/earth-day-512.webp?url';

export const urls = {
  sky,
  saltline,
  clouds,
  ice,
  emberdeep,
  seventide,
  harvest,
  lumen,
  lanternwake,
  lanternRoads,
  moon,
  nebulaViolet,
  nebulaAmber,
  nebulaBlue,
  earthDay,
  earthDayLo,
  earthNight,
  earthWater,
} as const;
export type TextureKey = keyof typeof urls;

/** 512px stand-ins, shown until `promote` fetches the full map. */
const small: Partial<Record<TextureKey, string>> = {
  saltline: saltline512,
  clouds: clouds512,
  ice: ice512,
  emberdeep: emberdeep512,
  seventide: seventide512,
  harvest: harvest512,
  lumen: lumen512,
  lanternwake: lanternwake512,
  lanternRoads: lanternRoads512,
  moon: moon512,
  earthDay: earthDay512,
  earthDayLo: earthDay512,
};

const loader = new THREE.TextureLoader();
const cache = new Map<string, THREE.Texture>();

/**
 * Returns a texture immediately (blank until it arrives) so scene construction
 * never waits on the network; `ready` resolves when the pixels are uploaded.
 */
export function texture(
  key: TextureKey,
  opts: { color?: boolean; mips?: boolean; aniso?: number; nearest?: boolean } = {},
): THREE.Texture & { ready?: Promise<void> } {
  const id = key + JSON.stringify(opts);
  const hit = cache.get(id);
  if (hit) return hit;
  const tex = new THREE.Texture() as THREE.Texture & { ready?: Promise<void> };
  tex.colorSpace = opts.color === false ? THREE.NoColorSpace : THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.generateMipmaps = opts.mips !== false;
  tex.minFilter = opts.mips === false ? THREE.LinearFilter : THREE.LinearMipmapLinearFilter;
  if (opts.nearest) tex.magFilter = THREE.NearestFilter;
  tex.anisotropy = opts.aniso ?? 4;
  tex.ready = new Promise((resolve) => {
    loader.load(
      small[key] ?? urls[key],
      (img) => {
        // The full map may have landed first; never step back down.
        if (!tex.userData.full) {
          tex.image = img.image;
          tex.needsUpdate = true;
        }
        resolve();
      },
      undefined,
      () => resolve(),
    );
  });
  tex.userData.key = key;
  cache.set(id, tex);
  return tex;
}

const promoted = new Set<TextureKey>();
// Full-size maps decode off the main thread where the browser can, flipped
// at decode because WebGL cannot flip an ImageBitmap on upload.
const bitmaps =
  typeof createImageBitmap === 'function'
    ? new THREE.ImageBitmapLoader().setOptions({
        imageOrientation: 'flipY',
        premultiplyAlpha: 'none',
      })
    : null;
const pending: { key: TextureKey; image: TexImageSource; since: number }[] = [];

/**
 * Fetches the full-size maps for these keys. Bodies call it as the camera
 * closes in; `flushTextures` puts them in place.
 */
export function promote(keys: (TextureKey | undefined)[]) {
  for (const key of keys) {
    if (!key || promoted.has(key) || !small[key]) continue;
    promoted.add(key);
    const done = (image: TexImageSource) => pending.push({ key, image, since: performance.now() });
    const fallback = () => loader.load(urls[key], (t) => done(t.image as TexImageSource));
    if (bitmaps) bitmaps.load(urls[key], done, undefined, fallback);
    else fallback();
  }
}

/**
 * Swaps at most one finished full-size map into place per frame, and only
 * while the camera is settled (or once it has waited 1.5 s), so a texture
 * upload never lands in the middle of a flight.
 */
export function flushTextures(renderer: THREE.WebGLRenderer, settled: boolean) {
  const next = pending[0];
  if (!next || (!settled && performance.now() - next.since < 1500)) return;
  pending.shift();
  const bitmap = typeof ImageBitmap !== 'undefined' && next.image instanceof ImageBitmap;
  for (const tex of cache.values())
    if (tex.userData.key === next.key) {
      // A bigger image needs new GPU storage: dispose drops the old one.
      tex.dispose();
      tex.image = next.image;
      tex.flipY = !bitmap;
      tex.userData.full = true;
      tex.needsUpdate = true;
      renderer.initTexture(tex);
    }
}
