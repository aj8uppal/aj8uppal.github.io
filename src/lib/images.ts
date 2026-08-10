import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/**
 * src/assets holds cropped WebP intermediates produced by scripts/prepare-images.mjs.
 * Globbing them keeps the page from carrying two dozen import lines, and keeps the
 * lookup keyed by the same name the prepare script writes.
 */
const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/*.webp', { eager: true });

export function asset(name: string): ImageMetadata {
  const mod = files[`/src/assets/${name}.webp`];
  if (!mod) throw new Error(`missing image asset: src/assets/${name}.webp (run npm run images)`);
  return mod.default;
}

export interface Sources {
  avif: string;
  webp: string;
  src: string;
  width: number;
  height: number;
  sizes: string;
}

/**
 * Pre-resolved responsive sources, for the React islands. Astro's <Picture> only
 * works in .astro files, so islands get plain serializable srcset strings instead
 * of an ImageMetadata object they could not render anyway.
 */
export async function sources(name: string, widths: number[], sizes: string): Promise<Sources> {
  const src = asset(name);
  const [avif, webp] = await Promise.all([
    getImage({ src, widths, sizes, format: 'avif' }),
    getImage({ src, widths, sizes, format: 'webp' }),
  ]);
  return {
    avif: avif.srcSet.attribute,
    webp: webp.srcSet.attribute,
    src: webp.src,
    width: src.width,
    height: src.height,
    sizes,
  };
}
