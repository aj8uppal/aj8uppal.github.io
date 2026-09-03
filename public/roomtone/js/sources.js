// sources.js — the three things roomtone can scan. All expose the same
// drawTo(ctx, w, h, progress) so the sampler, the viewfinder and the reveal
// never need to know which one is active.

import { getRoom } from './rooms.js';

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const easeInOut = (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/** Pan a still panorama across the frame — the simulated camera sweep. */
function panSource(img, iw, ih, kind, label) {
  return {
    kind, label,
    isLive: false,
    ready: () => iw > 0 && ih > 0,
    drawTo(ctx, w, h, p) {
      if (!iw || !ih) return;
      // Zoom in a touch so there is always something to sweep across.
      const zoom = 1.12;
      const scale = Math.max(w / iw, h / ih) * zoom;
      const viewW = w / scale, viewH = h / scale;
      const overX = Math.max(0, iw - viewW);
      const overY = Math.max(0, ih - viewH);
      const e = easeInOut(clamp(p, 0, 1));

      // Sweep along whichever axis has room; drift gently on the other.
      let sx, sy;
      if (overX >= overY) {
        sx = overX * (0.04 + 0.92 * e);
        sy = overY * (0.5 + 0.42 * Math.sin(p * Math.PI * 1.6));
      } else {
        sy = overY * (0.04 + 0.92 * e);
        sx = overX * (0.5 + 0.42 * Math.sin(p * Math.PI * 1.6));
      }
      ctx.drawImage(img,
        clamp(sx, 0, overX), clamp(sy, 0, overY), viewW, viewH,
        0, 0, w, h);
    },
  };
}

export function demoSource(roomId) {
  const room = getRoom(roomId);
  const s = panSource(room.canvas, room.width, room.height, 'demo', room.label);
  s.roomId = room.id;
  return s;
}

export function photoSource(img, name) {
  const label = name ? `Photo — ${name}` : 'Photo';
  const s = panSource(img, img.naturalWidth || img.width, img.naturalHeight || img.height, 'photo', label);
  s.fileName = name || '';
  // An ImageBitmap holds decoded pixels until it is closed.
  if (typeof ImageBitmap !== 'undefined' && img instanceof ImageBitmap) {
    s.stop = () => { try { img.close(); } catch (_) {} };
  }
  return s;
}

/**
 * Decode an image file, asking the browser to scale it down *during* decoding
 * when it is big, so a 60-megapixel photo never materialises at full size.
 * @returns {Promise<ImageBitmap|HTMLImageElement>}
 */
export async function decodeImageFile(file, maxEdge) {
  if (typeof createImageBitmap === 'function') {
    try {
      // Resize *during* decode. A tiny file cannot be a huge bitmap, so skip
      // the resize there rather than pointlessly upscaling an icon.
      const opts = file.size > 200 * 1024
        ? { resizeWidth: maxEdge, resizeQuality: 'high' }
        : undefined;
      const bmp = await createImageBitmap(file, opts);
      // resizeWidth constrains width only; a tall panorama may still be huge.
      if (bmp.height > maxEdge * 2) {
        const scaled = await createImageBitmap(bmp, { resizeHeight: maxEdge * 2, resizeQuality: 'high' });
        try { bmp.close(); } catch (_) {}
        return scaled;
      }
      return bmp;
    } catch (_) {
      // fall through to the <img> path
    }
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode failed')); };
    img.src = url;
  });
}

export function cameraSource(video, stream, label) {
  const track = stream.getVideoTracks()[0] || null;
  let ended = false;
  // A track can die under you: unplugged webcam, another app grabbing it, the
  // OS revoking access. The <video> keeps painting its last frame, so without
  // this the scan would happily "sample the room" from one frozen image.
  if (track) track.addEventListener('ended', () => { ended = true; });

  return {
    kind: 'camera',
    label: label || 'Live camera',
    isLive: true,
    stream,
    isDead: () => ended || (track ? track.readyState === 'ended' : false),
    ready: () => !ended && (!track || track.readyState === 'live') &&
      video.readyState >= 2 && video.videoWidth > 0,
    drawTo(ctx, w, h) {
      const vw = video.videoWidth, vh = video.videoHeight;
      if (!vw || !vh) return;
      const scale = Math.max(w / vw, h / vh);
      const dw = vw * scale, dh = vh * scale;
      ctx.drawImage(video, (w - dw) / 2, (h - dh) / 2, dw, dh);
    },
    stop() {
      ended = true;
      try { for (const t of stream.getTracks()) t.stop(); } catch (_) {}
      try { video.srcObject = null; } catch (_) {}
    },
  };
}

/**
 * Ask for the rear camera. Resolves to a source, or null with a reason.
 * Never throws — a refusal must degrade, not crash.
 */
export async function requestCamera(video) {
  const md = navigator.mediaDevices;
  if (!md || !md.getUserMedia) {
    return { source: null, reason: 'This browser has no camera API here.' };
  }
  if (!window.isSecureContext) {
    return { source: null, reason: 'Camera needs https or localhost. Staying in demo mode.' };
  }
  const tries = [
    { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 } }, audio: false },
    { video: true, audio: false },
  ];
  let lastErr = null;
  for (const c of tries) {
    try {
      const stream = await md.getUserMedia(c);
      video.srcObject = stream;
      video.setAttribute('playsinline', '');
      video.muted = true;
      try { await video.play(); } catch (_) { /* autoplay quirk; readyState still advances */ }
      await new Promise((res) => {
        if (video.readyState >= 2) return res();
        const done = () => { video.removeEventListener('loadeddata', done); res(); };
        video.addEventListener('loadeddata', done);
        setTimeout(done, 2500);
      });
      const track = stream.getVideoTracks()[0];
      // Device labels arrive as e.g. "FaceTime HD Camera (05ac:8514)".
      const raw = (track && track.label) || '';
      const clean = raw.replace(/\s*\([0-9a-f]{4}:[0-9a-f]{4}\)\s*$/i, '').trim().slice(0, 38);
      return { source: cameraSource(video, stream, clean ? `Live camera — ${clean}` : 'Live camera'), reason: null };
    } catch (err) {
      lastErr = err;
    }
  }
  const name = lastErr && lastErr.name;
  const reason = name === 'NotAllowedError' ? 'Camera permission was declined. Staying in demo mode.'
    : name === 'NotFoundError' || name === 'OverconstrainedError' ? 'No camera found. Staying in demo mode.'
    : 'Camera unavailable. Staying in demo mode.';
  return { source: null, reason };
}
