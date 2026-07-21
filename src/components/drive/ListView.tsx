// ─── ListView ──────────────────────────────────────────────────
// Renders the items as a list/table with columns: Name, Kind,
// Size, Modified, Actions.

import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";
import { KIND_META } from "../../lib/drive/icons";
import type { DriveItem, SortKey, SortState } from "../../lib/drive/types";
import FileRow from "./FileRow";

export default function ListView({
  items,
  selectedIds,
  activeId,
  renamingId,
  sort,
  onSortChange,
  onItemClick,
  onItemDoubleClick,
  onItemContextMenu,
  onRenameCommit,
  onRenameCancel,
  onItemDragStart,
  onItemDragEnd,
  onToggleStar,
  onToggleShare,
  onMore,
}: {
  items: DriveItem[];
  selectedIds: Set<string>;
  activeId: string | null;
  renamingId: string | null;
  sort: SortState;
  onSortChange: (key: SortKey) => void;
  onItemClick: (id: string, e: React.MouseEvent) => void;
  onItemDoubleClick: (id: string, e: React.MouseEvent) => void;
  onItemContextMenu: (id: string, e: React.MouseEvent) => void;
  onRenameCommit: (id: string, name: string) => void;
  onRenameCancel: () => void;
  onItemDragStart: (id: string, e: React.DragEvent) => void;
  onItemDragEnd: () => void;
  onToggleStar: (id: string, e: React.MouseEvent) => void;
  onToggleShare: (id: string, e: React.MouseEvent) => void;
  onMore: (id: string, e: React.MouseEvent) => void;
}) {
  const SortHeader = ({ k, label, className = "" }: { k: SortKey; label: string; className?: string }) => {
    const active = sort.key === k;
    return (
      <button
        onClick={() => onSortChange(k)}
        className={`flex items-center gap-1 text-left uppercase tracking-[0.3em] transition hover:text-blueprint-paper ${
          active ? "text-blueprint-brass" : ""
        } ${className}`}
      >
        {label}
        {active && (sort.dir === "asc" ? <ArrowUpAZ size={10} /> : <ArrowDownAZ size={10} />)}
      </button>
    );
  };

  return (
    <div className="border border-blueprint-grid/20 bg-blueprint-surface">
      <div className="grid grid-cols-[minmax(0,1fr)_100px_160px_140px_44px] gap-3 border-b border-blueprint-grid/20 px-4 py-2.5 text-[10px] font-medium text-blueprint-muted">
        <SortHeader k="name" label="Name" />
        <SortHeader k="kind" label="Kind" />
        <SortHeader k="size" label="Size" />
        <SortHeader k="modified" label="Modified" />
        <span></span>
      </div>
      {items.length === 0 ? null : (
        <div>
          {items.map((item) => (
            <FileRow
              key={item.id}
              item={item}
              selected={selectedIds.has(item.id)}
              multiSelected={selectedIds.size > 1 && selectedIds.has(item.id)}
              active={activeId === item.id}
              renaming={renamingId === item.id}
              onClick={(e) => onItemClick(item.id, e)}
              onDoubleClick={(e) => onItemDoubleClick(item.id, e)}
              onContextMenu={(e) => onItemContextMenu(item.id, e)}
              onRenameCommit={(name) => onRenameCommit(item.id, name)}
              onRenameCancel={onRenameCancel}
              onDragStart={(e) => onItemDragStart(item.id, e)}
              onDragEnd={onItemDragEnd}
              onToggleStar={(e) => onToggleStar(item.id, e)}
              onToggleShare={(e) => onToggleShare(item.id, e)}
              onMore={(e) => onMore(item.id, e)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
