import React from "react";

export default function StatCell({
  label,
  value,
  sub,
  last,
}: {
  label: string;
  value: string;
  sub?: string;
  last?: boolean;
}) {
  return (
    <div className={`p-6 ${last ? "" : "border-r border-blueprint-grid/15"}`}>
      <div className="text-[10px] font-mono uppercase tracking-widest text-blueprint-muted">{label}</div>
      <div className="mt-2 text-3xl font-mono anan-brass">{value}</div>
      {sub && <div className="mt-1 text-xs text-blueprint-muted font-mono">{sub}</div>}
    </div>
  );
}
