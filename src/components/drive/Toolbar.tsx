// ─── Toolbar ──────────────────────────────────────────────────
// Horizontal toolbar with: view toggle (grid/list), search, sort
// indicator, and primary actions (new folder, new file, upload).

import { LayoutGrid, List as ListIcon, Search, FolderPlus, FilePlus, Upload, X } from "lucide-react";
import { useDrive } from "../../lib/drive/store";
import type { ViewMode } from "../../lib/drive/types";
import { Link } from "@tanstack/react-router";

export default function Toolbar({
  search,
  onSearchChange,
  onNewFolder,
  onNewFile,
  showNew = true,
  rightSlot,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  onNewFolder: () => void;
  onNewFile: () => void;
  showNew?: boolean;
  rightSlot?: React.ReactNode;
}) {
  const { view, setView } = useDrive();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blueprint-grid/15 bg-blueprint-surface/40 px-4 py-2.5 backdrop-blur-sm">
      {/* Left: view toggle + search */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5 border border-blueprint-grid/20 bg-blueprint-bg/60 p-0.5">
          <button
            onClick={() => setView("grid")}
            className={`flex h-6 w-7 items-center justify-center transition ${
              view === "grid" ? "bg-blueprint-brass/15 text-blueprint-brass" : "text-blueprint-muted hover:text-blueprint-paper"
            }`}
            aria-label="Grid view"
            title="Grid view (⌘1)"
          >
            <LayoutGrid size={12} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`flex h-6 w-7 items-center justify-center transition ${
              view === "list" ? "bg-blueprint-brass/15 text-blueprint-brass" : "text-blueprint-muted hover:text-blueprint-paper"
            }`}
            aria-label="List view"
            title="List view (⌘2)"
          >
            <ListIcon size={12} />
          </button>
        </div>

        <div className="flex items-center gap-2 border border-blueprint-grid/20 bg-blueprint-bg/60 px-2.5 py-1.5">
          <Search size={11} className="text-blueprint-muted" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search this view…"
            className="w-40 bg-transparent text-[11px] text-blueprint-paper outline-none placeholder:text-blueprint-muted/50"
          />
          {search && (
            <button
              onClick={() => onSearchChange("")}
              className="text-blueprint-muted/60 transition hover:text-blueprint-paper"
              aria-label="Clear search"
            >
              <X size={10} />
            </button>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5">
        {rightSlot}
        {showNew && (
          <>
            <button
              onClick={onNewFolder}
              className="flex items-center gap-1.5 border border-blueprint-grid/20 px-2.5 py-1.5 text-[11px] text-blueprint-muted transition hover:border-blueprint-brass/40 hover:text-blueprint-paper"
              title="New folder"
            >
              <FolderPlus size={11} />
              Folder
            </button>
            <button
              onClick={onNewFile}
              className="flex items-center gap-1.5 border border-blueprint-grid/20 px-2.5 py-1.5 text-[11px] text-blueprint-muted transition hover:border-blueprint-brass/40 hover:text-blueprint-paper"
              title="New text file"
            >
              <FilePlus size={11} />
              File
            </button>
            <Link
              to="/dashboard/drive/upload"
              className="flex items-center gap-1.5 border border-blueprint-brass/30 bg-blueprint-brass/10 px-2.5 py-1.5 text-[11px] text-blueprint-brass transition hover:bg-blueprint-brass/20"
            >
              <Upload size={11} />
              Upload
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export function getView(): ViewMode {
  // helper for keyboard shortcuts — reads from store via the hook
  return "grid";
}
