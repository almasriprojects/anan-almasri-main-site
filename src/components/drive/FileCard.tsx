// ─── FileCard ──────────────────────────────────────────────────
// One icon tile for grid view.  Shows the file/folder icon, name
// (renameable inline), and a small metadata footer.

import { Star, Share2 } from "lucide-react";
import { FOLDER_COLORS, formatBytes, formatRelativeTime } from "../../lib/drive/utils";
import { KIND_META } from "../../lib/drive/icons";
import type { DriveItem } from "../../lib/drive/types";
import RenameInput from "./RenameInput";

export default function FileCard({
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
      className={`group relative flex flex-col items-center gap-2.5 border bg-blueprint-surface p-4 transition ${
        active
          ? "border-blueprint-brass shadow-lg shadow-blueprint-brass/10"
          : multiSelected
            ? "border-blueprint-brass/40 bg-blueprint-brass/[0.04]"
            : "border-blueprint-grid/20 hover:border-blueprint-grid/40 hover:bg-blueprint-bg/70"
      }`}
    >
      {/* Star + share + selection badge (top row) */}
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1">
          {item.starred && (
            <Star size={11} className="fill-amber-400 text-amber-400" />
          )}
          {item.shared && <Share2 size={11} className="text-violet-400" />}
        </div>
        {selected && (
          <div className="h-3.5 w-3.5 rounded-sm border border-blueprint-brass bg-blueprint-brass/40" />
        )}
      </div>

      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center">
        <Icon size={56} className={tint} strokeWidth={1.4} />
      </div>

      {/* Name + meta */}
      <div className="w-full text-center">
        {renaming ? (
          <RenameInput
            initial={item.name}
            onCommit={onRenameCommit}
            onCancel={onRenameCancel}
            className="text-center"
          />
        ) : (
          <p className="line-clamp-2 break-words text-[12px] font-medium text-blueprint-paper">
            {item.name}
          </p>
        )}
        <p className="mt-1 text-[10px] text-blueprint-muted/80">
          {isFolder
            ? "Folder"
            : `${formatBytes(item.size)} · ${formatRelativeTime(item.updatedAt)}`}
        </p>
      </div>

      {/* Quick actions (visible on hover) */}
      <div className="absolute right-2 top-9 flex flex-col gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={onToggleStar}
          className={`flex h-6 w-6 items-center justify-center rounded border border-blueprint-grid/20 bg-blueprint-bg/80 backdrop-blur transition ${
            item.starred ? "text-amber-400" : "text-blueprint-muted hover:text-amber-400"
          }`}
          aria-label="Star"
          title="Star"
        >
          <Star size={11} className={item.starred ? "fill-amber-400" : ""} />
        </button>
        <button
          onClick={onToggleShare}
          className={`flex h-6 w-6 items-center justify-center rounded border border-blueprint-grid/20 bg-blueprint-bg/80 backdrop-blur transition ${
            item.shared ? "text-violet-400" : "text-blueprint-muted hover:text-violet-400"
          }`}
          aria-label="Share"
          title="Share"
        >
          <Share2 size={11} />
        </button>
      </div>
    </div>
  );
}
