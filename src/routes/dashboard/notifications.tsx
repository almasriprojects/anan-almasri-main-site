import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/dashboard/notifications')({
  component: NotificationsPanel,
})

function NotificationsPanel() {
  const notifications = [
    { id: 1, title: "OTP request sent", description: "Admin login code requested", time: "2m ago" },
    { id: 2, title: "Webhook verified", description: "Admin successfully logged in", time: "5m ago" },
    { id: 3, title: "Site change pending", description: "Resume download link updated", time: "1h ago" },
  ];

  return (
    <section className="rounded-[1.25rem] border border-blueprint-grid/20 bg-blueprint-surface p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-blueprint-brass/80">Notifications</p>
          <h3 className="mt-2 text-lg font-semibold text-blueprint-paper">Recent activity</h3>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="rounded-2xl border border-blueprint-grid/15 bg-blueprint-bg p-4">
            <p className="text-sm font-medium text-blueprint-paper">{notification.title}</p>
            <p className="mt-1 text-sm text-blueprint-muted">{notification.description}</p>
            <p className="mt-2 text-xs text-blueprint-brass/80">{notification.time}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
