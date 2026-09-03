// Persistence: IndexedDB with a localStorage fallback. One document per key.
const DB_NAME = 'lifetrack';
const DB_VERSION = 1;
const STORE = 'kv';
const LS_PREFIX = 'lifetrack:';

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB unavailable'));
    let req;
    try {
      req = indexedDB.open(DB_NAME, DB_VERSION);
    } catch (err) {
      return reject(err);
    }
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => {
      const db = req.result;
      db.onversionchange = () => { db.close(); dbPromise = null; };
      db.onclose = () => { dbPromise = null; };
      resolve(db);
    };
    req.onerror = () => reject(req.error || new Error('IndexedDB open failed'));
    req.onblocked = () => reject(new Error('IndexedDB blocked'));
  });
  dbPromise.catch(() => { dbPromise = null; });
  return dbPromise;
}

function tx(db, mode, fn) {
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const store = t.objectStore(STORE);
    let result;
    try {
      result = fn(store);
    } catch (err) {
      reject(err);
      return;
    }
    t.oncomplete = () => resolve(result && 'result' in result ? result.result : undefined);
    t.onerror = () => reject(t.error || new Error('IndexedDB transaction failed'));
    t.onabort = () => reject(t.error || new Error('IndexedDB transaction aborted'));
  });
}

function lsGet(key) {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw == null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function lsSet(key, value) {
  try {
    localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function lsDel(key) {
  try { localStorage.removeItem(LS_PREFIX + key); } catch { /* ignore */ }
}

export class StorageReadError extends Error {}

/**
 * Reads a key. IndexedDB is the primary store and localStorage a fallback for environments where IDB is unusable.
 * A *failing* IDB read (as opposed to an empty one) throws StorageReadError so callers never mistake it for "no data".
 * When both copies exist the newer `meta.updatedAt` wins (a write may have fallen back to localStorage earlier).
 */
export async function dbGet(key) {
  let idbVal;
  let idbFailed = null;
  if (typeof indexedDB !== 'undefined') {
    try {
      let db;
      try { db = await openDB(); } catch (err) { await new Promise((r) => setTimeout(r, 300)); db = await openDB(); }
      idbVal = await tx(db, 'readonly', (s) => s.get(key));
    } catch (err) {
      idbFailed = err;
    }
  }
  const lsVal = lsGet(key);
  if (idbFailed && !isUnavailable(idbFailed)) throw new StorageReadError('Could not read saved data: ' + (idbFailed?.message || idbFailed));
  if (idbVal !== undefined && lsVal !== undefined && key === 'state') {
    return (lsVal?.meta?.updatedAt || '') > (idbVal?.meta?.updatedAt || '') ? lsVal : idbVal;
  }
  return idbVal !== undefined ? idbVal : lsVal;
}

function isUnavailable(err) {
  const name = err?.name || '';
  return name === 'SecurityError' || name === 'InvalidStateError' || /unavailable/i.test(String(err?.message || ''));
}

export async function dbSet(key, value) {
  try {
    const db = await openDB();
    await tx(db, 'readwrite', (s) => s.put(value, key));
    lsDel(key); // a fallback copy from an earlier outage must not outlive the real one
    return 'idb';
  } catch {
    return lsSet(key, value) ? 'localStorage' : null;
  }
}

export async function dbDelete(key) {
  try {
    const db = await openDB();
    await tx(db, 'readwrite', (s) => s.delete(key));
  } catch {
    /* ignore */
  }
  lsDel(key);
}

export async function dbKeys() {
  try {
    const db = await openDB();
    return await tx(db, 'readonly', (s) => s.getAllKeys());
  } catch {
    const out = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(LS_PREFIX)) out.push(k.slice(LS_PREFIX.length));
      }
    } catch { /* ignore */ }
    return out;
  }
}

export async function dbClearAll() {
  try {
    const db = await openDB();
    await tx(db, 'readwrite', (s) => s.clear());
  } catch { /* ignore */ }
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(LS_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch { /* ignore */ }
}

export async function storageEstimate() {
  try {
    if (navigator.storage?.estimate) {
      const { usage, quota } = await navigator.storage.estimate();
      return { usage, quota };
    }
  } catch { /* ignore */ }
  return null;
}

export async function requestPersistence() {
  try {
    if (navigator.storage?.persist) return await navigator.storage.persist();
  } catch { /* ignore */ }
  return false;
}
