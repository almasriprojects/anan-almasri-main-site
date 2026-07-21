import { createFileRoute } from "@tanstack/react-router";
import { Monitor, Users, Calendar, Award, Briefcase, UserCheck, UserX } from "lucide-react";

export const Route = createFileRoute("/dashboard/hrm")({
  component: HRMApp,
});

const employees = [
  { id: "EMP-001", name: "Alice Williams", dept: "Engineering", role: "Sr. Developer", status: "Active", tenure: "4 yrs" },
  { id: "EMP-002", name: "Bob Martinez", dept: "Sales", role: "Account Exec", status: "Active", tenure: "2 yrs" },
  { id: "EMP-003", name: "Carol Lee", dept: "Marketing", role: "Marketing Lead", status: "Active", tenure: "3 yrs" },
  { id: "EMP-004", name: "Dan Taylor", dept: "Engineering", role: "DevOps Eng.", status: "On Leave", tenure: "5 yrs" },
  { id: "EMP-005", name: "Eve Anderson", dept: "Finance", role: "Finance Mgr", status: "Active", tenure: "6 yrs" },
];

const deptMetrics = [
  { label: "Total Employees", value: 48, icon: Users },
  { label: "Departments", value: 7, icon: Briefcase },
  { label: "On Leave", value: 3, icon: UserX },
  { label: "Open Positions", value: 5, icon: UserCheck },
];

function HRMApp() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400">
          <Monitor size={20} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
          <h1 className="font-mono text-2xl font-bold text-blueprint-paper">HRM</h1>
          <p className="mt-1 text-sm text-blueprint-muted">Human Resources — employees, attendance, and performance.</p>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {deptMetrics.map((m) => {
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

      <div className="border border-blueprint-grid/20 bg-blueprint-surface">
        <div className="flex items-center justify-between border-b border-blueprint-grid/20 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">Employee Directory</p>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 border border-blueprint-grid/20 px-3 py-1.5 text-xs text-blueprint-muted transition hover:text-blueprint-paper">
              <Calendar size={12} />
              Time Off
            </button>
            <button className="flex items-center gap-1.5 border border-blueprint-grid/20 px-3 py-1.5 text-xs text-blueprint-muted transition hover:text-blueprint-paper">
              <Award size={12} />
              Performance
            </button>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-4 border-b border-blueprint-grid/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-blueprint-muted">
          <span className="col-span-2">Employee</span>
          <span>Department</span>
          <span>Role</span>
          <span>Status</span>
          <span>Tenure</span>
        </div>
        {employees.map((emp) => (
          <div key={emp.id} className="grid grid-cols-6 gap-4 border-b border-blueprint-grid/10 px-6 py-3.5 text-sm transition last:border-0 hover:bg-blueprint-bg/50">
            <div className="col-span-2">
              <p className="font-medium text-blueprint-paper">{emp.name}</p>
              <p className="font-mono text-xs text-blueprint-brass/60">{emp.id}</p>
            </div>
            <p className="text-blueprint-muted">{emp.dept}</p>
            <p className="text-blueprint-muted">{emp.role}</p>
            <div>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                emp.status === "Active" ? "bg-green-500/10 text-green-400" :
                emp.status === "On Leave" ? "bg-amber-500/10 text-amber-400" :
                "bg-gray-500/10 text-gray-400"
              }`}>
                {emp.status}
              </span>
            </div>
            <p className="text-blueprint-muted">{emp.tenure}</p>
          </div>
        ))}
      </div>
    </div>
  );
}