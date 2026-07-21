// ─── NewItemModal ──────────────────────────────────────────────
// Modal dialog for creating a new folder or a new text/markdown
// file.  Includes a color picker for folders and an optional
// initial content body for text files.

import { useEffect, useState } from "react";
import { X, FolderPlus, FilePlus } from "lucide-react";
import type { FileKind, FolderColor, ItemKind } from "../../lib/drive/types";
import { FOLDER_COLORS } from "../../lib/drive/utils";

const FOLDER_COLOR_KEYS: FolderColor[] = [
  "blue",
  "green",
  "rose",
  "violet",
  "purple",
  "amber",
  "cyan",
  "orange",
  "gray",
];

const FILE_KIND_CHOICES: { key: FileKind; label: string }[] = [
  { key: "text", label: "Text" },
  { key: "code", label: "Code" },
  { key: "document", label: "Document" },
  { key: "spreadsheet", label: "Spreadsheet" },
];

export default function NewItemModal({
  open,
  kind,
  onClose,
  onCreate,
}: {
  open: boolean;
  kind: ItemKind | null;
  onClose: () => void;
  onCreate: (input: {
    name: string;
    color?: FolderColor;
    fileKind?: FileKind;
    content?: string;
  }) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<FolderColor>("blue");
  const [fileKind, setFileKind] = useState<FileKind>("text");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(kind === "folder" ? "Untitled folder" : "untitled.txt");
      setColor("blue");
      setFileKind("text");
      setContent(kind === "file" && fileKind === "text" ? "" : "");
      setError(null);
      setBusy(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, kind]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open || !kind) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setError(null);
    setBusy(true);
    try {
      await onCreate({
        name: name.trim(),
        color: kind === "folder" ? color : undefined,
        fileKind: kind === "file" ? fileKind : undefined,
        content: kind === "file" && fileKind === "text" ? content : undefined,
      });
      onClose();
    } catch (err) {
      setError(String(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-md rounded-2xl border border-blueprint-grid/20 bg-blueprint-surface p-6 shadow-2xl shadow-black/60"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blueprint-brass/30 bg-blueprint-brass/10 text-blueprint-brass">
              {kind === "folder" ? <FolderPlus size={18} /> : <FilePlus size={18} />}
            </div>
            <h3 className="font-mono text-sm font-semibold text-blueprint-paper">
              New {kind === "folder" ? "Folder" : "File"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-blueprint-muted/60 transition hover:text-blueprint-paper"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <label className="mb-3 block">
          <span className="mb-1 block text-[10px] uppercase tracking-[0.3em] text-blueprint-muted">
            Name
          </span>
          <input
            autoFocus
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError(null);
            }}
            className="w-full border border-blueprint-grid/20 bg-blueprint-bg px-3 py-2 text-sm text-blueprint-paper outline-none focus:border-blueprint-brass/50"
            placeholder={kind === "folder" ? "Folder name" : "filename.txt"}
          />
          {error && <span className="mt-1 block text-[11px] text-rose-400">{error}</span>}
        </label>

        {kind === "folder" && (
          <div className="mb-4">
            <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-blueprint-muted">
              Color
            </span>
            <div className="flex flex-wrap gap-2">
              {FOLDER_COLOR_KEYS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`h-7 w-7 rounded-lg border-2 transition ${
                    color === c
                      ? "border-blueprint-brass scale-110"
                      : "border-blueprint-grid/30 hover:border-blueprint-grid/60"
                  }`}
                  aria-label={`Color ${c}`}
                >
                  <span className={`block h-full w-full rounded ${FOLDER_COLORS[c]} bg-current opacity-80`} />
                </button>
              ))}
            </div>
          </div>
        )}

        {kind === "file" && (
          <>
            <div className="mb-3">
              <span className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-blueprint-muted">
                Type
              </span>
              <div className="flex flex-wrap gap-2">
                {FILE_KIND_CHOICES.map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    onClick={() => setFileKind(c.key)}
                    className={`border px-3 py-1.5 text-[11px] transition ${
                      fileKind === c.key
                        ? "border-blueprint-brass/50 bg-blueprint-brass/10 text-blueprint-paper"
                        : "border-blueprint-grid/20 text-blueprint-muted hover:text-blueprint-paper"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            {fileKind === "text" && (
              <div className="mb-4">
                <span className="mb-1 block text-[10px] uppercase tracking-[0.3em] text-blueprint-muted">
                  Initial content (optional)
                </span>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={5}
                  className="w-full resize-y border border-blueprint-grid/20 bg-blueprint-bg px-3 py-2 font-mono text-[12px] text-blueprint-paper outline-none focus:border-blueprint-brass/50"
                  placeholder="Start typing…"
                />
              </div>
            )}
          </>
        )}

        <div className="mt-6 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border border-blueprint-grid/20 px-4 py-2 text-xs text-blueprint-muted transition hover:text-blueprint-paper"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={busy || !name.trim()}
            className="border border-blueprint-brass/30 bg-blueprint-brass/15 px-4 py-2 text-xs text-blueprint-brass transition hover:bg-blueprint-brass/25 disabled:opacity-40"
          >
            {busy ? "Creating…" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
