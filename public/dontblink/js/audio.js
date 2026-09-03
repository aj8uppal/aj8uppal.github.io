// All sound is synthesised at runtime. No files, no network.
// Calm mode keeps the drone and the space but removes the transients and the top end.

export function createAudio() {
  let ac = null, master = null, bus = null, verb = null, verbGain = null, ambientGain = null;
  let noiseBuf = null;
  const voices = new Set();   // every one-shot's output gain, so a run can be silenced
  let calm = false, started = false;

  function noise(seconds = 2) {
    const n = Math.floor(ac.sampleRate * seconds);
    const b = ac.createBuffer(1, n, ac.sampleRate);
    const d = b.getChannelData(0);
    let last = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;   // brown-ish: sits under everything
      d[i] = last * 3.2;
    }
    return b;
  }

  function impulse(seconds = 2.4, decay = 3.2) {
    const n = Math.floor(ac.sampleRate * seconds);
    const b = ac.createBuffer(2, n, ac.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < n; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, decay);
      }
    }
    return b;
  }

  function curve(k = 14) {
    const n = 1024, c = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const x = (i * 2) / n - 1;
      c[i] = ((1 + k) * x) / (1 + k * Math.abs(x));
    }
    return c;
  }

  function ensure() {
    if (ac) return true;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return false;
    try { ac = new AC(); } catch { return false; }

    master = ac.createGain();
    master.gain.value = 1;
    const limiter = ac.createDynamicsCompressor();
    limiter.threshold.value = -8;
    limiter.knee.value = 6;
    limiter.ratio.value = 12;
    limiter.attack.value = 0.003;
    limiter.release.value = 0.20;
    master.connect(limiter).connect(ac.destination);

    bus = ac.createGain();
    bus.connect(master);
    verb = ac.createConvolver();
    verb.buffer = impulse();
    verbGain = ac.createGain();
    verbGain.gain.value = 0.55;
    verb.connect(verbGain).connect(master);

    noiseBuf = noise();
    return true;
  }

  // A one-shot's master fader. Registered so silence() can kill it mid-flight.
  function voice(seconds) {
    const g = ac.createGain();
    voices.add(g);
    setTimeout(() => { voices.delete(g); try { g.disconnect(); } catch { /* gone */ } }, (seconds + 0.5) * 1000);
    return g;
  }

  // Cut every sound that is still in the air, and starve the reverb so its tail dies too.
  function silence() {
    if (!ac) return;
    const t = ac.currentTime;
    voices.forEach((g) => {
      try {
        g.gain.cancelScheduledValues(t);
        g.gain.setValueAtTime(g.gain.value, t);
        g.gain.linearRampToValueAtTime(0.0001, t + 0.04);
      } catch { /* already disconnected */ }
    });
    if (verbGain) {
      verbGain.gain.cancelScheduledValues(t);
      verbGain.gain.setValueAtTime(verbGain.gain.value, t);
      verbGain.gain.linearRampToValueAtTime(0.0001, t + 0.04);
      verbGain.gain.setValueAtTime(0.55, t + 0.6);
    }
    if (ambientGain) {
      ambientGain.gain.cancelScheduledValues(t);
      ambientGain.gain.setTargetAtTime(0.9, t, 0.3);
    }
  }

  function startAmbient() {
    if (!ensure() || started) return;
    started = true;
    ambientGain = ac.createGain();
    ambientGain.gain.value = 0;
    ambientGain.connect(master);
    ambientGain.connect(verb);

    // room tone
    const air = ac.createBufferSource();
    air.buffer = noiseBuf; air.loop = true;
    const airF = ac.createBiquadFilter();
    airF.type = 'lowpass'; airF.frequency.value = 520; airF.Q.value = 0.6;
    const airG = ac.createGain(); airG.gain.value = 0.30;
    air.connect(airF).connect(airG).connect(ambientGain);
    air.start();

    // the drone under the floor
    [37.5, 37.9, 56.2].forEach((f, i) => {
      const o = ac.createOscillator();
      o.type = i === 2 ? 'triangle' : 'sawtooth';
      o.frequency.value = f;
      const lp = ac.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 190; lp.Q.value = 3;
      const gn = ac.createGain(); gn.gain.value = i === 2 ? 0.05 : 0.10;
      o.connect(lp).connect(gn).connect(ambientGain);
      // slow breath on the filter
      const lfo = ac.createOscillator();
      lfo.frequency.value = 0.06 + i * 0.017;
      const la = ac.createGain(); la.gain.value = 55;
      lfo.connect(la).connect(lp.frequency);
      o.start(); lfo.start();
    });

    ambientGain.gain.setTargetAtTime(0.9, ac.currentTime, 2.2);
  }

  function panner(px = 0, pz = 1) {
    const p = ac.createPanner();
    p.panningModel = 'HRTF';
    p.distanceModel = 'inverse';
    p.refDistance = 1; p.maxDistance = 40; p.rolloffFactor = 0.7;
    if (p.positionX) {
      p.positionX.value = px; p.positionY.value = 0; p.positionZ.value = pz;
    } else { p.setPosition(px, 0, pz); }
    return p;
  }

  // The beat-advance hit. `i` is intensity 0..1.
  function stinger({ f = 110, len = 0.8, i = 0.5, px = 0, pz = 1 } = {}) {
    if (!ensure()) return;
    const t = ac.currentTime;
    const amp = (calm ? 0.19 : 1) * (0.14 + 0.34 * i);
    const atk = calm ? 0.16 : 0.004;   // calm mode swells instead of hitting

    const pan = panner(px * 3, Math.max(0.35, pz));
    const out = voice(len + 0.7);
    out.gain.value = 1;
    out.connect(pan);
    pan.connect(bus);
    pan.connect(verb);

    const shaper = ac.createWaveShaper();
    shaper.curve = curve(calm ? 2 : 9);
    const lp = ac.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(calm ? 700 : 3600, t);
    lp.frequency.exponentialRampToValueAtTime(240, t + len);
    shaper.connect(lp).connect(out);

    // dissonant cluster falling through itself
    [1, 1.0595, 1.4983].forEach((m, k) => {
      const o = ac.createOscillator();
      o.type = k === 2 ? 'square' : 'sawtooth';
      o.frequency.setValueAtTime(f * m, t);
      o.frequency.exponentialRampToValueAtTime(Math.max(24, f * m * 0.42), t + len);
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(amp * (k === 2 ? 0.35 : 1), t + atk);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g).connect(shaper);
      o.start(t); o.stop(t + len + 0.05);
    });

    // the crack on the front — the part calm mode removes
    if (!calm) {
      const n = ac.createBufferSource();
      n.buffer = noiseBuf;
      n.playbackRate.value = 1.8;
      const hp = ac.createBiquadFilter();
      hp.type = 'bandpass'; hp.frequency.value = 1500 + 2200 * i; hp.Q.value = 0.8;
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22 * (0.3 + i), t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16 + 0.2 * i);
      n.connect(hp).connect(g).connect(out);
      n.start(t); n.stop(t + 0.6);
    }
    setTimeout(() => { try { pan.disconnect(); out.disconnect(); } catch { /* gone */ } }, (len + 1.2) * 1000);
  }

  // eyelid swish — plays on every blink, live or demo
  function swish() {
    if (!ensure()) return;
    const t = ac.currentTime;
    const n = ac.createBufferSource();
    n.buffer = noiseBuf;
    n.playbackRate.value = 2.4;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass'; bp.Q.value = 1.1;
    bp.frequency.setValueAtTime(1500, t);
    bp.frequency.exponentialRampToValueAtTime(260, t + 0.17);
    const g = voice(0.4);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(calm ? 0.05 : 0.10, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.19);
    n.connect(bp).connect(g).connect(master);
    n.start(t); n.stop(t + 0.3);
  }

  // two-thump heart, used through the stand-off
  function heart(intensity = 0.5) {
    if (!ensure()) return;
    const t = ac.currentTime;
    const hit = (at, amp) => {
      const o = ac.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(72, at);
      o.frequency.exponentialRampToValueAtTime(34, at + 0.16);
      const g = voice(0.6);
      g.gain.setValueAtTime(0.0001, at);
      g.gain.exponentialRampToValueAtTime(amp, at + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, at + 0.30);
      o.connect(g).connect(master);
      o.start(at); o.stop(at + 0.4);
    };
    const a = (calm ? 0.16 : 0.30) * (0.4 + intensity);
    hit(t, a);
    hit(t + 0.19, a * 0.62);
  }

  // for the behind-you beat: something exhaling at the back of your neck
  function breath(px = 0.5, pz = -1.2) {
    if (!ensure()) return;
    const t = ac.currentTime;
    const n = ac.createBufferSource();
    n.buffer = noiseBuf; n.playbackRate.value = 0.55;
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass'; bp.frequency.value = 420; bp.Q.value = 1.6;
    const g = voice(2.4);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(calm ? 0.16 : 0.30, t + 0.5);
    g.gain.linearRampToValueAtTime(0.0001, t + 1.9);
    const p = panner(px * 3, pz);
    n.connect(bp).connect(g).connect(p);
    p.connect(bus); p.connect(verb);
    n.start(t); n.stop(t + 2.2);
    setTimeout(() => { try { p.disconnect(); } catch { /* gone */ } }, 2600);
  }

  function tone(f, len, amp) {
    if (!ensure()) return;
    const t = ac.currentTime;
    const o = ac.createOscillator();
    o.type = 'sine'; o.frequency.value = f;
    const g = voice(len + 0.3);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(amp * (calm ? 0.5 : 1), t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + len + 0.05);
  }

  function duck(amount = 0.35, seconds = 1.4) {
    if (!ac || !ambientGain) return;
    ambientGain.gain.cancelScheduledValues(ac.currentTime);
    ambientGain.gain.setTargetAtTime(amount, ac.currentTime, 0.05);
    ambientGain.gain.setTargetAtTime(0.9, ac.currentTime + seconds, 0.8);
  }

  return {
    resume() {
      if (!ensure()) return;
      if (ac.state === 'suspended') ac.resume().catch(() => {});
      startAmbient();
    },
    suspend() { if (ac && ac.state === 'running') ac.suspend().catch(() => {}); },
    stinger, swish, heart, breath, tone, duck, silence,
    setCalm(v) { calm = !!v; },
    get available() { return !!(window.AudioContext || window.webkitAudioContext); }
  };
}
