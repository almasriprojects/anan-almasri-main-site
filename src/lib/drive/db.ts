// ─── Tiny IndexedDB wrapper for the drive ──────────────────────
// Stores two object stores:  items  +  activity
// Keeps the API surface small so the rest of the app stays clean.

import type { ActivityEvent, DriveItem } from "./types";

const DB_NAME = "anan-drive";
const DB_VERSION = 1;
const STORE_ITEMS = "items";
const STORE_ACTIVITY = "activity";

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_ITEMS)) {
        const store = db.createObjectStore(STORE_ITEMS, { keyPath: "id" });
        store.createIndex("parentId", "parentId", { unique: false });
        store.createIndex("trashedAt", "trashedAt", { unique: false });
        store.createIndex("starred", "starred", { unique: false });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
      }
      if (!db.objectStoreNames.contains(STORE_ACTIVITY)) {
        db.createObjectStore(STORE_ACTIVITY, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

// Convenience: run a "fire-and-forget" write transaction
// (no value returned).  Resolves when the transaction commits.
function writeTx(
  store: string,
  work: (s: IDBObjectStore) => void,
): Promise<void> {
  return openDb().then(
    (db) =>
      new Promise<void>((resolve, reject) => {
        const t = db.transaction(store, "readwrite");
        t.oncomplete = () => resolve();
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
        try {
          work(t.objectStore(store));
        } catch (e) {
          reject(e);
        }
      }),
  );
}

// Convenience: run a "read" transaction that returns a value
function readTx<T>(
  store: string,
  work: (s: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(store, "readonly");
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
        try {
          const req = work(t.objectStore(store));
          req.onsuccess = () => resolve(req.result);
          req.onerror = () => reject(req.error);
        } catch (e) {
          reject(e);
        }
      }),
  );
}

// ─── items ─────────────────────────────────────────────────────
export const itemsDb = {
  getAll: () => readTx<DriveItem[]>(STORE_ITEMS, (s) => s.getAll()),
  put: (item: DriveItem) => writeTx(STORE_ITEMS, (s) => void s.put(item)),
  putMany: (items: DriveItem[]) =>
    writeTx(STORE_ITEMS, (s) => {
      items.forEach((i) => s.put(i));
    }),
  delete: (id: string) => writeTx(STORE_ITEMS, (s) => void s.delete(id)),
  clear: () => writeTx(STORE_ITEMS, (s) => void s.clear()),
};

// ─── activity ──────────────────────────────────────────────────
export const activityDb = {
  getAll: () => readTx<ActivityEvent[]>(STORE_ACTIVITY, (s) => s.getAll()),
  add: (event: ActivityEvent) => writeTx(STORE_ACTIVITY, (s) => void s.add(event)),
  clear: () => writeTx(STORE_ACTIVITY, (s) => void s.clear()),
};

// ─── storage estimate (best effort, may be unavailable) ────────
export async function storageEstimate(): Promise<{
  usedBytes: number;
  quotaBytes: number;
  percent: number;
} | null> {
  if (typeof navigator === "undefined" || !navigator.storage?.estimate) {
    return null;
  }
  try {
    const est = await navigator.storage.estimate();
    const used = est.usage ?? 0;
    const quota = est.quota ?? 0;
    const percent = quota > 0 ? Math.min(100, (used / quota) * 100) : 0;
    return { usedBytes: used, quotaBytes: quota, percent };
  } catch {
    return null;
  }
}
