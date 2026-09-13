// The live Fly image owns both builds. Never rebuild Voidreach in this repo.
import { createHash } from 'node:crypto';
import { appendFile, mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const FLY = 'https://voidreach-online.fly.dev';
const PAGES = 'https://aj8uppal.github.io/voidreach/';
const TARGET = fileURLToPath(new URL('../public/voidreach', import.meta.url));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');

async function get(base, file) {
  const url = new URL(file, base.endsWith('/') ? base : `${base}/`);
  url.searchParams.set('release-check', `${Date.now()}-${Math.random()}`);
  const response = await fetch(url, {
    redirect: 'error',
    cache: 'no-store',
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw Error(`${url.pathname}: HTTP ${response.status}`);
  return response;
}

export function validateManifest(manifest) {
  if (
    manifest.schema !== 1 ||
    manifest.origin !== FLY ||
    !/^[a-f0-9]{64}$/.test(manifest.release) ||
    !Array.isArray(manifest.files) ||
    !manifest.files.length ||
    manifest.files.length > 64
  )
    throw Error('Invalid Voidreach release manifest');
  const names = new Set();
  let total = 0;
  for (const file of [...manifest.files, manifest.client]) {
    if (
      !file ||
      typeof file.path !== 'string' ||
      !/^[a-zA-Z0-9_./-]+$/.test(file.path) ||
      file.path.split('/').some((part) => !part || part === '.' || part === '..') ||
      file.path === 'release.json' ||
      !Number.isSafeInteger(file.bytes) ||
      file.bytes < 1 ||
      file.bytes > 16 * 1024 * 1024 ||
      !/^[a-f0-9]{64}$/.test(file.sha256)
    )
      throw Error('Unsafe file in Voidreach release manifest');
    total += file.bytes;
  }
  for (const file of manifest.files) {
    if (names.has(file.path)) throw Error('Duplicate release file');
    names.add(file.path);
  }
  if (
    !names.has('index.html') ||
    !names.has('manifest.webmanifest') ||
    manifest.client.path !== 'index.html' ||
    total > 32 * 1024 * 1024
  ) {
    throw Error('Incomplete or oversized Voidreach release');
  }
  return manifest;
}

async function currentRelease(origin) {
  const health = await (await get(origin, 'health')).json();
  if (health.ok !== true) throw Error('Fly is unhealthy; retaining the existing Pages build');
  return validateManifest(await (await get(origin, 'release.json')).json());
}

async function verifiedBytes(base, file, prefix = '') {
  const bytes = Buffer.from(await (await get(base, prefix + file.path)).arrayBuffer());
  if (bytes.length !== file.bytes || hash(bytes) !== file.sha256)
    throw Error(`Release checksum mismatch: ${file.path}`);
  return bytes;
}

export async function checkRelease({ origin = FLY, pages = PAGES } = {}) {
  const manifest = await currentRelease(origin);
  let deployed;
  try {
    deployed = await (await get(pages, 'release.json')).json();
  } catch {
    /* initial deploy or stale CDN */
  }
  let changed = JSON.stringify(deployed) !== JSON.stringify(manifest);
  if (!changed) {
    // Repair a stale/corrupt HTML response even when its adjacent manifest is current.
    try {
      await verifiedBytes(
        pages,
        manifest.files.find((file) => file.path === 'index.html'),
      );
    } catch {
      changed = true;
    }
  }
  return { changed, release: manifest.release };
}

export async function verifyRelease({ origin = FLY, pages = PAGES } = {}) {
  const manifest = await currentRelease(origin);
  const deployed = await (await get(pages, 'release.json')).json();
  if (JSON.stringify(deployed) !== JSON.stringify(manifest))
    throw Error('Pages and Fly release manifests differ');
  await verifiedBytes(origin, manifest.client);
  for (const file of manifest.files) await verifiedBytes(pages, file);
  if ((await currentRelease(origin)).release !== manifest.release)
    throw Error('Fly changed during verification; rerun deployment');
  return { changed: false, release: manifest.release };
}

export async function syncRelease({ origin = FLY, target = TARGET } = {}) {
  const manifest = await currentRelease(origin);
  await verifiedBytes(origin, manifest.client);
  await mkdir(path.dirname(target), { recursive: true });
  const stage = await mkdtemp(path.join(path.dirname(target), '.voidreach-release-'));
  const next = path.join(stage, 'next');
  const backup = path.join(stage, 'previous');
  await mkdir(next);
  try {
    for (const file of manifest.files) {
      const bytes = await verifiedBytes(origin, file, 'pages-release/');
      await mkdir(path.dirname(path.join(next, file.path)), { recursive: true });
      await writeFile(path.join(next, file.path), bytes);
    }
    await writeFile(path.join(next, 'release.json'), JSON.stringify(manifest, null, 2) + '\n');
    // A rolling release can serve two images. Reject a mixed download before replacing anything.
    if ((await currentRelease(origin)).release !== manifest.release)
      throw Error('Fly changed during download; retry after its rollout');
    let existed = true;
    try {
      await rename(target, backup);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      existed = false;
    }
    try {
      await rename(next, target);
    } catch (error) {
      if (existed) await rename(backup, target);
      throw error;
    }
    return { changed: true, release: manifest.release };
  } finally {
    await rm(stage, { recursive: true, force: true });
  }
}

// Exported functions make failure cases testable against a disposable HTTP fixture.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const check = process.argv.includes('--check');
  const verify = process.argv.includes('--verify');
  const operation = check ? checkRelease : verify ? verifyRelease : syncRelease;
  let result;
  for (let attempt = 0; attempt < (verify ? 12 : 3); attempt++) {
    try {
      result = await operation();
      break;
    } catch (error) {
      if (attempt === (verify ? 11 : 2)) throw error;
      console.warn(`Voidreach sync: ${error.message}; retrying…`);
      await new Promise((resolve) => setTimeout(resolve, verify ? 15000 : 5000));
    }
  }
  console.log(
    `Voidreach ${result.release.slice(0, 12)}: ${check ? (result.changed ? 'deploy needed' : 'already in sync') : verify ? 'both hosts verified' : 'artifact ready'}`,
  );
  if (process.env.GITHUB_OUTPUT)
    await appendFile(
      process.env.GITHUB_OUTPUT,
      `changed=${result.changed}\nrelease=${result.release}\n`,
    );
  if (process.env.GITHUB_STEP_SUMMARY)
    await appendFile(
      process.env.GITHUB_STEP_SUMMARY,
      `Voidreach release: \`${result.release}\`\n\n[Fly](${FLY}/) · [Pages](${PAGES})\n`,
    );
}
