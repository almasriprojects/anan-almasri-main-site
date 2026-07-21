import { createFileRoute } from "@tanstack/react-router";
import { Users, Phone, Mail, Building2, UserPlus, Search, Filter } from "lucide-react";

export const Route = createFileRoute("/dashboard/crm")({
  component: CRMApp,
});

const leads = [
  { id: 1, name: "Sarah Johnson", company: "TechNova Inc.", email: "sarah@technova.com", phone: "+1 (555) 123-4567", status: "Hot", value: "$120,000" },
  { id: 2, name: "Michael Chen", company: "Quantum Dynamics", email: "mchen@quantumdyn.io", phone: "+1 (555) 234-5678", status: "Warm", value: "$85,000" },
  { id: 3, name: "Emily Rodriguez", company: "Pinnacle Solutions", email: "emily.r@pinnacle.com", phone: "+1 (555) 345-6789", status: "Cold", value: "$45,000" },
  { id: 4, name: "David Kim", company: "Horizon Ventures", email: "dkim@horizon.vc", phone: "+1 (555) 456-7890", status: "Hot", value: "$250,000" },
  { id: 5, name: "Lisa Thompson", company: "Meridian Group", email: "lisa@meridiangrp.com", phone: "+1 (555) 567-8901", status: "Warm", value: "$95,000" },
];

const pipelineStages = [
  { name: "Lead", count: 24, value: "$1.2M", color: "border-blue-500/50" },
  { name: "Qualified", count: 18, value: "$980K", color: "border-emerald-500/50" },
  { name: "Proposal", count: 12, value: "$720K", color: "border-amber-500/50" },
  { name: "Negotiation", count: 7, value: "$450K", color: "border-violet-500/50" },
  { name: "Closed Won", count: 31, value: "$2.8M", color: "border-green-500/50" },
];

function CRMApp() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
              <h1 className="font-mono text-2xl font-bold text-blueprint-paper">CRM</h1>
            </div>
          </div>
          <p className="mt-2 text-sm text-blueprint-muted">Customer Relationship Management — leads, pipeline, and contacts.</p>
        </div>
        <button className="flex items-center gap-2 border border-blueprint-grid/20 bg-blueprint-brass/10 px-4 py-2.5 text-sm text-blueprint-brass transition hover:bg-blueprint-brass/20">
          <UserPlus size={16} />
          Add Lead
        </button>
      </div>

      {/* Pipeline Overview */}
      <div className="mb-8 grid gap-4 sm:grid-cols-5">
        {pipelineStages.map((stage) => (
          <div key={stage.name} className={`border-l-2 ${stage.color} border border-blueprint-grid/20 bg-blueprint-surface p-4`}>
            <p className="text-xs uppercase tracking-[0.3em] text-blueprint-muted">{stage.name}</p>
            <p className="mt-2 font-mono text-2xl font-bold text-blueprint-paper">{stage.count}</p>
            <p className="mt-1 text-sm text-blueprint-brass">{stage.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 border border-blueprint-grid/20 bg-blueprint-surface px-4 py-2.5">
          <Search size={16} className="text-blueprint-muted" />
          <input
            type="text"
            placeholder="Search leads..."
            className="w-full bg-transparent text-sm text-blueprint-paper outline-none placeholder:text-blueprint-muted/50"
          />
        </div>
        <button className="flex items-center gap-2 border border-blueprint-grid/20 bg-blueprint-surface px-4 py-2.5 text-sm text-blueprint-muted transition hover:text-blueprint-paper">
          <Filter size={16} />
          Filter
        </button>
      </div>

      {/* Leads Table */}
      <div className="border border-blueprint-grid/20 bg-blueprint-surface">
        <div className="grid grid-cols-6 gap-4 border-b border-blueprint-grid/20 px-6 py-4 text-xs uppercase tracking-[0.3em] text-blueprint-muted">
          <span className="col-span-2">Name</span>
          <span>Company</span>
          <span>Contact</span>
          <span>Status</span>
          <span className="text-right">Value</span>
        </div>
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="grid grid-cols-6 gap-4 border-b border-blueprint-grid/10 px-6 py-4 text-sm transition last:border-0 hover:bg-blueprint-bg/50"
          >
            <div className="col-span-2">
              <p className="font-medium text-blueprint-paper">{lead.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={14} className="text-blueprint-muted" />
              <span className="text-blueprint-muted">{lead.company}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 text-blueprint-muted">
                <Mail size={12} />
                <span className="truncate">{lead.email}</span>
              </div>
              <div className="flex items-center gap-2 text-blueprint-muted/70">
                <Phone size={12} />
                <span>{lead.phone}</span>
              </div>
            </div>
            <div>
              <span
                className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-medium ${
                  lead.status === "Hot"
                    ? "bg-red-500/10 text-red-400"
                    : lead.status === "Warm"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-gray-500/10 text-gray-400"
                }`}
              >
                {lead.status}
              </span>
            </div>
            <p className="text-right font-mono font-medium text-blueprint-paper">{lead.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}