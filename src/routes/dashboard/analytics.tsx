import { createFileRoute } from "@tanstack/react-router";
import { BarChart3, TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";

export const Route = createFileRoute("/dashboard/analytics")({
  component: AnalyticsApp,
});

const kpiCards = [
  { label: "Total Revenue", value: "$2.4M", change: "+18.2%", positive: true, icon: DollarSign },
  { label: "Active Users", value: "3,842", change: "+7.4%", positive: true, icon: Users },
  { label: "Conversion Rate", value: "24.8%", change: "+3.1%", positive: true, icon: TrendingUp },
  { label: "Avg Response Time", value: "1.2s", change: "-12.5%", positive: true, icon: Activity },
];

const monthlyData = [
  { month: "Jan", revenue: 180, costs: 120, profit: 60 },
  { month: "Feb", revenue: 210, costs: 135, profit: 75 },
  { month: "Mar", revenue: 195, costs: 130, profit: 65 },
  { month: "Apr", revenue: 240, costs: 150, profit: 90 },
  { month: "May", revenue: 225, costs: 140, profit: 85 },
  { month: "Jun", revenue: 270, costs: 160, profit: 110 },
];

const topApps = [
  { name: "CRM", views: 1847, growth: "+12.3%" },
  { name: "Accounting", views: 1423, growth: "+8.7%" },
  { name: "Operations", views: 987, growth: "+15.2%" },
  { name: "HRM", views: 756, growth: "+5.4%" },
  { name: "Projects", views: 654, growth: "+22.1%" },
];

function AnalyticsApp() {
  const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue));
  const maxCosts = Math.max(...monthlyData.map((d) => d.costs));

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
            <BarChart3 size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
            <h1 className="font-mono text-2xl font-bold text-blueprint-paper">Analytics</h1>
            <p className="mt-1 text-sm text-blueprint-muted">Business intelligence, KPIs, and data-driven insights.</p>
          </div>
        </div>
        <button className="flex items-center gap-2 border border-blueprint-grid/20 bg-blueprint-surface px-4 py-2.5 text-sm text-blueprint-muted transition hover:text-blueprint-paper">
          <Download size={16} />
          Export Report
        </button>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-4">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="border border-blueprint-grid/20 bg-blueprint-surface p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-blueprint-muted">{kpi.label}</p>
                <Icon size={16} className="text-blueprint-brass/60" />
              </div>
              <p className="mt-3 font-mono text-2xl font-bold text-blueprint-paper">{kpi.value}</p>
              <div className={`mt-1 flex items-center gap-1 text-xs ${kpi.positive ? "text-green-400" : "text-red-400"}`}>
                {kpi.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {kpi.change}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="border border-blueprint-grid/20 bg-blueprint-surface p-6">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">Revenue vs Costs</p>
            <p className="text-xs text-blueprint-muted">Last 6 months</p>
          </div>
          <div className="flex items-end gap-3" style={{ height: 180 }}>
            {monthlyData.map((d) => (
              <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                <div className="flex w-full flex-col items-center justify-end" style={{ height: 160 }}>
                  <div
                    className="w-3/4 bg-blueprint-brass/60 rounded-t"
                    style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                    title={`Revenue: $${d.revenue}K`}
                  />
                  <div
                    className="mt-0.5 w-3/4 bg-blueprint-muted/30 rounded-t"
                    style={{ height: `${(d.costs / maxCosts) * 80}%` }}
                    title={`Costs: $${d.costs}K`}
                  />
                </div>
                <span className="text-[10px] text-blueprint-muted">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-4 text-[11px] text-blueprint-muted">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 bg-blueprint-brass/60" />
              Revenue
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 bg-blueprint-muted/30" />
              Costs
            </div>
          </div>
        </div>

        <div className="border border-blueprint-grid/20 bg-blueprint-surface p-6">
          <p className="mb-6 text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App Usage</p>
          <div className="space-y-4">
            {topApps.map((app) => (
              <div key={app.name} className="flex items-center justify-between border-b border-blueprint-grid/10 pb-3 last:border-0">
                <div>
                  <p className="text-sm font-medium text-blueprint-paper">{app.name}</p>
                  <p className="font-mono text-xs text-blueprint-muted">{app.views.toLocaleString()} views</p>
                </div>
                <span className="text-xs text-green-400">{app.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}