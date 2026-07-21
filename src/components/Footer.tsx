export default function Footer() {
  return (
    <footer className="border-t border-blueprint-grid/15 bg-blueprint-bg py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 font-mono text-[11px] tracking-annotation text-blueprint-muted/70 md:flex-row md:px-10">
        <span>© 2026 ANAN ALMASRI</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 bg-blueprint-brass" />
          ALL SYSTEMS OPERATIONAL
        </span>
        <span>DRAWING NO. AA-001</span>
      </div>
    </footer>
  );
}
