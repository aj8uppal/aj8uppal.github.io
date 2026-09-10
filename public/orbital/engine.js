/* ============================================================
   ORBITAL — engine.js
   Deterministic gravity simulation + level generation.
   Pure JS. No DOM. Runs identically in browser and node.
   ============================================================ */
(function (root) {
  'use strict';

  var WORLD        = 1000;      // the arena is a WORLD x WORLD square
  var DT           = 1 / 120;   // fixed physics step
  var GRAV_K       = 1150;      // gm = GRAV_K * r^2
  var GOAL_R       = 30;
  var GOAL_CAPTURE = 40;
  var GOAL_GM      = 110000;    // the wormhole tugs, gently
  var STAR_R       = 13;
  var STAR_PICKUP  = 44;
  var OUT_MARGIN   = 18;
  var MAX_FLIGHT   = 12;        // seconds before a shot fizzles out
  var LAUNCH_RING  = 396;       // launch pad sits on this radius from centre
  var SPEED_MIN    = 145;
  var SPEED_MAX    = 335;

  /* ---------------- deterministic rng ---------------- */

  function hashStr(str) {
    var h = 1779033703 ^ str.length;
    for (var i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      h ^= h >>> 16;
      return h >>> 0;
    };
  }

  function mulberry32(a) {
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function Rng(seed) {
    var seeder = hashStr(String(seed));
    var next = mulberry32(seeder());
    next(); next(); next();
    this.next = next;
  }
  Rng.prototype.range  = function (a, b) { return a + (b - a) * this.next(); };
  Rng.prototype.int    = function (a, b) { return Math.floor(a + (b - a + 1) * this.next()); };
  Rng.prototype.pick   = function (a)    { return a[Math.min(a.length - 1, Math.floor(this.next() * a.length))]; };
  Rng.prototype.chance = function (p)    { return this.next() < p; };

  /* ---------------- worlds & bodies ---------------- */

  var PLANET_TYPES = [
    { name: 'Ember',    hue: 18,  glow: '#ff9d55' },
    { name: 'Cinder',   hue: 355, glow: '#ff6f6a' },
    { name: 'Aurum',    hue: 44,  glow: '#ffd27a' },
    { name: 'Verdant',  hue: 152, glow: '#5fe8b4' },
    { name: 'Tethys',   hue: 188, glow: '#5cd9f5' },
    { name: 'Cobalt',   hue: 216, glow: '#77a8ff' },
    { name: 'Amethyst', hue: 274, glow: '#b48cff' },
    { name: 'Rosalind', hue: 328, glow: '#ff92c8' }
  ];

  /* ---------------- physics ---------------- */

  var _ax = 0, _ay = 0;

  function accel(x, y, bodies) {
    var ax = 0, ay = 0;
    for (var i = 0; i < bodies.length; i++) {
      var b = bodies[i];
      var dx = b.x - x, dy = b.y - y;
      var d2 = dx * dx + dy * dy;
      if (d2 < b.soft) d2 = b.soft;
      var inv = b.gm / (d2 * Math.sqrt(d2));
      ax += dx * inv;
      ay += dy * inv;
    }
    _ax = ax; _ay = ay;
  }

  // One velocity-Verlet step, in place. `s` = {x,y,vx,vy}
  function integrate(s, bodies) {
    accel(s.x, s.y, bodies);
    var ax = _ax, ay = _ay;
    s.x += s.vx * DT + 0.5 * ax * DT * DT;
    s.y += s.vy * DT + 0.5 * ay * DT * DT;
    accel(s.x, s.y, bodies);
    s.vx += 0.5 * (ax + _ax) * DT;
    s.vy += 0.5 * (ay + _ay) * DT;
  }

  /* Simulate a whole shot.
     Returns { path (flat xy), times, speeds, outcome, turn, minGap, gotStars, t } */
  function simulate(o) {
    var planets = o.planets;
    var goal    = o.goal || null;
    var stars   = o.stars || null;
    var maxT    = o.maxT || MAX_FLIGHT;
    var stride  = o.stride || 3;
    var bodies  = goal ? planets.concat([goal]) : planets;

    var s = { x: o.x0, y: o.y0, vx: o.vx0, vy: o.vy0 };
    var path = [s.x, s.y], times = [0], speeds = [Math.sqrt(s.vx * s.vx + s.vy * s.vy)];
    var t = 0, step = 0;
    var outcome = 'timeout';
    var turn = 0, prevAng = Math.atan2(s.vy, s.vx);
    var minGap = Infinity;
    var got = stars ? new Array(stars.length).fill(false) : null;

    while (t < maxT) {
      integrate(s, bodies);
      t += DT; step++;

      var ang = Math.atan2(s.vy, s.vx);
      var d = ang - prevAng;
      while (d >  Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      turn += Math.abs(d);
      prevAng = ang;

      if (stars) {
        for (var i = 0; i < stars.length; i++) {
          if (got[i]) continue;
          var sdx = stars[i].x - s.x, sdy = stars[i].y - s.y;
          if (sdx * sdx + sdy * sdy < STAR_PICKUP * STAR_PICKUP) got[i] = true;
        }
      }

      var crashed = false;
      for (var p = 0; p < planets.length; p++) {
        var pl = planets[p];
        var pd = Math.sqrt((pl.x - s.x) * (pl.x - s.x) + (pl.y - s.y) * (pl.y - s.y)) - pl.r;
        if (pd < minGap) minGap = pd;
        if (pd < 0) crashed = true;
      }

      if (goal) {
        var gdx = goal.x - s.x, gdy = goal.y - s.y;
        if (gdx * gdx + gdy * gdy < GOAL_CAPTURE * GOAL_CAPTURE) {
          path.push(s.x, s.y); times.push(t); speeds.push(Math.sqrt(s.vx * s.vx + s.vy * s.vy));
          outcome = 'goal';
          break;
        }
      }
      if (crashed) { outcome = 'crash'; break; }
      if (s.x < -OUT_MARGIN || s.x > WORLD + OUT_MARGIN ||
          s.y < -OUT_MARGIN || s.y > WORLD + OUT_MARGIN) { outcome = 'escape'; break; }

      if (step % stride === 0) {
        path.push(s.x, s.y); times.push(t); speeds.push(Math.sqrt(s.vx * s.vx + s.vy * s.vy));
      }
    }
    return { path: path, times: times, speeds: speeds, outcome: outcome,
             turn: turn, minGap: minGap, gotStars: got, t: t };
  }

  /* ---------------- level generation ----------------
     Levels are grown from a *known* trajectory, so every puzzle
     is guaranteed to have a three-star solution.               */

  function placeStars(sim, launch, goal, planets) {
    var n = sim.times.length;
    if (n < 20) return null;
    var cum = new Float64Array(n);
    for (var i = 1; i < n; i++) {
      var dx = sim.path[i * 2] - sim.path[(i - 1) * 2];
      var dy = sim.path[i * 2 + 1] - sim.path[(i - 1) * 2 + 1];
      cum[i] = cum[i - 1] + Math.sqrt(dx * dx + dy * dy);
    }
    var total = cum[n - 1];
    if (total < 820) return null;

    var combos = [[0.24, 0.52, 0.80], [0.18, 0.48, 0.78], [0.30, 0.58, 0.84], [0.14, 0.50, 0.86]];
    for (var c = 0; c < combos.length; c++) {
      var pts = [], ok = true;
      for (var k = 0; k < 3; k++) {
        var target = total * combos[c][k];
        var lo = 0, hi = n - 1;
        while (lo < hi) { var mid = (lo + hi) >> 1; if (cum[mid] < target) lo = mid + 1; else hi = mid; }
        pts.push({ x: sim.path[lo * 2], y: sim.path[lo * 2 + 1] });
      }
      for (var j = 0; j < 3 && ok; j++) {
        var st = pts[j];
        if (st.x < 64 || st.x > WORLD - 64 || st.y < 64 || st.y > WORLD - 64) { ok = false; break; }
        if (Math.hypot(st.x - launch.x, st.y - launch.y) < 140) { ok = false; break; }
        if (Math.hypot(st.x - goal.x,   st.y - goal.y)   < 105) { ok = false; break; }
        for (var q = 0; q < j; q++) if (Math.hypot(st.x - pts[q].x, st.y - pts[q].y) < 135) { ok = false; break; }
        for (var pp = 0; pp < planets.length && ok; pp++) {
          if (Math.hypot(st.x - planets[pp].x, st.y - planets[pp].y) < planets[pp].r + 28) ok = false;
        }
      }
      if (ok) return pts;
    }
    return null;
  }

  var MIN_TURN = [0, 0.80, 1.00, 1.20, 1.35];

  function buildLevel(seed, difficulty, tries) {
    var rng = new Rng(seed);
    var minTurn = MIN_TURN[Math.min(4, difficulty)] || 0.8;

    for (var attempt = 0; attempt < (tries || 700); attempt++) {
      var la = rng.range(0, Math.PI * 2);
      var launch = { x: WORLD / 2 + Math.cos(la) * LAUNCH_RING,
                     y: WORLD / 2 + Math.sin(la) * LAUNCH_RING };

      // --- scatter planets
      var planets = [], typePool = PLANET_TYPES.slice(), placedAll = true;
      for (var i = 0; i < difficulty; i++) {
        var placed = null;
        for (var k = 0; k < 70; k++) {
          var r = rng.range(44, 92);
          var a = rng.range(0, Math.PI * 2);
          var d = rng.range(50, 318);
          var cx = WORLD / 2 + Math.cos(a) * d, cy = WORLD / 2 + Math.sin(a) * d;
          if (Math.hypot(cx - launch.x, cy - launch.y) < r + 235) continue;
          var clash = false;
          for (var q = 0; q < planets.length; q++) {
            if (Math.hypot(cx - planets[q].x, cy - planets[q].y) < r + planets[q].r + 132) { clash = true; break; }
          }
          if (clash) continue;
          var ti = Math.floor(rng.next() * typePool.length) % typePool.length;
          var type = typePool.splice(ti, 1)[0] || PLANET_TYPES[0];
          placed = { x: cx, y: cy, r: r, gm: GRAV_K * r * r, soft: r * r,
                     hue: type.hue, glow: type.glow, name: type.name,
                     spin: rng.range(-0.22, 0.22), tilt: rng.range(0, Math.PI * 2) };
          break;
        }
        if (!placed) { placedAll = false; break; }
        planets.push(placed);
      }
      if (!placedAll) continue;

      // --- hunt for a shot worth building a puzzle around
      var toCentre = Math.atan2(WORLD / 2 - launch.y, WORLD / 2 - launch.x);
      for (var s = 0; s < 110; s++) {
        var aim   = toCentre + rng.range(-1.15, 1.15);
        var speed = rng.range(SPEED_MIN + 10, SPEED_MAX - 15);
        var vx0 = Math.cos(aim) * speed, vy0 = Math.sin(aim) * speed;

        var first = simulate({ x0: launch.x, y0: launch.y, vx0: vx0, vy0: vy0,
                               planets: planets, maxT: 9, stride: 3 });
        if (first.outcome === 'crash') continue;
        if (first.turn < minTurn) continue;
        if (first.minGap > 200) continue;          // must actually graze some gravity well
        var n = first.times.length;
        if (n < 45) continue;

        // --- pick a wormhole site along that arc
        var goal = null;
        var fracs = [0.94, 0.86, 0.78, 0.70, 0.60, 0.50];
        for (var f = 0; f < fracs.length; f++) {
          var idx = Math.floor((n - 1) * fracs[f]);
          var gx = first.path[idx * 2], gy = first.path[idx * 2 + 1];
          if (gx < 96 || gx > WORLD - 96 || gy < 96 || gy > WORLD - 96) continue;
          if (Math.hypot(gx - launch.x, gy - launch.y) < 340) continue;
          var near = false;
          for (var pj = 0; pj < planets.length; pj++) {
            if (Math.hypot(gx - planets[pj].x, gy - planets[pj].y) < planets[pj].r + 108) { near = true; break; }
          }
          if (near) continue;
          goal = { x: gx, y: gy, r: GOAL_R, gm: GOAL_GM, soft: 62 * 62 };
          break;
        }
        if (!goal) continue;

        // --- re-simulate WITH the wormhole's pull; this is the real solution
        var solved = simulate({ x0: launch.x, y0: launch.y, vx0: vx0, vy0: vy0,
                                planets: planets, goal: goal, maxT: 11, stride: 2 });
        if (solved.outcome !== 'goal' || solved.t < 1.35) continue;

        var stars = placeStars(solved, launch, goal, planets);
        if (!stars) continue;

        // --- final proof: this exact shot collects all three
        var proof = simulate({ x0: launch.x, y0: launch.y, vx0: vx0, vy0: vy0,
                               planets: planets, goal: goal, stars: stars, maxT: 11, stride: 2 });
        if (proof.outcome !== 'goal') continue;
        if (proof.gotStars.indexOf(false) !== -1) continue;

        return {
          seed: String(seed),
          difficulty: difficulty,
          launch: launch,
          launchAngle: toCentre,
          planets: planets,
          goal: goal,
          stars: stars.map(function (p) { return { x: p.x, y: p.y, r: STAR_R }; }),
          solution: { aim: aim, speed: speed, time: proof.t },
          searchAttempts: attempt + 1
        };
      }
    }
    return null;
  }

  function makeLevel(seed, difficulty) {
    for (var d = difficulty; d >= 1; d--) {
      var lv = buildLevel(seed + '|d' + d, d, 700);
      if (lv) return lv;
    }
    // never observed in testing, but never ship a dead end
    return buildLevel(seed + '|fallback', 1, 4000) || buildLevel('orbital-safe-harbour', 1, 4000);
  }

  /* ---------------- daily puzzle ---------------- */

  var EPOCH = Date.UTC(2026, 0, 1);
  // Sun .. Sat — the weekend is where the hard slingshots live
  var WEEK_DIFFICULTY = [4, 1, 2, 2, 3, 3, 4];

  function localDayIndex(date) {
    var d = date || new Date();
    var t = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
    return Math.round((t - EPOCH) / 86400000);
  }
  function dailyInfo(date) {
    var d = date || new Date();
    var n = localDayIndex(d);
    return {
      number: n,
      seed: 'orbital-daily-' + n,
      difficulty: WEEK_DIFFICULTY[d.getDay()],
      dateKey: d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
    };
  }
  function msUntilTomorrow(date) {
    var d = date || new Date();
    var t = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 0, 0, 0, 0);
    return t.getTime() - d.getTime();
  }

  root.ORBITAL_ENGINE = {
    WORLD: WORLD, DT: DT, GOAL_R: GOAL_R, GOAL_CAPTURE: GOAL_CAPTURE,
    STAR_R: STAR_R, STAR_PICKUP: STAR_PICKUP, OUT_MARGIN: OUT_MARGIN,
    MAX_FLIGHT: MAX_FLIGHT, SPEED_MIN: SPEED_MIN, SPEED_MAX: SPEED_MAX,
    PLANET_TYPES: PLANET_TYPES,
    Rng: Rng, hashStr: hashStr,
    accel: accel, integrate: integrate, simulate: simulate,
    makeLevel: makeLevel, buildLevel: buildLevel,
    dailyInfo: dailyInfo, localDayIndex: localDayIndex, msUntilTomorrow: msUntilTomorrow
  };
})(typeof globalThis !== 'undefined' ? globalThis : this);
