// ─── StorageBar ────────────────────────────────────────────────
// Visualises storage usage: a horizontal bar + a label, plus a
// "X of Y used (Z%)" caption.

import { formatBytes } from "../../lib/drive/utils";

export default function StorageBar({
  usedBytes,
  quotaBytes,
  percent,
  className = "",
  showBreakdown,
  byKind,
}: {
  usedBytes: number;
  quotaBytes: number;
  percent: number;
  className?: string;
  showBreakdown?: boolean;
  byKind?: Record<string, number>;
}) {
  const safePercent = Math.max(0, Math.min(100, percent));
  const color =
    safePercent >= 85
      ? "bg-rose-400"
      : safePercent >= 60
        ? "bg-amber-400"
        : "bg-blueprint-brass";

  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between text-[11px] text-blueprint-muted">
        <span>
          <span className="font-mono text-blueprint-paper">{formatBytes(usedBytes)}</span>{" "}
          of {formatBytes(quotaBytes)} used
        </span>
        <span className="font-mono">{safePercent.toFixed(1)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-blueprint-bg/80">
        <div
          className={`h-full transition-all duration-500 ${color}`}
          style={{ width: `${safePercent}%` }}
        />
      </div>
      {showBreakdown && byKind && (
        <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-blueprint-muted sm:grid-cols-3">
          {Object.entries(byKind)
            .filter(([, bytes]) => bytes > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([kind, bytes]) => (
              <div key={kind} className="flex items-center justify-between">
                <span className="capitalize">{kind}</span>
                <span className="font-mono text-blueprint-paper/80">{formatBytes(bytes)}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
