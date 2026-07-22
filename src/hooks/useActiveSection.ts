import { useEffect, useState } from "react";

/**
 * Scroll-spy: returns the id of the section (from `ids`) closest to 30% down
 * the viewport. Shared by Navbar and SectionRail so both track the same
 * "active" section without duplicating the probe logic.
 */
export function useActiveSection(ids: string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const probe = window.innerHeight * 0.3;
        let best: { id: string; dist: number } | null = null;
        for (const id of ids) {
          const el = document.getElementById(id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
          const dist = Math.abs(rect.top - probe);
          if (!best || dist < best.dist) best = { id, dist };
        }
        if (best) setActive(best.id);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return active;
}
