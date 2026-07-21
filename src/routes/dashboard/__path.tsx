import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, createFileRoute } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Calculator,
  Briefcase,
  Scale,
  Package,
  BarChart3,
  Settings,
  Bell,
  Clock,
  Monitor,
  FolderKanban,
  HardDrive,
  Sparkles,
  Mail,
  Calendar,
  ListTodo,
  StickyNote,
  HeadphonesIcon,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/__path")({
  component: AnanOSShell,
});

const appItems = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard, shortcut: "⌘1" },
  { label: "CRM", to: "/dashboard/crm", icon: Users, shortcut: "⌘2" },
  { label: "Operations", to: "/dashboard/operations", icon: Briefcase, shortcut: "⌘3" },
  { label: "Accounting", to: "/dashboard/accounting", icon: Calculator, shortcut: "⌘4" },
  { label: "HRM", to: "/dashboard/hrm", icon: Monitor, shortcut: "⌘5" },
  { label: "Legal", to: "/dashboard/legal", icon: Scale, shortcut: "⌘6" },
  { label: "Inventory", to: "/dashboard/inventory", icon: Package, shortcut: "⌘7" },
  { label: "Projects", to: "/dashboard/projects", icon: FolderKanban, shortcut: "⌘8" },
  { label: "Analytics", to: "/dashboard/analytics", icon: BarChart3, shortcut: "⌘9" },
  { label: "Drive", to: "/dashboard/drive", icon: HardDrive, shortcut: "⌘0" },
  { label: "AI Chat", to: "/dashboard/ai-chat", icon: Sparkles, shortcut: "⌘-" },
  { label: "Mail", to: "/dashboard/mail", icon: Mail, shortcut: "⌘M" },
  { label: "Calendar", to: "/dashboard/calendar", icon: Calendar, shortcut: "⌘C" },
  { label: "Tasks", to: "/dashboard/tasks", icon: ListTodo, shortcut: "⌘T" },
  { label: "Notes", to: "/dashboard/notes", icon: StickyNote, shortcut: "⌘N" },
  { label: "Support", to: "/dashboard/support", icon: HeadphonesIcon, shortcut: "⌘S" },
];

const menuBarApps = [
  { label: "AnanOS", icon: Monitor },
  { label: "File", icon: null },
  { label: "Edit", icon: null },
  { label: "View", icon: null },
  { label: "Help", icon: null },
];

function AnanOSShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const location = useLocation();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const currentApp =
    appItems.find((a) => isActive(a.to))?.label || "AnanOS";

  return (
    <div className="min-h-screen bg-blueprint-bg text-blueprint-paper flex flex-col">
      {/* ── macOS-style Top Menu Bar ── */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-9 items-center justify-between border-b border-blueprint-grid/20 bg-blueprint-surface/90 px-4 text-xs backdrop-blur-xl lg:h-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-semibold text-blueprint-brass">
            <Monitor size={14} />
            <span className="hidden sm:inline">AnanOS</span>
          </div>
          {menuBarApps.map((item) => (
            <button
              key={item.label}
              className="hidden px-2 py-1 text-blueprint-muted transition hover:text-blueprint-paper md:inline-block"
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Bell size={13} className="text-blueprint-muted" />
          <span className="text-blueprint-muted">{currentTime}</span>
        </div>
      </header>

      {/* ── Mobile menu toggle (visible below lg) ── */}
      <button
        className="fixed left-3 top-12 z-50 flex h-8 w-8 items-center justify-center border border-blueprint-grid/20 bg-blueprint-surface/90 text-blueprint-paper backdrop-blur-xl lg:hidden"
        onClick={() => setMobileOpen((state) => !state)}
        aria-label="Toggle navigation"
      >
        <Monitor size={16} />
      </button>

      {/* ── Mobile Navigation Panel ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-blueprint-bg/95 backdrop-blur-md lg:hidden">
          <nav className="mt-20 flex flex-col gap-1 px-6">
            {appItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition ${
                    active
                      ? "border-blueprint-brass bg-blueprint-brass/10 text-blueprint-paper"
                      : "border-transparent text-blueprint-muted hover:border-blueprint-grid/20 hover:text-blueprint-paper"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                  <span className="ml-auto text-xs text-blueprint-muted/50">
                    {item.shortcut}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      {/* ── Desktop Content Area ── */}
      <main className="bp-grid flex-1 pt-9 lg:pt-10 pb-24 lg:pb-28">
        <div className="mx-auto h-full">
          <Outlet />
        </div>
      </main>


      {/* ── macOS-style Dock ── */}
      <footer className="fixed inset-x-0 bottom-0 z-50 flex justify-center pb-2 pt-2 lg:pb-3">
        <div className="flex items-end gap-1 rounded-2xl border border-blueprint-grid/20 bg-blueprint-surface/80 px-3 py-2 backdrop-blur-2xl shadow-2xl shadow-black/40 lg:gap-1.5 lg:px-4 lg:py-3">
          {appItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                title={`${item.label} (${item.shortcut})`}
                className={`group relative flex flex-col items-center px-2 py-1 transition-all duration-150 hover:-translate-y-1 ${
                  active ? "scale-110" : "opacity-70 hover:opacity-100"
                }`}
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border text-sm transition-all duration-150 lg:h-12 lg:w-12 lg:rounded-2xl ${
                    active
                      ? "border-blueprint-brass bg-blueprint-brass/15 text-blueprint-brass shadow-lg shadow-blueprint-brass/10"
                      : "border-blueprint-grid/15 bg-blueprint-bg/60 text-blueprint-muted group-hover:border-blueprint-grid/30 group-hover:bg-blueprint-bg group-hover:text-blueprint-paper"
                  }`}
                >
                  <Icon size={20} className="lg:size-[22px]" />
                </div>
                {/* Active indicator dot */}
                {active && (
                  <span className="mt-1 h-1 w-1 rounded-full bg-blueprint-brass" />
                )}
                {/* Tooltip label */}
                <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-blueprint-grid/20 bg-blueprint-surface px-2 py-1 text-[11px] text-blueprint-paper opacity-0 shadow-lg transition-opacity group-hover:opacity-100 lg:block">
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Dock separator */}
          <div className="mx-1 h-10 w-px bg-blueprint-grid/20 lg:mx-2" />

          {/* Dock utility icons */}
          <Link
            to="/dashboard/notifications"
            className={`group relative flex flex-col items-center px-2 py-1 transition-all duration-150 hover:-translate-y-1 ${
              isActive("/dashboard/notifications") ? "scale-110" : "opacity-60 hover:opacity-100"
            }`}
            title="Notifications"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blueprint-grid/15 bg-blueprint-bg/60 text-blueprint-muted transition-all duration-150 group-hover:border-blueprint-grid/30 group-hover:bg-blueprint-bg group-hover:text-blueprint-paper lg:h-12 lg:w-12 lg:rounded-2xl">
              <Bell size={20} className="lg:size-[22px]" />
            </div>
            <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-blueprint-grid/20 bg-blueprint-surface px-2 py-1 text-[11px] text-blueprint-paper opacity-0 shadow-lg transition-opacity group-hover:opacity-100 lg:block">
              Notifications
            </span>
          </Link>

          <Link
            to="/dashboard/settings"
            className={`group relative flex flex-col items-center px-2 py-1 transition-all duration-150 hover:-translate-y-1 ${
              isActive("/dashboard/settings") ? "scale-110" : "opacity-60 hover:opacity-100"
            }`}
            title="Settings"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blueprint-grid/15 bg-blueprint-bg/60 text-blueprint-muted transition-all duration-150 group-hover:border-blueprint-grid/30 group-hover:bg-blueprint-bg group-hover:text-blueprint-paper lg:h-12 lg:w-12 lg:rounded-2xl">
              <Settings size={20} className="lg:size-[22px]" />
            </div>
            <span className="absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-blueprint-grid/20 bg-blueprint-surface px-2 py-1 text-[11px] text-blueprint-paper opacity-0 shadow-lg transition-opacity group-hover:opacity-100 lg:block">
              Settings
            </span>
          </Link>
        </div>
      </footer>
    </div>
  );
}