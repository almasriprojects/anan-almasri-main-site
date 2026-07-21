import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Users, Calculator, Briefcase, Scale, Package, BarChart3, Monitor,
  FolderKanban, LayoutDashboard, Activity, HardDrive, Wifi, Zap,
  Sparkles, Mail, Calendar, ListTodo, StickyNote, HeadphonesIcon,
  Search, Cpu, BatteryFull, Thermometer, FolderOpen,
  Settings, HelpCircle, Power, ChevronRight, Bell, Sun,
  Volume2, MessageSquare, Clock, TrendingUp,
  DollarSign, ChevronUp, Globe, Shield, Edit3,
  ArrowUpDown, CheckCircle, FileText, RefreshCw,
  Database, Server,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: AnanOSDesktop,
});

// ─── APPS ───────────────────────────────────────
const allApps = [
  { label: "CRM", to: "/dashboard/crm", icon: Users, color: "text-blue-400", gradient: "from-blue-500/20 to-blue-500/5", desc: "Customer management" },
  { label: "Operations", to: "/dashboard/operations", icon: Briefcase, color: "text-emerald-400", gradient: "from-emerald-500/20 to-emerald-500/5", desc: "Work orders & assets" },
  { label: "Accounting", to: "/dashboard/accounting", icon: Calculator, color: "text-amber-400", gradient: "from-amber-500/20 to-amber-500/5", desc: "Finance & ledger" },
  { label: "HRM", to: "/dashboard/hrm", icon: Monitor, color: "text-violet-400", gradient: "from-violet-500/20 to-violet-500/5", desc: "Employee management" },
  { label: "Legal", to: "/dashboard/legal", icon: Scale, color: "text-rose-400", gradient: "from-rose-500/20 to-rose-500/5", desc: "Cases & compliance" },
  { label: "Inventory", to: "/dashboard/inventory", icon: Package, color: "text-cyan-400", gradient: "from-cyan-500/20 to-cyan-500/5", desc: "Stock & warehouse" },
  { label: "Projects", to: "/dashboard/projects", icon: FolderKanban, color: "text-orange-400", gradient: "from-orange-500/20 to-orange-500/5", desc: "Tasks & tracking" },
  { label: "Analytics", to: "/dashboard/analytics", icon: BarChart3, color: "text-indigo-400", gradient: "from-indigo-500/20 to-indigo-500/5", desc: "Reports & KPIs" },
  { label: "Mail", to: "/dashboard/mail", icon: Mail, color: "text-blue-400", gradient: "from-blue-500/20 to-sky-500/5", desc: "Email client" },
  { label: "Calendar", to: "/dashboard/calendar", icon: Calendar, color: "text-rose-400", gradient: "from-rose-500/20 to-pink-500/5", desc: "Schedule & events" },
  { label: "Tasks", to: "/dashboard/tasks", icon: ListTodo, color: "text-emerald-400", gradient: "from-emerald-500/20 to-teal-500/5", desc: "Task management" },
  { label: "Notes", to: "/dashboard/notes", icon: StickyNote, color: "text-amber-400", gradient: "from-amber-500/20 to-yellow-500/5", desc: "Documentation" },
  { label: "Drive", to: "/dashboard/drive", icon: HardDrive, color: "text-sky-400", gradient: "from-sky-500/20 to-cyan-500/5", desc: "File storage" },
  { label: "AI Chat", to: "/dashboard/ai-chat", icon: Sparkles, color: "text-fuchsia-400", gradient: "from-fuchsia-500/20 to-purple-500/5", desc: "AI assistant" },
  { label: "Support", to: "/dashboard/support", icon: HeadphonesIcon, color: "text-teal-400", gradient: "from-teal-500/20 to-emerald-500/5", desc: "Help desk" },
];

// ─── DESKTOP FOLDERS ────────────────────────────
const desktopFolders = [
  { label: "Financials", icon: FolderOpen, color: "text-emerald-400", items: "34 files" },
  { label: "Contracts", icon: FolderOpen, color: "text-rose-400", items: "28 files" },
];

// ─── LIVE CONTAINER STATS (fetched from /api/stats) ──
type LiveStats = {
  cpu: number;
  memory: { percent: number; usedGB: string; totalGB: string };
  disk: { percent: number; usedGB: string; totalGB: string };
  network: { rxMB: string; txMB: string };
  uptime: string;
  hostname: string;
  cpus: number;
};

const FALLBACK_STATS: LiveStats = {
  cpu: 0,
  memory: { percent: 0, usedGB: "0.00", totalGB: "0.00" },
  disk: { percent: 0, usedGB: "0.00", totalGB: "0.00" },
  network: { rxMB: "0.00", txMB: "0.00" },
  uptime: "—",
  hostname: "—",
  cpus: 0,
};

// Color thresholds for the bars
const colorFor = (pct: number, kind: "cpu" | "mem" | "disk") => {
  if (pct >= 85) return { text: "text-rose-400", hex: "#fb7185" };
  if (pct >= 60) return { text: "text-amber-400", hex: "#fbbf24" };
  if (kind === "cpu") return { text: "text-sky-400", hex: "#60a5fa" };
  if (kind === "mem") return { text: "text-violet-400", hex: "#a78bfa" };
  return { text: "text-emerald-400", hex: "#34d399" };
};

const activityFeed = [
  { app: "CRM", text: "David Kim marked as Hot lead", time: "2m", icon: Users, color: "text-blue-400" },
  { app: "Drive", text: "Q3_Report.pdf uploaded", time: "5m", icon: HardDrive, color: "text-sky-400" },
  { app: "AI Chat", text: "Revenue analysis completed", time: "12m", icon: Sparkles, color: "text-fuchsia-400" },
  { app: "Tasks", text: "SSL certificate renewal done", time: "18m", icon: ListTodo, color: "text-emerald-400" },
  { app: "Mail", text: "3 new emails from TechNova", time: "24m", icon: Mail, color: "text-blue-400" },
  { app: "Projects", text: "API Integration at 90%", time: "35m", icon: FolderKanban, color: "text-orange-400" },
];

const kpiWidgets = [
  { label: "Revenue MTD", value: "$2.4M", change: "+18.2%", icon: DollarSign, up: true },
  { label: "Active Users", value: "3,842", change: "+7.4%", icon: Users, up: true },
  { label: "Open Tickets", value: "8", change: "-3", icon: MessageSquare, up: false },
  { label: "Tasks Done", value: "142", change: "+12", icon: CheckCircle, up: true },
];

// ─── COMPONENT ──────────────────────────────────
function AnanOSDesktop() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [mounted, setMounted] = useState(false);
  const [startOpen, setStartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showWidgets, setShowWidgets] = useState(true);
  const [selectedIcons, setSelectedIcons] = useState<string[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [liveStats, setLiveStats] = useState<LiveStats>(FALLBACK_STATS);
  const [statsOnline, setStatsOnline] = useState(false);
  const startRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
    };
    update();
    const i = setInterval(update, 1000);
    return () => clearInterval(i);
  }, []);

  // Poll /api/stats every 2s for live container metrics
  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: LiveStats = await res.json();
        if (!cancelled) {
          setLiveStats(data);
          setStatsOnline(true);
        }
      } catch {
        if (!cancelled) setStatsOnline(false);
      }
    };
    fetchStats();
    const id = setInterval(fetchStats, 2000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Close start menu
  useEffect(() => {
    if (!startOpen) return;
    const handler = (e: MouseEvent) => {
      if (startRef.current && !startRef.current.contains(e.target as Node)) setStartOpen(false);
    };
    setTimeout(() => window.addEventListener("click", handler), 0);
    return () => window.removeEventListener("click", handler);
  }, [startOpen]);

  // Close context menu
  useEffect(() => {
    if (!contextMenu) return;
    const handler = () => setContextMenu(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [contextMenu]);

  const handleDesktopContext = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const toggleSelect = (label: string) => {
    setSelectedIcons((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const filteredApps = allApps.filter((a) =>
    a.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden"
      onContextMenu={handleDesktopContext}
    >
      {/* ─── WALLPAPER ─────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#080f20]/70 via-[#0c1a35]/70 to-[#040b18]/70" />
      <div className="absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: `linear-gradient(rgba(201,161,93,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(201,161,93,.18) 1px,transparent 1px)`, backgroundSize: "80px 80px" }}
      />

      {/* Ambient glow */}
      <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-blueprint-brass/4 blur-[120px]" />
      <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-violet-500/4 blur-[120px]" />
      <div className="absolute left-1/2 top-1/3 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/2 blur-[100px]" />

      {/* Subtle floating particles */}
      {mounted && Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute h-[2px] w-[2px] rounded-full bg-blueprint-brass/10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${8 + Math.random() * 12}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* ─── DESKTOP CONTENT ────────────────────────── */}
      <div className="relative z-10 flex h-screen flex-col">
        {/* Desktop area */}
        <div
          className="flex-1 overflow-y-auto p-5 lg:p-6"
          onClick={() => { setStartOpen(false); setContextMenu(null); }}
        >
          {/* Top bar */}
          <div className="mb-5 flex items-center justify-between">
            <div className="hidden items-center gap-2 lg:flex">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blueprint-brass/15 text-xs font-bold text-blueprint-brass">A</div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted/50">AnanOS Enterprise</span>
            </div>
            <div className="flex items-center gap-3">
              {/* System tray icons */}
              <div className="hidden items-center gap-2 sm:flex">
                <Shield size={13} className="text-green-400/60" />
                <Wifi size={13} className="text-blueprint-muted/60" />
                <Volume2 size={13} className="text-blueprint-muted/60" />
                <BatteryFull size={13} className="text-green-400/60" />
                <Sun size={13} className="text-blueprint-muted/60" />
              </div>
              {/* Clock widget */}
              <div className="flex items-center gap-2.5 rounded-xl border border-blueprint-grid/15 bg-blueprint-surface/40 px-3.5 py-2 backdrop-blur-lg">
                <Clock size={13} className="text-blueprint-brass" />
                <span className="font-mono text-xs font-semibold text-blueprint-paper">{time}</span>
                <span className="hidden text-[10px] text-blueprint-muted/70 sm:inline">{date}</span>
              </div>
              {/* Bell */}
              <button className="relative rounded-xl border border-blueprint-grid/15 bg-blueprint-surface/40 p-2 backdrop-blur-lg transition hover:bg-blueprint-surface/70">
                <Bell size={14} className="text-blueprint-muted" />
                <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] font-bold text-white">3</span>
              </button>
            </div>
          </div>

          {/* Widgets Panel - main content of the desktop. Apps live in the Start menu. */}
          <div className="flex w-full flex-col gap-4">
              {/* KPI Widget - full width always */}
              <div className="rounded-2xl border border-blueprint-grid/12 bg-blueprint-surface/25 p-5 backdrop-blur-lg">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted/50">
                    <TrendingUp size={12} />
                    Business Overview
                  </div>
                  <button className="rounded-lg border border-blueprint-grid/15 px-3 py-1 text-[10px] text-blueprint-muted transition hover:bg-white/5 hover:text-blueprint-paper">View All</button>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {kpiWidgets.map((k) => {
                    const KIcon = k.icon;
                    return (
                      <div key={k.label} className="rounded-xl border border-blueprint-grid/10 bg-blueprint-bg/40 p-3.5 transition hover:bg-blueprint-bg/60">
                        <div className="flex items-center justify-between">
                          <KIcon size={14} className="text-blueprint-muted/60" />
                          <span className={`text-[10px] font-medium ${k.up ? "text-green-400" : "text-red-400"}`}>{k.change}</span>
                        </div>
                        <p className="mt-1.5 font-mono text-lg font-bold text-blueprint-paper">{k.value}</p>
                        <p className="text-[10px] text-blueprint-muted/70">{k.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* System Monitor + Activity Feed - side by side on lg+, stacked on mobile */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">

                {/* System Monitor - LIVE from /api/stats */}
                <div className="rounded-2xl border border-blueprint-grid/12 bg-blueprint-surface/25 p-5 backdrop-blur-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted/50">
                      <Server size={12} />
                      System Monitor
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="flex h-2 w-2 items-center justify-center">
                        {statsOnline && (
                          <span className="absolute h-2 w-2 animate-ping rounded-full bg-green-400/60" />
                        )}
                        <span className={`h-1.5 w-1.5 rounded-full ${statsOnline ? "bg-green-400" : "bg-rose-400"}`} />
                      </span>
                      <span className={`text-[9px] font-mono font-semibold ${statsOnline ? "text-green-400" : "text-rose-400"}`}>
                        {statsOnline ? "LIVE" : "OFFLINE"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(() => {
                      // CPU
                      const cpu = colorFor(liveStats.cpu, "cpu");
                      // Memory
                      const mem = colorFor(liveStats.memory.percent, "mem");
                      // Disk
                      const dsk = colorFor(liveStats.disk.percent, "disk");
                      const rows = [
                        {
                          key: "cpu",
                          icon: Cpu,
                          color: cpu.text,
                          hex: cpu.hex,
                          label: "CPU",
                          value: `${liveStats.cpu}%`,
                          bar: liveStats.cpu,
                        },
                        {
                          key: "mem",
                          icon: HardDrive,
                          color: mem.text,
                          hex: mem.hex,
                          label: "Memory",
                          value: `${liveStats.memory.usedGB} / ${liveStats.memory.totalGB} GB (${liveStats.memory.percent}%)`,
                          bar: liveStats.memory.percent,
                        },
                        {
                          key: "net",
                          icon: Globe,
                          color: "text-blue-400",
                          hex: "#60a5fa",
                          label: "Network",
                          value: `↓ ${liveStats.network.rxMB} MB  ·  ↑ ${liveStats.network.txMB} MB`,
                          bar: 0,
                        },
                        {
                          key: "disk",
                          icon: Database,
                          color: dsk.text,
                          hex: dsk.hex,
                          label: "Disk",
                          value: `${liveStats.disk.usedGB} / ${liveStats.disk.totalGB} GB (${liveStats.disk.percent}%)`,
                          bar: liveStats.disk.percent,
                        },
                      ];
                      return rows.map((r) => {
                        const I = r.icon;
                        return (
                          <div key={r.key}>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                <I size={11} className={r.color} />
                                <span className="text-blueprint-muted/80">{r.label}</span>
                              </div>
                              <span className="font-mono text-blueprint-paper">{r.value}</span>
                            </div>
                            {r.bar > 0 && (
                              <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-blueprint-bg/50">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{ width: `${r.bar}%`, background: `linear-gradient(90deg, ${r.hex}99, ${r.hex}cc)` }}
                                />
                              </div>
                            )}
                          </div>
                        );
                      });
                    })()}
                  </div>

                  {/* Footer with hostname + uptime */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 font-mono text-[10px] text-blueprint-muted/70">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-blueprint-muted/50">host</span>
                      <span className="truncate text-blueprint-paper/80">{liveStats.hostname}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blueprint-muted/50">up</span>
                      <span className="text-blueprint-paper/80">{liveStats.uptime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blueprint-muted/50">cpus</span>
                      <span className="text-blueprint-paper/80">{liveStats.cpus}</span>
                    </div>
                  </div>
                </div>

                {/* Activity Feed */}
                <div className="rounded-2xl border border-blueprint-grid/12 bg-blueprint-surface/25 p-5 backdrop-blur-lg">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-blueprint-muted/50">
                      <Activity size={12} />
                      Live Activity
                    </div>
                    <span className="flex h-2 w-2 items-center justify-center">
                      <span className="absolute h-2 w-2 animate-ping rounded-full bg-green-400/60" />
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    </span>
                  </div>
                  <div className="space-y-1">
                    {activityFeed.map((a, i) => {
                      const AIcon = a.icon;
                      return (
                        <div key={i} className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition hover:bg-white/[0.04]">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-blueprint-grid/15 bg-blueprint-surface/50 transition group-hover:scale-110">
                            <AIcon size={13} className={a.color} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs text-blueprint-paper/90">{a.text}</p>
                          </div>
                          <span className="shrink-0 text-[10px] font-mono text-blueprint-muted/50">{a.time}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* ─── TASKBAR (Windows 11 style) ────────────────── */}
        <div className="fixed inset-x-0 bottom-0 z-40 flex h-14 items-center justify-center border-t border-white/[0.06] bg-blueprint-surface/80 px-4 backdrop-blur-2xl lg:h-16">
          <div className="flex w-full max-w-7xl items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-1">
              {/* Start button */}
              <button
                onClick={(e) => { e.stopPropagation(); setStartOpen(!startOpen); }}
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 ${
                  startOpen
                    ? "bg-blueprint-brass/15 text-blueprint-brass shadow-lg shadow-blueprint-brass/10"
                    : "text-blueprint-muted hover:bg-white/[0.08] hover:text-blueprint-paper"
                }`}
              >
                <LayoutDashboard size={18} />
              </button>

              {/* Search */}
              <button className="hidden h-10 items-center gap-2 rounded-xl border border-blueprint-grid/15 bg-blueprint-bg/50 px-3 transition hover:bg-blueprint-bg/80 md:flex">
                <Search size={14} className="text-blueprint-muted" />
                <span className="text-xs text-blueprint-muted/60">Search apps, files, settings...</span>
                <kbd className="rounded-md border border-blueprint-grid/20 bg-blueprint-surface/50 px-1.5 py-0.5 text-[9px] text-blueprint-muted/40">⌘K</kbd>
              </button>
            </div>

            {/* Center - Running apps */}
            <div className="flex items-center gap-0.5">
              {allApps.slice(0, 8).map((app) => {
                const Icon = app.icon;
                return (
                  <Link
                    key={app.to}
                    to={app.to}
                    className="group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 hover:bg-white/[0.08] lg:h-11 lg:w-11"
                    title={app.label}
                  >
                    <Icon size={18} className="text-blueprint-muted transition-all duration-200 group-hover:text-blueprint-paper group-hover:scale-110" />
                    <span className="absolute -bottom-1 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-blueprint-brass/0 transition-all duration-300 group-hover:bg-blueprint-brass/60" />
                  </Link>
                );
              })}
            </div>

            {/* Right */}
            <div className="hidden items-center gap-2 sm:flex">
              <button className="h-10 w-10 rounded-xl text-blueprint-muted transition hover:bg-white/[0.08] hover:text-blueprint-paper">
                <MessageSquare size={16} className="mx-auto" />
              </button>
              <button className="h-10 w-10 rounded-xl text-blueprint-muted transition hover:bg-white/[0.08] hover:text-blueprint-paper">
                <Bell size={16} className="mx-auto" />
              </button>
              <button
                onClick={() => setShowWidgets(!showWidgets)}
                className="h-10 w-10 rounded-xl text-blueprint-muted transition hover:bg-white/[0.08] hover:text-blueprint-paper"
              >
                <ChevronUp size={16} className={`mx-auto transition-transform ${showWidgets ? "rotate-180" : ""}`} />
              </button>
              <div className="ml-1 flex items-center gap-2 rounded-xl border border-blueprint-grid/15 bg-blueprint-bg/50 px-3 py-1.5">
                <span className="font-mono text-xs font-semibold text-blueprint-paper">{time}</span>
                <div className="flex items-center gap-1">
                  <Wifi size={10} className="text-blueprint-muted/60" />
                  <BatteryFull size={12} className="text-green-400/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── START MENU ───────────────────────────── */}
        {startOpen && (
          <div
            ref={startRef}
            className="fixed bottom-20 left-4 z-50 w-[600px] max-w-[calc(100vw-2rem)] origin-bottom-left animate-[fadeIn_0.15s_ease-out] rounded-2xl border border-white/[0.08] bg-blueprint-surface/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-2xl lg:bottom-[72px] lg:left-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search */}
            <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-blueprint-grid/20 bg-blueprint-bg/80 px-4 py-3 transition focus-within:border-blueprint-brass/40">
              <Search size={15} className="text-blueprint-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search apps, files, settings..."
                className="w-full bg-transparent text-sm text-blueprint-paper outline-none placeholder:text-blueprint-muted/40"
                autoFocus
              />
            </div>

            {/* All Apps - unified grid (5 cols x 3 rows = 15 apps), no scrolling */}
            <div className="mb-4 grid grid-cols-5 gap-2">
              {(search ? filteredApps : allApps).map((app) => {
                const Icon = app.icon;
                return (
                  <Link
                    key={app.to}
                    to={app.to}
                    onClick={() => { setStartOpen(false); setSearch(""); }}
                    className="group flex flex-col items-center gap-2 rounded-2xl p-3 transition hover:bg-white/[0.06]"
                  >
                    <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${app.gradient} shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl`}>
                      <div className="absolute inset-0 rounded-2xl border border-white/10" />
                      <Icon size={22} className={`${app.color} drop-shadow-sm`} />
                    </div>
                    <span className="rounded-md px-1.5 py-0.5 text-center text-[11px] font-medium leading-tight text-blueprint-paper/80 transition-colors group-hover:text-blueprint-paper"
                      style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
                      {app.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between border-t border-white/[0.06] pt-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blueprint-brass/20 to-blueprint-brass/5 text-xs font-bold text-blueprint-brass">AA</div>
                <div>
                  <p className="text-xs font-medium text-blueprint-paper">Admin</p>
                  <p className="text-[10px] text-blueprint-muted/50">anan@ananenterprise.com</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Link to="/dashboard/settings" onClick={() => setStartOpen(false)} className="rounded-xl p-2 text-blueprint-muted/60 transition hover:bg-white/[0.06] hover:text-blueprint-paper"><Settings size={15} /></Link>
                <button className="rounded-xl p-2 text-blueprint-muted/60 transition hover:bg-white/[0.06] hover:text-blueprint-paper"><HelpCircle size={15} /></button>
                <button className="rounded-xl p-2 text-blueprint-muted/60 transition hover:bg-white/[0.06] hover:text-rose-400"><Power size={15} /></button>
              </div>
            </div>
          </div>
        )}

        {/* ─── CONTEXT MENU ──────────────────────────── */}
        {contextMenu && (
          <div
            className="fixed z-[60] w-48 origin-top-left animate-[fadeIn_0.1s_ease-out] rounded-xl border border-white/[0.08] bg-blueprint-surface/95 p-1 shadow-2xl shadow-black/60 backdrop-blur-2xl"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            {[
              { label: "View", icon: Sun },
              { label: "Sort by", icon: ArrowUpDown },
              { label: "Refresh", icon: RefreshCw },
              null,
              { label: "New Folder", icon: FolderOpen },
              { label: "New Text File", icon: FileText },
              null,
              { label: "Display Settings", icon: Settings },
              { label: "Personalize", icon: Edit3 },
            ].map((item, i) =>
              item ? (
                <button
                  key={item.label}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs text-blueprint-muted transition hover:bg-white/[0.06] hover:text-blueprint-paper"
                  onClick={() => setContextMenu(null)}
                >
                  <item.icon size={13} className="text-blueprint-muted/60" />
                  {item.label}
                </button>
              ) : (
                <div key={i} className="my-1 h-px bg-white/[0.06]" />
              )
            )}
          </div>
        )}
      </div>

      {/* ─── ANIMATION KEYFRAMES ─────────────────────── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          25% { opacity: 0.3; }
          50% { opacity: 0.5; }
          75% { opacity: 0.2; }
        }
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(201,161,93,0.15); border-radius: 2px; }
      `}</style>
    </div>
  );
}
