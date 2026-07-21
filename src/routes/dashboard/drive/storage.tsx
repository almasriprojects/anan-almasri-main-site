// ─── /dashboard/drive/storage — Storage Analytics ──────────────
// Real quota from navigator.storage.estimate (best effort) plus
// per-kind breakdown.

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Server, Database, AlertTriangle } from "lucide-react";
import StorageBar from "../../../components/drive/StorageBar";
import { useDrive } from "../../../lib/drive/store";
import { formatBytes } from "../../../lib/drive/utils";
import { storageEstimate } from "../../../lib/drive/db";
import { KIND_META } from "../../../lib/drive/icons";
import type { FileKind } from "../../../lib/drive/types";

export const Route = createFileRoute("/dashboard/drive/storage")({
  component: DriveStorage,
});

function DriveStorage() {
  const drive = useDrive();
  const [estimate, setEstimate] = useState<{
    usedBytes: number;
    quotaBytes: number;
    percent: number;
  } | null>(null);
  const [estimating, setEstimating] = useState(false);

  useEffect(() => {
    setEstimating(true);
    void storageEstimate().then((e) => {
      setEstimate(e);
      setEstimating(false);
    });
  }, []);

  // Per-kind breakdown of all live files
  const byKind = drive.items
    .filter((i) => i.trashedAt === null && i.kind === "file")
    .reduce<Record<string, number>>((acc, i) => {
      const k = i.fileKind ?? "other";
      acc[k] = (acc[k] ?? 0) + i.size;
      return acc;
    }, {});

  // Fallback values
  const usedBytes = estimate?.usedBytes ?? Object.values(byKind).reduce((s, v) => s + v, 0);
  const quotaBytes = estimate?.quotaBytes ?? 500 * 1024 * 1024; // 500MB fallback
  const percent = estimate?.percent ?? (usedBytes / quotaBytes) * 100;

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 lg:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blueprint-brass/30 bg-blueprint-brass/10 text-blueprint-brass">
          <Server size={18} />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-blueprint-muted">Drive</p>
          <h1 className="font-mono text-lg font-semibold text-blueprint-paper">Storage</h1>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main storage card */}
        <div className="rounded-2xl border border-blueprint-grid/20 bg-blueprint-surface/50 p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <Database size={11} className="text-blueprint-brass" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted">
              {estimate ? "Browser Quota" : "Local Storage (estimated)"}
            </p>
            {estimating && <span className="text-[10px] text-blueprint-muted/60">measuring…</span>}
          </div>
          <StorageBar
            usedBytes={usedBytes}
            quotaBytes={quotaBytes}
            percent={percent}
            showBreakdown
            byKind={byKind}
          />
          {!estimate && (
            <div className="mt-4 flex items-start gap-2 border-t border-blueprint-grid/15 pt-3 text-[10px] text-blueprint-muted">
              <AlertTriangle size={11} className="mt-0.5 shrink-0 text-amber-400" />
              <p>
                The browser didn't expose <code className="font-mono text-blueprint-paper/80">navigator.storage.estimate</code>;
                using a 500 MB demo quota.
              </p>
            </div>
          )}
        </div>

        {/* Per-kind breakdown table */}
        <div className="rounded-2xl border border-blueprint-grid/20 bg-blueprint-surface/50 p-5">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted">
            Breakdown by Kind
          </p>
          <ul className="space-y-1.5">
            {(Object.keys(byKind) as Array<keyof typeof KIND_META>)
              .filter((k) => byKind[k] > 0)
              .sort((a, b) => byKind[b] - byKind[a])
              .map((k) => {
                const meta = KIND_META[k as FileKind] ?? KIND_META.other;
                const Icon = meta.Icon;
                return (
                  <li
                    key={k}
                    className="flex items-center justify-between border-b border-blueprint-grid/10 py-1.5 text-xs last:border-0"
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={11} className={meta.color} />
                      <span className="text-blueprint-paper">{meta.label}</span>
                    </span>
                    <span className="font-mono text-blueprint-muted">{formatBytes(byKind[k])}</span>
                  </li>
                );
              })}
            {Object.keys(byKind).length === 0 && (
              <li className="py-4 text-center text-[11px] italic text-blueprint-muted/70">
                No files stored yet
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
