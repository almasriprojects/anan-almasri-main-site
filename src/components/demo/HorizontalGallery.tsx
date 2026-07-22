import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { projects } from "../../data/projectsData";
import { motionTokens } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import ProjectSheet from "./ProjectSheet";

const AUTO_ADVANCE_MS = 8000;

/**
 * Sprint-3 horizontal project gallery.
 *
 *  - Each project is a full-bleed slide; the rail scrolls horizontally.
 *  - Vertical wheel events are hijacked and translated into horizontal scroll.
 *  - Touch: native swipe (CSS scroll-snap).
 *  - Keyboard: ← / → arrows.
 *  - Auto-advances every 8s when the user is idle (no scroll / hover / click).
 *  - "Next" sheet peeks in from the right edge.
 */
export default function HorizontalGallery() {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const lastInteractionRef = useRef<number>(Date.now());
  const autoTimerRef = useRef<number | null>(null);

  const total = projects.length;

  const bumpInteraction = useCallback(() => {
    lastInteractionRef.current = Date.now();
  }, []);

  // Scroll active into view by scrolling the rail container.
  const goTo = useCallback(
    (i: number) => {
      const idx = Math.max(0, Math.min(total - 1, i));
      const rail = railRef.current;
      if (!rail) return;
      const slide = rail.children[idx] as HTMLElement | undefined;
      if (!slide) return;
      rail.scrollTo({ left: slide.offsetLeft, behavior: reduced ? "auto" : "smooth" });
      setActive(idx);
      bumpInteraction();
    },
    [total, reduced, bumpInteraction]
  );

  // Wheel hijack: translate vertical wheel deltas into horizontal scroll.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onWheel = (e: WheelEvent) => {
      // Only hijack if the user is scrolling vertically.
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      rail.scrollLeft += e.deltaY;
      bumpInteraction();
    };

    rail.addEventListener("wheel", onWheel, { passive: false });
    return () => rail.removeEventListener("wheel", onWheel);
  }, [bumpInteraction]);

  // Track which slide is centered → set active index.
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const center = rail.scrollLeft + rail.clientWidth / 2;
        let nearest = 0;
        let best = Infinity;
        Array.from(rail.children).forEach((child, i) => {
          const el = child as HTMLElement;
          const mid = el.offsetLeft + el.offsetWidth / 2;
          const d = Math.abs(mid - center);
          if (d < best) {
            best = d;
            nearest = i;
          }
        });
        setActive(nearest);
      });
    };
    rail.addEventListener("scroll", onScroll, { passive: true });
    return () => rail.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard arrows + Home/End.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo(active + 1);
      else if (e.key === "ArrowLeft") goTo(active - 1);
      else if (e.key === "Home") goTo(0);
      else if (e.key === "End") goTo(total - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, goTo, total]);

  // Auto-advance.
  useEffect(() => {
    if (reduced) return;
    const tick = () => {
      const idle = Date.now() - lastInteractionRef.current;
      if (idle >= AUTO_ADVANCE_MS) {
        goTo((active + 1) % total);
      }
      autoTimerRef.current = window.setTimeout(tick, 1000);
    };
    autoTimerRef.current = window.setTimeout(tick, 1000);
    return () => {
      if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current);
    };
  }, [active, total, reduced, goTo]);

  return (
    <section
      id="projects"
      className="relative border-t border-blueprint-grid/15 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: motionTokens.dur.base, ease: motionTokens.ease }}
          className="mb-8 max-w-2xl"
        >
          <div className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
            <motion.span
              aria-hidden="true"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: motionTokens.dur.base, ease: motionTokens.ease }}
              style={{ transformOrigin: "left center" }}
              className="h-px w-8 bg-blueprint-brass/70"
            />
            SECTION 03 — DRAWING SET
          </div>
          <h2 className="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">
            Projects
          </h2>
          <p className="mt-3 font-sans text-[15px] leading-relaxed text-blueprint-muted">
            Scroll, swipe, or use ← → keys. The gallery auto-advances every 8s
            when idle. {total} sheets, drawn from a real career.
          </p>
        </motion.div>
      </div>

      {/* Sheet counter + controls (full-bleed strip) */}
      <div className="mb-4 flex items-center justify-between border-y border-blueprint-grid/15 bg-blueprint-surface/30 px-6 py-2 font-mono text-[10px] tracking-annotation text-blueprint-muted/80 md:px-10">
        <span>
          <span className="text-blueprint-brass">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="text-blueprint-muted/50"> / {String(total).padStart(2, "0")}</span>
        </span>
        <span className="hidden md:inline">SCROLL · WHEEL · ARROWS · AUTO</span>
        <span>{projects[active]?.title?.toUpperCase()}</span>
      </div>

      {/* Rail */}
      <div
        ref={railRef}
        onMouseEnter={bumpInteraction}
        onClick={bumpInteraction}
        className="relative flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pb-6 md:px-10"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(201,161,93,0.4) transparent",
        }}
      >
        {projects.map((p, i) => (
          <div
            key={p.sheetNo}
            className="relative h-[78vh] min-h-[560px] w-[88vw] max-w-[1100px] shrink-0 snap-center"
            style={{ scrollSnapAlign: "center" }}
          >
            <ProjectSheet
              project={p}
              index={i}
              total={total}
              active={i === active}
            />
          </div>
        ))}
      </div>

      {/* Progress dots */}
      <div className="mx-auto mt-6 flex max-w-7xl items-center justify-center gap-2 px-6 md:px-10">
        {projects.map((p, i) => (
          <button
            key={p.sheetNo}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to ${p.title}`}
            className={`h-1.5 w-6 rounded-full transition-all ${
              i === active
                ? "w-10 bg-blueprint-brass"
                : "bg-blueprint-grid/30 hover:bg-blueprint-grid/50"
            }`}
          />
        ))}
      </div>

      {/* Prev / Next buttons */}
      <div className="mx-auto mt-6 flex max-w-7xl items-center justify-between gap-3 px-6 md:px-10">
        <button
          type="button"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          className="border border-blueprint-grid/25 px-4 py-2 font-mono text-[10px] tracking-annotation text-blueprint-muted transition-colors hover:border-blueprint-brass/60 hover:text-blueprint-paper disabled:opacity-30"
        >
          ← PREV
        </button>
        <button
          type="button"
          onClick={() => goTo(active + 1)}
          disabled={active === total - 1}
          className="border border-blueprint-grid/25 px-4 py-2 font-mono text-[10px] tracking-annotation text-blueprint-muted transition-colors hover:border-blueprint-brass/60 hover:text-blueprint-paper disabled:opacity-30"
        >
          NEXT →
        </button>
      </div>
    </section>
  );
}
