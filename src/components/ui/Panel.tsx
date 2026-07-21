import React from "react";

export default function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-[1.25rem] border border-blueprint-grid/20 bg-blueprint-surface p-6 ${className}`}>
      {children}
    </div>
  );
}
