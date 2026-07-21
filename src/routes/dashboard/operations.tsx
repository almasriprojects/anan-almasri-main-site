import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, ClipboardList, Truck, Wrench, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/dashboard/operations")({
  component: OperationsApp,
});

const workOrders = [
  { id: "WO-1024", asset: "CNC Machine #3", priority: "High", status: "In Progress", assignee: "Alex M.", due: "2026-07-22" },
  { id: "WO-1023", asset: "HVAC System A", priority: "Critical", status: "Pending", assignee: "Jane D.", due: "2026-07-21" },
  { id: "WO-1022", asset: "Conveyor Belt #2", priority: "Medium", status: "Completed", assignee: "Bob K.", due: "2026-07-19" },
  { id: "WO-1021", asset: "Generator Backup", priority: "Low", status: "Scheduled", assignee: "Sarah L.", due: "2026-07-25" },
  { id: "WO-1020", asset: "Server Rack Cooling", priority: "High", status: "In Progress", assignee: "Mike R.", due: "2026-07-23" },
];

const metrics = [
  { label: "Active Orders", value: 14, icon: ClipboardList },
  { label: "Pending", value: 8, icon: Clock },
  { label: "Completed This Week", value: 23, icon: CheckCircle },
  { label: "Overdue", value: 3, icon: AlertTriangle },
];

function OperationsApp() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
            <h1 className="font-mono text-2xl font-bold text-blueprint-paper">Operations</h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-blueprint-muted">Work orders, asset management, and maintenance scheduling.</p>
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

      {/* Work Orders Table */}
      <div className="border border-blueprint-grid/20 bg-blueprint-surface">
        <div className="flex items-center justify-between border-b border-blueprint-grid/20 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">Open Work Orders</p>
          <button className="text-xs text-blueprint-brass transition hover:text-blueprint-paper">View All</button>
        </div>
        <div className="grid grid-cols-6 gap-4 border-b border-blueprint-grid/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-blueprint-muted">
          <span>ID</span>
          <span className="col-span-2">Asset</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Assignee</span>
        </div>
        {workOrders.map((wo) => (
          <div key={wo.id} className="grid grid-cols-6 gap-4 border-b border-blueprint-grid/10 px-6 py-3.5 text-sm transition last:border-0 hover:bg-blueprint-bg/50">
            <p className="font-mono text-blueprint-brass">{wo.id}</p>
            <p className="col-span-2 font-medium text-blueprint-paper">{wo.asset}</p>
            <div>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                wo.priority === "Critical" ? "bg-red-500/10 text-red-400" :
                wo.priority === "High" ? "bg-orange-500/10 text-orange-400" :
                wo.priority === "Medium" ? "bg-amber-500/10 text-amber-400" :
                "bg-gray-500/10 text-gray-400"
              }`}>
                {wo.priority}
              </span>
            </div>
            <div>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                wo.status === "Completed" ? "bg-green-500/10 text-green-400" :
                wo.status === "In Progress" ? "bg-blue-500/10 text-blue-400" :
                "bg-gray-500/10 text-gray-400"
              }`}>
                {wo.status}
              </span>
            </div>
            <p className="text-blueprint-muted">{wo.assignee}</p>
          </div>
        ))}
      </div>
    </div>
  );
}