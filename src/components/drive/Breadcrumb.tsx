// ─── Breadcrumb ────────────────────────────────────────────────
// Clickable path: Home › Parent › Current.  Each segment is a link.

import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import type { DriveItem } from "../../lib/drive/types";

export default function Breadcrumb({
  path,
  trailing,
  onDrop,
}: {
  path: DriveItem[];
  trailing?: string; // shown as a non-link suffix (e.g. "Recent")
  onDrop?: (folderId: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs text-blueprint-muted">
      <Link
        to="/dashboard/drive"
        className="flex items-center gap-1 rounded px-1.5 py-0.5 transition hover:bg-blueprint-bg/40 hover:text-blueprint-paper"
      >
        <Home size={11} />
        <span>Home</span>
      </Link>
      {path.map((seg, i) => {
        const isLast = i === path.length - 1 && !trailing;
        return (
          <span key={seg.id} className="flex items-center gap-1.5">
            <ChevronRight size={11} className="text-blueprint-muted/50" />
            {isLast ? (
              <span className="rounded bg-blueprint-bg/40 px-1.5 py-0.5 font-medium text-blueprint-paper">
                {seg.name}
              </span>
            ) : (
              <Link
                to="/dashboard/drive/folder/$folderId"
                params={{ folderId: seg.id }}
                onDragOver={(e) => {
                  if (onDrop) {
                    e.preventDefault();
                  }
                }}
                onDrop={(e) => {
                  if (onDrop) {
                    e.preventDefault();
                    onDrop(seg.id);
                  }
                }}
                className="rounded px-1.5 py-0.5 transition hover:bg-blueprint-bg/40 hover:text-blueprint-paper"
              >
                {seg.name}
              </Link>
            )}
          </span>
        );
      })}
      {trailing && (
        <span className="flex items-center gap-1.5">
          <ChevronRight size={11} className="text-blueprint-muted/50" />
          <span className="rounded bg-blueprint-bg/40 px-1.5 py-0.5 font-medium text-blueprint-paper">
            {trailing}
          </span>
        </span>
      )}
    </div>
  );
}
