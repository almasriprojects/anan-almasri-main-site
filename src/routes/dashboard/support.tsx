import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { HeadphonesIcon, MessageSquare, Plus, Search, AlertCircle, CheckCircle, Clock, User, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/support")({
  component: SupportApp,
});

const tickets = [
  { id: "TK-1001", subject: "Cannot access CRM dashboard", status: "Open", priority: "High", customer: "Alice Williams", assignee: "Support Team", created: "2 hours ago", messages: 4 },
  { id: "TK-1002", subject: "Invoice payment not reflecting", status: "In Progress", priority: "Critical", customer: "TechNova Inc.", assignee: "Bob M.", created: "5 hours ago", messages: 7 },
  { id: "TK-1003", subject: "New employee onboarding - account setup", status: "Open", priority: "Medium", customer: "HR Department", assignee: "IT Support", created: "1 day ago", messages: 2 },
  { id: "TK-1004", subject: "API integration documentation request", status: "Resolved", priority: "Low", customer: "Quantum Dynamics", assignee: "Carol L.", created: "2 days ago", messages: 5 },
  { id: "TK-1005", subject: "Password reset - admin account", status: "Closed", priority: "Medium", customer: "David Kim", assignee: "Support Team", created: "3 days ago", messages: 3 },
  { id: "TK-1006", subject: "Performance issues with Analytics app", status: "In Progress", priority: "High", customer: "Eve Anderson", assignee: "Engineering", created: "4 days ago", messages: 9 },
];

const metrics = [
  { label: "Open Tickets", value: 8, icon: MessageSquare },
  { label: "In Progress", value: 4, icon: Clock },
  { label: "Resolved Today", value: 12, icon: CheckCircle },
  { label: "SLA Breached", value: 1, icon: AlertCircle },
];

function SupportApp() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Open", "In Progress", "Resolved", "Closed"];

  const filteredTickets = tickets.filter((t) => filter === "All" || t.status === filter);

  const statusColors: Record<string, string> = {
    Open: "bg-blue-500/10 text-blue-400",
    "In Progress": "bg-amber-500/10 text-amber-400",
    Resolved: "bg-green-500/10 text-green-400",
    Closed: "bg-gray-500/10 text-gray-400",
  };

  const priorityColors: Record<string, string> = {
    Critical: "text-red-400",
    High: "text-orange-400",
    Medium: "text-amber-400",
    Low: "text-gray-400",
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-400">
            <HeadphonesIcon size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
            <h1 className="font-mono text-2xl font-bold text-blueprint-paper">AnanSupport</h1>
            <p className="mt-1 text-sm text-blueprint-muted">Help desk, support tickets, and customer service.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 border border-blueprint-grid/20 bg-blueprint-brass/10 px-4 py-2.5 text-sm text-blueprint-brass transition hover:bg-blueprint-brass/20">
          <Plus size={16} />
          New Ticket
        </button>
      </div>

      {/* Metrics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="border border-blueprint-grid/20 bg-blueprint-surface p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-blueprint-muted">{m.label}</p>
                <Icon size={16} className="text-blueprint-brass/60" />
              </div>
              <p className="mt-3 font-mono text-3xl font-bold text-blueprint-paper">{m.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full border px-4 py-1.5 text-xs transition ${
                filter === f
                  ? "border-blueprint-brass bg-blueprint-brass/10 text-blueprint-paper"
                  : "border-blueprint-grid/20 text-blueprint-muted hover:border-blueprint-grid/40 hover:text-blueprint-paper"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 border border-blueprint-grid/20 bg-blueprint-surface px-3 py-1.5">
          <Search size={14} className="text-blueprint-muted" />
          <input type="text" placeholder="Search tickets..." className="w-40 bg-transparent text-xs text-blueprint-paper outline-none placeholder:text-blueprint-muted/50" />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="border border-blueprint-grid/20 bg-blueprint-surface">
        <div className="grid grid-cols-7 gap-4 border-b border-blueprint-grid/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-blueprint-muted">
          <span>ID</span>
          <span className="col-span-2">Subject</span>
          <span>Status</span>
          <span>Priority</span>
          <span>Customer</span>
          <span>Msgs</span>
        </div>
        {filteredTickets.map((t) => (
          <div key={t.id} className="group grid grid-cols-7 gap-4 border-b border-blueprint-grid/10 px-6 py-3.5 text-sm transition last:border-0 hover:bg-blueprint-bg/50">
            <p className="font-mono text-blueprint-brass/80">{t.id}</p>
            <div className="col-span-2">
              <p className="font-medium text-blueprint-paper">{t.subject}</p>
              <p className="text-xs text-blueprint-muted">Created {t.created}</p>
            </div>
            <div>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${statusColors[t.status]}`}>{t.status}</span>
            </div>
            <div>
              <span className={`text-[11px] font-medium ${priorityColors[t.priority]}`}>{t.priority}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User size={12} className="text-blueprint-muted" />
              <span className="text-blueprint-muted truncate">{t.customer}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-blueprint-muted">
                <MessageSquare size={12} />
                {t.messages}
              </span>
              <ArrowUpRight size={14} className="opacity-0 transition group-hover:opacity-100 text-blueprint-brass" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}