/**
 * Shipworthy's daily drop.
 *
 *   node scripts/shipworthy-daily.mjs
 *
 * Asks Claude for a handful of app ideas the page has never shown, writes them
 * to public/shipworthy/daily.json, and appends their titles to archive.json so
 * tomorrow's request can be told what to avoid. The page reads daily.json at
 * load; without it, it falls back to remixes seeded by the date, so a skipped
 * run is a quieter day and never a broken one.
 *
 * No SDK. The lockfile could not be regenerated on the machine this was
 * written on, so the call is one request to /v1/messages with Node's built-in
 * fetch, in the shape the API documents: structured output pinned to a JSON
 * schema, and the server-side fallback so a classifier decline is retried on
 * another model inside the same call rather than costing the day.
 *
 * Needs ANTHROPIC_API_KEY. Without it the script says so and exits 0, so the
 * schedule can exist before the key does.
 */
import { appendFile, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const DIR = join(HERE, '..', 'public', 'shipworthy');
const PAGE = join(DIR, 'index.html');
const DAILY = join(DIR, 'daily.json');
const ARCHIVE = join(DIR, 'archive.json');

const MODEL = 'claude-opus-5';
const COUNT = 5;
/** How many days of past drops the prompt is told to avoid. */
const MEMORY_DAYS = 120;
/** How many days the archive file keeps. */
const KEEP_DAYS = 365;
const DAY_MS = 864e5;

/* The page's vocab, mirrored here so the schema can pin the keys it accepts. */
const AUD = {
  me: 'people building for themselves',
  devs: 'developers',
  creators: 'creators',
  students: 'students',
  smb: 'small businesses',
  gamers: 'gamers',
  parents: 'parents',
  fitness: 'fitness people',
  jobs: 'job seekers',
  teams: 'teams at work',
};
const FMT = ['web', 'ext', 'bot', 'mobile', 'cli'];
const MECH = ['identity', 'screenshot', 'invite', 'wom', 'ritual', 'wave', 'humor'];
const GOAL = ['fun', 'followers', 'money', 'portfolio', 'learn'];
const AXES = ['share', 'identity', 'utility', 'timing', 'net', 'speed'];

/** Fails the run with a message that shows on the run page as an annotation, key redacted. */
function fail(message) {
  const line = String(message).replace(/sk-ant-[A-Za-z0-9_-]+/g, 'sk-ant-...').replace(/\s+/g, ' ');
  console.log(`::error::${line.slice(0, 900)}`);
  process.exit(1);
}

const key = process.env.ANTHROPIC_API_KEY;
if (!key) {
  console.log('ANTHROPIC_API_KEY is not set, so there is no drop today.');
  process.exit(0);
}
/* An identity-linked key must also name the workspace it acts in; a plain key needs nothing. */
const workspace = process.env.ANTHROPIC_WORKSPACE_ID;

const today = new Date().toISOString().slice(0, 10);

/** Titles the page already carries, read off the IDEAS array in the page itself. */
async function libraryTitles() {
  const html = await readFile(PAGE, 'utf8');
  const start = html.indexOf('const IDEAS=[');
  const end = html.indexOf('\n];', start);
  if (start < 0 || end < 0) return [];
  const block = html.slice(start, end);
  return [...block.matchAll(/\{id:"[^"]+",t:"([^"]+)"/g)].map((m) => m[1]);
}

async function readArchive() {
  try {
    const parsed = JSON.parse(await readFile(ARCHIVE, 'utf8'));
    return Array.isArray(parsed.days) ? parsed.days : [];
  } catch {
    return [];
  }
}

/** One audience leads each day, so a week of drops does not all land on developers. */
function focusFor(date) {
  const keys = Object.keys(AUD);
  const jan1 = Date.parse(date.slice(0, 4) + '-01-01');
  const dayOfYear = Math.floor((Date.parse(date) - jan1) / DAY_MS);
  return keys[dayOfYear % keys.length];
}

const schema = {
  type: 'object',
  properties: {
    ideas: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          t: { type: 'string', description: 'Title, at most four words' },
          p: { type: 'string', description: 'One-line pitch, at most 160 characters' },
          aud: { type: 'array', items: { type: 'string', enum: Object.keys(AUD) } },
          fmt: { type: 'string', enum: FMT },
          mech: { type: 'string', enum: MECH },
          goal: { type: 'array', items: { type: 'string', enum: GOAL } },
          why: { type: 'string', description: 'Two sentences on why it spreads' },
          share: { type: 'string', description: 'The artifact a user posts or sends' },
          mvp: { type: 'array', items: { type: 'string' }, description: 'Exactly three steps' },
          first: { type: 'string', description: 'How to reach the first 100 users' },
          risk: { type: 'string', description: 'Biggest risk and its mitigation' },
          comps: { type: 'array', items: { type: 'string' }, description: 'Real comparables' },
          s: {
            type: 'object',
            properties: Object.fromEntries(AXES.map((a) => [a, { type: 'integer' }])),
            required: AXES,
            additionalProperties: false,
          },
          effort: { type: 'integer', description: '1 weekend, 2 week, 3 month' },
          money: { type: 'integer', description: 'Monetisation potential 1 to 5' },
        },
        required: [
          't',
          'p',
          'aud',
          'fmt',
          'mech',
          'goal',
          'why',
          'share',
          'mvp',
          'first',
          'risk',
          'comps',
          's',
          'effort',
          'money',
        ],
        additionalProperties: false,
      },
    },
  },
  required: ['ideas'],
  additionalProperties: false,
};

function prompt({ focus, avoid }) {
  return [
    `You are the idea bench behind Shipworthy, a page for people who vibe code small apps fast and want one that is useful and has a real chance of spreading. Every morning it publishes a fresh drop. Today is ${today}.`,
    '',
    `Generate exactly ${COUNT} app ideas for today. At least three should be for ${AUD[focus]} (key "${focus}"); the rest can be for anyone. Every idea must have one concrete share moment: the image, message or artifact a user would post or send, which a stranger understands in one glance. Prefer scope that ships in a weekend. Be specific and current; a title that could sit on any generic list is a failure.`,
    '',
    'Scores are integers from 1 to 5: share (does the output post well as a screenshot), identity (does it say something about the user), utility (frequency times pain), timing (is it riding a wave right now), net (better with other people), speed (5 means a weekend build). Be honest; do not give every idea a 5.',
    '',
    'These titles and concepts have already appeared on the page. Do not repeat them, and do not produce a thin variation of one:',
    avoid.map((t) => '- ' + t).join('\n'),
  ].join('\n');
}

async function ask(body) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-beta': 'server-side-fallback-2026-07-01',
      ...(workspace ? { 'anthropic-workspace-id': workspace } : {}),
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    const hint = text.includes('anthropic-workspace-id')
      ? ' The key is identity-linked: add an ANTHROPIC_WORKSPACE_ID secret with the workspace id from the Console, or use a plain API key.'
      : '';
    throw new Error(`API ${res.status}: ${text.slice(0, 600)}${hint}`);
  }
  return JSON.parse(text);
}

const clamp = (v, lo, hi, fallback) => {
  const n = Math.round(Number(v));
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : fallback;
};
const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const list = (v, max, min) => {
  if (!Array.isArray(v)) return null;
  const out = v
    .map((x) => str(x, 300))
    .filter(Boolean)
    .slice(0, max);
  return out.length >= min ? out : null;
};

/** Everything the page's own normaliser would reject is rejected here, so the file is clean. */
function clean(raw, taken) {
  const t = str(raw.t, 60);
  const p = str(raw.p, 220);
  if (!t || !p || taken.has(t.toLowerCase())) return null;
  const mvp = list(raw.mvp, 3, 3);
  const aud = list(raw.aud, 2, 1)?.filter((a) => a in AUD);
  if (!mvp || !aud?.length) return null;
  const s = Object.fromEntries(AXES.map((a) => [a, clamp(raw.s?.[a], 1, 5, 3)]));
  return {
    t,
    p,
    aud,
    fmt: FMT.includes(raw.fmt) ? raw.fmt : 'web',
    mech: MECH.includes(raw.mech) ? raw.mech : 'wom',
    goal: list(raw.goal, 3, 1)?.filter((g) => GOAL.includes(g)) ?? ['fun'],
    why: str(raw.why, 600),
    share: str(raw.share, 600),
    mvp,
    first: str(raw.first, 600),
    risk: str(raw.risk, 600),
    comps: list(raw.comps, 3, 0) ?? [],
    s,
    effort: clamp(raw.effort, 1, 3, 1),
    money: clamp(raw.money, 1, 5, 2),
  };
}

const days = await readArchive();
const recent = days.filter((d) => Date.parse(d.date) > Date.now() - MEMORY_DAYS * DAY_MS);
const library = await libraryTitles();
const avoid = [...library, ...recent.flatMap((d) => d.ideas.map((i) => i.t))];
const taken = new Set(avoid.map((t) => t.toLowerCase()));
const focus = focusFor(today);

console.log(
  `Asking ${MODEL} for ${COUNT} ideas, focus "${focus}", ${avoid.length} titles to avoid.`,
);

const res = await ask({
  model: MODEL,
  max_tokens: 16000,
  fallbacks: 'default',
  messages: [{ role: 'user', content: prompt({ focus, avoid }) }],
  output_config: { format: { type: 'json_schema', schema } },
}).catch((err) => fail(err.message));

if (res.stop_reason === 'refusal') {
  fail('The request was declined on every model in the chain; no drop today.');
}
if (res.stop_reason !== 'end_turn') {
  fail(`Unexpected stop_reason ${res.stop_reason}; not publishing a partial drop.`);
}

const text = res.content.find((b) => b.type === 'text')?.text ?? '';
let parsed;
try {
  parsed = JSON.parse(text);
} catch (err) {
  fail(`The reply was not JSON (${err.message}): ${text.slice(0, 200)}`);
}
const ideas = [];
for (const raw of parsed.ideas ?? []) {
  const idea = clean(raw, taken);
  if (idea) {
    taken.add(idea.t.toLowerCase());
    ideas.push(idea);
  }
}

if (ideas.length < 3) {
  fail(`Only ${ideas.length} usable ideas came back; keeping the previous drop.`);
}

const drop = {
  date: today,
  generated: new Date().toISOString(),
  model: res.model,
  ideas,
};
await writeFile(DAILY, JSON.stringify(drop, null, 2) + '\n');

const kept = days.filter((d) => d.date !== today);
kept.push({ date: today, ideas: ideas.map(({ t, p }) => ({ t, p })) });
kept.sort((a, b) => (a.date < b.date ? -1 : 1));
await writeFile(ARCHIVE, JSON.stringify({ days: kept.slice(-KEEP_DAYS) }, null, 2) + '\n');

const titles = ideas.map((i) => i.t).join('; ');
console.log(`Wrote ${ideas.length} ideas for ${today} (${res.model}): ${titles}`);

/* The Actions run page shows this without anyone opening the logs. */
if (process.env.GITHUB_STEP_SUMMARY) {
  const lines = ideas.map((i) => `- **${i.t}** (${i.aud.join(', ')}): ${i.p}`);
  const summary = `## Drop for ${today}\n\n${lines.join('\n')}\n\nModel: ${res.model}\n`;
  await appendFile(process.env.GITHUB_STEP_SUMMARY, summary);
}
