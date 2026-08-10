// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

/**
 * Resolve the design lab to an empty component unless the build asked for it.
 *
 * Base.astro already gates whether the panel renders, and a plain build has no
 * lab markup and no lab styles in it. Its client script is the exception:
 * Astro hoists the `<script>` of every `.astro` file in the module graph and
 * writes it into `_astro` as its own chunk, and a dead branch around the
 * import does not take the file out of the graph. That chunk is unreachable -
 * nothing on the page loads it - but it is still a file on the site, and
 * "review furniture ships nowhere near production" should be true of the
 * bytes and not only of the page.
 *
 * A dev server always resolves the real one - the plugin only applies to
 * builds - and `--mode lab` (or the older `palettes`) reaches it as Vite's own
 * mode, which is the same string `import.meta.env.MODE` gets.
 */
function labOnlyInLabBuilds() {
  let wanted = false;
  return {
    name: 'lab-only-in-lab-builds',
    apply: /** @type {const} */ ('build'),
    enforce: /** @type {const} */ ('pre'),
    config(/** @type {unknown} */ _config, /** @type {{ mode: string }} */ env) {
      wanted = env.mode === 'lab' || env.mode === 'palettes';
    },
    resolveId(/** @type {string} */ id) {
      if (wanted || !id.endsWith('components/Lab.astro')) return null;
      return '\0empty-lab';
    },
    load(/** @type {string} */ id) {
      return id === '\0empty-lab' ? 'export default () => null;' : null;
    },
  };
}

// GitHub Pages user site: served from the repository root, so no `base` path.
// Everything under public/ is copied to dist/ verbatim, which is what keeps the
// legacy demo URLs (/grinchjump.html, /pewpew/public/index.html, ...) alive.
export default defineConfig({
  site: 'https://aj8uppal.github.io',
  integrations: [react()],
  build: { inlineStylesheets: 'auto' },
  image: {
    // Sharp emits the responsive AVIF/WebP variants for the project imagery.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  devToolbar: { enabled: false },
  vite: { plugins: [labOnlyInLabBuilds()] },
});
