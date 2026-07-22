import { motion, AnimatePresence } from "framer-motion";
import type { ServiceNode } from "../../data/systemDiagramData";
import { motionTokens } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface Props {
  node: ServiceNode | null;
  onClose: () => void;
  /** Optional: highlighted project sheet numbers when a node is "selected" */
  highlightSheets: Set<string> | null;
  onSelectSheet?: (sheetNo: string) => void;
}

/**
 * Right-side detail panel that slides in when a node is hovered or selected.
 * Shows tech, role, snippet, and which project sheets use this node.
 */
export default function NodeSidePanel({
  node,
  onClose,
  highlightSheets,
  onSelectSheet,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <AnimatePresence>
      {node && (
        <motion.aside
          key={node.id}
          initial={reduced ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: motionTokens.dur.base, ease: motionTokens.ease }}
          className="pointer-events-auto absolute right-4 top-4 z-30 w-[320px] border border-blueprint-grid/25 bg-blueprint-surface/95 backdrop-blur-md"
          aria-live="polite"
        >
          {/* Top brass edge */}
          <div className="h-[2px] w-full bg-blueprint-brass/70" />

          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-blueprint-grid/15 p-4">
            <div>
              <div className="mb-1 font-mono text-[9px] tracking-annotation text-blueprint-brass/80">
                {node.kind.toUpperCase()} · {node.sub.toUpperCase()}
              </div>
              <div className="font-mono text-base font-bold text-blueprint-paper">
                {node.label}
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-xs text-blueprint-muted/60 transition-colors hover:text-blueprint-paper"
              aria-label="Close node details"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4 p-4">
            {/* Role */}
            <p className="font-sans text-[13px] leading-relaxed text-blueprint-muted">
              {node.role}
            </p>

            {/* Tech tags */}
            <div>
              <div className="mb-2 font-mono text-[9px] tracking-annotation text-blueprint-muted/70">
                TECH
              </div>
              <div className="flex flex-wrap gap-1.5">
                {node.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-sm border border-blueprint-grid/25 bg-blueprint-bg/40 px-2 py-0.5 font-mono text-[10px] text-blueprint-paper/90"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Snippet */}
            <div>
              <div className="mb-2 font-mono text-[9px] tracking-annotation text-blueprint-muted/70">
                SNIPPET
              </div>
              <pre className="overflow-x-auto border border-blueprint-grid/20 bg-blueprint-bg/60 p-3 font-mono text-[11px] leading-relaxed text-blueprint-paper/90">
                {node.snippet}
              </pre>
            </div>

            {/* Project sheets */}
            {node.sheets.length > 0 && (
              <div>
                <div className="mb-2 font-mono text-[9px] tracking-annotation text-blueprint-muted/70">
                  USED IN
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {node.sheets.map((s) => {
                    const highlighted = highlightSheets?.has(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => onSelectSheet?.(s)}
                        className={`rounded-sm border px-2 py-0.5 font-mono text-[10px] transition-colors ${
                          highlighted
                            ? "border-blueprint-brass/70 bg-blueprint-brass/15 text-blueprint-brass"
                            : "border-blueprint-grid/25 bg-blueprint-bg/40 text-blueprint-paper/80 hover:border-blueprint-brass/40 hover:text-blueprint-paper"
                        }`}
                      >
                        SHEET {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
