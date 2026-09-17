/**
 * Where the multiplayer relay lives.
 *
 *   ?server=wss://host      explicit override (testing a deploy from localhost)
 *   localhost / 127.0.0.1   ws://<same host>:8791 — `npm run server`
 *   anywhere else           the production relay on Fly
 */

export const PRODUCTION_RELAY = 'wss://hypergrid-online.fly.dev/ws';
export const LOCAL_RELAY_PORT = 8791;

export function relayUrl() {
  const params = new URLSearchParams(location.search);
  const override = params.get('server');
  if (override) return override;
  const h = location.hostname;
  if (h === 'localhost' || h === '127.0.0.1' || h === '[::1]') {
    return `ws://${h}:${LOCAL_RELAY_PORT}/ws`;
  }
  return PRODUCTION_RELAY;
}

/** Shareable link that drops a friend straight into your lobby. */
export function inviteUrl(code) {
  const url = new URL(location.href);
  url.search = '';
  url.hash = '';
  url.searchParams.set('join', code);
  const server = new URLSearchParams(location.search).get('server');
  if (server) url.searchParams.set('server', server);
  return url.toString();
}
