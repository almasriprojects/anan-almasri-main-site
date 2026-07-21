export default function Dashboard() {
  return (
    <div className="min-h-screen bg-blueprint-bg text-blueprint-paper">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-[1.25rem] border border-blueprint-grid/20 bg-blueprint-surface p-10 shadow-2xl shadow-black/10">
          <p className="text-sm uppercase tracking-[0.34em] text-blueprint-brass/80">Admin Dashboard</p>
          <h1 className="mt-4 text-4xl font-semibold text-blueprint-paper">Welcome back.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-blueprint-muted">
            You are now on the protected admin dashboard. Keep your OTP and webhook secure, and confirm that your backend session flow protects this route.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-blueprint-grid/20 bg-blueprint-bg p-6">
              <p className="text-sm font-semibold text-blueprint-paper">Admin tools</p>
              <p className="mt-2 text-sm text-blueprint-muted">Add management controls here later.</p>
            </div>
            <div className="rounded-2xl border border-blueprint-grid/20 bg-blueprint-bg p-6">
              <p className="text-sm font-semibold text-blueprint-paper">Security</p>
              <p className="mt-2 text-sm text-blueprint-muted">Use server-side auth to protect this page in production.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
