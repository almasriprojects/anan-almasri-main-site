import { createFileRoute } from "@tanstack/react-router";
import { Scale, FileText, Gavel, Shield, Clock } from "lucide-react";

export const Route = createFileRoute("/dashboard/legal")({
  component: LegalApp,
});

const cases = [
  { id: "CAS-001", title: "Contract Dispute - Vendor A", status: "Active", priority: "High", assigned: "Lisa C.", nextHearing: "2026-08-05" },
  { id: "CAS-002", title: "IP Filing - Patent #7843", status: "In Review", priority: "Medium", assigned: "Mark W.", nextHearing: "2026-07-30" },
  { id: "CAS-003", title: "Employment Agreement Review", status: "Drafting", priority: "Low", assigned: "Nina P.", nextHearing: "N/A" },
  { id: "CAS-004", title: "Compliance Audit - Q3", status: "Active", priority: "High", assigned: "Omar S.", nextHearing: "2026-08-12" },
  { id: "CAS-005", title: "NDA Review - Strategic Partner", status: "Completed", priority: "Medium", assigned: "Lisa C.", nextHearing: "N/A" },
];

const metrics = [
  { label: "Active Cases", value: 12, icon: Scale },
  { label: "Documents", value: 47, icon: FileText },
  { label: "Compliance Items", value: 8, icon: Shield },
  { label: "Pending Reviews", value: 6, icon: Clock },
];

function LegalApp() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
          <Scale size={20} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
          <h1 className="font-mono text-2xl font-bold text-blueprint-paper">Legal</h1>
          <p className="mt-1 text-sm text-blueprint-muted">Case management, contracts, compliance, and legal documents.</p>
        </div>
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

      <div className="border border-blueprint-grid/20 bg-blueprint-surface">
        <div className="flex items-center justify-between border-b border-blueprint-grid/20 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">Open Cases & Matters</p>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 border border-blueprint-grid/20 px-3 py-1.5 text-xs text-blueprint-muted transition hover:text-blueprint-paper">
              <FileText size={12} />
              Documents
            </button>
            <button className="flex items-center gap-1.5 border border-blueprint-grid/20 px-3 py-1.5 text-xs text-blueprint-brass transition hover:bg-blueprint-brass/10">
              <Gavel size={12} />
              New Case
            </button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 border-b border-blueprint-grid/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-blueprint-muted">
          <span className="col-span-2">Case / Matter</span>
          <span>Priority</span>
          <span>Status</span>
          <span>Next Hearing</span>
        </div>
        {cases.map((c) => (
          <div key={c.id} className="grid grid-cols-5 gap-4 border-b border-blueprint-grid/10 px-6 py-3.5 text-sm transition last:border-0 hover:bg-blueprint-bg/50">
            <div className="col-span-2">
              <p className="font-medium text-blueprint-paper">{c.title}</p>
              <p className="font-mono text-xs text-blueprint-brass/60">{c.id} · {c.assigned}</p>
            </div>
            <div>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                c.priority === "High" ? "bg-red-500/10 text-red-400" :
                c.priority === "Medium" ? "bg-amber-500/10 text-amber-400" :
                "bg-gray-500/10 text-gray-400"
              }`}>
                {c.priority}
              </span>
            </div>
            <div>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                c.status === "Active" ? "bg-blue-500/10 text-blue-400" :
                c.status === "Completed" ? "bg-green-500/10 text-green-400" :
                "bg-gray-500/10 text-gray-400"
              }`}>
                {c.status}
              </span>
            </div>
            <p className="font-mono text-blueprint-muted">{c.nextHearing}</p>
          </div>
        ))}
      </div>
    </div>
  );
}