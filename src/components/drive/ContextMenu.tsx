// ─── ContextMenu ───────────────────────────────────────────────
// Right-click context menu for drive items + the empty space.

import {
  FolderPlus,
  FilePlus,
  Edit3,
  Copy,
  Share2,
  Star,
  Trash2,
  Download,
  Info,
  RotateCcw,
  XCircle,
  Move,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef } from "react";

export interface ContextMenuItem {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  danger?: boolean;
  separator?: boolean;
  disabled?: boolean;
}

export default function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => onClose();
    window.addEventListener("click", handler);
    window.addEventListener("contextmenu", handler);
    window.addEventListener("scroll", handler, true);
    return () => {
      window.removeEventListener("click", handler);
      window.removeEventListener("contextmenu", handler);
      window.removeEventListener("scroll", handler, true);
    };
  }, [onClose]);

  // Keep menu inside viewport
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (rect.right > vw) el.style.left = `${Math.max(8, vw - rect.width - 8)}px`;
    if (rect.bottom > vh) el.style.top = `${Math.max(8, vh - rect.height - 8)}px`;
  }, []);

  return (
    <div
      ref={ref}
      className="fixed z-[80] w-52 origin-top-left animate-[fadeIn_0.08s_ease-out] rounded-xl border border-white/[0.08] bg-blueprint-surface/95 p-1 shadow-2xl shadow-black/60 backdrop-blur-2xl"
      style={{ left: x, top: y }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      {items.map((item, i) => {
        if (item.separator) {
          return <div key={i} className="my-1 h-px bg-white/[0.06]" />;
        }
        const Icon = item.icon;
        return (
          <button
            key={item.label}
            disabled={item.disabled}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick?.();
              onClose();
            }}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs transition disabled:opacity-30 ${
              item.danger
                ? "text-rose-300 hover:bg-rose-500/20"
                : "text-blueprint-paper/90 hover:bg-white/[0.06]"
            }`}
          >
            {Icon && <Icon size={13} className="shrink-0" />}
            <span className="truncate">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Re-export the commonly-used icons so callers can build menus
export const CTX_ICONS = {
  FolderPlus,
  FilePlus,
  Edit3,
  Copy,
  Share2,
  Star,
  Trash2,
  Download,
  Info,
  RotateCcw,
  XCircle,
  Move,
};
