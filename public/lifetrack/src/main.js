import { html, render } from '../vendor/preact-htm.module.js';
import { App } from './app.js';
import { load, onSaveError } from './store.js';
import { toast } from './ui/components.js';

let swUpdate = null;
const root = document.getElementById('app');

function mount() {
  render(html`<${App} swUpdate=${swUpdate} />`, root);
}

async function start() {
  onSaveError((msg) => toast(`${msg} Export a backup from Settings.`, { kind: 'error', duration: 12000 }));
  await load();
  root.classList.remove('app-loading');
  root.removeAttribute('aria-busy');
  mount();
  registerSW();
}

function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  if (location.protocol !== 'https:' && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') return;
  const register = async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js');
      const promptUpdate = (worker) => {
        swUpdate = () => { worker.postMessage({ type: 'SKIP_WAITING' }); };
        mount();
      };
      if (reg.waiting && navigator.serviceWorker.controller) promptUpdate(reg.waiting);
      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if (!nw) return;
        nw.addEventListener('statechange', () => {
          if (nw.state === 'installed' && navigator.serviceWorker.controller) promptUpdate(nw);
        });
      });
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        location.reload();
      });
      // Check for updates periodically while the tab is open.
      setInterval(() => reg.update().catch(() => {}), 60 * 60 * 1000);
    } catch (err) {
      console.warn('Service worker registration failed', err);
    }
  };
  if (document.readyState === 'complete') register();
  else window.addEventListener('load', register, { once: true });
}

window.addEventListener('error', (e) => {
  if (root.classList.contains('app-loading')) {
    root.innerHTML = `<div class="splash"><div class="splash-logo">◎</div><div>LifeTrack failed to start.</div><div class="hint">${String(e.message || e.error || 'Unknown error').replace(/</g, '&lt;')}</div><div class="hint">Try a modern browser (Chrome, Safari, Firefox, Edge) and make sure the app is served over http(s), not opened as a file.</div></div>`;
  }
});

start();
