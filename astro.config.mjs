// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

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
});
