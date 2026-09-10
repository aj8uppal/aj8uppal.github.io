/* ============================================================
   ORBITAL — game.js
   Rendering, input, feel. Physics comes from engine.js.
   ============================================================ */
(function () {
  'use strict';

  var E = window.ORBITAL_ENGINE;
  var W = E.WORLD;
  var TAU = Math.PI * 2;

  var $ = function (s) { return document.querySelector(s); };
  var canvas = $('#stage');
  var ctx = canvas.getContext('2d');

  /* ---------------- storage ---------------- */

  var Store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    raw: function (k, d) { try { var v = localStorage.getItem(k); return v == null ? d : v; } catch (e) { return d; } },
    setRaw: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  function loadStats() {
    var s = Store.get('orbital.stats.v1', null);
    if (!s || typeof s !== 'object') s = {};
    s.played = s.played || 0; s.wins = s.wins || 0;
    s.streak = s.streak || 0; s.maxStreak = s.maxStreak || 0;
    s.perfect = s.perfect || 0; s.results = s.results || {}; s.last = s.last || null;
    return s;
  }
  var stats = loadStats();
  function saveStats() { Store.set('orbital.stats.v1', stats); }

  /* ---------------- sound ---------------- */

  var Sound = (function () {
    var ac = null, master = null, padGain = null, noiseBuf = null;
    var enabled = Store.raw('orbital.sound', 'on') !== 'off';

    function ensure() {
      if (ac) { if (ac.state === 'suspended') ac.resume(); return ac; }
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { ac = new AC(); } catch (e) { return null; }
      master = ac.createGain();
      master.gain.value = enabled ? 0.85 : 0;
      master.connect(ac.destination);

      var len = ac.sampleRate * 1.2;
      noiseBuf = ac.createBuffer(1, len, ac.sampleRate);
      var d = noiseBuf.getChannelData(0);
      for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

      pad();
      return ac;
    }

    function pad() {
      padGain = ac.createGain(); padGain.gain.value = 0;
      var f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 460; f.Q.value = 0.7;
      padGain.connect(f); f.connect(master);
      var freqs = [55, 82.41, 110, 164.81, 220];
      var vols  = [0.42, 0.2, 0.26, 0.1, 0.05];
      for (var i = 0; i < freqs.length; i++) {
        var o = ac.createOscillator();
        o.type = i % 2 ? 'sine' : 'triangle';
        o.frequency.value = freqs[i] * (1 + (i - 2) * 0.0018);
        var g = ac.createGain(); g.gain.value = vols[i];
        o.connect(g); g.connect(padGain); o.start();
        var lfo = ac.createOscillator();
        lfo.frequency.value = 0.021 + i * 0.0143;
        var lg = ac.createGain(); lg.gain.value = vols[i] * 0.55;
        lfo.connect(lg); lg.connect(g.gain); lfo.start();
      }
      padGain.gain.setValueAtTime(0, ac.currentTime);
      padGain.gain.linearRampToValueAtTime(0.05, ac.currentTime + 7);
    }

    function tone(o) {
      if (!ac || !enabled) return;
      var t = ac.currentTime + (o.delay || 0);
      var osc = ac.createOscillator();
      osc.type = o.type || 'sine';
      osc.frequency.setValueAtTime(o.f0, t);
      if (o.f1) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.f1), t + o.dur);
      var g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t + (o.atk || 0.008));
      g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
      var node = g;
      if (o.filter) {
        var bp = ac.createBiquadFilter();
        bp.type = o.filter; bp.frequency.value = o.fc || 900; bp.Q.value = o.q || 1;
        g.connect(bp); node = bp;
      }
      node.connect(master);
      osc.connect(g); osc.start(t); osc.stop(t + o.dur + 0.05);
    }

    function noise(o) {
      if (!ac || !enabled || !noiseBuf) return;
      var t = ac.currentTime + (o.delay || 0);
      var src = ac.createBufferSource(); src.buffer = noiseBuf;
      var bp = ac.createBiquadFilter();
      bp.type = o.filter || 'bandpass';
      bp.frequency.setValueAtTime(o.fc, t);
      if (o.fc1) bp.frequency.exponentialRampToValueAtTime(Math.max(40, o.fc1), t + o.dur);
      bp.Q.value = o.q || 1.1;
      var g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(o.vol || 0.2, t + (o.atk || 0.01));
      g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
      src.connect(bp); bp.connect(g); g.connect(master);
      src.start(t); src.stop(t + o.dur + 0.05);
    }

    var PENT = [523.25, 587.33, 698.46, 783.99, 987.77, 1174.66];

    return {
      ensure: ensure,
      isOn: function () { return enabled; },
      toggle: function () {
        enabled = !enabled;
        Store.setRaw('orbital.sound', enabled ? 'on' : 'off');
        if (ac && master) master.gain.linearRampToValueAtTime(enabled ? 0.85 : 0, ac.currentTime + 0.25);
        if (enabled) ensure();
        return enabled;
      },
      launch: function (p) {
        ensure();
        noise({ fc: 300 + p * 900, fc1: 120, dur: 0.5, vol: 0.16, q: 0.8 });
        tone({ f0: 180 + p * 160, f1: 60, dur: 0.42, vol: 0.14, type: 'triangle' });
      },
      star: function (i) {
        ensure();
        tone({ f0: PENT[i % PENT.length], dur: 0.42, vol: 0.15, type: 'triangle' });
        tone({ f0: PENT[i % PENT.length] * 2, dur: 0.3, vol: 0.06, type: 'sine', delay: 0.015 });
      },
      crash: function () {
        ensure();
        noise({ fc: 900, fc1: 90, dur: 0.55, vol: 0.2, q: 0.6, filter: 'lowpass' });
        tone({ f0: 96, f1: 34, dur: 0.5, vol: 0.2, type: 'sine' });
      },
      fizzle: function () {
        ensure();
        tone({ f0: 340, f1: 90, dur: 0.6, vol: 0.09, type: 'sine' });
      },
      win: function () {
        ensure();
        var seq = [523.25, 659.25, 783.99, 1046.5, 1318.5];
        for (var i = 0; i < seq.length; i++) {
          tone({ f0: seq[i], dur: 0.75, vol: 0.14, type: 'triangle', delay: i * 0.085 });
          tone({ f0: seq[i] * 2, dur: 0.5, vol: 0.05, type: 'sine', delay: i * 0.085 + 0.02 });
        }
        noise({ fc: 2600, fc1: 5200, dur: 1.1, vol: 0.05, q: 0.5, delay: 0.05 });
      },
      blip: function () { ensure(); tone({ f0: 880, dur: 0.07, vol: 0.06, type: 'square' }); }
    };
  })();

  function buzz(ms) { if (navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) {} } }

  /* ---------------- layout ---------------- */

  var view = { w: 0, h: 0, dpr: 1, size: 0, ox: 0, oy: 0, scale: 1 };

  function layout() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    var w = Math.round(window.innerWidth), h = Math.round(window.innerHeight);
    view.w = w; view.h = h; view.dpr = dpr;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var sat = ($('#satProbe') || {}).offsetHeight || 0;
    var sab = ($('#sabProbe') || {}).offsetHeight || 0;
    var top = 78 + sat, bottom = 104 + sab;
    var avail = h - top - bottom;
    var size = Math.min(w - 14, avail);
    if (size < 300) { size = Math.min(w - 12, h - top - 60); }
    size = Math.max(200, size);
    view.size = size;
    view.ox = (w - size) / 2;
    view.oy = top + Math.max(0, (avail - size) / 2);
    view.scale = size / W;
    buildSky();
  }

  function X(x) { return view.ox + x * view.scale; }
  function Y(y) { return view.oy + y * view.scale; }
  function S(v) { return v * view.scale; }

  /* ---------------- starfield (pre-rendered) ---------------- */

  var sky = null, twinklers = [];
  var NEB = [[92, 48, 186], [26, 92, 196], [176, 52, 140], [26, 148, 156], [200, 118, 44]];

  function buildSky() {
    var pad = 40;
    var w = view.w + pad * 2, h = view.h + pad * 2;
    if (w <= 0 || h <= 0) return;
    var c = document.createElement('canvas');
    var dpr = Math.min(view.dpr, 2);
    c.width = Math.round(w * dpr); c.height = Math.round(h * dpr);
    var g = c.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);

    var bg = g.createLinearGradient(0, 0, w * 0.3, h);
    bg.addColorStop(0, '#06070f');
    bg.addColorStop(0.55, '#080a18');
    bg.addColorStop(1, '#0b0818');
    g.fillStyle = bg; g.fillRect(0, 0, w, h);

    var rng = new E.Rng((state.level ? state.level.seed : 'sky') + '|sky' + Math.round(view.w / 40));

    g.globalCompositeOperation = 'screen';
    for (var i = 0; i < 4; i++) {
      var col = NEB[Math.floor(rng.next() * NEB.length) % NEB.length];
      var cx = rng.range(-0.1, 1.1) * w, cy = rng.range(-0.1, 1.1) * h;
      var rad = rng.range(0.35, 0.95) * Math.max(w, h);
      var ng = g.createRadialGradient(cx, cy, 0, cx, cy, rad);
      var a = rng.range(0.07, 0.16);
      ng.addColorStop(0, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + a.toFixed(3) + ')');
      ng.addColorStop(0.45, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + (a * 0.35).toFixed(3) + ')');
      ng.addColorStop(1, 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0)');
      g.fillStyle = ng; g.fillRect(0, 0, w, h);
    }
    g.globalCompositeOperation = 'source-over';

    var n = Math.min(1400, Math.round(w * h / 3400));
    twinklers = [];
    for (var s = 0; s < n; s++) {
      var depth = rng.next();
      var sx = rng.next() * w, sy = rng.next() * h;
      var r = 0.35 + depth * depth * 1.35;
      var a2 = 0.14 + rng.next() * 0.6;
      var tint = rng.chance(0.14) ? rng.pick(['#9fd6ff', '#c9b6ff', '#ffe0b0', '#a8fff0']) : '#ffffff';
      g.globalAlpha = a2;
      g.fillStyle = tint;
      if (r < 0.8) { g.fillRect(sx, sy, 1, 1); }
      else { g.beginPath(); g.arc(sx, sy, r, 0, TAU); g.fill(); }
      if (r > 1.35 && twinklers.length < 90) {
        twinklers.push({ x: sx - pad, y: sy - pad, r: r, a: a2, sp: rng.range(0.5, 2.1), ph: rng.range(0, TAU), c: tint });
      }
    }
    g.globalAlpha = 1;

    // a few distant "bright" stars with diffraction spikes
    for (var b = 0; b < 7; b++) {
      var bx = rng.next() * w, by = rng.next() * h, br = rng.range(1.6, 2.8);
      var bg2 = g.createRadialGradient(bx, by, 0, bx, by, br * 9);
      bg2.addColorStop(0, 'rgba(255,255,255,0.5)');
      bg2.addColorStop(0.2, 'rgba(180,220,255,0.16)');
      bg2.addColorStop(1, 'rgba(180,220,255,0)');
      g.fillStyle = bg2; g.beginPath(); g.arc(bx, by, br * 9, 0, TAU); g.fill();
      g.strokeStyle = 'rgba(255,255,255,0.14)'; g.lineWidth = 0.7;
      g.beginPath();
      g.moveTo(bx - br * 7, by); g.lineTo(bx + br * 7, by);
      g.moveTo(bx, by - br * 7); g.lineTo(bx, by + br * 7);
      g.stroke();
    }

    sky = { canvas: c, pad: pad, w: w, h: h };
  }

  /* ---------------- state ---------------- */

  var SUFFIX = ['Drift', 'Passage', 'Slingshot', 'Corridor', 'Descent', 'Crossing',
                'Cradle', 'Vault', 'Trace', 'Lantern', 'Threshold', 'Gyre', 'Reach', 'Hollow'];

  var state = {
    mode: 'daily',
    daily: null,
    level: null,
    name: '',
    bodies: [],
    phase: 'aim',            // aim | flight | crash | lost | winning | done
    attempts: 0,
    collected: [false, false, false],
    comet: { x: 0, y: 0, vx: 0, vy: 0 },
    trail: [],
    ghosts: [],
    aim: { angle: 0, power: 0.5, dragging: false },
    flightT: 0,
    speedSamples: [],
    lastSample: 0,
    particles: [],
    shake: 0,
    flash: 0,
    phaseT: 0,
    winT: 0,
    endless: { cleared: 0, stars: 0 },
    solved: false,
    t: 0
  };

  function levelName(level) {
    var rng = new E.Rng(level.seed + '|name');
    var p = level.planets[Math.floor(rng.next() * level.planets.length) % level.planets.length];
    return p.name + ' ' + rng.pick(SUFFIX);
  }

  function loadLevel(level) {
    state.level = level;
    state.name = levelName(level);
    state.bodies = level.planets.concat([level.goal]);
    state.attempts = 0;
    state.collected = [false, false, false];
    state.ghosts = [];
    state.particles = [];
    state.aim = { angle: level.launchAngle, power: 0.52, dragging: false };
    state.solved = false;
    for (var i = 0; i < level.stars.length; i++) { level.stars[i].taken = false; level.stars[i].pop = 0; }
    resetShot(true);
    buildSky();
    paintHud();
  }

  function resetShot(silent) {
    var L = state.level;
    if (state.trail.length > 8 && !silent) {
      state.ghosts.push(state.trail.slice());
      if (state.ghosts.length > 4) state.ghosts.shift();
    }
    state.comet.x = L.launch.x; state.comet.y = L.launch.y;
    state.comet.vx = 0; state.comet.vy = 0;
    state.trail = [];
    state.speedSamples = [];
    state.flightT = 0;
    state.phase = 'aim';
    state.phaseT = 0;
    state.winT = 0;
    for (var i = 0; i < L.stars.length; i++) { L.stars[i].taken = false; L.stars[i].pop = 0; }
    state.collected = [false, false, false];
    paintHud();
  }

  function aimVelocity() {
    var sp = E.SPEED_MIN + (E.SPEED_MAX - E.SPEED_MIN) * clamp(state.aim.power, 0, 1);
    return { vx: Math.cos(state.aim.angle) * sp, vy: Math.sin(state.aim.angle) * sp, sp: sp };
  }

  function launch() {
    var v = aimVelocity();
    state.comet.x = state.level.launch.x;
    state.comet.y = state.level.launch.y;
    state.comet.vx = v.vx; state.comet.vy = v.vy;
    state.trail = [state.comet.x, state.comet.y];
    state.speedSamples = [v.sp];
    state.lastSample = 0;
    state.flightT = 0;
    state.attempts++;
    state.phase = 'flight';
    state.phaseT = 0;
    burst(18, state.level.launch.x, state.level.launch.y, {
      speed: [40, 190], hue: 190, life: [0.25, 0.6], size: [1.2, 3],
      dir: state.aim.angle + Math.PI, spread: 0.9
    });
    Sound.launch(state.aim.power);
    buzz(12);
    paintHud();
  }

  /* ---------------- particles ---------------- */

  function burst(n, x, y, o) {
    o = o || {};
    for (var i = 0; i < n; i++) {
      var a = (o.dir != null) ? o.dir + (Math.random() - 0.5) * (o.spread || TAU) : Math.random() * TAU;
      var sp = rand(o.speed || [30, 160]);
      var life = rand(o.life || [0.3, 0.9]);
      state.particles.push({
        x: x, y: y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: life, max: life,
        size: rand(o.size || [1, 3]),
        hue: (o.hue == null ? 195 : o.hue) + (Math.random() - 0.5) * (o.hueSpread || 40),
        light: o.light || 70,
        drag: o.drag || 1.6,
        grav: o.grav || false
      });
    }
    if (state.particles.length > 700) state.particles.splice(0, state.particles.length - 700);
  }
  function rand(r) { return r[0] + (r[1] - r[0]) * Math.random(); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  function stepParticles(dt) {
    var P = state.particles;
    for (var i = P.length - 1; i >= 0; i--) {
      var p = P[i];
      p.life -= dt;
      if (p.life <= 0) { P.splice(i, 1); continue; }
      var damp = Math.exp(-p.drag * dt);
      p.vx *= damp; p.vy *= damp;
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }

  /* ---------------- flight ---------------- */

  function stepFlight(dt) {
    var L = state.level, c = state.comet;
    var steps = Math.min(Math.ceil(dt / E.DT), 14);
    for (var s = 0; s < steps; s++) {
      E.integrate(c, state.bodies);
      state.flightT += E.DT;

      state.trail.push(c.x, c.y);
      if (state.trail.length > 1500) state.trail.splice(0, state.trail.length - 1500);

      if (state.flightT - state.lastSample > 0.045) {
        state.lastSample = state.flightT;
        state.speedSamples.push(Math.sqrt(c.vx * c.vx + c.vy * c.vy));
      }

      // stars
      for (var i = 0; i < L.stars.length; i++) {
        var st = L.stars[i];
        if (st.taken) continue;
        var dx = st.x - c.x, dy = st.y - c.y;
        if (dx * dx + dy * dy < E.STAR_PICKUP * E.STAR_PICKUP) {
          st.taken = true; st.pop = 1;
          state.collected[i] = true;
          burst(26, st.x, st.y, { hue: 44, speed: [50, 210], life: [0.35, 0.8], size: [1, 3.2], light: 76 });
          Sound.star(countStars() - 1);
          buzz(9);
          state.flash = Math.max(state.flash, 0.12);
          paintHud();
        }
      }

      // wormhole
      var gdx = L.goal.x - c.x, gdy = L.goal.y - c.y;
      if (gdx * gdx + gdy * gdy < E.GOAL_CAPTURE * E.GOAL_CAPTURE) { win(); return; }

      // planets
      for (var p = 0; p < L.planets.length; p++) {
        var pl = L.planets[p];
        var px = pl.x - c.x, py = pl.y - c.y;
        if (px * px + py * py < pl.r * pl.r) { crash(pl); return; }
      }

      if (c.x < -E.OUT_MARGIN || c.x > W + E.OUT_MARGIN || c.y < -E.OUT_MARGIN || c.y > W + E.OUT_MARGIN) { fizzle(); return; }
      if (state.flightT > E.MAX_FLIGHT) { fizzle(); return; }
    }
  }

  function countStars() {
    var n = 0;
    for (var i = 0; i < state.collected.length; i++) if (state.collected[i]) n++;
    return n;
  }

  function crash(planet) {
    state.phase = 'crash';
    state.phaseT = 0;
    state.shake = 1;
    state.flash = 0.3;
    var c = state.comet;
    burst(64, c.x, c.y, { hue: planet ? planet.hue : 20, hueSpread: 70, speed: [60, 400], life: [0.35, 1.1], size: [1, 4], light: 66 });
    burst(22, c.x, c.y, { hue: 40, hueSpread: 30, speed: [20, 120], life: [0.6, 1.5], size: [2, 6], light: 80, drag: 2.6 });
    Sound.crash();
    buzz([16, 40, 22]);
    setHint('Burned up — resetting', true);
  }

  function fizzle() {
    state.phase = 'lost';
    state.phaseT = 0;
    var c = state.comet;
    burst(26, c.x, c.y, { hue: 195, speed: [10, 70], life: [0.6, 1.6], size: [1, 3], light: 74, drag: 2.4 });
    Sound.fizzle();
    setHint('Lost to the dark — resetting', true);
  }

  function win() {
    state.phase = 'winning';
    state.phaseT = 0;
    state.winT = 0;
    state.solved = true;
    state.flash = 0.42;
    Sound.win();
    buzz([12, 50, 12, 50, 24]);
    var g = state.level.goal;
    burst(90, g.x, g.y, { hue: 190, hueSpread: 120, speed: [80, 460], life: [0.5, 1.6], size: [1, 4], light: 74 });
    if (state.mode === 'daily') recordDaily();
    else { state.endless.cleared++; state.endless.stars += countStars(); }
  }

  /* ---------------- drawing helpers ---------------- */

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawArenaFrame(t) {
    var x = view.ox, y = view.oy, s = view.size, r = Math.min(26, s * 0.06);
    ctx.save();
    roundRect(x, y, s, s, r);
    var g = ctx.createRadialGradient(x + s / 2, y + s / 2, s * 0.1, x + s / 2, y + s / 2, s * 0.72);
    g.addColorStop(0, 'rgba(120,170,255,0.055)');
    g.addColorStop(1, 'rgba(120,170,255,0)');
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(150,200,255,0.16)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    // corner ticks
    ctx.strokeStyle = 'rgba(150,220,255,0.30)';
    ctx.lineWidth = 1.4;
    var L = Math.min(18, s * 0.05);
    var pts = [[x, y, 1, 1], [x + s, y, -1, 1], [x + s, y + s, -1, -1], [x, y + s, 1, -1]];
    for (var i = 0; i < 4; i++) {
      var p = pts[i];
      ctx.beginPath();
      ctx.moveTo(p[0] + p[2] * (r * 0.5 + L), p[1] + p[3] * r * 0.16);
      ctx.lineTo(p[0] + p[2] * r * 0.5, p[1] + p[3] * r * 0.16);
      ctx.moveTo(p[0] + p[2] * r * 0.16, p[1] + p[3] * (r * 0.5 + L));
      ctx.lineTo(p[0] + p[2] * r * 0.16, p[1] + p[3] * r * 0.5);
      ctx.stroke();
    }
  }

  function drawPolarGrid(t) {
    var cx = X(500), cy = Y(500);
    ctx.strokeStyle = 'rgba(140,190,255,0.045)';
    ctx.lineWidth = 1;
    for (var i = 1; i <= 4; i++) {
      ctx.beginPath(); ctx.arc(cx, cy, S(i * 118), 0, TAU); ctx.stroke();
    }
    ctx.save();
    ctx.translate(cx, cy); ctx.rotate(t * 0.03);
    for (var a = 0; a < 8; a++) {
      ctx.beginPath();
      ctx.moveTo(Math.cos(a * TAU / 8) * S(60), Math.sin(a * TAU / 8) * S(60));
      ctx.lineTo(Math.cos(a * TAU / 8) * S(478), Math.sin(a * TAU / 8) * S(478));
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlanet(p, t) {
    var cx = X(p.x), cy = Y(p.y), r = S(p.r);

    ctx.save();
    ctx.setLineDash([S(10), S(15)]);
    ctx.lineDashOffset = -t * S(18) * (p.spin > 0 ? 1 : -1);
    ctx.strokeStyle = 'hsla(' + p.hue + ',80%,70%,0.075)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, r * 2.05, 0, TAU); ctx.stroke();
    ctx.restore();

    ctx.globalCompositeOperation = 'screen';
    var gl = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 2.6);
    gl.addColorStop(0, 'hsla(' + p.hue + ',88%,62%,0.24)');
    gl.addColorStop(0.5, 'hsla(' + p.hue + ',88%,62%,0.06)');
    gl.addColorStop(1, 'hsla(' + p.hue + ',88%,62%,0)');
    ctx.fillStyle = gl; ctx.beginPath(); ctx.arc(cx, cy, r * 2.6, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    var bg = ctx.createRadialGradient(cx - r * 0.34, cy - r * 0.4, r * 0.05, cx, cy, r * 1.08);
    bg.addColorStop(0, 'hsl(' + p.hue + ',74%,74%)');
    bg.addColorStop(0.4, 'hsl(' + p.hue + ',64%,47%)');
    bg.addColorStop(0.78, 'hsl(' + p.hue + ',68%,22%)');
    bg.addColorStop(1, 'hsl(' + p.hue + ',72%,9%)');
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();

    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
    ctx.translate(cx, cy); ctx.rotate(p.tilt + t * p.spin * 0.06);
    for (var i = 0; i < 6; i++) {
      var yy = (-0.85 + 1.7 * (i + 0.5) / 6) * r;
      ctx.globalAlpha = 0.055 + 0.05 * ((i * 7) % 3);
      ctx.fillStyle = (i % 2) ? '#000000' : '#ffffff';
      ctx.beginPath();
      ctx.ellipse(0, yy, r * 1.15, r * (0.035 + 0.045 * ((i * 5) % 3)), 0, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    var sh = ctx.createRadialGradient(r * 0.6, r * 0.66, r * 0.06, r * 0.25, r * 0.3, r * 1.8);
    sh.addColorStop(0, 'rgba(0,0,0,0.66)');
    sh.addColorStop(0.6, 'rgba(0,0,0,0.28)');
    sh.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sh; ctx.fillRect(-r, -r, r * 2, r * 2);
    ctx.restore();

    ctx.strokeStyle = 'hsla(' + p.hue + ',100%,84%,0.5)';
    ctx.lineWidth = Math.max(0.7, r * 0.03);
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.985, Math.PI * 0.92, Math.PI * 1.98); ctx.stroke();

    ctx.globalCompositeOperation = 'screen';
    var at = ctx.createRadialGradient(cx, cy, r * 0.94, cx, cy, r * 1.2);
    at.addColorStop(0, 'hsla(' + p.hue + ',100%,76%,0)');
    at.addColorStop(0.35, 'hsla(' + p.hue + ',100%,76%,0.20)');
    at.addColorStop(1, 'hsla(' + p.hue + ',100%,76%,0)');
    ctx.fillStyle = at; ctx.beginPath(); ctx.arc(cx, cy, r * 1.2, 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawGoal(g, t) {
    var cx = X(g.x), cy = Y(g.y), r = S(g.r);
    var pulse = 0.9 + 0.1 * Math.sin(t * 1.7);

    ctx.globalCompositeOperation = 'screen';
    var glow = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 5.2 * pulse);
    glow.addColorStop(0, 'rgba(170,120,255,0.30)');
    glow.addColorStop(0.3, 'rgba(90,170,255,0.12)');
    glow.addColorStop(1, 'rgba(90,170,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(cx, cy, r * 5.2 * pulse, 0, TAU); ctx.fill();

    // accretion disc — three spiral arms of infalling light
    for (var a = 0; a < 3; a++) {
      for (var i = 0; i < 30; i++) {
        var u = i / 29;
        var rad = r * (1.12 + u * u * 2.5);
        var ang = -t * 1.15 + a * TAU / 3 + u * 3.1;
        var px = cx + Math.cos(ang) * rad;
        var py = cy + Math.sin(ang) * rad * 0.9;
        var al = (1 - u) * 0.55 + 0.05;
        var sz = Math.max(0.6, r * (0.16 * (1 - u) + 0.03));
        ctx.fillStyle = a === 1 ? 'rgba(190,150,255,' + al.toFixed(3) + ')'
                                : 'rgba(150,225,255,' + al.toFixed(3) + ')';
        ctx.beginPath(); ctx.arc(px, py, sz, 0, TAU); ctx.fill();
      }
    }
    ctx.globalCompositeOperation = 'source-over';

    // event horizon
    ctx.fillStyle = '#03030a';
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.86, 0, TAU); ctx.fill();

    ctx.save();
    ctx.shadowColor = 'rgba(190,230,255,0.9)';
    ctx.shadowBlur = r * 0.9;
    ctx.strokeStyle = 'rgba(225,245,255,0.9)';
    ctx.lineWidth = Math.max(1, r * 0.085);
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.9, 0, TAU); ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = 'rgba(160,200,255,0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.28, 0, TAU); ctx.stroke();
  }

  function starPath(r) {
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.quadraticCurveTo(r * 0.12, r * 0.12, 0, r);
    ctx.quadraticCurveTo(-r * 0.12, r * 0.12, -r, 0);
    ctx.quadraticCurveTo(-r * 0.12, -r * 0.12, 0, -r);
    ctx.quadraticCurveTo(r * 0.12, -r * 0.12, r, 0);
    ctx.closePath();
  }

  function drawCollectible(st, i, t) {
    var cx = X(st.x), cy = Y(st.y);
    if (st.taken) {
      if (st.pop <= 0) return;
      var p = 1 - st.pop;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.globalAlpha = st.pop * 0.9;
      ctx.translate(cx, cy);
      ctx.rotate(p * 1.6);
      ctx.scale(1 + p * 1.8, 1 + p * 1.8);
      ctx.fillStyle = 'rgba(255,225,150,0.9)';
      starPath(S(E.STAR_R)); ctx.fill();
      ctx.restore();
      return;
    }
    var bob = Math.sin(t * 1.5 + i * 2.1) * S(3.2);
    var spin = t * 0.35 + i;

    ctx.strokeStyle = 'rgba(255,212,121,0.10)';
    ctx.lineWidth = 1;
    ctx.setLineDash([S(4), S(7)]);
    ctx.lineDashOffset = -t * S(9);
    ctx.beginPath(); ctx.arc(cx, cy + bob, S(E.STAR_PICKUP), 0, TAU); ctx.stroke();
    ctx.setLineDash([]);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    var g = ctx.createRadialGradient(cx, cy + bob, 0, cx, cy + bob, S(E.STAR_R * 3.4));
    g.addColorStop(0, 'rgba(255,225,150,0.55)');
    g.addColorStop(0.3, 'rgba(255,190,90,0.16)');
    g.addColorStop(1, 'rgba(255,190,90,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy + bob, S(E.STAR_R * 3.4), 0, TAU); ctx.fill();

    ctx.translate(cx, cy + bob);
    ctx.rotate(spin);
    var sc = 1 + Math.sin(t * 2.4 + i) * 0.07;
    ctx.scale(sc, sc);
    var sg = ctx.createLinearGradient(0, -S(E.STAR_R), 0, S(E.STAR_R));
    sg.addColorStop(0, '#fff6da');
    sg.addColorStop(0.5, '#ffd479');
    sg.addColorStop(1, '#ffa73c');
    ctx.fillStyle = sg;
    starPath(S(E.STAR_R)); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    starPath(S(E.STAR_R * 0.36)); ctx.fill();
    ctx.restore();
  }

  function drawLaunchPad(t) {
    var L = state.level;
    var cx = X(L.launch.x), cy = Y(L.launch.y);
    var r = S(26);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(L.launchAngle);
    ctx.strokeStyle = 'rgba(150,225,255,0.4)';
    ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.arc(0, 0, r, -2.05, 2.05); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, r * 1.36, -1.5, 1.5); ctx.stroke();
    ctx.strokeStyle = 'rgba(150,225,255,0.18)';
    for (var i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.cos(i * 1.3) * r, Math.sin(i * 1.3) * r);
      ctx.lineTo(Math.cos(i * 1.3) * r * 1.36, Math.sin(i * 1.3) * r * 1.36);
      ctx.stroke();
    }
    ctx.restore();

    var pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
    ctx.globalCompositeOperation = 'screen';
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * (1.3 + pulse * 0.5));
    g.addColorStop(0, 'rgba(125,249,255,' + (0.18 + pulse * 0.1).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(125,249,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, r * (1.3 + pulse * 0.5), 0, TAU); ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawTrail(trail, headBright) {
    var n = trail.length / 2;
    if (n < 2) return;
    var chunks = 8;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.globalCompositeOperation = 'screen';
    for (var c = 0; c < chunks; c++) {
      var i0 = Math.floor((n - 1) * c / chunks);
      var i1 = Math.min(n - 1, Math.ceil((n - 1) * (c + 1) / chunks));
      if (i1 <= i0) continue;
      var f = (c + 1) / chunks;
      ctx.beginPath();
      ctx.moveTo(X(trail[i0 * 2]), Y(trail[i0 * 2 + 1]));
      for (var i = i0 + 1; i <= i1; i++) ctx.lineTo(X(trail[i * 2]), Y(trail[i * 2 + 1]));
      ctx.lineWidth = S(4 + 15 * f);
      ctx.strokeStyle = 'rgba(110,190,255,' + (0.06 * f * headBright).toFixed(3) + ')';
      ctx.stroke();
      ctx.lineWidth = S(1.6 + 4.6 * f);
      ctx.strokeStyle = 'rgba(' + Math.round(lerp(140, 240, f)) + ',' + Math.round(lerp(200, 248, f)) + ',255,' + (0.16 + 0.52 * f * headBright).toFixed(3) + ')';
      ctx.stroke();
      ctx.lineWidth = S(0.7 + 1.7 * f);
      ctx.strokeStyle = 'rgba(255,255,255,' + (0.08 + 0.6 * f * headBright).toFixed(3) + ')';
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawGhosts() {
    ctx.globalCompositeOperation = 'screen';
    ctx.lineCap = 'round';
    for (var g = 0; g < state.ghosts.length; g++) {
      var tr = state.ghosts[g];
      var n = tr.length / 2;
      if (n < 2) continue;
      var age = (g + 1) / state.ghosts.length;
      ctx.beginPath();
      ctx.moveTo(X(tr[0]), Y(tr[1]));
      for (var i = 1; i < n; i += 2) ctx.lineTo(X(tr[i * 2]), Y(tr[i * 2 + 1]));
      ctx.strokeStyle = 'rgba(120,170,235,' + (0.05 + 0.07 * age).toFixed(3) + ')';
      ctx.lineWidth = S(1.6);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawComet(t, alpha) {
    var c = state.comet;
    var cx = X(c.x), cy = Y(c.y);
    var sp = Math.sqrt(c.vx * c.vx + c.vy * c.vy);
    var ang = Math.atan2(c.vy, c.vx);
    ctx.save();
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.globalCompositeOperation = 'screen';
    var R = S(24 + Math.min(14, sp * 0.03));
    var g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.16, 'rgba(190,245,255,0.6)');
    g.addColorStop(0.44, 'rgba(140,180,255,0.2)');
    g.addColorStop(1, 'rgba(140,180,255,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();
    if (sp > 5) {
      ctx.translate(cx, cy); ctx.rotate(ang);
      var L = S(6 + sp * 0.05);
      var tg = ctx.createLinearGradient(0, 0, -L, 0);
      tg.addColorStop(0, 'rgba(255,255,255,0.55)');
      tg.addColorStop(1, 'rgba(160,220,255,0)');
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.moveTo(0, -S(3.2)); ctx.lineTo(-L, 0); ctx.lineTo(0, S(3.2));
      ctx.closePath(); ctx.fill();
      ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#ffffff';
    ctx.beginPath(); ctx.arc(cx, cy, S(4.6), 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawParticles() {
    ctx.globalCompositeOperation = 'screen';
    var P = state.particles;
    for (var i = 0; i < P.length; i++) {
      var p = P[i];
      var f = p.life / p.max;
      var r = S(p.size) * (0.4 + f * 0.9);
      ctx.fillStyle = 'hsla(' + p.hue.toFixed(0) + ',100%,' + p.light + '%,' + (f * 0.85).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), r, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawPreview(t) {
    var L = state.level, v = aimVelocity();
    var sim = E.simulate({ x0: L.launch.x, y0: L.launch.y, vx0: v.vx, vy0: v.vy,
                           planets: L.planets, goal: L.goal, maxT: 1.2, stride: 6 });
    var n = sim.times.length;
    ctx.globalCompositeOperation = 'screen';
    for (var i = 1; i < n; i++) {
      var f = 1 - (i - 1) / Math.max(1, n - 1);
      var a = 0.6 * f * f * (state.aim.dragging ? 1 : 0.5);
      if (a < 0.006) continue;
      ctx.fillStyle = 'rgba(200,240,255,' + a.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(X(sim.path[i * 2]), Y(sim.path[i * 2 + 1]), S(2.4 * (0.45 + 0.55 * f)), 0, TAU);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    // aim arrow + power ring at the pad
    var cx = X(L.launch.x), cy = Y(L.launch.y);
    var pw = clamp(state.aim.power, 0, 1);
    var len = S(34 + pw * 46);
    var ax = cx + Math.cos(state.aim.angle) * len, ay = cy + Math.sin(state.aim.angle) * len;
    ctx.strokeStyle = 'rgba(125,249,255,' + (state.aim.dragging ? 0.75 : 0.3) + ')';
    ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(state.aim.angle) * S(30), cy + Math.sin(state.aim.angle) * S(30));
    ctx.lineTo(ax, ay); ctx.stroke();
    ctx.save();
    ctx.translate(ax, ay); ctx.rotate(state.aim.angle);
    ctx.fillStyle = 'rgba(125,249,255,' + (state.aim.dragging ? 0.85 : 0.35) + ')';
    ctx.beginPath(); ctx.moveTo(S(9), 0); ctx.lineTo(-S(4), -S(5)); ctx.lineTo(-S(4), S(5));
    ctx.closePath(); ctx.fill();
    ctx.restore();

    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth = S(5);
    ctx.beginPath(); ctx.arc(cx, cy, S(44), -Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
    var pg = ctx.createLinearGradient(cx - S(44), cy, cx + S(44), cy);
    pg.addColorStop(0, '#7df9ff'); pg.addColorStop(1, '#b892ff');
    ctx.strokeStyle = pg;
    ctx.lineCap = 'round';
    ctx.globalAlpha = state.aim.dragging ? 1 : 0.42;
    ctx.beginPath(); ctx.arc(cx, cy, S(44), -Math.PI * 0.5, -Math.PI * 0.5 + TAU * pw); ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawConstellation(t) {
    var L = state.level;
    var pts = [];
    for (var i = 0; i < L.stars.length; i++) if (state.collected[i]) pts.push(L.stars[i]);
    if (!pts.length) return;
    pts.push(L.goal);
    ctx.globalCompositeOperation = 'screen';
    var pulse = 0.35 + 0.35 * Math.sin(t * 3);
    ctx.strokeStyle = 'rgba(255,225,150,' + (0.18 + pulse * 0.3).toFixed(3) + ')';
    ctx.lineWidth = S(1.6);
    ctx.setLineDash([S(6), S(9)]);
    ctx.lineDashOffset = -t * S(24);
    ctx.beginPath();
    ctx.moveTo(X(L.launch.x), Y(L.launch.y));
    for (var k = 0; k < pts.length; k++) ctx.lineTo(X(pts[k].x), Y(pts[k].y));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------------- main loop ---------------- */

  function render(t) {
    ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
    ctx.clearRect(0, 0, view.w, view.h);

    if (sky) {
      var dx = Math.sin(t * 0.021) * 16, dy = Math.cos(t * 0.017) * 12;
      ctx.drawImage(sky.canvas, -sky.pad + dx, -sky.pad + dy, sky.w, sky.h);
      ctx.globalCompositeOperation = 'screen';
      for (var i = 0; i < twinklers.length; i++) {
        var s = twinklers[i];
        var a = s.a * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph)));
        ctx.fillStyle = s.c;
        ctx.globalAlpha = a;
        ctx.beginPath(); ctx.arc(s.x + dx, s.y + dy, s.r, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.save();
    if (state.shake > 0.002) {
      var m = state.shake * state.shake * 14;
      ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
    }

    drawArenaFrame(t);

    ctx.save();
    roundRect(view.ox, view.oy, view.size, view.size, Math.min(26, view.size * 0.06));
    ctx.clip();

    drawPolarGrid(t);
    drawGhosts();

    var L = state.level;
    for (var p = 0; p < L.planets.length; p++) drawPlanet(L.planets[p], t);
    drawGoal(L.goal, t);
    for (var k = 0; k < L.stars.length; k++) drawCollectible(L.stars[k], k, t);
    drawLaunchPad(t);

    if (state.phase === 'winning' || state.phase === 'done') drawConstellation(t);
    if (state.phase === 'aim') drawPreview(t);

    var headBright = (state.phase === 'crash' || state.phase === 'lost')
      ? Math.max(0, 1 - state.phaseT * 1.4) : 1;
    drawTrail(state.trail, headBright);

    if (state.phase === 'flight') drawComet(t, 1);
    else if (state.phase === 'aim') drawComet(t, 0.9);
    else if (state.phase === 'winning') drawComet(t, Math.max(0, 1 - state.winT / 0.85));

    drawParticles();
    ctx.restore();
    ctx.restore();

    if (state.flash > 0.003) {
      ctx.fillStyle = 'rgba(190,235,255,' + (state.flash * 0.45).toFixed(3) + ')';
      ctx.fillRect(0, 0, view.w, view.h);
    }

    var vg = ctx.createRadialGradient(view.w / 2, view.h / 2, Math.min(view.w, view.h) * 0.34,
                                      view.w / 2, view.h / 2, Math.max(view.w, view.h) * 0.78);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, view.w, view.h);
  }

  function update(dt) {
    state.phaseT += dt;
    state.shake = Math.max(0, state.shake - dt * 3.0);
    state.flash = Math.max(0, state.flash - dt * 2.1);

    var L = state.level;
    for (var i = 0; i < L.stars.length; i++) {
      if (L.stars[i].pop > 0) L.stars[i].pop = Math.max(0, L.stars[i].pop - dt * 2.1);
    }
    stepParticles(dt);

    if (state.phase === 'flight') {
      stepFlight(dt);
      if (state.phase === 'flight' && Math.random() < dt * 34) {
        burst(1, state.comet.x, state.comet.y, {
          speed: [4, 34], life: [0.35, 0.9], size: [0.7, 1.9], hue: 200, hueSpread: 70, light: 82, drag: 2.2
        });
      }
    } else if (state.phase === 'winning') {
      if (state.winT === 0) {
        var g0 = L.goal, c0 = state.comet;
        state.capture = { ang: Math.atan2(c0.y - g0.y, c0.x - g0.x),
                          rad: Math.hypot(c0.x - g0.x, c0.y - g0.y) };
      }
      state.winT += dt;
      var pr = clamp(state.winT / 0.8, 0, 1);
      var ease = 1 - Math.pow(1 - pr, 2.2);
      state.comet.x = L.goal.x + Math.cos(state.capture.ang + ease * 8) * state.capture.rad * (1 - ease);
      state.comet.y = L.goal.y + Math.sin(state.capture.ang + ease * 8) * state.capture.rad * (1 - ease);
      state.trail.push(state.comet.x, state.comet.y);
      if (state.winT > 1.05) { state.phase = 'done'; onWinDone(); }
    } else if (state.phase === 'crash' || state.phase === 'lost') {
      if (state.phaseT > 1.05) resetShot();
    }
  }

  var lastMs = 0;
  function frame(ms) {
    var now = ms / 1000;
    var dt = lastMs ? Math.min(0.05, now - lastMs) : 0.016;
    lastMs = now;
    state.t += dt;
    if (state.level) { update(dt); render(state.t); }
    requestAnimationFrame(frame);
  }

  /* ---------------- input ---------------- */

  var drag = null;

  function onDown(e) {
    Sound.ensure();
    if (scrimOpen()) return;
    if (state.phase === 'crash' || state.phase === 'lost') { resetShot(); return; }
    if (state.phase !== 'aim') return;
    drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, moved: 0 };
    state.aim.dragging = true;
    try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  }

  function onMove(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    var len = Math.sqrt(dx * dx + dy * dy);
    drag.moved = Math.max(drag.moved, len);
    if (len > 5) {
      state.aim.angle = Math.atan2(dy, dx);
      state.aim.power = clamp((len - 5) / (view.size * 0.38), 0, 1);
    }
    e.preventDefault();
  }

  function onUp(e) {
    if (!drag || e.pointerId !== drag.id) return;
    var moved = drag.moved;
    drag = null;
    state.aim.dragging = false;
    if (moved > 9 && state.phase === 'aim') launch();
    else setHint(hintForPhase());
  }

  canvas.addEventListener('pointerdown', onDown, { passive: false });
  window.addEventListener('pointermove', onMove, { passive: false });
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);

  window.addEventListener('keydown', function (e) {
    if (scrimOpen()) { if (e.key === 'Escape') hideScrim(); return; }
    if (state.phase === 'crash' || state.phase === 'lost') { resetShot(); return; }
    if (state.phase !== 'aim') return;
    var step = e.shiftKey ? 0.004 : 0.02;
    if (e.key === 'ArrowLeft')  { state.aim.angle -= step; e.preventDefault(); }
    if (e.key === 'ArrowRight') { state.aim.angle += step; e.preventDefault(); }
    if (e.key === 'ArrowUp')    { state.aim.power = clamp(state.aim.power + step * 0.9, 0, 1); e.preventDefault(); }
    if (e.key === 'ArrowDown')  { state.aim.power = clamp(state.aim.power - step * 0.9, 0, 1); e.preventDefault(); }
    if (e.key === ' ' || e.key === 'Enter') { launch(); e.preventDefault(); }
    if (e.key === 'r' || e.key === 'R') { resetShot(); }
  });

  window.addEventListener('resize', layout);
  window.addEventListener('orientationchange', function () { setTimeout(layout, 220); });

  /* ---------------- hud ---------------- */

  var hintEl = $('#hint'), subEl = $('#subline'), attemptEl = $('#attemptTxt');

  function hintForPhase() {
    if (state.attempts === 0) return 'Drag anywhere to aim · release to launch';
    return 'Drag to aim · release to launch';
  }
  function setHint(text, warm) {
    if (!hintEl) return;
    hintEl.textContent = text;
    hintEl.classList.toggle('warm', !!warm);
  }

  function paintHud() {
    if (state.mode === 'daily') {
      subEl.innerHTML = '<b>#' + state.daily.number + '</b> · ' + state.name;
    } else {
      subEl.innerHTML = '<b>Endless</b> · System ' + (state.endless.cleared + 1) + ' · ' + state.name;
    }
    attemptEl.innerHTML = state.attempts === 0
      ? 'Ready'
      : 'Attempt <b>' + state.attempts + '</b>';
    var pips = document.querySelectorAll('#pips .pip');
    for (var i = 0; i < pips.length; i++) pips[i].classList.toggle('on', !!state.collected[i]);
    if (state.phase === 'aim') setHint(hintForPhase());
  }

  /* ---------------- sheets ---------------- */

  var scrim = $('#scrim');
  function scrimOpen() { return scrim.classList.contains('show'); }
  function showSheet(id) {
    var sheets = document.querySelectorAll('.sheet');
    for (var i = 0; i < sheets.length; i++) sheets[i].style.display = (sheets[i].id === id) ? '' : 'none';
    scrim.classList.add('show');
  }
  function hideScrim() {
    scrim.classList.remove('show');
    if (state.phase === 'done') resetShot(true);
  }

  scrim.addEventListener('pointerdown', function (e) {
    if (e.target === scrim) hideScrim();
  });

  var toastEl = $('#toast'), toastTimer = null;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 1900);
  }

  /* ---------------- results & sharing ---------------- */

  var BLOCKS = '▁▂▃▄▅▆▇█';
  function sparkline(samples) {
    if (!samples || samples.length < 2) return '▁▁▁▁▁▁▁▁';
    var n = 9, pick = [], i;
    for (i = 0; i < n; i++) pick.push(samples[Math.round(i * (samples.length - 1) / (n - 1))]);
    var mn = Math.min.apply(null, pick), mx = Math.max.apply(null, pick);
    var range = Math.max(1e-6, mx - mn), out = '';
    for (i = 0; i < n; i++) out += BLOCKS[clamp(Math.round((pick[i] - mn) / range * 7), 0, 7)];
    return out;
  }

  function dateKeyOffset(days) {
    var d = new Date();
    d.setDate(d.getDate() + days);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  function recordDaily() {
    var key = state.daily.dateKey;
    if (stats.results[key]) return;
    var s = countStars();
    stats.results[key] = {
      n: state.daily.number, attempts: state.attempts, stars: s,
      time: Math.round(state.flightT * 10) / 10,
      spark: sparkline(state.speedSamples), name: state.name
    };
    stats.played++; stats.wins++;
    stats.streak = (stats.last === dateKeyOffset(-1)) ? stats.streak + 1 : 1;
    stats.last = key;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
    if (s === 3) stats.perfect++;
    saveStats();
  }

  function shareText(r) {
    var lines = [];
    lines.push('ORBITAL #' + r.n + ' · ' + (r.name || ''));
    lines.push('★'.repeat(r.stars) + '☆'.repeat(3 - r.stars) + '  ' + r.attempts + (r.attempts === 1 ? ' attempt' : ' attempts') + '  ·  ' + r.time.toFixed(1) + 's');
    lines.push(r.spark);
    if (/^https?:/.test(location.href)) lines.push(location.origin + location.pathname);
    return lines.join('\n');
  }

  function doShare(r) {
    var text = shareText(r);
    if (navigator.share) {
      navigator.share({ text: text }).catch(function () {});
      return;
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast('Copied to clipboard'); },
                                               function () { fallbackCopy(text); });
    } else fallbackCopy(text);
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); toast('Copied to clipboard'); }
    catch (e) { toast('Copy failed'); }
    document.body.removeChild(ta);
  }

  var countdownTimer = null;
  function startCountdown() {
    var el = $('#countdown');
    if (!el) return;
    clearInterval(countdownTimer);
    function tick() {
      var ms = E.msUntilTomorrow();
      var h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
      el.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
    }
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  function showWin(r, revisit) {
    $('#winTitle').textContent = revisit ? 'Already Captured' : 'Captured';
    $('#winName').textContent = 'Orbital #' + r.n;
    $('#winSub').textContent = r.name || '';
    var pips = document.querySelectorAll('#winStars .pip');
    for (var i = 0; i < pips.length; i++) {
      (function (el, on, idx) {
        el.classList.remove('on');
        setTimeout(function () { el.classList.toggle('on', on); }, 180 + idx * 170);
      })(pips[i], i < r.stars, i);
    }
    $('#winAttempts').textContent = r.attempts;
    $('#winTime').textContent = r.time.toFixed(1) + 's';
    $('#winStreak').textContent = stats.streak;
    $('#winSpark').textContent = r.spark;
    $('#winFoot').innerHTML = 'Solved <b>' + stats.wins + '</b>' +
      ' · Perfect <b>' + stats.perfect + '</b>' +
      ' · Best streak <b>' + stats.maxStreak + '</b>';
    $('#shareBtn').onclick = function () { Sound.blip(); doShare(r); };
    startCountdown();
    showSheet('winSheet');
  }

  function onWinDone() {
    if (state.mode === 'daily') {
      var r = stats.results[state.daily.dateKey] || {
        n: state.daily.number, attempts: state.attempts, stars: countStars(),
        time: Math.round(state.flightT * 10) / 10, spark: sparkline(state.speedSamples), name: state.name
      };
      setTimeout(function () { showWin(r, false); }, 380);
    } else {
      toast('System cleared · ' + countStars() + '★');
      setTimeout(nextEndless, 1250);
    }
  }

  function nextEndless() {
    var d = 1 + Math.min(3, Math.floor(state.endless.cleared / 3));
    var seed = 'endless-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1e9).toString(36);
    loadLevel(E.makeLevel(seed, d));
    setHint('New system · drag to aim');
  }

  /* ---------------- modes ---------------- */

  function startDaily(force) {
    state.mode = 'daily';
    var info = E.dailyInfo();
    state.daily = info;
    loadLevel(E.makeLevel(info.seed, info.difficulty));
    var prior = stats.results[info.dateKey];
    if (prior && !force) showWin(prior, true);
    document.getElementById('modeBtn').classList.remove('is-off');
  }
  function startEndless() {
    state.mode = 'endless';
    state.endless = { cleared: 0, stars: 0 };
    nextEndless();
    hideScrim();
    toast('Endless mode');
  }

  /* ---------------- boot ---------------- */

  $('#soundBtn').addEventListener('click', function () {
    var on = Sound.toggle();
    this.classList.toggle('is-off', !on);
    if (on) Sound.blip();
  });
  $('#helpBtn').addEventListener('click', function () { Sound.blip(); showSheet('howSheet'); });
  $('#statsBtn').addEventListener('click', function () { Sound.blip(); paintStats(); showSheet('statsSheet'); });
  $('#modeBtn').addEventListener('click', function () {
    Sound.blip();
    if (state.mode === 'daily') { startEndless(); this.classList.add('is-off'); }
    else { startDaily(true); this.classList.remove('is-off'); toast('Daily orbital'); }
  });
  $('#howClose').addEventListener('click', function () {
    Store.set('orbital.seen', true); Sound.blip(); hideScrim();
  });
  $('#statsClose').addEventListener('click', function () { Sound.blip(); hideScrim(); });
  $('#replayBtn').addEventListener('click', function () {
    Sound.blip(); hideScrim();
    state.attempts = 0; state.ghosts = []; resetShot(true);
    toast('Replaying — stats already locked in');
  });
  $('#endlessBtn').addEventListener('click', function () { Sound.blip(); startEndless(); $('#modeBtn').classList.add('is-off'); });

  function paintStats() {
    $('#stPlayed').textContent = stats.wins;
    $('#stStreak').textContent = stats.streak;
    $('#stMax').textContent = stats.maxStreak;
    $('#stPerfect').textContent = stats.perfect;
    var keys = Object.keys(stats.results).sort().slice(-8).reverse();
    var html = '';
    for (var i = 0; i < keys.length; i++) {
      var r = stats.results[keys[i]];
      html += '<div class="hist-row"><span class="hn">#' + r.n + '</span>' +
              '<span class="hs">' + '★'.repeat(r.stars) + '<span class="dim">' + '★'.repeat(3 - r.stars) + '</span></span>' +
              '<span class="ha">' + r.attempts + (r.attempts === 1 ? ' try' : ' tries') + '</span>' +
              '<span class="hp">' + r.spark + '</span></div>';
    }
    $('#history').innerHTML = html || '<p class="empty">No orbitals captured yet.</p>';
  }

  if (!Sound.isOn()) $('#soundBtn').classList.add('is-off');

  layout();
  startDaily(false);
  if (!Store.get('orbital.seen', false)) showSheet('howSheet');
  requestAnimationFrame(frame);
  window.addEventListener('load', function () { setTimeout(layout, 60); });

  // exposed for tinkering + automated checks
  window.__orbital = {
    state: state, view: view, engine: E,
    aim: function (angle, power) { state.aim.angle = angle; state.aim.power = power; },
    fire: function () { if (state.phase === 'aim') launch(); },
    perfect: function () {
      var sol = state.level.solution;
      state.aim.angle = sol.aim;
      state.aim.power = (sol.speed - E.SPEED_MIN) / (E.SPEED_MAX - E.SPEED_MIN);
      launch();
    },
    reset: function () { resetShot(true); }
  };
})();
