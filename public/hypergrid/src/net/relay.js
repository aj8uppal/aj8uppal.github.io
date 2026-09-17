/**
 * Thin client for the relay server: open a socket, host or join a room, then
 * exchange messages with the one other person in it. The relay never looks
 * inside game traffic — it forwards binary frames and peer JSON verbatim.
 */

const SERVER_TYPES = new Set(['hosted', 'joined', 'peer-joined', 'peer-left', 'host-left', 'error', 'pong']);

export class RelayClient {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.handlers = new Map();
    this.pending = null;
    this.closed = false;
  }

  on(type, fn) {
    if (!this.handlers.has(type)) this.handlers.set(type, []);
    this.handlers.get(type).push(fn);
    return this;
  }

  _emit(type, payload) {
    const list = this.handlers.get(type);
    if (list) for (const fn of list) fn(payload);
  }

  connect(timeoutMs = 9000) {
    return new Promise((resolve, reject) => {
      let settled = false;
      const done = (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        if (err) reject(err); else resolve();
      };
      const timer = setTimeout(() => {
        done(new Error('Could not reach the multiplayer server. Check your connection and try again.'));
        try { this.ws && this.ws.close(); } catch { /* ignore */ }
      }, timeoutMs);

      let ws;
      try {
        ws = new WebSocket(this.url);
      } catch {
        done(new Error('Could not open a connection to the multiplayer server.'));
        return;
      }
      ws.binaryType = 'arraybuffer';
      this.ws = ws;

      ws.onopen = () => done();
      ws.onerror = () => done(new Error('Could not reach the multiplayer server. Check your connection and try again.'));
      ws.onclose = (ev) => {
        done(new Error('The multiplayer server closed the connection.'));
        if (!this.closed) this._emit('close', { code: ev.code, reason: ev.reason });
        this.closed = true;
        if (this.pending) {
          this.pending.reject(new Error('Disconnected from the multiplayer server.'));
          this.pending = null;
        }
      };
      ws.onmessage = (ev) => {
        if (typeof ev.data !== 'string') {
          this._emit('binary', ev.data);
          return;
        }
        let msg;
        try { msg = JSON.parse(ev.data); } catch { return; }
        if (!msg || typeof msg.t !== 'string') return;
        if (SERVER_TYPES.has(msg.t)) this._server(msg);
        else this._emit('message', msg);
      };
    });
  }

  _server(msg) {
    if (this.pending && (msg.t === this.pending.expect || msg.t === 'error')) {
      const p = this.pending;
      this.pending = null;
      if (msg.t === 'error') p.reject(new Error(msg.message || 'The server rejected that request.'));
      else p.resolve(msg);
      return;
    }
    this._emit(msg.t, msg);
  }

  _request(payload, expect) {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error('Not connected to the multiplayer server.'));
        return;
      }
      this.pending = { expect, resolve, reject };
      this.ws.send(JSON.stringify(payload));
    });
  }

  host(mode, name) { return this._request({ t: 'host', mode, name }, 'hosted'); }
  join(code, name) { return this._request({ t: 'join', code, name }, 'joined'); }

  get open() { return !!this.ws && this.ws.readyState === WebSocket.OPEN; }
  get buffered() { return this.ws ? this.ws.bufferedAmount : 0; }

  send(obj) {
    if (this.open) this.ws.send(JSON.stringify(obj));
  }

  sendBinary(buffer) {
    if (this.open) this.ws.send(buffer);
  }

  close() {
    this.closed = true;
    if (this.ws) {
      try { this.ws.close(1000, 'bye'); } catch { /* ignore */ }
    }
  }
}
