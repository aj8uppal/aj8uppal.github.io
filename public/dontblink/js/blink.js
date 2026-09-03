// Blink detection with no model and no network.
//
// 1. Find a coarse face box from rg-chromaticity "skin-ish" pixels plus frame-to-frame
//    motion, weighted toward the centre of the frame.
// 2. Take the band across the upper third of that box — the eyes live there.
// 3. Every frame, reduce that band to one number: how much dark pixel area + edge energy
//    it contains. Open eyes have pupils, lashes and an iris edge. A closed eyelid is a
//    smooth, brighter patch. So the number DIPS sharply and briefly when you blink.
// 4. Compare against a slowly-adapting baseline so drifting light doesn't fire it.
//
// It is a heuristic, not a face tracker. It is tuned to fail toward "no blink" rather
// than toward a false positive, and a false positive only advances the story anyway.

const PW = 128, PH = 96;          // processing resolution
const REFRACTORY = 380;           // ms between accepted blinks
const MIN_DIP = 40, MAX_DIP = 520; // ms — a blink is brief

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function createCameraBlink() {
  const video = document.createElement('video');
  video.playsInline = true; video.muted = true; video.autoplay = true;
  video.setAttribute('playsinline', '');

  const proc = document.createElement('canvas');
  proc.width = PW; proc.height = PH;
  const pctx = proc.getContext('2d', { willReadFrequently: true });

  let stream = null, running = false, starting = false;
  let prevGray = null;
  const gray = new Float32Array(PW * PH);

  // face box in processing pixels
  let box = { x: PW * 0.28, y: PH * 0.16, w: PW * 0.44, h: PH * 0.62 };
  let boxSeen = false;
  let lastBoxAt = 0;

  // signal state
  let base = 0, dev = 0.02, primed = false;
  let state = 'idle', dipStart = 0, dipMin = 0, lastBlink = 0;
  let thr = 2.4;
  const history = new Float32Array(96);
  let hi = 0;
  let quality = 0;         // 0..1 confidence that we are actually reading eyes
  let lastFrameAt = 0;

  // calibration
  let cal = null;

  async function start() {
    if (starting) return { ok: false, reason: 'busy' };
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { ok: false, reason: 'nosupport' };
    }
    starting = true;
    let got;
    try {
      got = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false
      });
    } catch (err) {
      starting = false;
      const name = err && err.name ? err.name : 'error';
      return { ok: false, reason: name === 'NotAllowedError' ? 'denied' : 'unavailable' };
    }
    starting = false;
    stop();                       // never orphan a stream we already hold
    stream = got;
    video.srcObject = stream;
    try { await video.play(); } catch { /* autoplay of a muted local stream; harmless */ }
    running = true;
    prevGray = null; primed = false; boxSeen = false; quality = 0;
    return { ok: true };
  }

  function stop() {
    running = false;
    if (stream) { stream.getTracks().forEach((t) => { try { t.stop(); } catch { /* already gone */ } }); stream = null; }
    try { video.pause(); } catch { /* fine */ }
    video.srcObject = null;
    prevGray = null;
  }

  function grab() {
    if (!running || video.readyState < 2 || !video.videoWidth) return false;
    // mirror so the inset reads like a mirror; detection is symmetric so it doesn't matter
    pctx.save();
    pctx.translate(PW, 0); pctx.scale(-1, 1);
    pctx.drawImage(video, 0, 0, PW, PH);
    pctx.restore();
    return true;
  }

  function findBox(data) {
    const colW = new Float32Array(PW), rowW = new Float32Array(PH);
    let total = 0;
    for (let y = 0; y < PH; y++) {
      for (let x = 0; x < PW; x++) {
        const i = (y * PW + x) * 4;
        const r = data[i], g = data[i + 1], b = data[i + 2];
        const s = r + g + b;
        let w = 0;
        if (s > 60 && s < 735) {
          const rn = r / s, gn = g / s;
          if (rn > 0.33 && rn < 0.50 && gn > 0.245 && gn < 0.375 && r > b - 6) w = 1;
        }
        if (prevGray) {
          const d = Math.abs(gray[y * PW + x] - prevGray[y * PW + x]);
          if (d > 7) w += 0.45;
        }
        if (w > 0) {
          // faces are near the middle of a webcam frame far more often than not
          const cxw = 1 - Math.abs(x / PW - 0.5) * 1.1;
          const cyw = 1 - Math.abs(y / PH - 0.42) * 1.0;
          w *= Math.max(0.15, cxw * cyw);
          colW[x] += w; rowW[y] += w; total += w;
        }
      }
    }
    if (total < PW * PH * 0.012) return null;

    const moment = (arr, n) => {
      let m0 = 0, m1 = 0;
      for (let i = 0; i < n; i++) { m0 += arr[i]; m1 += arr[i] * i; }
      const mean = m1 / (m0 || 1);
      let m2 = 0;
      for (let i = 0; i < n; i++) m2 += arr[i] * (i - mean) * (i - mean);
      return { mean, sd: Math.sqrt(m2 / (m0 || 1)) };
    };
    const cx = moment(colW, PW), cy = moment(rowW, PH);
    const w = clamp(cx.sd * 2.3, PW * 0.20, PW * 0.86);
    const h = clamp(cy.sd * 2.5, PH * 0.28, PH * 0.92);
    return { x: clamp(cx.mean - w / 2, 0, PW - w), y: clamp(cy.mean - h / 2, 0, PH - h), w, h };
  }

  function eyeBand() {
    return {
      x: Math.round(box.x + box.w * 0.08),
      y: Math.round(box.y + box.h * 0.20),
      w: Math.round(box.w * 0.84),
      h: Math.max(4, Math.round(box.h * 0.26))
    };
  }

  function measure(now) {
    const img = pctx.getImageData(0, 0, PW, PH);
    const d = img.data;
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      gray[p] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    }
    if (now - lastBoxAt > 420) {
      const cand = findBox(d);
      lastBoxAt = now;
      if (cand) {
        const a = boxSeen ? 0.22 : 1;
        box = {
          x: box.x + (cand.x - box.x) * a,
          y: box.y + (cand.y - box.y) * a,
          w: box.w + (cand.w - box.w) * a,
          h: box.h + (cand.h - box.h) * a
        };
        boxSeen = true;
      }
    }

    const b = eyeBand();
    const x1 = clamp(b.x, 1, PW - 2), x2 = clamp(b.x + b.w, 2, PW - 1);
    const y1 = clamp(b.y, 1, PH - 2), y2 = clamp(b.y + b.h, 2, PH - 1);
    let sum = 0, n = 0;
    for (let y = y1; y < y2; y++) for (let x = x1; x < x2; x++) { sum += gray[y * PW + x]; n++; }
    if (n < 12) return null;
    const mean = sum / n;
    const dark = mean * 0.70;
    let darkN = 0, edge = 0;
    for (let y = y1; y < y2; y++) {
      for (let x = x1; x < x2; x++) {
        const v = gray[y * PW + x];
        if (v < dark) darkN++;
        edge += Math.abs(gray[y * PW + x + 1] - gray[y * PW + x - 1]);
        edge += Math.abs(gray[(y + 1) * PW + x] - gray[(y - 1) * PW + x]) * 0.6;
      }
    }
    if (!prevGray) prevGray = new Float32Array(PW * PH);
    prevGray.set(gray);
    return { sig: (darkN / n) * 1.0 + (edge / n / 255) * 1.1, lum: mean };
  }

  // Returns { blink, z, sig } or null when there is nothing to read yet.
  function tick(now) {
    if (!running) return null;
    if (now - lastFrameAt < 24) return null;   // ~40fps ceiling on the CV work
    lastFrameAt = now;
    if (!grab()) return null;
    const m = measure(now);
    if (!m) return null;

    if (!primed) { base = m.sig; dev = 0.02; primed = true; }
    const z = (m.sig - base) / Math.max(dev * 1.3, 0.006);
    history[hi = (hi + 1) % history.length] = z;

    let blink = false;
    const active = state === 'dip';
    if (!active) {
      // adapt the baseline only while the eyes look open
      base += (m.sig - base) * 0.030;
      dev += (Math.abs(m.sig - base) - dev) * 0.030;
      dev = Math.max(dev, 0.004);
    }

    const useThr = cal && cal.phase === 'blink' ? 1.7 : thr;
    if (state === 'idle') {
      if (z < -useThr && now - lastBlink > REFRACTORY) { state = 'dip'; dipStart = now; dipMin = z; }
    } else {
      dipMin = Math.min(dipMin, z);
      if (z > -useThr * 0.45) {
        const dur = now - dipStart;
        state = 'idle';
        if (dur >= MIN_DIP && dur <= MAX_DIP) {
          blink = true; lastBlink = now;
          if (cal && cal.phase === 'blink') cal.dips.push(-dipMin);
        }
      } else if (now - dipStart > 900) {
        // not a blink — the light changed or you looked away. Re-seat the baseline.
        state = 'idle'; base = m.sig; dev = Math.max(dev, 0.02); lastBlink = now;
      }
    }

    // rolling confidence: are we seeing a signal with any life in it?
    quality = clamp(dev / 0.02, 0, 1) * (boxSeen ? 1 : 0.45);
    return { blink, z, sig: m.sig };
  }

  /* ------------------------------------------------------------ calibration */
  function beginCalibration(now) {
    cal = { t0: now, phase: 'settle', dips: [], done: false };
    primed = false; boxSeen = false; lastBoxAt = 0; state = 'idle';
  }

  // Drives the 3-second routine. Returns { phase, progress, done, ok, instruction }.
  function calibrationStep(now) {
    if (!cal) return null;
    const el = now - cal.t0;
    const SETTLE = 1400, BLINK = 1900;
    if (el < SETTLE) {
      cal.phase = 'settle';
    } else if (el < SETTLE + BLINK) {
      if (cal.phase !== 'blink') { cal.phase = 'blink'; cal.dips.length = 0; }
    } else if (!cal.done) {
      cal.done = true;
      cal.phase = 'done';
      if (cal.dips.length) {
        const avg = cal.dips.reduce((a, b) => a + b, 0) / cal.dips.length;
        thr = clamp(avg * 0.55, 1.8, 5.0);
        cal.ok = true;
      } else {
        thr = 2.3;
        cal.ok = false;
      }
    }
    return {
      phase: cal.phase,
      progress: clamp(el / (SETTLE + BLINK), 0, 1),
      done: cal.done,
      ok: cal.ok,
      dips: cal.dips.length,
      instruction: cal.phase === 'settle'
        ? 'Look at the dot. Hold still.'
        : cal.phase === 'blink' ? 'Now blink twice.' : 'Ready.'
    };
  }

  /* ------------------------------------------------------------------ inset */
  function drawInset(g, w, h) {
    g.fillStyle = '#000';
    g.fillRect(0, 0, w, h);
    if (running && video.readyState >= 2 && video.videoWidth) {
      g.save();
      g.translate(w, 0); g.scale(-1, 1);
      g.drawImage(video, 0, 0, w, h);
      g.restore();
      // knock the colour out and tint it to match the film
      g.globalCompositeOperation = 'saturation';
      g.fillStyle = '#808080'; g.fillRect(0, 0, w, h);
      g.globalCompositeOperation = 'multiply';
      g.fillStyle = '#b8c46a'; g.fillRect(0, 0, w, h);
      g.globalCompositeOperation = 'source-over';
    }
    const sx = w / PW, sy = h / PH;
    const b = eyeBand();
    g.strokeStyle = boxSeen ? 'rgba(214,230,140,0.95)' : 'rgba(214,230,140,0.35)';
    g.lineWidth = 1;
    g.strokeRect(b.x * sx + 0.5, b.y * sy + 0.5, b.w * sx, b.h * sy);
    // signal trace along the bottom — this is the proof of what fired
    g.beginPath();
    for (let i = 0; i < history.length; i++) {
      const v = history[(hi + 1 + i) % history.length];
      const x = (i / (history.length - 1)) * w;
      const y = h - 4 - clamp((v + 6) / 9, 0, 1) * (h * 0.26);
      i ? g.lineTo(x, y) : g.moveTo(x, y);
    }
    g.strokeStyle = 'rgba(179,193,75,0.9)';
    g.lineWidth = 1;
    g.stroke();
  }

  return {
    start, stop, tick, beginCalibration, calibrationStep, drawInset,
    get running() { return running; },
    get quality() { return quality; },
    get threshold() { return thr; }
  };
}

/* ------------------------------------------------------- demo blink source */
// A synthetic eye for the inset so demo mode still "proves" what fired.
export function drawDemoEye(g, w, h, closeAmount) {
  const c = clamp(closeAmount, 0, 1);
  g.fillStyle = '#08090a';
  g.fillRect(0, 0, w, h);
  const cx = w / 2, cy = h / 2, rx = w * 0.36, ry = h * 0.24 * (1 - c * 0.97);

  g.save();
  g.beginPath();
  g.moveTo(cx - rx, cy);
  g.quadraticCurveTo(cx, cy - ry * 2.1, cx + rx, cy);
  g.quadraticCurveTo(cx, cy + ry * 1.9, cx - rx, cy);
  g.closePath();
  g.fillStyle = 'rgba(206,214,186,0.10)';
  g.fill();
  g.clip();
  if (c < 0.94) {
    g.fillStyle = '#c6d183';
    g.beginPath(); g.arc(cx, cy, Math.min(rx * 0.42, h * 0.19), 0, Math.PI * 2); g.fill();
    g.fillStyle = '#05060a';
    g.beginPath(); g.arc(cx, cy, Math.min(rx * 0.19, h * 0.085), 0, Math.PI * 2); g.fill();
  }
  g.restore();

  g.beginPath();
  g.moveTo(cx - rx, cy);
  g.quadraticCurveTo(cx, cy - ry * 2.1, cx + rx, cy);
  g.quadraticCurveTo(cx, cy + ry * 1.9, cx - rx, cy);
  g.closePath();
  g.strokeStyle = `rgba(179,193,75,${0.55 + c * 0.4})`;
  g.lineWidth = 1.4;
  g.stroke();
}
