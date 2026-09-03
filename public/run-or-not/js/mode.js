/**
 * Where the conditions come from.
 *
 * `false` — go through `/api/conditions`, the edge-cached proxy. That is the
 * Vercel deployment and `dev.py`.
 * `true`  — call Open-Meteo from the browser. That is the static build, which
 * has no server to proxy through. Every upstream this app uses is keyless and
 * sends `Access-Control-Allow-Origin: *`, so nothing is lost but the cache.
 *
 * `scripts/build-static.sh` flips this one line and changes nothing else.
 */
export const DIRECT = true;
