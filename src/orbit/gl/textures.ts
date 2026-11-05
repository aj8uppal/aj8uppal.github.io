/** Scene textures, hashed by Vite. Provenance is in ../textures/manifest.json. */
import * as THREE from 'three';
import sky from '../textures/sky.webp?url';
import saltline from '../textures/saltline.webp?url';
import clouds from '../textures/clouds.webp?url';
import ember from '../textures/ember.webp?url';
import ice from '../textures/ice.webp?url';
import rift from '../textures/rift.webp?url';
import moon from '../textures/moon.webp?url';
import nebulaViolet from '../textures/nebula-violet.webp?url';
import nebulaAmber from '../textures/nebula-amber.webp?url';
import nebulaBlue from '../textures/nebula-blue.webp?url';
import earthDay from '../textures/earth-day.webp?url';
import earthDayLo from '../textures/earth-day-lo.webp?url';
import earthNight from '../textures/earth-night.webp?url';
import earthWater from '../textures/earth-water.webp?url';

export const urls = {
  sky,
  saltline,
  clouds,
  ember,
  ice,
  rift,
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

const loader = new THREE.TextureLoader();
const cache = new Map<string, THREE.Texture>();

/**
 * Returns a texture immediately (blank until it arrives) so scene construction
 * never waits on the network; `ready` resolves when the pixels are uploaded.
 */
export function texture(
  key: TextureKey,
  opts: { color?: boolean; mips?: boolean; aniso?: number } = {},
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
  tex.anisotropy = opts.aniso ?? 4;
  tex.ready = new Promise((resolve) => {
    loader.load(
      urls[key],
      (img) => {
        tex.image = img.image;
        tex.needsUpdate = true;
        resolve();
      },
      undefined,
      () => resolve(),
    );
  });
  cache.set(id, tex);
  return tex;
}
