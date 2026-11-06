/**
 * The production gates: the Worldbuilder home at / (verify-portfolio) and the
 * Orbit site at /v2/ (verify-orbit). Both take the server's base URL.
 */
await import('./verify-portfolio.mjs');
await import('./verify-orbit.mjs');
