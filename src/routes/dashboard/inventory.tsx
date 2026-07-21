import { createFileRoute } from "@tanstack/react-router";
import { Package, Box, Truck, AlertTriangle, Search, Filter, ArrowUpDown } from "lucide-react";

export const Route = createFileRoute("/dashboard/inventory")({
  component: InventoryApp,
});

const items = [
  { id: "SKU-001", name: "Industrial Bearings (40mm)", qty: 340, minQty: 100, unit: "pcs", location: "Warehouse A", status: "In Stock" },
  { id: "SKU-002", name: "Hydraulic Fluid 5Gal", qty: 28, minQty: 30, unit: "pails", location: "Warehouse A", status: "Low Stock" },
  { id: "SKU-003", name: "Steel Sheet 4x8 14ga", qty: 120, minQty: 50, unit: "sheets", location: "Warehouse B", status: "In Stock" },
  { id: "SKU-004", name: "Electronic Controller v3", qty: 5, minQty: 20, unit: "units", location: "Warehouse C", status: "Critical" },
  { id: "SKU-005", name: "Packaging Box 12x12x6", qty: 2500, minQty: 500, unit: "boxes", location: "Warehouse B", status: "In Stock" },
];

const metrics = [
  { label: "Total SKUs", value: 1284, icon: Package },
  { label: "Low Stock", value: 23, icon: AlertTriangle },
  { label: "Inbound Orders", value: 7, icon: Truck },
  { label: "Warehouses", value: 3, icon: Box },
];

function InventoryApp() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          <Package size={20} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">App</p>
          <h1 className="font-mono text-2xl font-bold text-blueprint-paper">Inventory</h1>
          <p className="mt-1 text-sm text-blueprint-muted">Stock management, warehousing, and supply chain tracking.</p>
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
              <p className="mt-3 font-mono text-3xl font-bold text-blueprint-paper">{m.value.toLocaleString()}</p>
            </div>
          );
        })}
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex flex-1 items-center gap-2 border border-blueprint-grid/20 bg-blueprint-surface px-4 py-2.5">
          <Search size={16} className="text-blueprint-muted" />
          <input type="text" placeholder="Search inventory..." className="w-full bg-transparent text-sm text-blueprint-paper outline-none placeholder:text-blueprint-muted/50" />
        </div>
        <button className="flex items-center gap-2 border border-blueprint-grid/20 bg-blueprint-surface px-4 py-2.5 text-sm text-blueprint-muted transition hover:text-blueprint-paper">
          <Filter size={16} />
          Filter
        </button>
        <button className="flex items-center gap-2 border border-blueprint-grid/20 bg-blueprint-surface px-4 py-2.5 text-sm text-blueprint-muted transition hover:text-blueprint-paper">
          <ArrowUpDown size={16} />
          Sort
        </button>
      </div>

      <div className="border border-blueprint-grid/20 bg-blueprint-surface">
        <div className="grid grid-cols-7 gap-4 border-b border-blueprint-grid/20 px-6 py-3 text-xs uppercase tracking-[0.3em] text-blueprint-muted">
          <span className="col-span-2">Item</span>
          <span>QTY</span>
          <span>Min</span>
          <span>Location</span>
          <span>Status</span>
          <span>Unit</span>
        </div>
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-7 gap-4 border-b border-blueprint-grid/10 px-6 py-3.5 text-sm transition last:border-0 hover:bg-blueprint-bg/50">
            <div className="col-span-2">
              <p className="font-medium text-blueprint-paper">{item.name}</p>
              <p className="font-mono text-xs text-blueprint-brass/60">{item.id}</p>
            </div>
            <p className={`font-mono font-medium ${item.qty < item.minQty ? "text-red-400" : "text-blueprint-paper"}`}>
              {item.qty.toLocaleString()}
            </p>
            <p className="font-mono text-blueprint-muted">{item.minQty}</p>
            <p className="text-blueprint-muted">{item.location}</p>
            <div>
              <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                item.status === "In Stock" ? "bg-green-500/10 text-green-400" :
                item.status === "Low Stock" ? "bg-amber-500/10 text-amber-400" :
                "bg-red-500/10 text-red-400"
              }`}>
                {item.status}
              </span>
            </div>
            <p className="text-blueprint-muted">{item.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}