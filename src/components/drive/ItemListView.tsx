// ─── ItemListView ─────────────────────────────────────────────
// The shared body used by every drive page (Browse, Recent,
// Shared, Starred, Trash, Folder).  Renders the Toolbar + the
// grid/list of items + an empty state.

import { useMemo, useState } from "react";
import { useDrive } from "../../lib/drive/store";
import { useDriveOutlet } from "../../lib/drive/outletContext";
import type { DriveItem, SortKey } from "../../lib/drive/types";
import { KIND_META } from "../../lib/drive/icons";
import Toolbar from "./Toolbar";
import GridView from "./GridView";
import ListView from "./ListView";
import EmptyState from "./EmptyState";
import { Folder, File, Star, Share2, Trash2, Clock, Inbox } from "lucide-react";

export default function ItemListView({
  title,
  description,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  filter,
  showNew = true,
  contentBelow,
}: {
  title: string;
  description?: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon: typeof Inbox;
  /** Return a list of items to display given all items + the current folder */
  filter: (all: DriveItem[]) => DriveItem[];
  showNew?: boolean;
  /** Optional content rendered above the grid (e.g. stats summary) */
  contentBelow?: React.ReactNode;
}) {
  const drive = useDrive();
  const ctx = useDriveOutlet();
  const [search, setSearch] = useState("");

  // Determine the items to show
  const baseItems = useMemo(() => {
    return filter(drive.items).filter((i) => i.parentId === (ctx.currentFolder?.id ?? null) || filter(drive.items).includes(i));
  }, [drive.items, ctx.currentFolder, filter]);

  // Re-derive: the filter is responsible for trimming, but we need to
  // also exclude trashed items unless the filter is for trash.
  // To keep things simple, the filter is the single source of truth.

  // Sort
  const sorted = useMemo(() => {
    const sortedItems = [...baseItems];
    sortedItems.sort((a, b) => {
      // Folders first, always
      if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
      let cmp = 0;
      switch (drive.sort.key) {
        case "name":
          cmp = a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
          break;
        case "size":
          cmp = a.size - b.size;
          break;
        case "kind":
          cmp = (a.fileKind ?? a.kind).localeCompare(b.fileKind ?? b.kind);
          break;
        case "modified":
          cmp = a.updatedAt - b.updatedAt;
          break;
      }
      return drive.sort.dir === "asc" ? cmp : -cmp;
    });
    return sortedItems;
  }, [baseItems, drive.sort]);

  // Filter by search
  const visible = useMemo(() => {
    if (!search.trim()) return sorted;
    const q = search.toLowerCase();
    return sorted.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.tags.some((t) => t.includes(q)) ||
        (i.fileKind && KIND_META[i.fileKind].label.toLowerCase().includes(q)),
    );
  }, [sorted, search]);

  const handleSortChange = (k: SortKey) => {
    if (drive.sort.key === k) {
      drive.setSort({ key: k, dir: drive.sort.dir === "asc" ? "desc" : "asc" });
    } else {
      drive.setSort({ key: k, dir: "asc" });
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header strip with title + description */}
      {(title || description) && (
        <div className="border-b border-blueprint-grid/15 bg-blueprint-surface/30 px-4 py-3">
          <p className="font-mono text-sm font-semibold text-blueprint-paper">{title}</p>
          {description && (
            <p className="mt-0.5 text-[11px] text-blueprint-muted">{description}</p>
          )}
        </div>
      )}

      {/* Toolbar */}
      <Toolbar
        search={search}
        onSearchChange={setSearch}
        onNewFolder={ctx.onNewFolder}
        onNewFile={ctx.onNewFile}
        showNew={showNew}
      />

      {/* Optional summary content */}
      {contentBelow}

      {/* Items grid or list */}
      <div className="flex-1 overflow-y-auto p-3">
        {visible.length === 0 ? (
          <EmptyState
            icon={emptyIcon}
            title={emptyTitle}
            description={search ? `No items match "${search}".` : emptyDescription}
          />
        ) : drive.view === "grid" ? (
          <GridView
            items={visible}
            selectedIds={ctx.selectedIds}
            activeId={ctx.activeId}
            renamingId={ctx.renamingId}
            onItemClick={ctx.onItemClick}
            onItemDoubleClick={ctx.onItemDoubleClick}
            onItemContextMenu={ctx.onItemContextMenu}
            onRenameCommit={ctx.onRenameCommit}
            onRenameCancel={ctx.onRenameCancel}
            onItemDragStart={ctx.onItemDragStart}
            onItemDragEnd={ctx.onItemDragEnd}
            onToggleStar={ctx.onToggleStar}
            onToggleShare={ctx.onToggleShare}
            onItemDragOver={() => {}}
            onItemDrop={() => {}}
          />
        ) : (
          <ListView
            items={visible}
            selectedIds={ctx.selectedIds}
            activeId={ctx.activeId}
            renamingId={ctx.renamingId}
            sort={drive.sort}
            onSortChange={handleSortChange}
            onItemClick={ctx.onItemClick}
            onItemDoubleClick={ctx.onItemDoubleClick}
            onItemContextMenu={ctx.onItemContextMenu}
            onRenameCommit={ctx.onRenameCommit}
            onRenameCancel={ctx.onRenameCancel}
            onItemDragStart={ctx.onItemDragStart}
            onItemDragEnd={ctx.onItemDragEnd}
            onToggleStar={ctx.onToggleStar}
            onToggleShare={ctx.onToggleShare}
            onMore={ctx.onMore}
          />
        )}
      </div>
    </div>
  );
}

// Re-export some useful icon aliases for callers
export { Folder, File, Star, Share2, Trash2, Clock };
