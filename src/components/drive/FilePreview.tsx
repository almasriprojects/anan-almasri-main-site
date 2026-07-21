// ─── FilePreview ───────────────────────────────────────────────
// Inline preview for a file: shows a header (icon, name, meta)
// and a body appropriate for the file kind.  Used both in the
// inspector column and as a full modal.

import { Download, X, Save } from "lucide-react";
import { KIND_META } from "../../lib/drive/icons";
import { FOLDER_COLORS, formatBytes, formatExactDate } from "../../lib/drive/utils";
import type { DriveItem } from "../../lib/drive/types";
import { useEffect, useState } from "react";

export default function FilePreview({
  item,
  onClose,
  onSaveContent,
}: {
  item: DriveItem | null;
  onClose?: () => void;
  onSaveContent?: (content: string) => void;
}) {
  const [editContent, setEditContent] = useState<string | null>(null);
  useEffect(() => {
    setEditContent(item?.content ?? "");
  }, [item?.id, item?.content]);

  if (!item) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 px-4 py-10 text-center text-blueprint-muted/60">
        <p className="text-[11px]">No item selected</p>
      </div>
    );
  }

  const isFolder = item.kind === "folder";
  const kindKey = isFolder ? "folder" : (item.fileKind ?? "other");
  const meta = KIND_META[kindKey];
  const Icon = meta.Icon;
  const tint = isFolder && item.color ? FOLDER_COLORS[item.color] : meta.color;

  const isText = kindKey === "text" || kindKey === "code";

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b border-blueprint-grid/15 p-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blueprint-grid/20 bg-blueprint-bg/60 ${tint}`}>
            <Icon size={18} />
          </div>
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-semibold text-blueprint-paper">{item.name}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-[0.3em] text-blueprint-muted">
              {meta.label}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-blueprint-muted/60 transition hover:text-blueprint-paper"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 text-xs text-blueprint-muted">
        {isText ? (
          <div className="space-y-2">
            {editContent !== null && onSaveContent ? (
              <>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={14}
                  className="w-full resize-y border border-blueprint-grid/20 bg-blueprint-bg px-3 py-2 font-mono text-[11px] text-blueprint-paper outline-none focus:border-blueprint-brass/50"
                />
                <div className="flex justify-end">
                  <button
                    onClick={() => onSaveContent(editContent)}
                    className="flex items-center gap-1.5 border border-blueprint-brass/30 bg-blueprint-brass/10 px-3 py-1.5 text-[10px] text-blueprint-brass transition hover:bg-blueprint-brass/20"
                  >
                    <Save size={11} />
                    Save
                  </button>
                </div>
              </>
            ) : item.content ? (
              <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words rounded border border-blueprint-grid/20 bg-blueprint-bg/60 p-3 font-mono text-[11px] leading-relaxed text-blueprint-paper/90">
                {item.content}
              </pre>
            ) : (
              <p className="italic text-blueprint-muted/70">Empty file</p>
            )}
          </div>
        ) : kindKey === "image" ? (
          <div className="rounded border border-blueprint-grid/20 bg-blueprint-bg/40 p-2">
            <div className="flex h-48 items-center justify-center text-blueprint-muted/50">
              <Icon size={42} className={tint} />
              <span className="ml-3 text-[11px] italic">Image preview not available</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded border border-blueprint-grid/20 bg-blueprint-bg/40 py-10 text-center">
            <Icon size={48} className={tint} />
            <p className="text-[11px] italic text-blueprint-muted/80">No preview available</p>
            <button
              onClick={() => {
                // Generate a small download for text-like files; for others
                // we just copy metadata to clipboard.
                if (item.content) {
                  const blob = new Blob([item.content], { type: item.mimeType ?? "text/plain" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = item.name;
                  a.click();
                  setTimeout(() => URL.revokeObjectURL(url), 0);
                } else {
                  const meta = JSON.stringify(item, null, 2);
                  navigator.clipboard?.writeText(meta);
                }
              }}
              className="flex items-center gap-1.5 border border-blueprint-grid/20 px-3 py-1.5 text-[10px] text-blueprint-muted transition hover:text-blueprint-paper"
            >
              <Download size={11} />
              Download
            </button>
          </div>
        )}
      </div>

      {/* Footer metadata */}
      <div className="border-t border-blueprint-grid/15 p-4 text-[10px] text-blueprint-muted/80">
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <dt className="text-blueprint-muted/60">Type</dt>
          <dd className="text-blueprint-paper/80">{meta.label}</dd>
          <dt className="text-blueprint-muted/60">Size</dt>
          <dd className="text-blueprint-paper/80">{isFolder ? "—" : formatBytes(item.size)}</dd>
          <dt className="text-blueprint-muted/60">Owner</dt>
          <dd className="text-blueprint-paper/80">{item.ownerName}</dd>
          <dt className="text-blueprint-muted/60">Created</dt>
          <dd className="text-blueprint-paper/80">{formatExactDate(item.createdAt)}</dd>
          <dt className="text-blueprint-muted/60">Modified</dt>
          <dd className="text-blueprint-paper/80">{formatExactDate(item.updatedAt)}</dd>
          <dt className="text-blueprint-muted/60">Tags</dt>
          <dd className="truncate text-blueprint-paper/80">
            {item.tags.length ? item.tags.map((t) => `#${t}`).join(" ") : "—"}
          </dd>
        </dl>
      </div>
    </div>
  );
}
