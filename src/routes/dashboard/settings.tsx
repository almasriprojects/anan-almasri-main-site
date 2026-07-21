import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/dashboard/settings')({
  component: DashboardSettings,
})

function DashboardSettings() {
  return (
    <div className="rounded-[1.25rem] border border-blueprint-grid/20 bg-blueprint-surface p-8 text-blueprint-paper">
      Settings page coming soon.
    </div>
  );
}
