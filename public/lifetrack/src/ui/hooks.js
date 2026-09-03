import { useState, useEffect, useCallback, useRef, useMemo } from '../../vendor/preact-htm.module.js';
import { subscribe, getState } from '../store.js';
import { todayKey } from '../dates.js';

/** Re-render when the store changes. Returns the current state. */
export function useStore() {
  const [, force] = useState(0);
  useEffect(() => subscribe(() => force((n) => n + 1)), []);
  return getState();
}

/** Parse the hash route: "#/tasks/abc?x=1" -> { path: ['tasks','abc'], query: {x:'1'} }. */
export function parseHash(hash = location.hash) {
  const raw = hash.replace(/^#\/?/, '');
  const [pathPart, queryPart] = raw.split('?');
  const path = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  const query = {};
  if (queryPart) for (const [k, v] of new URLSearchParams(queryPart)) query[k] = v;
  return { path: path.length ? path : ['today'], query };
}

export function navigate(to, { replace = false } = {}) {
  const hash = to.startsWith('#') ? to : '#/' + to.replace(/^\//, '');
  if (replace) history.replaceState(null, '', hash);
  else location.hash = hash;
  if (replace) window.dispatchEvent(new HashChangeEvent('hashchange'));
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash());
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

/** Re-renders at local midnight so "today" stays correct in long-lived tabs. */
export function useToday() {
  const [today, setToday] = useState(() => todayKey());
  useEffect(() => {
    let timer;
    const schedule = () => {
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
      timer = setTimeout(() => { setToday(todayKey()); schedule(); }, next - now);
    };
    schedule();
    const onVisible = () => { if (document.visibilityState === 'visible') setToday(todayKey()); };
    document.addEventListener('visibilitychange', onVisible);
    return () => { clearTimeout(timer); document.removeEventListener('visibilitychange', onVisible); };
  }, []);
  return today;
}

export function useMediaQuery(q) {
  const [m, setM] = useState(() => (typeof matchMedia !== 'undefined' ? matchMedia(q).matches : false));
  useEffect(() => {
    const mq = matchMedia(q);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [q]);
  return m;
}

export function useOnline() {
  const [online, setOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);
  return online;
}

/** Local UI preference persisted to localStorage. */
export function useLocalPref(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem('lifetrack:pref:' + key);
      return raw == null ? initial : JSON.parse(raw);
    } catch {
      return initial;
    }
  });
  const set = useCallback((v) => {
    setVal((prev) => {
      const next = typeof v === 'function' ? v(prev) : v;
      try { localStorage.setItem('lifetrack:pref:' + key, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [key]);
  return [val, set];
}

/** Calls handler when clicking outside ref. */
export function useClickOutside(ref, handler, active = true) {
  useEffect(() => {
    if (!active) return;
    const on = (e) => { if (ref.current && !ref.current.contains(e.target)) handler(e); };
    document.addEventListener('mousedown', on);
    document.addEventListener('touchstart', on);
    return () => { document.removeEventListener('mousedown', on); document.removeEventListener('touchstart', on); };
  }, [ref, handler, active]);
}

export function useKey(key, handler, { meta = false, active = true } = {}) {
  useEffect(() => {
    if (!active) return;
    const on = (e) => {
      if (e.key !== key) return;
      if (meta && !(e.metaKey || e.ctrlKey)) return;
      handler(e);
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [key, handler, meta, active]);
}

export function useAutoFocus(enabled = true) {
  const ref = useRef(null);
  useEffect(() => {
    if (enabled && ref.current) {
      const t = setTimeout(() => ref.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [enabled]);
  return ref;
}

export function useDebounced(value, ms = 200) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export function useMemoState(fn, deps) {
  return useMemo(fn, deps);
}
