// ─── TagPicker ─────────────────────────────────────────────────
// Lets the user add/remove tags for a selected item.

import { Plus, X } from "lucide-react";
import { useState } from "react";

export default function TagPicker({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const t = draft.trim().toLowerCase();
    if (!t) return;
    if (tags.includes(t)) {
      setDraft("");
      return;
    }
    onChange([...tags, t]);
    setDraft("");
  };

  const remove = (t: string) => onChange(tags.filter((x) => x !== t));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.length === 0 && (
          <span className="text-[11px] text-blueprint-muted/60 italic">No tags</span>
        )}
        {tags.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full border border-blueprint-brass/30 bg-blueprint-brass/10 px-2 py-0.5 text-[10px] font-medium text-blueprint-brass"
          >
            #{t}
            <button
              onClick={() => remove(t)}
              className="text-blueprint-brass/60 hover:text-blueprint-brass"
              aria-label={`Remove tag ${t}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-1.5">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="add tag…"
          className="flex-1 border border-blueprint-grid/20 bg-blueprint-bg/60 px-2 py-1 text-[11px] text-blueprint-paper outline-none placeholder:text-blueprint-muted/50 focus:border-blueprint-brass/40"
        />
        <button
          onClick={add}
          disabled={!draft.trim()}
          className="flex items-center gap-1 border border-blueprint-grid/20 bg-blueprint-brass/10 px-2 py-1 text-[10px] text-blueprint-brass transition hover:bg-blueprint-brass/20 disabled:opacity-30"
        >
          <Plus size={10} />
          Add
        </button>
      </div>
    </div>
  );
}
