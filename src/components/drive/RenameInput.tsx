// ─── RenameInput ───────────────────────────────────────────────
// Inline editable name field used by FileCard and FileRow for the
// "double-click to rename" interaction.

import { useEffect, useRef, useState } from "react";

export default function RenameInput({
  initial,
  onCommit,
  onCancel,
  className = "",
  autoFocus = true,
}: {
  initial: string;
  onCommit: (name: string) => void;
  onCancel: () => void;
  className?: string;
  autoFocus?: boolean;
}) {
  const [value, setValue] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value.trim() && value.trim() !== initial) onCommit(value.trim());
        else onCancel();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (value.trim()) onCommit(value.trim());
          else onCancel();
        }
        if (e.key === "Escape") {
          e.preventDefault();
          onCancel();
        }
      }}
      onClick={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      className={`w-full rounded border border-blueprint-brass/60 bg-blueprint-bg px-1.5 py-0.5 text-xs text-blueprint-paper outline-none ${className}`}
    />
  );
}
