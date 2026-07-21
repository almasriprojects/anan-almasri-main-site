// ─── Drive store ───────────────────────────────────────────────
// React Context + reducer pattern.  Persists every mutation to
// IndexedDB, so the entire file system survives a page reload.
//
// Exposed via the `useDriveStore()` hook (selective) or
// `useDrive()` for the full state.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { ActivityEvent, DriveItem, FileKind, FolderColor, ItemKind, SortState, ViewMode } from "./types";
import { activityDb, itemsDb } from "./db";
import { buildSeed, buildSeedActivity } from "./seed";
import { genId, inferFileKind, validateName } from "./utils";

// ─── State shape ───────────────────────────────────────────────
interface DriveState {
  items: DriveItem[];
  activity: ActivityEvent[];
  view: ViewMode;
  sort: SortState;
  ready: boolean; // true after initial IndexedDB hydration
}

type Action =
  | { type: "HYDRATE"; items: DriveItem[]; activity: ActivityEvent[] }
  | { type: "SET_VIEW"; view: ViewMode }
  | { type: "SET_SORT"; sort: SortState }
  | { type: "PUT"; item: DriveItem }
  | { type: "PUT_MANY"; items: DriveItem[] }
  | { type: "DELETE"; id: string };

const initialState: DriveState = {
  items: [],
  activity: [],
  view: "grid",
  sort: { key: "modified", dir: "desc" },
  ready: false,
};

function reducer(state: DriveState, action: Action): DriveState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, items: action.items, activity: action.activity, ready: true };
    case "SET_VIEW":
      return { ...state, view: action.view };
    case "SET_SORT":
      return { ...state, sort: action.sort };
    case "PUT": {
      const others = state.items.filter((i) => i.id !== action.item.id);
      return { ...state, items: [...others, action.item] };
    }
    case "PUT_MANY": {
      const map = new Map(state.items.map((i) => [i.id, i]));
      action.items.forEach((i) => map.set(i.id, i));
      return { ...state, items: Array.from(map.values()) };
    }
    case "DELETE": {
      return {
        ...state,
        items: state.items.filter((i) => i.id !== action.id),
      };
    }
    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────
interface DriveContextValue extends DriveState {
  // CRUD
  createItem: (input: {
    name: string;
    kind: ItemKind;
    fileKind?: FileKind;
    parentId: string | null;
    color?: FolderColor;
    tags?: string[];
    content?: string;
  }) => Promise<{ ok: true; item: DriveItem } | { ok: false; error: string }>;
  renameItem: (id: string, name: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  moveItems: (ids: string[], targetParentId: string | null) => Promise<{ ok: true } | { ok: false; error: string }>;
  duplicateItem: (id: string) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  toggleShare: (id: string) => Promise<void>;
  trashItems: (ids: string[]) => Promise<void>;
  restoreItems: (ids: string[]) => Promise<void>;
  deleteForever: (ids: string[]) => Promise<void>;
  emptyTrash: () => Promise<void>;
  updateItemContent: (id: string, content: string) => Promise<void>;
  updateItemTags: (id: string, tags: string[]) => Promise<void>;
  updateItemColor: (id: string, color: FolderColor) => Promise<void>;
  importFiles: (files: File[], parentId: string | null) => Promise<DriveItem[]>;
  resetToSeed: () => Promise<void>;
  setView: (view: ViewMode) => void;
  setSort: (sort: SortState) => void;
}

const DriveContext = createContext<DriveContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────
export function DriveProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const itemsRef = useRef(state.items);
  itemsRef.current = state.items;
  const [, forceTick] = useState(0);

  // Hydrate from IndexedDB on mount, seeding if empty
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        let existing = await itemsDb.getAll();
        let activity = await activityDb.getAll();
        if (existing.length === 0) {
          const seedItems = buildSeed();
          const seedActivity = buildSeedActivity();
          await itemsDb.putMany(seedItems);
          await activityDb.clear();
          for (const a of seedActivity) await activityDb.add(a);
          existing = seedItems;
          activity = seedActivity;
        }
        if (!cancelled) {
          dispatch({ type: "HYDRATE", items: existing, activity });
        }
      } catch (err) {
        console.error("[drive] hydrate failed", err);
        if (!cancelled) {
          // mark ready anyway so the UI doesn't hang
          dispatch({ type: "HYDRATE", items: [], activity: [] });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Append an activity event: persist to DB + refresh in-memory list
  const pushActivity = useCallback(async (event: Omit<ActivityEvent, "id" | "at">) => {
    const full: ActivityEvent = { id: genId("act"), at: Date.now(), ...event };
    try {
      await activityDb.add(full);
    } catch (e) {
      console.warn("[drive] activity log failed", e);
    }
    // Refresh the in-memory activity list with what's now in the DB
    const fresh = await activityDb.getAll();
    forceTick((n) => n + 1);
    dispatch({ type: "HYDRATE", items: itemsRef.current, activity: fresh });
  }, []);

  // ─── createItem ───────────────────────────────────────────
  const createItem = useCallback<DriveContextValue["createItem"]>(
    async (input) => {
      const trimmed = input.name.trim();
      const err = validateName(trimmed, itemsRef.current, input.parentId);
      if (err) return { ok: false, error: err };
      const now = Date.now();
      const item: DriveItem = {
        id: genId(input.kind === "folder" ? "f" : "i"),
        parentId: input.parentId,
        name: trimmed,
        kind: input.kind,
        fileKind: input.kind === "file" ? input.fileKind ?? "other" : undefined,
        size: 0,
        ownerId: "admin",
        ownerName: "Admin",
        createdAt: now,
        updatedAt: now,
        starred: false,
        shared: false,
        trashedAt: null,
        tags: input.tags ?? [],
        color: input.kind === "folder" ? input.color ?? "blue" : undefined,
        content: input.content,
      };
      await itemsDb.put(item);
      dispatch({ type: "PUT", item });
      pushActivity({
        itemId: item.id,
        itemName: item.name,
        action: input.kind === "folder" ? "created" : "created",
        detail: input.parentId
          ? `in folder`
          : `at root`,
      });
      return { ok: true, item };
    },
    [pushActivity],
  );

  // ─── renameItem ───────────────────────────────────────────
  const renameItem = useCallback<DriveContextValue["renameItem"]>(
    async (id, name) => {
      const item = itemsRef.current.find((i) => i.id === id);
      if (!item) return { ok: false, error: "Item not found" };
      const err = validateName(name, itemsRef.current, item.parentId, id);
      if (err) return { ok: false, error: err };
      const updated: DriveItem = { ...item, name: name.trim(), updatedAt: Date.now() };
      await itemsDb.put(updated);
      dispatch({ type: "PUT", item: updated });
      pushActivity({
        itemId: id,
        itemName: updated.name,
        action: "renamed",
        detail: `from ${item.name}`,
      });
      return { ok: true };
    },
    [pushActivity],
  );

  // ─── moveItems ────────────────────────────────────────────
  const moveItems = useCallback<DriveContextValue["moveItems"]>(
    async (ids, targetParentId) => {
      const updates: DriveItem[] = [];
      for (const id of ids) {
        const item = itemsRef.current.find((i) => i.id === id);
        if (!item) continue;
        if (item.parentId === targetParentId) continue;
        // Prevent moving a folder into itself or its descendant
        if (
          item.kind === "folder" &&
          targetParentId &&
          (await isDescendantCheck(targetParentId, id))
        ) {
          continue;
        }
        if (item.kind === "folder" && targetParentId === id) continue;
        const updated: DriveItem = { ...item, parentId: targetParentId, updatedAt: Date.now() };
        updates.push(updated);
      }
      if (updates.length === 0) return { ok: false, error: "Nothing to move" };
      await itemsDb.putMany(updates);
      dispatch({ type: "PUT_MANY", items: updates });
      pushActivity({
        itemId: updates[0].id,
        itemName: updates.map((u) => u.name).join(", "),
        action: "moved",
        detail: `${updates.length} item${updates.length > 1 ? "s" : ""}`,
      });
      return { ok: true };
    },
    [pushActivity],
  );

  // ─── duplicateItem ────────────────────────────────────────
  const duplicateItem = useCallback<DriveContextValue["duplicateItem"]>(
    async (id) => {
      const item = itemsRef.current.find((i) => i.id === id);
      if (!item) return;
      const now = Date.now();
      const copy: DriveItem = {
        ...item,
        id: genId(item.kind === "folder" ? "f" : "i"),
        name: `${item.name} copy`,
        createdAt: now,
        updatedAt: now,
        starred: false,
      };
      await itemsDb.put(copy);
      dispatch({ type: "PUT", item: copy });
      pushActivity({
        itemId: copy.id,
        itemName: copy.name,
        action: "duplicated",
      });
    },
    [pushActivity],
  );

  // ─── toggleStar ──────────────────────────────────────────
  const toggleStar = useCallback<DriveContextValue["toggleStar"]>(
    async (id) => {
      const item = itemsRef.current.find((i) => i.id === id);
      if (!item) return;
      const updated: DriveItem = { ...item, starred: !item.starred, updatedAt: Date.now() };
      await itemsDb.put(updated);
      dispatch({ type: "PUT", item: updated });
      pushActivity({
        itemId: id,
        itemName: updated.name,
        action: updated.starred ? "starred" : "unstarred",
      });
    },
    [pushActivity],
  );

  // ─── toggleShare ─────────────────────────────────────────
  const toggleShare = useCallback<DriveContextValue["toggleShare"]>(
    async (id) => {
      const item = itemsRef.current.find((i) => i.id === id);
      if (!item) return;
      const updated: DriveItem = { ...item, shared: !item.shared, updatedAt: Date.now() };
      await itemsDb.put(updated);
      dispatch({ type: "PUT", item: updated });
      pushActivity({
        itemId: id,
        itemName: updated.name,
        action: updated.shared ? "shared" : "unshared",
      });
    },
    [pushActivity],
  );

  // ─── trash / restore / delete forever / empty trash ──────
  const trashItems = useCallback<DriveContextValue["trashItems"]>(
    async (ids) => {
      const updates: DriveItem[] = [];
      for (const id of ids) {
        const item = itemsRef.current.find((i) => i.id === id);
        if (!item) continue;
        updates.push({ ...item, trashedAt: Date.now(), updatedAt: Date.now() });
      }
      if (!updates.length) return;
      await itemsDb.putMany(updates);
      dispatch({ type: "PUT_MANY", items: updates });
      pushActivity({
        itemId: updates[0].id,
        itemName: updates.map((u) => u.name).join(", "),
        action: "trashed",
        detail: `${updates.length} item${updates.length > 1 ? "s" : ""}`,
      });
    },
    [pushActivity],
  );

  const restoreItems = useCallback<DriveContextValue["restoreItems"]>(
    async (ids) => {
      const updates: DriveItem[] = [];
      for (const id of ids) {
        const item = itemsRef.current.find((i) => i.id === id);
        if (!item) continue;
        updates.push({ ...item, trashedAt: null, updatedAt: Date.now() });
      }
      if (!updates.length) return;
      await itemsDb.putMany(updates);
      dispatch({ type: "PUT_MANY", items: updates });
      pushActivity({
        itemId: updates[0].id,
        itemName: updates.map((u) => u.name).join(", "),
        action: "restored",
        detail: `${updates.length} item${updates.length > 1 ? "s" : ""}`,
      });
    },
    [pushActivity],
  );

  const deleteForever = useCallback<DriveContextValue["deleteForever"]>(
    async (ids) => {
      for (const id of ids) await itemsDb.delete(id);
      ids.forEach((id) => dispatch({ type: "DELETE", id }));
      pushActivity({
        itemId: ids[0],
        itemName: `${ids.length} item${ids.length > 1 ? "s" : ""}`,
        action: "deleted",
      });
    },
    [pushActivity],
  );

  const emptyTrash = useCallback<DriveContextValue["emptyTrash"]>(async () => {
    const trashIds = itemsRef.current.filter((i) => i.trashedAt !== null).map((i) => i.id);
    if (!trashIds.length) return;
    for (const id of trashIds) await itemsDb.delete(id);
    trashIds.forEach((id) => dispatch({ type: "DELETE", id }));
    pushActivity({
      itemId: trashIds[0],
      itemName: "Trash",
      action: "deleted",
      detail: `emptied trash (${trashIds.length})`,
    });
  }, [pushActivity]);

  // ─── content / tags / color updates ─────────────────────
  const updateItemContent = useCallback<DriveContextValue["updateItemContent"]>(
    async (id, content) => {
      const item = itemsRef.current.find((i) => i.id === id);
      if (!item) return;
      const updated: DriveItem = { ...item, content, size: new Blob([content]).size, updatedAt: Date.now() };
      await itemsDb.put(updated);
      dispatch({ type: "PUT", item: updated });
    },
    [],
  );

  const updateItemTags = useCallback<DriveContextValue["updateItemTags"]>(
    async (id, tags) => {
      const item = itemsRef.current.find((i) => i.id === id);
      if (!item) return;
      const updated: DriveItem = { ...item, tags, updatedAt: Date.now() };
      await itemsDb.put(updated);
      dispatch({ type: "PUT", item: updated });
    },
    [],
  );

  const updateItemColor = useCallback<DriveContextValue["updateItemColor"]>(
    async (id, color) => {
      const item = itemsRef.current.find((i) => i.id === id);
      if (!item || item.kind !== "folder") return;
      const updated: DriveItem = { ...item, color, updatedAt: Date.now() };
      await itemsDb.put(updated);
      dispatch({ type: "PUT", item: updated });
    },
    [],
  );

  // ─── import files (drag/drop or file picker) ─────────────
  const importFiles = useCallback<DriveContextValue["importFiles"]>(
    async (files, parentId) => {
      const created: DriveItem[] = [];
      const now = Date.now();
      for (const file of files) {
        const trimmed = file.name.trim();
        const err = validateName(trimmed, itemsRef.current, parentId);
        if (err) {
          console.warn(`[drive] skipped ${file.name}: ${err}`);
          continue;
        }
        const fileKind = inferFileKind(file.name, file.type);
        const item: DriveItem = {
          id: genId("i"),
          parentId,
          name: trimmed,
          kind: "file",
          fileKind,
          size: file.size,
          mimeType: file.type || undefined,
          extension: trimmed.includes(".") ? trimmed.split(".").pop()!.toLowerCase() : undefined,
          ownerId: "admin",
          ownerName: "Admin",
          createdAt: now,
          updatedAt: now,
          starred: false,
          shared: false,
          trashedAt: null,
          tags: [],
          // Try to read text files (small) into the content field for preview
          content: file.size < 256 * 1024 && (fileKind === "text" || fileKind === "code")
            ? await file.text().catch(() => undefined)
            : undefined,
        };
        await itemsDb.put(item);
        created.push(item);
        dispatch({ type: "PUT", item });
        pushActivity({
          itemId: item.id,
          itemName: item.name,
          action: "uploaded",
          detail: `${(file.size / 1024).toFixed(1)} KB`,
        });
      }
      return created;
    },
    [pushActivity],
  );

  // ─── reset to seed (for development) ────────────────────
  const resetToSeed = useCallback<DriveContextValue["resetToSeed"]>(async () => {
    await itemsDb.clear();
    await activityDb.clear();
    const seed = buildSeed();
    await itemsDb.putMany(seed);
    dispatch({ type: "HYDRATE", items: seed, activity: [] });
  }, []);

  // ─── view / sort setters ────────────────────────────────
  const setView = useCallback((v: ViewMode) => dispatch({ type: "SET_VIEW", view: v }), []);
  const setSort = useCallback((s: SortState) => dispatch({ type: "SET_SORT", sort: s }), []);

  const value = useMemo<DriveContextValue>(
    () => ({
      ...state,
      createItem,
      renameItem,
      moveItems,
      duplicateItem,
      toggleStar,
      toggleShare,
      trashItems,
      restoreItems,
      deleteForever,
      emptyTrash,
      updateItemContent,
      updateItemTags,
      updateItemColor,
      importFiles,
      resetToSeed,
      setView,
      setSort,
    }),
    [
      state,
      createItem,
      renameItem,
      moveItems,
      duplicateItem,
      toggleStar,
      toggleShare,
      trashItems,
      restoreItems,
      deleteForever,
      emptyTrash,
      updateItemContent,
      updateItemTags,
      updateItemColor,
      importFiles,
      resetToSeed,
      setView,
      setSort,
    ],
  );

  return <DriveContext.Provider value={value}>{children}</DriveContext.Provider>;
}

// ─── Hooks ─────────────────────────────────────────────────────
export function useDrive(): DriveContextValue {
  const ctx = useContext(DriveContext);
  if (!ctx) throw new Error("useDrive must be used within a DriveProvider");
  return ctx;
}

// Quick helper used by moveItems
async function isDescendantCheck(
  candidateId: string,
  ofItemId: string,
): Promise<boolean> {
  // Avoid circular imports by re-deriving with a flat scan
  const all = await itemsDb.getAll();
  const byParent = new Map<string, string[]>();
  for (const it of all) {
    if (it.parentId) {
      const arr = byParent.get(it.parentId) ?? [];
      arr.push(it.id);
      byParent.set(it.parentId, arr);
    }
  }
  if (candidateId === ofItemId) return true;
  const stack = [ofItemId];
  let safety = 0;
  while (stack.length && safety < 1000) {
    const id = stack.pop()!;
    if (id === candidateId) return true;
    const kids = byParent.get(id);
    if (kids) stack.push(...kids);
    safety++;
  }
  return false;
}
