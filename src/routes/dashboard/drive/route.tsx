// ─── /dashboard/drive (parent layout) ─────────────────────────
// Provides the 3-column Finder-style shell (sidebar + main +
// inspector) for every drive sub-route, plus the DriveProvider
// context, drag-and-drop state, and shared keyboard shortcuts.
//
// Shared state (selection, active item, CRUD handlers) is passed
// to children via the DriveOutletCtx React context (see
// ../../../lib/drive/outletContext.ts).

import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HardDrive,
  Menu,
  X,
  ChevronRight,
  Cloud,
  Star,
  Share2,
  Trash2,
  Info,
  Edit3,
  Copy,
  FolderPlus,
  FilePlus,
  Download,
  RotateCcw,
  XCircle,
  Move,
  type LucideIcon,
} from "lucide-react";
import { DriveProvider, useDrive } from "../../../lib/drive/store";
import type { ActivityEvent, DriveItem, FileKind, FolderColor, ItemKind } from "../../../lib/drive/types";
import { buildBreadcrumb } from "../../../lib/drive/utils";
import { DriveOutletCtx } from "../../../lib/drive/outletContext";
import Sidebar from "../../../components/drive/Sidebar";
import Breadcrumb from "../../../components/drive/Breadcrumb";
import ContextMenu, { type ContextMenuItem } from "../../../components/drive/ContextMenu";
import NewItemModal from "../../../components/drive/NewItemModal";
import FilePreview from "../../../components/drive/FilePreview";
import TagPicker from "../../../components/drive/TagPicker";
import ActivityStrip from "../../../components/drive/ActivityStrip";
import ConfirmDialog from "../../../components/drive/ConfirmDialog";

export const Route = createFileRoute("/dashboard/drive")({
  component: DriveLayout,
});

// ─── Outer: wraps in DriveProvider ─────────────────────────────
function DriveLayout() {
  return (
    <DriveProvider>
      <DriveShell />
    </DriveProvider>
  );
}

// ─── Inner: the actual Finder-style 3-col shell ────────────────
function DriveShell() {
  const drive = useDrive();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [newItemKind, setNewItemKind] = useState<ItemKind | null>(null);
  const [confirm, setConfirm] = useState<null | {
    title: string;
    message: string;
    confirmLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
  }>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    items: ContextMenuItem[];
  } | null>(null);
  const [globalDropOver, setGlobalDropOver] = useState(false);

  // Detect the current view: are we inside a folder route?
  const folderMatch = location.pathname.match(/^\/dashboard\/drive\/folder\/(.+)$/);
  const currentFolderId = folderMatch ? folderMatch[1] : null;
  const currentFolder = currentFolderId
    ? drive.items.find((i) => i.id === currentFolderId) ?? null
    : null;
  const isTrash = location.pathname === "/dashboard/drive/trash";
  const isSpecial =
    location.pathname === "/dashboard/drive/upload" ||
    location.pathname === "/dashboard/drive/storage";

  // breadcrumb path
  const breadcrumbPath = useMemo(
    () => (currentFolder ? buildBreadcrumb(currentFolder.id, drive.items) : []),
    [currentFolder, drive.items],
  );

  // Reset selection when route changes
  useEffect(() => {
    setSelectedIds(new Set());
    setActiveId(null);
    setRenamingId(null);
    setContextMenu(null);
  }, [location.pathname]);

  // Close sidebar on resize to lg+
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ─── Trash handler ─────────────────────────────────────
  const handleTrash = useCallback(
    (ids: string[]) => {
      if (!ids.length) return;
      const items = drive.items.filter((i) => ids.includes(i.id));
      const names = items.map((i) => i.name).join(", ");
      setConfirm({
        title: "Move to Trash?",
        message: `"${names.length > 60 ? names.slice(0, 57) + "…" : names}" will be moved to Trash. You can restore it for 30 days.`,
        confirmLabel: "Move to Trash",
        destructive: true,
        onConfirm: async () => {
          await drive.trashItems(ids);
          setSelectedIds(new Set());
          setActiveId(null);
          setConfirm(null);
        },
      });
    },
    [drive],
  );

  const handleRestore = useCallback(
    (ids: string[]) => {
      void drive.restoreItems(ids);
      setSelectedIds(new Set());
      setActiveId(null);
    },
    [drive],
  );

  const handleDeleteForever = useCallback(
    (ids: string[]) => {
      if (!ids.length) return;
      setConfirm({
        title: "Delete forever?",
        message: `This will permanently delete ${ids.length} item${ids.length > 1 ? "s" : ""}. This action cannot be undone.`,
        confirmLabel: "Delete",
        destructive: true,
        onConfirm: async () => {
          await drive.deleteForever(ids);
          setSelectedIds(new Set());
          setActiveId(null);
          setConfirm(null);
        },
      });
    },
    [drive],
  );

  // ─── keyboard shortcuts ─────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // ⌘1 / ⌘2 view switch
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        if (e.key === "1") {
          e.preventDefault();
          drive.setView("grid");
        } else if (e.key === "2") {
          e.preventDefault();
          drive.setView("list");
        }
        return;
      }
      // Esc: deselect
      if (e.key === "Escape") {
        setSelectedIds(new Set());
        setActiveId(null);
        setRenamingId(null);
        setContextMenu(null);
      }
      // Delete / Backspace: trash
      if ((e.key === "Delete" || e.key === "Backspace") && selectedIds.size > 0 && !isTrash) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        handleTrash(Array.from(selectedIds));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedIds, isTrash, drive, handleTrash]);

  // ─── Selection helpers ─────────────────────────────────
  const handleItemClick = useCallback((id: string, e: React.MouseEvent) => {
    setActiveId(id);
    if (e.metaKey || e.ctrlKey) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        return next;
      });
    } else if (e.shiftKey) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
    } else {
      setSelectedIds(new Set([id]));
    }
  }, []);

  // ─── Double click ─────────────────────────────────────
  const handleItemDoubleClick = useCallback(
    (id: string) => {
      const item = drive.items.find((i) => i.id === id);
      if (!item) return;
      if (item.kind === "folder" && !isTrash && item.trashedAt === null) {
        navigate({ to: "/dashboard/drive/folder/$folderId", params: { folderId: id } });
      } else if (item.kind === "file") {
        setActiveId(id);
        setSelectedIds(new Set([id]));
      }
    },
    [drive.items, isTrash, navigate],
  );

  // ─── Rename ────────────────────────────────────────────
  const handleRenameCommit = useCallback(
    async (id: string, name: string) => {
      const r = await drive.renameItem(id, name);
      if (!r.ok) {
        setRenamingId(id);
        return;
      }
      setRenamingId(null);
    },
    [drive],
  );

  // ─── Star / Share ─────────────────────────────────────
  const handleToggleStar = useCallback(
    (id: string) => {
      void drive.toggleStar(id);
    },
    [drive],
  );
  const handleToggleShare = useCallback(
    (id: string) => {
      void drive.toggleShare(id);
    },
    [drive],
  );

  // ─── Drag start / end ─────────────────────────────────
  const handleItemDragStart = useCallback(
    (id: string, e: React.DragEvent) => {
      const ids = selectedIds.has(id) ? Array.from(selectedIds) : [id];
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", ids.join(","));
    },
    [selectedIds],
  );
  const handleItemDragEnd = useCallback(() => {}, []);

  // ─── Create new item ──────────────────────────────────
  const handleCreate = useCallback(
    async (input: { name: string; color?: FolderColor; fileKind?: FileKind; content?: string }) => {
      const parentId = isTrash ? null : currentFolder?.id ?? null;
      const kind: ItemKind = newItemKind ?? "file";
      const res = await drive.createItem({
        name: input.name,
        kind,
        fileKind: kind === "file" ? input.fileKind ?? "text" : undefined,
        parentId,
        color: input.color,
        content: input.content,
      });
      if (!res.ok) {
        throw new Error(res.error);
      }
    },
    [drive, currentFolder, isTrash, newItemKind],
  );

  // ─── Context menu helpers ────────────────────────────
  const openContextMenu = useCallback(
    (x: number, y: number, items: ContextMenuItem[]) => {
      setContextMenu({ x, y, items });
    },
    [],
  );

  const buildItemMenu = useCallback(
    (item: DriveItem, ids: string[]): ContextMenuItem[] => {
      const multi = ids.length > 1;
      return [
        {
          label: "Open",
          icon: ChevronRight as LucideIcon,
          onClick: () => {
            if (item.kind === "folder" && item.trashedAt === null) {
              navigate({ to: "/dashboard/drive/folder/$folderId", params: { folderId: item.id } });
            }
          },
          disabled: multi || item.kind !== "folder",
        },
        { separator: true, label: "" },
        {
          label: multi ? `Rename (${ids.length})` : "Rename",
          icon: Edit3,
          onClick: () => {
            if (ids.length === 1) setRenamingId(ids[0]);
          },
          disabled: multi,
        },
        {
          label: multi ? `Duplicate (${ids.length})` : "Duplicate",
          icon: Copy,
          onClick: () => {
            ids.forEach((id) => void drive.duplicateItem(id));
          },
        },
        { separator: true, label: "" },
        {
          label: item.starred ? "Remove from Starred" : "Add to Starred",
          icon: Star,
          onClick: () => {
            ids.forEach((id) => void drive.toggleStar(id));
          },
        },
        {
          label: item.shared ? "Stop sharing" : "Share",
          icon: Share2,
          onClick: () => {
            ids.forEach((id) => void drive.toggleShare(id));
          },
        },
        {
          label: "Move to Root",
          icon: Move,
          onClick: () => {
            void drive.moveItems(ids, null);
          },
        },
        { separator: true, label: "" },
        {
          label: multi ? `Download (${ids.length})` : "Download",
          icon: Download,
          onClick: () => {
            ids.forEach((id) => {
              const it = drive.items.find((i) => i.id === id);
              if (!it) return;
              if (it.content) {
                const blob = new Blob([it.content], { type: it.mimeType ?? "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = it.name;
                a.click();
                setTimeout(() => URL.revokeObjectURL(url), 0);
              }
            });
          },
        },
        { separator: true, label: "" },
        {
          label: "Move to Trash",
          icon: Trash2,
          danger: true,
          onClick: () => handleTrash(ids),
        },
      ];
    },
    [drive, handleTrash, navigate],
  );

  const buildTrashMenu = useCallback(
    (_item: DriveItem, ids: string[]): ContextMenuItem[] => [
      {
        label: "Restore",
        icon: RotateCcw,
        onClick: () => handleRestore(ids),
      },
      { separator: true, label: "" },
      {
        label: "Delete Forever",
        icon: XCircle,
        danger: true,
        onClick: () => handleDeleteForever(ids),
      },
    ],
    [handleDeleteForever, handleRestore],
  );

  const handleItemContextMenu = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const item = drive.items.find((i) => i.id === id);
      if (!item) return;
      if (!selectedIds.has(id)) {
        setSelectedIds(new Set([id]));
        setActiveId(id);
      }
      const ids = selectedIds.has(id) ? Array.from(selectedIds) : [id];
      openContextMenu(
        e.clientX,
        e.clientY,
        isTrash ? buildTrashMenu(item, ids) : buildItemMenu(item, ids),
      );
    },
    [drive.items, isTrash, openContextMenu, selectedIds, buildItemMenu, buildTrashMenu],
  );

  const handleBackgroundContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      openContextMenu(e.clientX, e.clientY, [
        { label: "New Folder", icon: FolderPlus, onClick: () => setNewItemKind("folder") },
        { label: "New Text File", icon: FilePlus, onClick: () => setNewItemKind("file") },
        { separator: true, label: "" },
        {
          label: "Upload Files…",
          icon: Cloud,
          onClick: () => setNewItemKind("file"),
        },
      ]);
    },
    [openContextMenu],
  );

  // ─── Active item for inspector ──────────────────────
  const activeItem = useMemo(
    () => (activeId ? drive.items.find((i) => i.id === activeId) ?? null : null),
    [activeId, drive.items],
  );

  // ─── Drop files anywhere (on the main area) ────────
  const handleMainDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setGlobalDropOver(false);
      const files = Array.from(e.dataTransfer.files ?? []);
      if (files.length) {
        const parentId = isTrash ? null : currentFolder?.id ?? null;
        void drive.importFiles(files, parentId);
      }
    },
    [drive, currentFolder, isTrash],
  );

  // ─── Build the context object to pass down ─────────
  const outletCtx = useMemo(
    () => ({
      currentFolder,
      selectedIds,
      setSelectedIds,
      activeId,
      setActiveId,
      renamingId,
      setRenamingId,
      onItemClick: handleItemClick,
      onItemDoubleClick: handleItemDoubleClick,
      onItemContextMenu: handleItemContextMenu,
      onRenameCommit: handleRenameCommit,
      onRenameCancel: () => setRenamingId(null),
      onItemDragStart: handleItemDragStart,
      onItemDragEnd: handleItemDragEnd,
      onToggleStar: handleToggleStar,
      onToggleShare: handleToggleShare,
      onTrash: handleTrash,
      onRestore: handleRestore,
      onDeleteForever: handleDeleteForever,
      onMore: (id: string, e: React.MouseEvent) => handleItemContextMenu(id, e),
      onNewFolder: () => setNewItemKind("folder"),
      onNewFile: () => setNewItemKind("file"),
    }),
    [
      currentFolder,
      selectedIds,
      activeId,
      renamingId,
      handleItemClick,
      handleItemDoubleClick,
      handleItemContextMenu,
      handleRenameCommit,
      handleItemDragStart,
      handleItemDragEnd,
      handleToggleStar,
      handleToggleShare,
      handleTrash,
      handleRestore,
      handleDeleteForever,
    ],
  );

  // ─── Render ─────────────────────────────────────────
  if (isSpecial) {
    return (
      <div className="flex h-[calc(100vh-9rem)] overflow-hidden border border-blueprint-grid/15 bg-blueprint-surface/40 lg:h-[calc(100vh-10rem)]">
        <Sidebar collapsed={!sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-9rem)] overflow-hidden border border-blueprint-grid/15 bg-blueprint-surface/40 lg:h-[calc(100vh-10rem)]">
      {/* ─── Sidebar ──────────────────────────────── */}
      <Sidebar collapsed={!sidebarOpen} onCloseMobile={() => setSidebarOpen(false)} />

      {/* ─── Main + Inspector ─────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main column */}
        <main
          className="relative flex flex-1 flex-col overflow-hidden"
          onContextMenu={handleBackgroundContextMenu}
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes("Files")) e.preventDefault();
          }}
          onDragEnter={(e) => {
            if (e.dataTransfer.types.includes("Files")) setGlobalDropOver(true);
          }}
          onDragLeave={(e) => {
            if (e.currentTarget === e.target) setGlobalDropOver(false);
          }}
          onDrop={handleMainDrop}
        >
          {/* Top bar with hamburger + breadcrumb */}
          <div className="flex items-center gap-2 border-b border-blueprint-grid/15 bg-blueprint-surface/50 px-3 py-2 backdrop-blur-sm lg:px-4">
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="flex h-7 w-7 items-center justify-center rounded text-blueprint-muted transition hover:bg-white/[0.06] hover:text-blueprint-paper lg:hidden"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? <X size={14} /> : <Menu size={14} />}
            </button>
            <Breadcrumb
              path={breadcrumbPath}
              trailing={
                isTrash
                  ? "Trash"
                  : location.pathname === "/dashboard/drive/recent"
                    ? "Recents"
                    : location.pathname === "/dashboard/drive/starred"
                      ? "Starred"
                      : location.pathname === "/dashboard/drive/shared"
                        ? "Shared"
                        : !currentFolderId
                          ? "My Drive"
                          : undefined
              }
            />
          </div>

          {/* Outlet for the page-specific view */}
          <div className="flex-1 overflow-y-auto">
            <DriveOutletCtx.Provider value={outletCtx}>
              <Outlet />
            </DriveOutletCtx.Provider>
          </div>

          {/* Global drop overlay */}
          {globalDropOver && (
            <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center border-2 border-dashed border-blueprint-brass bg-blueprint-brass/10 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-2 text-blueprint-brass">
                <Cloud size={32} />
                <p className="font-mono text-sm">Release to upload</p>
              </div>
            </div>
          )}
        </main>

        {/* ─── Inspector (right column) ──────────────── */}
        <aside className="hidden w-72 shrink-0 flex-col border-l border-blueprint-grid/15 bg-blueprint-surface/40 xl:flex">
          {activeItem ? (
            <Inspector
              item={activeItem}
              onClose={() => {
                setActiveId(null);
                setSelectedIds(new Set());
              }}
              onSaveContent={(c) => void drive.updateItemContent(activeItem.id, c)}
              onUpdateTags={(t) => void drive.updateItemTags(activeItem.id, t)}
              onUpdateColor={(c) => void drive.updateItemColor(activeItem.id, c)}
            />
          ) : (
            <NoSelectionInspector activity={drive.activity} />
          )}
        </aside>
      </div>

      {/* ─── New Item Modal ──────────────────────── */}
      <NewItemModal
        open={newItemKind !== null}
        kind={newItemKind}
        onClose={() => setNewItemKind(null)}
        onCreate={handleCreate}
      />

      {/* ─── Confirm Dialog ──────────────────────── */}
      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.title ?? ""}
        message={confirm?.message ?? ""}
        confirmLabel={confirm?.confirmLabel}
        destructive={confirm?.destructive}
        onConfirm={() => confirm?.onConfirm()}
        onCancel={() => setConfirm(null)}
      />

      {/* ─── Context menu ────────────────────────── */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={contextMenu.items}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

// ─── Inspector ────────────────────────────────────────────────
function Inspector({
  item,
  onClose,
  onSaveContent,
  onUpdateTags,
  onUpdateColor,
}: {
  item: DriveItem;
  onClose: () => void;
  onSaveContent: (c: string) => void;
  onUpdateTags: (t: string[]) => void;
  onUpdateColor: (c: FolderColor) => void;
}) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-blueprint-grid/15 px-4 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted/80">
          Inspector
        </p>
        <button
          onClick={onClose}
          className="text-blueprint-muted/60 transition hover:text-blueprint-paper"
          aria-label="Close inspector"
        >
          <X size={13} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <FilePreview item={item} onSaveContent={onSaveContent} />
      </div>
      <div className="border-t border-blueprint-grid/15 p-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted/80">
          Tags
        </p>
        <TagPicker tags={item.tags} onChange={onUpdateTags} />
      </div>
      {item.kind === "folder" && (
        <div className="border-t border-blueprint-grid/15 p-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted/80">
            Folder color
          </p>
          <FolderColorPicker
            value={item.color ?? "blue"}
            onChange={onUpdateColor}
          />
        </div>
      )}
    </div>
  );
}

// ─── No-selection inspector ──────────────────────────────────
function NoSelectionInspector({ activity }: { activity: ActivityEvent[] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-blueprint-grid/15 px-4 py-2.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted/80">
          Recent Activity
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <ActivityStrip events={activity} max={20} />
      </div>
      <div className="border-t border-blueprint-grid/15 p-4 text-center">
        <Info size={20} className="mx-auto mb-1.5 text-blueprint-muted/60" />
        <p className="text-[10px] leading-relaxed text-blueprint-muted/80">
          Select any item to see its details, preview, and metadata.
        </p>
      </div>
    </div>
  );
}

// ─── Folder color picker (compact) ───────────────────────────
function FolderColorPicker({
  value,
  onChange,
}: {
  value: FolderColor;
  onChange: (c: FolderColor) => void;
}) {
  const colors: FolderColor[] = [
    "blue",
    "green",
    "rose",
    "violet",
    "purple",
    "amber",
    "cyan",
    "orange",
    "gray",
  ];
  return (
    <div className="flex flex-wrap gap-1.5">
      {colors.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`h-5 w-5 rounded-full border transition ${
            value === c ? "border-blueprint-brass scale-110" : "border-blueprint-grid/30"
          }`}
          style={{ background: COLOR_DOT[c] }}
          aria-label={`Color ${c}`}
        />
      ))}
    </div>
  );
}

const COLOR_DOT: Record<FolderColor, string> = {
  blue: "#60a5fa",
  green: "#34d399",
  rose: "#fb7185",
  violet: "#a78bfa",
  purple: "#c084fc",
  amber: "#fbbf24",
  cyan: "#22d3ee",
  orange: "#fb923c",
  gray: "#9ca3af",
};
