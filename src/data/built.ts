/**
 * Eleven more projects, and the page at /built that holds them.
 *
 * Three lead: Eyeshot, BeatLayer and Voidreach are the ones a person might
 * send to another person, and they get the room that implies. The other eight
 * are a grid. That is the only ranking on the page, and it is a judgement,
 * not a metric.
 *
 * Each entry owns one accent. They are eleven stops around the wheel rather
 * than eleven shades of one colour, because the whole risk of a page like this
 * is that a reader comes away remembering "a lot of apps" and not one of them.
 * The accent is used three times per card - a hairline, the numeral, the arrow -
 * and never as a fill, so eleven of them in a column is a set and not a
 * fairground. Every one clears 4.6:1 on --ink-2-hi, the lightest ground a card ever
 * stands on, so the accent is safe at any size anywhere on the card.
 */

/** How you can reach it, which is not the same question as whether it works. */
export type Reach =
  | 'open' /* a URL, and it runs */
  | 'install' /* you have to put it somewhere first */
  | 'read'; /* the work is finished; what is published is the write-up */

export interface Built {
  key: string;
  /** The three that lead the page. Everything else is the grid. */
  featured?: true;
  name: string;
  /** One word for the shelf it belongs on. */
  kind: string;
  reach: Reach;
  reachLabel: string;
  href: string;
  cta: string;
  /** The app in one sentence, in its own voice. */
  what: string;
  /** The thing about it worth knowing that the first sentence had no room for. */
  how: string;
  /** Stack, joined with middots by the page. */
  k: string;
  accent: string;
  /** src/assets/built-<key>.webp, written by scripts/capture-built.mjs. */
  alt: string;
  /** What the capture is a picture of. Every one is a real running state. */
  cap: string;
}

export const built = {
  statement: 'Eleven more.',
  lead: 'Smaller than the seven on the main page, and finished. A daily eye test, a drum machine that plays under you, a space sandbox with other people in it, a shared sixty-second canvas, a graveyard for tabs. Nine open in a browser tab; none of them asks you to sign up.',
  /* The honest asterisk, said once, up front, rather than eleven times in
     eleven cards. */
  caveat:
    'Nothing here is a mockup. Every picture below is the app running, taken by a script that drives it into the state the picture shows.',
  facts: [
    { k: 'Projects', v: 'Eleven' },
    { k: 'Open in a browser', v: 'Nine' },
    { k: 'With other people in them', v: 'Two' },
    { k: 'Signups needed', v: 'None' },
  ],
} as const;

export const apps: Built[] = [
  {
    key: 'eyeshot',
    featured: true,
    name: 'Eyeshot',
    kind: 'Game',
    reach: 'open',
    reachLabel: 'Live',
    href: 'https://eyeshot.app/',
    cta: 'Play today’s five',
    what: 'Five tests of your eye a day. Draw a perfect circle. Tap the exact middle of a line. Stop a timer at ten seconds.',
    how: 'Everyone gets the same five, so the scores mean something against each other; the server re-scores your raw input with the same code the browser used, so the leaderboard is not a list of the most creative people. A new set at midnight.',
    k: 'Fastify · SQLite · Canvas · Fly.io',
    accent: '#85a9e0',
    alt: 'The Eyeshot angle event: a sheet of graph paper with one arm of an angle drawn on it and the target, 115 degrees, above.',
    cap: 'ANGLE — swing the second arm to exactly 115°',
  },
  {
    key: 'beatlayer',
    featured: true,
    name: 'BeatLayer',
    kind: 'Instrument',
    reach: 'open',
    reachLabel: 'Live',
    href: '/beatlayer/',
    cta: 'Open BeatLayer',
    what: 'Drop in a guitar take and it lays synthesised drums under it, in your tempo, on your downbeat.',
    how: 'It finds the beat in the audio you give it, so the grid lines up with the take rather than the take with a click. Every drum is synthesised in the browser — there are no samples to load and nothing to upload, and you can export the result as a stem.',
    k: 'Vite · React · TypeScript · Web Audio',
    accent: '#f2994a',
    alt: 'BeatLayer: a waveform pane above a step sequencer, with kick, snare and hat rows lit across one bar and a groove library down the right.',
    cap: 'The sequencer, with a straight-rock groove loaded',
  },
  {
    key: 'voidreach',
    featured: true,
    name: 'Voidreach',
    kind: 'Game',
    reach: 'open',
    reachLabel: 'Live',
    href: '/voidreach/',
    cta: 'Fly it',
    what: 'A first-person space sandbox in a browser tab. Sixty-four star systems, and you can dock at any of them.',
    how: 'Everything you can see is generated — there is not one asset file in the build. Fly solo from this page, or launch online and meet whoever else is out there on the same server.',
    k: 'Three.js · WebGL 2 · TypeScript · Node ws',
    accent: '#7fd8f0',
    alt: 'The Voidreach cockpit: a station and a moon ahead, contact markers with distances, and shield, hull and power gauges along the bottom.',
    cap: 'Docking approach at Helios Anchorage, Sol Ascendant',
  },
  {
    key: 'sixty-seconds',
    name: 'Sixty Seconds',
    kind: 'Multiplayer',
    reach: 'open',
    reachLabel: 'Live',
    href: 'https://sixty-seconds.fly.dev/',
    cta: 'Draw with whoever is there',
    what: 'Everyone on the page draws the same canvas. After sixty seconds the round closes, gets a name, and becomes a replay link. Then a new sixty seconds starts.',
    how: 'A finished round is one JSON file, and it is enough to redraw the whole thing from nothing — the PNG, the scrubbable replay and the share card are all rendered from it in your browser. The server is Python, standard library only, websockets included.',
    k: 'Python stdlib · WebSocket · Canvas · Fly.io',
    accent: '#ff7e8c',
    alt: 'The Sixty Seconds canvas mid-round: hills, a sun and two birds drawn in orange and blue by two people, with both cursors labelled and thirteen seconds left.',
    cap: 'Two browsers, one round — the capture script joins twice and draws',
  },
  {
    key: 'tab-graveyard',
    name: 'Tab Graveyard',
    kind: 'Extension',
    reach: 'install',
    reachLabel: 'Unpacked',
    href: '/tab-graveyard/',
    cta: 'See your headstone',
    what: 'Closes the tabs you were never going to read, and hands you a headstone with the number on it.',
    how: 'Burying writes every tab to storage before it closes it, so nothing is deleted: the graveyard stays searchable forever, any tab comes back with one click, and the whole batch is undoable for ten minutes. Pinned and active tabs are never touched.',
    k: 'Chrome MV3 · Canvas · two permissions',
    accent: '#c8b98f',
    alt: 'The Tab Graveyard landing page: a headstone card reading “here lie 61, tabs buried this week”, beside a slider and the epitaph it earns.',
    cap: 'The card the extension draws, running on the page — drag the slider',
  },
  {
    key: 'run-or-not',
    name: 'Run or Not',
    kind: 'Tool',
    reach: 'open',
    reachLabel: 'Live',
    href: '/run-or-not/',
    cta: 'Ask about right now',
    what: 'One screen, one verdict: should you run outside right now?',
    how: 'Heat, wind, rain, air quality, pollen and the light, weighed against thresholds you can move, and turned into one word and the two numbers that decided it. If the answer is no, it tells you the hour today when it turns yes.',
    k: 'Open-Meteo · vanilla JS · PWA',
    accent: '#3ddc84',
    alt: 'Run or Not showing GO in green over “Wind 9 mph, AQI 38, sunset in 2h 34m”, with six condition chips underneath.',
    cap: 'Sydney, live conditions at the moment of capture',
  },
  {
    key: 'sleep-debt-ledger',
    name: 'Sleep Debt Ledger',
    kind: 'Tool',
    reach: 'open',
    reachLabel: 'Live',
    href: '/sleep-debt-ledger/',
    cta: 'Open the ledger',
    what: 'Type when you slept. See the running balance, and the day it clears.',
    how: 'Fourteen nights on the books, and the nights you did not log are not counted as debt — one night gives you a real number in twenty seconds and silence never punishes you. The payoff date rolls the window forward, which is why you can go solvent while sleeping exactly your target.',
    k: 'localStorage · no build step · PWA',
    accent: '#f2c14e',
    alt: 'The Sleep Debt Ledger: a balance of minus sixteen hours twenty-eight minutes, the line “solvent by Sep 13 if you sleep 8h 30m”, and twelve nightly bars.',
    cap: 'Twelve nights logged, and the date the balance clears',
  },
  {
    key: 'ai-wrapped',
    name: 'AI Wrapped',
    kind: 'Toy',
    reach: 'open',
    reachLabel: 'Live',
    href: '/ai-wrapped/',
    cta: 'Wrap your year',
    what: 'Drop in your chat export and get your year in prompts: words written, the hour you are worst at, and the number of times you said please.',
    how: 'One HTML file, no dependencies and no network calls of any kind. Your export is read with FileReader, counted in memory, and never leaves the tab — open it from disk with the wifi off and it still works.',
    k: 'One file · no dependencies · no server',
    accent: '#eb81d5',
    alt: 'An AI Wrapped card: 627,257 in yellow on a violet-to-pink gradient, over the line “words you wrote to an AI”.',
    cap: 'The opening card, on the built-in sample export',
  },
  {
    key: 'playlist-from-photo',
    name: 'Playlist From a Photo',
    kind: 'Toy',
    reach: 'open',
    reachLabel: 'Demo',
    href: '/playlist-from-photo/',
    cta: 'Make a poster',
    what: 'Upload one photo. Get twelve songs that feel like it, as a poster you can post.',
    how: 'Claude reads the light, the era and the mood — never the subject — and proposes titles; every one is then looked up in the Apple catalogue and dropped if it does not come back. An invented song fails the lookup and never reaches the poster. This copy has no server, so its twelve are fixed; the crop, the palette and the poster are still made from your photo.',
    k: 'Claude Opus vision · iTunes catalogue · Canvas',
    accent: '#c495e0',
    alt: 'A finished poster: a dusk coastline above the title “Long Drive, No Radio” and twelve numbered tracks in two columns.',
    cap: 'A poster, made from a photograph the capture script painted for it',
  },
  {
    key: 'lifetrack',
    name: 'LifeTrack',
    kind: 'Tool',
    reach: 'open',
    reachLabel: 'Live',
    href: '/lifetrack/',
    cta: 'Open LifeTrack',
    what: 'Tasks, projects, habits, workouts, the calendar, the people you keep meaning to see — one app, and none of it leaves your browser.',
    how: 'No build step and no framework: plain ES modules, a vendored Preact, IndexedDB, and a service worker so it installs to a home screen and opens on a plane. Every mutation is undoable, because a tracker you are afraid to touch stops being a tracker.',
    k: 'ES modules · Preact · IndexedDB · PWA',
    accent: '#a19df7',
    alt: 'LifeTrack’s Today view: a sidebar of sections, four counters across the top, and columns of tasks and habits for the day.',
    cap: 'The Today view, on the app’s own sample data',
  },
  {
    key: 'papertrader',
    name: 'Paper Trader',
    kind: 'Research',
    reach: 'read',
    reachLabel: 'Memo',
    href: '/papertrader/',
    cta: 'Read the memo',
    what: 'A backtester, and seven passes of research through it looking for a strategy that more often than not makes money.',
    how: 'The answer was a monthly momentum-and-trend allocation across nine ETFs with a crash canary: 9.0% CAGR, −19.3% worst drawdown, profitable in 87% of rolling years against SPY’s 83% and its −55%. It has been trading a paper account since. The app itself runs on my machine, against a real account; what is published is the argument.',
    k: 'Python · pandas · Yahoo daily bars',
    accent: '#41b8b8',
    alt: 'The research memo: a headline claim, four stat panels, and a log-scale growth chart running 2007 to 2026 with the strategy, SPY and a 60/40 mix overlaid.',
    cap: 'Growth of $100,000, log scale, against the two benchmarks',
  },
];
