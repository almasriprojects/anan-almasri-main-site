// ─── Sidebar ───────────────────────────────────────────────────
// macOS Finder–style sidebar with three sections:
//   • Favorites   (All My Files, Recents, Starred, Shared, Trash)
//   • Locations  (My Drive, Cloud, This Device)
//   • Tags       (computed from the user's items)
//
// Each entry is a NavLink.  The active one is highlighted.

import { Link, useLocation } from "@tanstack/react-router";
import {
  HardDrive,
  Star,
  Clock,
  Share2,
  Trash2,
  Cloud,
  Server,
  Tag as TagIcon,
  Folder,
  type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";
import { useDrive } from "../../lib/drive/store";

interface SidebarEntry {
  to: string;
  label: string;
  Icon: LucideIcon;
  count?: number;
  countKey?: "starred" | "shared" | "recent" | "trash" | "total";
}

export default function Sidebar({
  collapsed,
  onCloseMobile,
}: {
  collapsed: boolean;
  onCloseMobile?: () => void;
}) {
  const { items, ready } = useDrive();
  const location = useLocation();

  const counts = useMemo(() => {
    const live = items.filter((i) => i.trashedAt === null);
    return {
      total: live.length,
      starred: live.filter((i) => i.starred).length,
      shared: live.filter((i) => i.shared).length,
      recent: live.filter((i) => Date.now() - i.updatedAt < 7 * 24 * 60 * 60 * 1000).length,
      trash: items.filter((i) => i.trashedAt !== null).length,
    };
  }, [items]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => i.trashedAt === null && i.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [items]);

  const active = (to: string) => {
    const path = location.pathname;
    if (to === "/dashboard/drive") return path === "/dashboard/drive";
    return path.startsWith(to);
  };

  const favorites: SidebarEntry[] = [
    { to: "/dashboard/drive/recent", label: "Recents", Icon: Clock, count: counts.recent, countKey: "recent" },
    { to: "/dashboard/drive/starred", label: "Starred", Icon: Star, count: counts.starred, countKey: "starred" },
    { to: "/dashboard/drive/shared", label: "Shared", Icon: Share2, count: counts.shared, countKey: "shared" },
  ];

  const locations: SidebarEntry[] = [
    { to: "/dashboard/drive", label: "My Drive", Icon: HardDrive, count: counts.total, countKey: "total" },
  ];

  const trash: SidebarEntry[] = [
    { to: "/dashboard/drive/trash", label: "Trash", Icon: Trash2, count: counts.trash, countKey: "trash" },
  ];

  return (
    <aside
      className={`flex h-full w-64 shrink-0 flex-col border-r border-blueprint-grid/15 bg-blueprint-surface/60 backdrop-blur-sm transition-all lg:relative lg:translate-x-0 ${
        collapsed
          ? "-translate-x-full lg:w-0 lg:overflow-hidden lg:border-0"
          : "absolute inset-y-0 left-0 z-30 lg:static lg:translate-x-0"
      }`}
    >
      {/* Brand row */}
      <div className="flex items-center justify-between gap-2 border-b border-blueprint-grid/15 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blueprint-brass/30 bg-blueprint-brass/10 text-blueprint-brass">
            <HardDrive size={14} />
          </div>
          <div>
            <p className="font-mono text-[13px] font-semibold text-blueprint-paper">AnanDrive</p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-blueprint-muted/60">File Manager</p>
          </div>
        </div>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="text-blueprint-muted/60 transition hover:text-blueprint-paper lg:hidden"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        )}
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-3 text-xs">
        {!ready && (
          <div className="px-3 py-4 text-center text-[11px] text-blueprint-muted/60">
            Loading…
          </div>
        )}
        {ready && (
          <>
            <Section title="Favorites">
              {favorites.map((e) => (
                <SidebarLink key={e.to} entry={e} isActive={active(e.to)} onClick={onCloseMobile} />
              ))}
            </Section>

            <Section title="Locations">
              {locations.map((e) => (
                <SidebarLink key={e.to} entry={e} isActive={active(e.to)} onClick={onCloseMobile} />
              ))}
              <SidebarLink
                entry={{ to: "/dashboard/drive/upload", label: "Upload Center", Icon: Cloud }}
                isActive={active("/dashboard/drive/upload")}
                onClick={onCloseMobile}
              />
              <SidebarLink
                entry={{ to: "/dashboard/drive/storage", label: "Storage", Icon: Server }}
                isActive={active("/dashboard/drive/storage")}
                onClick={onCloseMobile}
              />
            </Section>

            {allTags.length > 0 && (
              <Section title="Tags" icon={TagIcon}>
                {allTags.slice(0, 12).map((t) => (
                  <Link
                    key={t}
                    to="/dashboard/drive"
                    onClick={onCloseMobile}
                    className="flex items-center gap-2 rounded px-2.5 py-1.5 text-[11px] text-blueprint-muted transition hover:bg-blueprint-bg/40 hover:text-blueprint-paper"
                  >
                    <span className="font-mono text-blueprint-brass">#</span>
                    <span className="truncate">{t}</span>
                  </Link>
                ))}
              </Section>
            )}

            <Section title="" className="mt-4 border-t border-blueprint-grid/15 pt-3">
              {trash.map((e) => (
                <SidebarLink key={e.to} entry={e} isActive={active(e.to)} onClick={onCloseMobile} />
              ))}
            </Section>
          </>
        )}
      </div>

      {/* Footer hint */}
      <div className="border-t border-blueprint-grid/15 px-4 py-2.5 text-[9px] text-blueprint-muted/60">
        <Folder size={10} className="mr-1 inline" />
        Click any folder to open. Drag to move.
      </div>
    </aside>
  );
}

function Section({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`mb-4 ${className}`}>
      {title && (
        <p className="mb-1 flex items-center gap-1.5 px-2.5 text-[9px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted/60">
          {Icon && <Icon size={9} />}
          {title}
        </p>
      )}
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SidebarLink({
  entry,
  isActive,
  onClick,
}: {
  entry: SidebarEntry;
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = entry.Icon;
  return (
    <Link
      to={entry.to}
      onClick={onClick}
      className={`flex items-center gap-2.5 rounded px-2.5 py-1.5 text-[11px] transition ${
        isActive
          ? "bg-blueprint-brass/15 text-blueprint-paper"
          : "text-blueprint-muted hover:bg-blueprint-bg/40 hover:text-blueprint-paper"
      }`}
    >
      <Icon
        size={12}
        className={isActive ? "text-blueprint-brass" : "text-blueprint-muted/70"}
      />
      <span className="flex-1 truncate">{entry.label}</span>
      {entry.count !== undefined && entry.count > 0 && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-mono ${
            isActive
              ? "bg-blueprint-brass/30 text-blueprint-paper"
              : "bg-blueprint-bg/60 text-blueprint-muted/80"
          }`}
        >
          {entry.count}
        </span>
      )}
    </Link>
  );
}
