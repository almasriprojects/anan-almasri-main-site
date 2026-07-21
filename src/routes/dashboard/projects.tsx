import { createFileRoute } from "@tanstack/react-router";
import { FolderKanban, ListTodo, Clock, CheckCircle, Users, AlertCircle, BarChart3, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/projects")({
  component: ProjectsApp,
});

const projects = [
  { id: "PRJ-001", name: "Website Redesign", lead: "Alice W.", progress: 75, status: "On Track", deadline: "2026-08-15", team: 5 },
  { id: "PRJ-002", name: "Mobile App v2", lead: "Bob M.", progress: 45, status: "At Risk", deadline: "2026-09-01", team: 8 },
  { id: "PRJ-003", name: "API Integration", lead: "Carol L.", progress: 90, status: "On Track", deadline: "2026-07-28", team: 3 },
  { id: "PRJ-004", name: "Data Migration", lead: "Dan T.", progress: 30, status: "Behind", deadline: "2026-08-30", team: 4 },
  { id: "PRJ-005", name: "Q3 Marketing Campaign", lead: "Eve A.", progress: 60, status: "On Track", deadline: "2026-09-15", team: 6 },
];

const metrics = [
  { label: "Active Projects", value: 8, icon: FolderKanban },
  { label: "Tasks", value: 142, icon: ListTodo },
  { label: "Completed", value: 67, icon: CheckCircle },
  { label: "At Risk", value: 2, icon: AlertCircle },
];

function ProjectsApp() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <FolderKanban size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
            <h1 className="font-mono text-2xl font-bold text-blueprint-paper">Projects</h1>
            <p className="mt-1 text-sm text-blueprint-muted">Project management, task tracking, and team collaboration.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 border border-blueprint-grid/20 bg-blueprint-brass/10 px-4 py-2.5 text-sm text-blueprint-brass transition hover:bg-blueprint-brass/20">
          <Plus size={16} />
          New Project
        </button>
      </div>

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

      <div className="grid gap-4 lg:grid-cols-2">
        {projects.map((p) => (
          <div key={p.id} className="border border-blueprint-grid/20 bg-blueprint-surface p-6 transition hover:border-blueprint-grid/40">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs text-blueprint-brass/60">{p.id}</p>
                <h3 className="mt-1 font-mono text-lg font-bold text-blueprint-paper">{p.name}</h3>
              </div>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                p.status === "On Track" ? "bg-green-500/10 text-green-400" :
                p.status === "At Risk" ? "bg-amber-500/10 text-amber-400" :
                "bg-red-500/10 text-red-400"
              }`}>
                {p.status}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-4 text-xs text-blueprint-muted">
              <div className="flex items-center gap-1.5"><Users size={12} />{p.team} members</div>
              <div className="flex items-center gap-1.5"><Clock size={12} />{p.deadline}</div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blueprint-muted">Progress</span>
                <span className="font-mono text-blueprint-paper">{p.progress}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full bg-blueprint-bg">
                <div className="h-full bg-blueprint-brass transition-all" style={{ width: `${p.progress}%` }} />
              </div>
            </div>
            <p className="mt-3 text-xs text-blueprint-muted">Lead: {p.lead}</p>
          </div>
        ))}
      </div>
    </div>
  );
}