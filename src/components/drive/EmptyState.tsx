// ─── EmptyState ────────────────────────────────────────────────
// A friendly empty-state panel used by all drive pages when there
// are no items to display.

import type { LucideIcon } from "lucide-react";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-3 px-6 py-12 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blueprint-grid/20 bg-blueprint-surface/60 text-blueprint-brass/80">
        <Icon size={26} />
      </div>
      <h3 className="font-mono text-sm font-semibold text-blueprint-paper">{title}</h3>
      <p className="max-w-sm text-xs leading-relaxed text-blueprint-muted">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
