// ─── ConfirmDialog ─────────────────────────────────────────────
// A reusable confirmation modal for destructive operations.

import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel, onConfirm]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-blueprint-grid/20 bg-blueprint-surface p-6 shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            {destructive ? (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
                <AlertTriangle size={18} />
              </div>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blueprint-brass/30 bg-blueprint-brass/10 text-blueprint-brass">
                <AlertTriangle size={18} />
              </div>
            )}
            <h3 className="font-mono text-sm font-semibold text-blueprint-paper">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-blueprint-muted/60 transition hover:text-blueprint-paper"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
        <p className="mb-6 text-xs leading-relaxed text-blueprint-muted">{message}</p>
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="border border-blueprint-grid/20 px-4 py-2 text-xs text-blueprint-muted transition hover:text-blueprint-paper"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-xs transition ${
              destructive
                ? "border border-rose-500/30 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
                : "border border-blueprint-brass/30 bg-blueprint-brass/15 text-blueprint-brass hover:bg-blueprint-brass/25"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
