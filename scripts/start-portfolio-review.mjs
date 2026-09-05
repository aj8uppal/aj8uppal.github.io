/** Start only the local review processes we need, and stop only those we own. */
import { spawn } from 'node:child_process';
import { access, mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const repository = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const host = '127.0.0.1';
export const services = [
  { key: 'portfolio', label: 'Portfolio preview', port: 4340, route: '/portfolio/' },
  { key: 'driftfall', label: 'Driftfall', port: 5301, route: '/' },
  { key: 'bring-something-home', label: 'Bring Something Home', port: 5303, route: '/' },
];
const baseURL = (service) => `http://${host}:${service.port}`;
const exists = async (file) =>
  access(file).then(
    () => true,
    () => false,
  );

/** Title plus app-specific health shape prevents reusing an unrelated server. */
export function matchesService(key, html, health) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '';
  if (key === 'portfolio')
    return (
      /^AJ Uppal\b/.test(title) &&
      /data-portfolio-home=["'](?:worldbuilder|editorial|studio|field-notes|observatory)["']/.test(
        html,
      ) &&
      !html.includes('/@vite/client') &&
      health?.directoryIndex === true
    );
  if (key === 'driftfall')
    return /^Driftfall\b/.test(title) && health?.name === 'Driftfall' && health.ok === true;
  if (key === 'bring-something-home')
    return (
      /^Bring Something Home\b/.test(title) &&
      health?.status === 'ok' &&
      typeof health.version === 'string' &&
      Number.isFinite(health.realms)
    );
  return false;
}

async function readResponse(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(4000), redirect: 'error' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const reader = response.body.getReader();
  const chunks = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 1024 * 1024) throw new Error('Response is larger than a review page');
      chunks.push(value);
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  return Buffer.concat(chunks).toString('utf8');
}

/** A short exclusive bind also detects listeners that do not speak HTTP. */
export async function portAvailable(port) {
  return new Promise((resolve, reject) => {
    const server = createServer();
    server.once('error', (error) => (error.code === 'EADDRINUSE' ? resolve(false) : reject(error)));
    server.listen({ host, port, exclusive: true }, () => server.close(() => resolve(true)));
  });
}

export async function inspectService(service) {
  if (await portAvailable(service.port)) return 'free';
  try {
    const [html, health] = await Promise.all([
      readResponse(baseURL(service) + service.route),
      service.key === 'portfolio'
        ? readResponse(baseURL(service) + '/playlist-from-photo/').then((html) => ({
            directoryIndex: /<title[^>]*>\s*Playlist From a Photo\s*<\/title>/i.test(html),
          }))
        : readResponse(baseURL(service) + '/api/health').then(JSON.parse),
    ]);
    return matchesService(service.key, html, health) ? 'matching' : 'occupied';
  } catch {
    return 'occupied';
  }
}

/** The set contains only detached process groups created by this launcher. */
export async function stopOwned(children, graceMs = 4000) {
  const groups = [...children].filter((child) => child.pid);
  const signal = (child, value) => {
    try {
      process.kill(-child.pid, value);
    } catch (error) {
      if (error.code !== 'ESRCH') throw error;
    }
  };
  const alive = (child) => {
    try {
      process.kill(-child.pid, 0);
      return true;
    } catch (error) {
      if (error.code === 'ESRCH') return false;
      throw error;
    }
  };
  for (const child of groups) signal(child, 'SIGTERM');
  const deadline = Date.now() + graceMs;
  while (groups.some(alive) && Date.now() < deadline) await delay(80);
  for (const child of groups.filter(alive)) signal(child, 'SIGKILL');
}

async function snapshotIssues(directory, key) {
  const runtime = key === 'driftfall' ? 'server/index.js' : 'dist-server/server/main.js';
  const required = ['package.json', 'node_modules', 'dist/index.html', runtime];
  const checks = await Promise.all(
    required.map(async (file) => ({ file, found: await exists(path.join(directory, file)) })),
  );
  return checks.filter((check) => !check.found).map((check) => check.file);
}

export function portGuardSource(port) {
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid review port');
  return `import { Server } from 'node:net';\nconst original = Server.prototype.listen;\nServer.prototype.listen = function (...args) {\n  const port = typeof args[0] === 'object' ? args[0]?.port : args[0];\n  if (Number(port) !== ${port}) throw new Error('The review requires port ${port}; refusing an alternate listen port.');\n  return original.apply(this, args);\n};\n`;
}

async function hasPortfolioBuild() {
  return (
    (await exists(path.join(repository, 'dist/portfolio/index.html'))) &&
    (await exists(path.join(repository, 'dist/directions/index.html')))
  );
}

function buildPortfolio(children) {
  return new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'build:lab'], {
      cwd: repository,
      env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
      detached: true,
      stdio: ['ignore', 'inherit', 'inherit'],
    });
    children.add(child);
    child.once('error', reject);
    child.once('close', (code, signal) => {
      children.delete(child);
      if (code === 0) resolve();
      else reject(new Error(`Portfolio build stopped (${signal || `exit ${code}`}).`));
    });
  });
}

export async function startReview({ check = false } = {}) {
  const [major, minor] = process.versions.node.split('.').map(Number);
  if (major < 24 || (major === 24 && minor < 15))
    throw new Error('Use Node.js 24.15 or newer for these frozen builds.');
  if (process.platform === 'win32')
    throw new Error('This launcher uses POSIX process groups. Run it on macOS or Linux.');
  const buildRoot = path.resolve(
    process.env.PORTFOLIO_BUILD_DIR || path.join(repository, '../data/portfolio-builds/2026-09-05'),
  );
  console.log(`Frozen build directory: ${buildRoot}`);
  const plan = await Promise.all(
    services.map(async (service) => {
      const status = await inspectService(service);
      const directory =
        service.key === 'portfolio' ? repository : path.join(buildRoot, service.key);
      const missing =
        service.key === 'portfolio'
          ? (await exists(path.join(repository, 'node_modules/.bin/astro')))
            ? []
            : ['node_modules/.bin/astro']
          : await snapshotIssues(directory, service.key);
      return { ...service, directory, status, missing };
    }),
  );
  for (const service of plan) {
    if (service.status === 'occupied')
      throw new Error(
        `Port ${service.port} is occupied, but it does not answer as a healthy ${service.label} server. Resolve that listener yourself, then retry. No alternate port will be used.`,
      );
    if (service.status === 'matching')
      console.log(
        `Reusing ${service.label} at ${baseURL(service)}${service.route}. Its process and state stay under its existing owner's control.`,
      );
    else if (service.missing.length) {
      console.log(
        `${service.label} is unavailable. Missing from ${service.directory}: ${service.missing.join(', ')}.`,
      );
      if (service.key === 'portfolio')
        throw new Error(
          'Portfolio dependencies are missing. Restore the repository dependencies before launching the review.',
        );
    } else
      console.log(
        `${check ? 'Ready to start' : 'Will start'} ${service.label} on port ${service.port}.`,
      );
  }
  const outputExists = await hasPortfolioBuild();
  console.log(
    outputExists
      ? 'Using the existing compiled portfolio in dist/.'
      : 'Compiled portfolio output is missing. A launch will run npm run build:lab before preview.',
  );
  if (check) {
    console.log('Check complete. No processes were started and no state was created.');
    return;
  }

  const children = new Set();
  let stopping = false;
  let session;
  let finish;
  const completed = new Promise((resolve) => {
    finish = resolve;
  });
  const stop = async (code = 0) => {
    if (stopping) return;
    stopping = true;
    process.exitCode = code;
    console.log(
      'Stopping the processes started by this launcher. Reused servers will keep running.',
    );
    try {
      await stopOwned(children);
    } finally {
      finish();
    }
  };
  const onInterrupt = () => {
    void stop(130);
  };
  const onTerminate = () => {
    void stop(143);
  };
  process.on('SIGINT', onInterrupt);
  process.on('SIGTERM', onTerminate);
  try {
    for (const service of plan) {
      if (stopping) break;
      if (service.status === 'matching' || service.missing.length) continue;
      if (!session) {
        const stateRoot = path.join(buildRoot, 'state');
        await mkdir(stateRoot, { recursive: true });
        session = await mkdtemp(path.join(stateRoot, 'review-'));
        console.log(`Disposable state for this launch: ${session}`);
      }
      const env = { ...process.env, HOST: host, PORT: String(service.port) };
      let command = 'npm';
      let args = ['start'];
      if (service.key === 'portfolio') {
        if (!outputExists) {
          console.log('Building the missing portfolio output with npm run build:lab.');
          await buildPortfolio(children);
          if (stopping) break;
          if (!(await hasPortfolioBuild()))
            throw new Error('The build did not produce the portfolio and directions pages.');
        }
        // Astro preview does not forward Vite's strictPort option. Restrict
        // this child process to its requested port, including a bind race.
        const guard = path.join(session, 'preview-port.mjs');
        await writeFile(guard, portGuardSource(service.port));
        command = path.join(repository, 'node_modules/.bin/astro');
        args = ['preview', '--host', host, '--port', String(service.port), '--root', repository];
        env.NODE_OPTIONS = [process.env.NODE_OPTIONS, `--import=${pathToFileURL(guard).href}`]
          .filter(Boolean)
          .join(' ');
        env.ASTRO_TELEMETRY_DISABLED = '1';
      } else if (service.key === 'driftfall') {
        env.DATA_DIR = path.join(session, 'driftfall');
        await mkdir(env.DATA_DIR, { recursive: true });
      } else {
        const state = path.join(session, 'bring-something-home');
        await mkdir(state, { recursive: true });
        env.DATA_PATH = path.join(state, 'game.sqlite');
      }
      if (stopping) break;
      const child = spawn(command, args, {
        cwd: service.directory,
        env,
        detached: true,
        stdio: ['ignore', 'inherit', 'inherit'],
      });
      children.add(child);
      let failure;
      child.once('error', (error) => {
        failure = error;
        console.error(`${service.label} could not start: ${error.message}`);
        if (!stopping) void stop(1);
      });
      child.once('exit', (code, signal) => {
        failure = new Error(`${service.label} stopped (${signal || `exit ${code}`}).`);
        if (!stopping) {
          console.error(failure.message);
          void stop(1);
        }
      });
      const deadline = Date.now() + 60000;
      let ready = false;
      while (!stopping && !failure && Date.now() < deadline) {
        if ((await inspectService(service)) === 'matching') {
          ready = true;
          break;
        }
        await delay(500);
      }
      if (stopping) break;
      if (failure) throw failure;
      if (!ready)
        throw new Error(
          `${service.label} did not become healthy at ${baseURL(service)} within 60 seconds.`,
        );
      console.log(`${service.label} is ready at ${baseURL(service)}${service.route}.`);
    }
    if (stopping) {
      await completed;
      return;
    }
    console.log('\nPortfolio: http://127.0.0.1:4340/portfolio/');
    console.log('Compare all five directions: http://127.0.0.1:4340/directions/');
    for (const service of plan.filter((item) => item.key !== 'portfolio')) {
      if (service.status === 'matching' || !service.missing.length)
        console.log(`${service.label}: ${baseURL(service)}/`);
      else
        console.log(
          `${service.label}: local demo unavailable; the portfolio case is still available.`,
        );
    }
    let boundary = false;
    if (await exists(path.join(repository, 'public/boundary/index.html'))) {
      try {
        boundary = /<title[^>]*>\s*Boundary\b/i.test(
          await readResponse('http://127.0.0.1:4340/boundary/'),
        );
      } catch {
        /* Only advertise a staged Boundary that actually answers. */
      }
    }
    console.log(
      boundary
        ? 'Boundary: http://127.0.0.1:4340/boundary/'
        : 'Boundary is not answering from public/boundary yet. No separate Boundary server is started.',
    );
    if (children.size) {
      console.log('Keep this terminal open. Press Ctrl+C to stop this launch.');
      await completed;
    } else
      console.log('All available servers were reused. Nothing to stop; this launcher is exiting.');
  } catch (error) {
    if (stopping && process.exitCode !== 1) {
      await completed;
      return;
    }
    await stop(1);
    await completed;
    throw error;
  } finally {
    process.removeListener('SIGINT', onInterrupt);
    process.removeListener('SIGTERM', onTerminate);
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const args = process.argv.slice(2);
  if (args.some((arg) => !['--check', '--help'].includes(arg))) {
    console.error('Usage: node scripts/start-portfolio-review.mjs [--check | --help]');
    process.exitCode = 1;
  } else if (args.includes('--help')) {
    console.log('Usage: node scripts/start-portfolio-review.mjs [--check]');
    console.log(
      'Starts the portfolio and available frozen local demos. --check inspects ports and snapshot files without starting anything.',
    );
    console.log(
      'Set PORTFOLIO_BUILD_DIR to override the dated frozen build directory. See docs/portfolio-local-demo.md.',
    );
  } else {
    startReview({ check: args.includes('--check') }).catch((error) => {
      console.error(`Portfolio review could not start: ${error.message}`);
      process.exitCode = 1;
    });
  }
}
