// ─── FileRow ───────────────────────────────────────────────────
// One row for list view. Mirrors macOS Finder's list/columns mode.

import { Star, Share2, MoreHorizontal } from "lucide-react";
import { FOLDER_COLORS, formatBytes, formatExactDate, formatRelativeTime } from "../../lib/drive/utils";
import { KIND_META } from "../../lib/drive/icons";
import type { DriveItem } from "../../lib/drive/types";
import RenameInput from "./RenameInput";

export default function FileRow({
  item,
  selected,
  multiSelected,
  active,
  renaming,
  onClick,
  onDoubleClick,
  onContextMenu,
  onRenameCommit,
  onRenameCancel,
  onDragStart,
  onDragEnd,
  onToggleStar,
  onToggleShare,
  onMore,
}: {
  item: DriveItem;
  selected: boolean;
  multiSelected: boolean;
  active: boolean;
  renaming: boolean;
  onClick: (e: React.MouseEvent) => void;
  onDoubleClick: (e: React.MouseEvent) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  onRenameCommit: (name: string) => void;
  onRenameCancel: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onToggleStar: (e: React.MouseEvent) => void;
  onToggleShare: (e: React.MouseEvent) => void;
  onMore: (e: React.MouseEvent) => void;
}) {
  const isFolder = item.kind === "folder";
  const kindKey = isFolder ? "folder" : (item.fileKind ?? "other");
  const meta = KIND_META[kindKey];
  const Icon = meta.Icon;
  const tint = isFolder && item.color ? FOLDER_COLORS[item.color] : meta.color;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      className={`group grid grid-cols-[minmax(0,1fr)_100px_160px_140px_44px] items-center gap-3 border-b border-blueprint-grid/10 px-4 py-2.5 text-xs transition last:border-0 ${
        active
          ? "bg-blueprint-brass/10"
          : multiSelected
            ? "bg-blueprint-brass/[0.04]"
            : "hover:bg-blueprint-bg/40"
      }`}
    >
      {/* Name */}
      <div className="flex min-w-0 items-center gap-3">
        <Icon size={16} className={tint} />
        {renaming ? (
          <RenameInput
            initial={item.name}
            onCommit={onRenameCommit}
            onCancel={onRenameCancel}
          />
        ) : (
          <div className="flex min-w-0 items-center gap-2">
            <p className="truncate text-blueprint-paper">{item.name}</p>
            {item.starred && <Star size={10} className="shrink-0 fill-amber-400 text-amber-400" />}
            {item.shared && <Share2 size={10} className="shrink-0 text-violet-400" />}
          </div>
        )}
      </div>

      {/* Kind */}
      <p className="text-blueprint-muted">{meta.label}</p>

      {/* Size */}
      <p className="font-mono text-blueprint-muted">
        {isFolder ? "—" : formatBytes(item.size)}
      </p>

      {/* Modified */}
      <p className="text-blueprint-muted" title={formatExactDate(item.updatedAt)}>
        {formatRelativeTime(item.updatedAt)}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={onToggleStar}
          className={`flex h-6 w-6 items-center justify-center rounded transition ${
            item.starred ? "text-amber-400" : "text-blueprint-muted/40 opacity-0 hover:text-amber-400 group-hover:opacity-100"
          }`}
          aria-label="Star"
        >
          <Star size={11} className={item.starred ? "fill-amber-400" : ""} />
        </button>
        <button
          onClick={onToggleShare}
          className={`flex h-6 w-6 items-center justify-center rounded transition ${
            item.shared ? "text-violet-400" : "text-blueprint-muted/40 opacity-0 hover:text-violet-400 group-hover:opacity-100"
          }`}
          aria-label="Share"
        >
          <Share2 size={11} />
        </button>
        <button
          onClick={onMore}
          className="flex h-6 w-6 items-center justify-center rounded text-blueprint-muted/40 opacity-0 transition hover:text-blueprint-paper group-hover:opacity-100"
          aria-label="More actions"
        >
          <MoreHorizontal size={13} />
        </button>
      </div>
    </div>
  );
}
