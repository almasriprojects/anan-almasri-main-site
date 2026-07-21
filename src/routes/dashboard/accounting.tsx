import { createFileRoute } from "@tanstack/react-router";
import { Calculator, DollarSign, TrendingUp, TrendingDown, CreditCard, ArrowUpRight, ArrowDownRight } from "lucide-react";

export const Route = createFileRoute("/dashboard/accounting")({
  component: AccountingApp,
});

const transactions = [
  { id: "TX-001", description: "Client Payment - TechNova Inc.", amount: 45000, type: "credit", date: "2026-07-20", category: "Revenue" },
  { id: "TX-002", description: "Office Rent - July", amount: 8500, type: "debit", date: "2026-07-19", category: "Overhead" },
  { id: "TX-003", description: "Software Licenses - Annual", amount: 12000, type: "debit", date: "2026-07-18", category: "OpEx" },
  { id: "TX-004", description: "Client Payment - Quantum Dynamics", amount: 32000, type: "credit", date: "2026-07-18", category: "Revenue" },
  { id: "TX-005", description: "Payroll Processing", amount: 28000, type: "debit", date: "2026-07-17", category: "Payroll" },
];

const metrics = [
  { label: "Revenue (MTD)", value: "$342,000", change: "+12.5%", positive: true, icon: TrendingUp },
  { label: "Expenses (MTD)", value: "$187,000", change: "+3.2%", positive: false, icon: TrendingDown },
  { label: "Net Income", value: "$155,000", change: "+18.3%", positive: true, icon: DollarSign },
  { label: "Cash on Hand", value: "$1.2M", change: "+2.1%", positive: true, icon: CreditCard },
];

function AccountingApp() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <Calculator size={20} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
            <h1 className="font-mono text-2xl font-bold text-blueprint-paper">Accounting</h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-blueprint-muted">Financial management, bookkeeping, and expense tracking.</p>
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
              <p className="mt-3 font-mono text-2xl font-bold text-blueprint-paper">{m.value}</p>
              <div className={`mt-1 flex items-center gap-1 text-xs ${m.positive ? "text-green-400" : "text-red-400"}`}>
                {m.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {m.change}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border border-blueprint-grid/20 bg-blueprint-surface">
        <div className="flex items-center justify-between border-b border-blueprint-grid/20 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">Recent Transactions</p>
          <button className="text-xs text-blueprint-brass transition hover:text-blueprint-paper">Export</button>
        </div>
        <div className="grid grid-cols-6 gap-4 border-b border-blueprint-grid/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-blueprint-muted">
          <span>ID</span>
          <span className="col-span-2">Description</span>
          <span>Category</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
        </div>
        {transactions.map((tx) => (
          <div key={tx.id} className="grid grid-cols-6 gap-4 border-b border-blueprint-grid/10 px-6 py-3.5 text-sm transition last:border-0 hover:bg-blueprint-bg/50">
            <p className="font-mono text-blueprint-brass/80">{tx.id}</p>
            <p className="col-span-2 font-medium text-blueprint-paper">{tx.description}</p>
            <p className="text-blueprint-muted">{tx.category}</p>
            <p className="text-blueprint-muted">{tx.date}</p>
            <p className={`text-right font-mono font-medium ${tx.type === "credit" ? "text-green-400" : "text-red-400"}`}>
              {tx.type === "credit" ? "+" : "-"}${tx.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}