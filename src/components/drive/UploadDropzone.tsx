// ─── UploadDropzone ────────────────────────────────────────────
// A drag-and-drop area for file uploads.  Calls back to the parent
// with the dropped File[].

import { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

export default function UploadDropzone({
  onFiles,
  hint = "Drop files here, or click to browse",
  accept,
  multiple = true,
  className = "",
}: {
  onFiles: (files: File[]) => void | Promise<void | unknown[]>;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
}) {
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        const files = Array.from(e.dataTransfer.files ?? []);
        if (files.length) void onFiles(files);
      }}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
        over
          ? "border-blueprint-brass bg-blueprint-brass/10"
          : "border-blueprint-grid/30 bg-blueprint-surface/40 hover:border-blueprint-brass/40 hover:bg-blueprint-surface/70"
      } ${className}`}
    >
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl border border-blueprint-grid/20 transition ${
          over ? "bg-blueprint-brass/15 text-blueprint-brass" : "bg-blueprint-bg/60 text-blueprint-muted"
        }`}
      >
        <UploadCloud size={26} />
      </div>
      <div>
        <p className="font-mono text-sm font-semibold text-blueprint-paper">
          {over ? "Release to upload" : hint}
        </p>
        <p className="mt-1 text-[11px] text-blueprint-muted">
          Files are stored locally in your browser. No data leaves this device.
        </p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) void onFiles(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
