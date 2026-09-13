import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import { mkdtemp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { checkRelease, syncRelease, validateManifest, verifyRelease } from './sync-voidreach.mjs';

const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
async function fixture(t) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'voidreach-sync-test-'));
  const target = path.join(root, 'voidreach');
  await mkdir(target);
  await writeFile(path.join(target, 'index.html'), 'previous working release');
  const bodies = {
    'index.html': '<!doctype html><title>Voidreach test release</title>',
    'manifest.webmanifest': '{"start_url":"./"}',
    'icons/icon.svg': '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  };
  const files = Object.entries(bodies).map(([file, bytes]) => ({
    path: file,
    bytes: Buffer.byteLength(bytes),
    sha256: hash(bytes),
  }));
  const client = '<!doctype html><title>Fly client</title>';
  const manifest = {
    schema: 1,
    origin: 'https://voidreach-online.fly.dev',
    release: 'a'.repeat(64),
    client: { path: 'index.html', bytes: Buffer.byteLength(client), sha256: hash(client) },
    files,
  };
  const routes = new Map([
    ['/health', () => ({ ok: true })],
    ['/release.json', () => manifest],
    ['/index.html', () => client],
    ['/pages/release.json', () => manifest],
  ]);
  for (const [file, bytes] of Object.entries(bodies)) {
    routes.set(`/pages-release/${file}`, () => bytes);
    routes.set(`/pages/${file}`, () => bytes);
  }
  const server = createServer((req, res) => {
    const handler = routes.get(new URL(req.url, 'http://test').pathname);
    if (!handler) {
      res.writeHead(404);
      res.end();
      return;
    }
    const body = handler();
    res.end(typeof body === 'string' ? body : JSON.stringify(body));
  });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await rm(root, { recursive: true, force: true });
  });
  const origin = `http://127.0.0.1:${server.address().port}`;
  return { root, target, bodies, manifest, routes, origin, pages: `${origin}/pages/` };
}

test('copies verified bytes, removes obsolete files, and verifies the published host', async (t) => {
  const f = await fixture(t);
  await writeFile(path.join(f.target, 'obsolete.js'), 'stale');
  const result = await syncRelease(f);
  assert.equal(result.release, f.manifest.release);
  for (const [file, bytes] of Object.entries(f.bodies))
    assert.equal(await readFile(path.join(f.target, file), 'utf8'), bytes);
  assert.deepEqual(
    JSON.parse(await readFile(path.join(f.target, 'release.json'), 'utf8')),
    f.manifest,
  );
  assert(!(await readdir(f.target)).includes('obsolete.js'));
  assert.equal((await checkRelease(f)).changed, false);
  await verifyRelease(f);
  await syncRelease(f);
  // Rollback is based on content, never release ordering.
  f.manifest.release = '0'.repeat(64);
  f.routes.set('/pages/release.json', () => ({ ...f.manifest, release: 'a'.repeat(64) }));
  assert.equal((await checkRelease(f)).changed, true);
  assert.equal((await syncRelease(f)).release, '0'.repeat(64));
});

test('failed downloads leave the entire previous release intact', async (t) => {
  const failures = {
    unhealthy: (f) => f.routes.set('/health', () => ({ ok: false })),
    missing: (f) => f.routes.delete('/pages-release/manifest.webmanifest'),
    truncated: (f) => f.routes.set('/pages-release/index.html', () => 'partial HTML'),
    mixedClient: (f) => f.routes.set('/index.html', () => 'another Fly image'),
    malformed: (f) => f.routes.set('/release.json', () => '<html>SPA fallback</html>'),
    rolling: (f) => {
      let reads = 0;
      f.routes.set('/release.json', () => ({
        ...f.manifest,
        release: ++reads === 1 ? f.manifest.release : 'b'.repeat(64),
      }));
    },
  };
  for (const [name, change] of Object.entries(failures))
    await t.test(name, async (t) => {
      const f = await fixture(t);
      change(f);
      await assert.rejects(syncRelease(f));
      assert.equal(
        await readFile(path.join(f.target, 'index.html'), 'utf8'),
        'previous working release',
      );
      assert.deepEqual(await readdir(f.root), ['voidreach']);
    });
});

test('rejects unsafe or incomplete manifests before writing files', async (t) => {
  const f = await fixture(t);
  for (const file of [
    '../escape',
    '/absolute',
    'icons/../../escape',
    'icons//bad',
    'https://evil.test/x',
    'release.json',
    'a%2fb',
  ]) {
    const manifest = structuredClone(f.manifest);
    manifest.files[0].path = file;
    assert.throws(() => validateManifest(manifest));
  }
  const duplicate = structuredClone(f.manifest);
  duplicate.files.push(duplicate.files[0]);
  assert.throws(() => validateManifest(duplicate));
  const incomplete = structuredClone(f.manifest);
  incomplete.files = [incomplete.files[0]];
  assert.throws(() => validateManifest(incomplete));
  const oversized = structuredClone(f.manifest);
  oversized.files[0].bytes = 20 * 1024 * 1024;
  assert.throws(() => validateManifest(oversized));
});

test('detects stale Pages manifests and corrupted content even if the release id matches', async (t) => {
  const f = await fixture(t);
  f.routes.set('/pages/index.html', () => 'old cached page');
  assert.equal((await checkRelease(f)).changed, true);
  await assert.rejects(verifyRelease(f), /checksum/);
  f.routes.delete('/pages/release.json');
  assert.equal((await checkRelease(f)).changed, true);
  await assert.rejects(verifyRelease(f));
});
