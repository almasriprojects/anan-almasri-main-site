/**
 * Decorative blueprint tick marks rendered along the top edge of a section.
 * Purely presentational — hidden from assistive tech.
 */
export default function TickMarks() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 right-0 top-0 flex justify-between px-6 md:px-10"
    >
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="h-2 w-px bg-blueprint-grid/30"
        />
      ))}
    </div>
  );
}
