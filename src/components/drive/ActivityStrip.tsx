// ─── ActivityStrip ─────────────────────────────────────────────
// Shows the latest activity events (uploads, moves, etc.) — used
// in the inspector column and on the upload page.

import {
  FolderPlus,
  FilePlus,
  Edit3,
  Move,
  Star,
  Share2,
  Trash2,
  RotateCcw,
  XCircle,
  Copy,
  Upload,
  type LucideIcon,
} from "lucide-react";
import { formatRelativeTime } from "../../lib/drive/utils";
import type { ActivityEvent } from "../../lib/drive/types";

const ICON_MAP: Record<ActivityEvent["action"], LucideIcon> = {
  created: FolderPlus,
  uploaded: Upload,
  renamed: Edit3,
  moved: Move,
  starred: Star,
  unstarred: Star,
  shared: Share2,
  unshared: Share2,
  trashed: Trash2,
  restored: RotateCcw,
  deleted: XCircle,
  duplicated: Copy,
};

const COLOR_MAP: Record<ActivityEvent["action"], string> = {
  created: "text-emerald-400",
  uploaded: "text-sky-400",
  renamed: "text-blueprint-brass",
  moved: "text-blueprint-brass",
  starred: "text-amber-400",
  unstarred: "text-blueprint-muted/60",
  shared: "text-violet-400",
  unshared: "text-blueprint-muted/60",
  trashed: "text-rose-400",
  restored: "text-emerald-400",
  deleted: "text-rose-500",
  duplicated: "text-cyan-400",
};

export default function ActivityStrip({
  events,
  max = 12,
  emptyMessage = "No activity yet",
}: {
  events: ActivityEvent[];
  max?: number;
  emptyMessage?: string;
}) {
  const visible = events.slice(0, max);

  if (visible.length === 0) {
    return (
      <p className="px-1 py-4 text-center text-[11px] text-blueprint-muted/60 italic">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ol className="space-y-1">
      {visible.map((ev) => {
        const Icon = ICON_MAP[ev.action];
        // when both starred and unstarred share the same icon (Star),
        // vary the icon visually with a different lucide swap
        const FinalIcon =
          ev.action === "created" && ev.itemName?.includes(".") ? FilePlus : Icon;
        return (
          <li
            key={ev.id}
            className="flex items-start gap-2.5 rounded-lg px-2 py-2 transition hover:bg-white/[0.04]"
          >
            <div
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-blueprint-grid/15 bg-blueprint-bg/50 ${COLOR_MAP[ev.action]}`}
            >
              <FinalIcon size={11} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] text-blueprint-paper/90">
                <span className="font-medium">{ev.itemName}</span>{" "}
                <span className="text-blueprint-muted">— {labelFor(ev.action)}</span>
              </p>
              {ev.detail && (
                <p className="truncate text-[10px] text-blueprint-muted/70">{ev.detail}</p>
              )}
            </div>
            <span className="shrink-0 text-[10px] font-mono text-blueprint-muted/60">
              {formatRelativeTime(ev.at)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function labelFor(a: ActivityEvent["action"]): string {
  switch (a) {
    case "created":
      return "created";
    case "uploaded":
      return "uploaded";
    case "renamed":
      return "renamed";
    case "moved":
      return "moved";
    case "starred":
      return "starred";
    case "unstarred":
      return "unstarred";
    case "shared":
      return "shared";
    case "unshared":
      return "unshared";
    case "trashed":
      return "moved to trash";
    case "restored":
      return "restored";
    case "deleted":
      return "deleted forever";
    case "duplicated":
      return "duplicated";
  }
}
