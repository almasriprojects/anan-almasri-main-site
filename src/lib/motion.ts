// ─── Shared motion tokens ──────────────────────────────────────
// One source of truth for the page's motion language.
// All new components should import from here so the language stays coherent.

import type { Variants, Transition, Easing } from "framer-motion";

export const motionTokens = {
  // Expo-out: feels deliberate, never "bouncy" — appropriate for a blueprint.
  ease: [0.22, 1, 0.36, 1] as Easing,
  dur: {
    fast: 0.35,
    base: 0.6,
    slow: 1.1,
  },
  stagger: {
    tight: 0.04,
    base: 0.08,
    loose: 0.12,
  },
  y: {
    small: 12,
    base: 24,
    large: 40,
  },
  // Sprint-1 additions for the demo page
  plot: {
    grid: 1.5,      // body grid draw-in duration (s)
    trace: 0.045,   // per-character trace delay (s)
    headline: 0.7,  // headline letters total duration
  },
  particle: {
    speed: 2.4,     // base travel time for one packet (s)
    count: 3,       // packets per edge
  },
  parallax: {
    max: 10,        // px max mouse-driven offset
  },
  cursor: {
    blink: 1.06,    // s for terminal cursor blink
  },
} as const;

export const transitions = {
  base: { duration: motionTokens.dur.base, ease: motionTokens.ease } as Transition,
  slow: { duration: motionTokens.dur.slow, ease: motionTokens.ease } as Transition,
  fast: { duration: motionTokens.dur.fast, ease: motionTokens.ease } as Transition,
};

// ─── Presets ───────────────────────────────────────────────────

/** Standard section-entry fade-up. */
export function fadeUp(reduced: boolean) {
  return {
    initial: reduced ? false : { opacity: 0, y: motionTokens.y.base },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-80px" },
    transition: transitions.base,
  };
}

/** A horizontal draw-in for tick marks / divider lines. */
export function drawX(reduced: boolean, duration = motionTokens.dur.base) {
  return {
    initial: reduced ? false : { scaleX: 0 },
    whileInView: { scaleX: 1 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration, ease: motionTokens.ease },
    style: { transformOrigin: "left center" as const },
  };
}

// ─── Variants (for stagger containers) ─────────────────────────

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: motionTokens.stagger.base,
      delayChildren: 0.05,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: motionTokens.y.base },
  show: {
    opacity: 1,
    y: 0,
    transition: transitions.base,
  },
};
