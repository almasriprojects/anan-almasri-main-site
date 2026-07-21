// ─── GridView ──────────────────────────────────────────────────
// Renders the items as a grid of FileCards. Handles drag-and-drop
// between cards (move into a folder) and drop on the empty area
// (move to current parent).

import type { DriveItem } from "../../lib/drive/types";
import FileCard from "./FileCard";

export default function GridView({
  items,
  selectedIds,
  activeId,
  renamingId,
  onItemClick,
  onItemDoubleClick,
  onItemContextMenu,
  onRenameCommit,
  onRenameCancel,
  onItemDragStart,
  onItemDragEnd,
  onToggleStar,
  onToggleShare,
  onItemDragOver,
  onItemDrop,
}: {
  items: DriveItem[];
  selectedIds: Set<string>;
  activeId: string | null;
  renamingId: string | null;
  onItemClick: (id: string, e: React.MouseEvent) => void;
  onItemDoubleClick: (id: string, e: React.MouseEvent) => void;
  onItemContextMenu: (id: string, e: React.MouseEvent) => void;
  onRenameCommit: (id: string, name: string) => void;
  onRenameCancel: () => void;
  onItemDragStart: (id: string, e: React.DragEvent) => void;
  onItemDragEnd: () => void;
  onToggleStar: (id: string, e: React.MouseEvent) => void;
  onToggleShare: (id: string, e: React.MouseEvent) => void;
  onItemDragOver: (id: string, e: React.DragEvent) => void;
  onItemDrop: (id: string, e: React.DragEvent) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {items.map((item) => (
        <FileCard
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
        />
      ))}
    </div>
  );
}
