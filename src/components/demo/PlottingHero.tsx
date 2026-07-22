import { useEffect, useState } from "react";
import { motion, type Variants, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useBookCall } from "../BookCallModal/context";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { motionTokens } from "../../lib/motion";
import { useMousePosition } from "../../hooks/useMousePosition";
import DraftingCursor from "./DraftingCursor";
import LiveSystemStatus from "./LiveSystemStatus";
import TerminalBlock from "./TerminalBlock";

/**
 * Sprint-1 hero for the demo page.
 *
 * Composition:
 *  - Mouse-driven parallax (≤10px) on the whole stage
 *  - Headline letters rise in, then a DraftingCursor traces a brass underline
 *  - LiveSystemStatus pinned top-right (mounts in DOM only on md+)
 *  - Two CTAs (BOOK A CALL + EXPLORE BLUEPRINT)
 *  - Live TerminalBlock below the CTAs
 */
export default function PlottingHero() {
  const reduced = useReducedMotion();
  const { openBookCall } = useBookCall();
  const { nx, ny } = useMousePosition();
  const [stageW, setStageW] = useState(900);

  // Measure the headline stage so the DraftingCursor matches its width.
  useEffect(() => {
    const measure = () => {
      const el = document.getElementById("plotting-hero-headline");
      if (el) setStageW(el.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Animated progress for the DraftingCursor trace (0 → 1 → hold).
  const traceProgress = useMotionValue(0);
  const trace = useSpring(traceProgress, {
    stiffness: 28,
    damping: 18,
    mass: 1,
  });

  useEffect(() => {
    if (reduced) {
      traceProgress.set(1);
      return;
    }
    const start = window.setTimeout(() => traceProgress.set(1), 350);
    return () => window.clearTimeout(start);
  }, [traceProgress, reduced]);

  // Parallax: gentle translation of the whole hero stage.
  const parallaxX = useTransform(nx, [-1, 1], [-motionTokens.parallax.max, motionTokens.parallax.max]);
  const parallaxY = useTransform(ny, [-1, 1], [-motionTokens.parallax.max * 0.6, motionTokens.parallax.max * 0.6]);

  const headlineContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.035,
        delayChildren: 0.1,
      },
    },
  };
  const headlineLetter: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: motionTokens.plot.headline,
        ease: motionTokens.ease,
      },
    },
  };
  const splitWords = (text: string) =>
    text.split(" ").map((word, wi) => (
      <span key={`w-${wi}`} className="inline-block whitespace-nowrap">
        {word.split("").map((ch, ci) => (
          <motion.span
            key={`c-${wi}-${ci}`}
            variants={headlineLetter}
            className="inline-block"
          >
            {ch}
          </motion.span>
        ))}
        <span className="inline-block">&nbsp;</span>
      </span>
    ));

  return (
    <section
      id="top"
      className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40"
    >
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* Top-right floating live status */}
        <div className="pointer-events-none absolute right-6 top-0 z-10 md:right-10">
          <LiveSystemStatus />
        </div>

        <motion.div
          style={reduced ? undefined : { x: parallaxX, y: parallaxY }}
          className="max-w-4xl"
        >
          {/* Eyebrow */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionTokens.dur.base,
              ease: motionTokens.ease,
            }}
            className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted"
          >
            <motion.span
              aria-hidden="true"
              initial={reduced ? false : { scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: motionTokens.dur.base,
                delay: 0.05,
                ease: motionTokens.ease,
              }}
              style={{ transformOrigin: "left center" }}
              className="h-px w-8 bg-blueprint-brass/70"
            />
            DRAWING NO. AA-DEMO-001 · REV 2026.07 · MIAMI, FL
          </motion.div>

          {/* Headline */}
          <div id="plotting-hero-headline" className="relative">
            {reduced ? (
              <h1 className="font-mono text-4xl font-bold leading-[1.08] text-blueprint-paper sm:text-5xl md:text-6xl">
                I design systems. <span className="text-blueprint-brass">Now they're alive.</span>
              </h1>
            ) : (
              <motion.h1
                variants={headlineContainer}
                initial="hidden"
                animate="show"
                className="font-mono text-4xl font-bold leading-[1.08] text-blueprint-paper sm:text-5xl md:text-6xl"
              >
                {splitWords("I design systems.")}{" "}
                <span className="text-blueprint-brass">
                  {splitWords("Now they're alive.")}
                </span>
              </motion.h1>
            )}

            {/* Drafting cursor — sits below the baseline, traces left to right */}
            <div
              className="mt-3 h-10 w-full"
              style={{ position: "relative" }}
            >
              <DraftingCursor progress={trace} width={stageW} height={40} />
            </div>
          </div>

          {/* Lead */}
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionTokens.dur.base,
              delay: 0.55,
              ease: motionTokens.ease,
            }}
            className="mt-8 max-w-2xl font-sans text-[16px] leading-relaxed text-blueprint-muted md:text-[18px]"
          >
            I'm Anan Almasri — an AI automation engineer building self-hosted,
            production-grade systems end-to-end. This demo is a live
            blueprint: every animation, every packet, every terminal line runs
            in your browser. Watch it work, then we'll talk about yours.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionTokens.dur.base,
              delay: 0.7,
              ease: motionTokens.ease,
            }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <motion.button
              type="button"
              onClick={() => openBookCall()}
              whileHover={
                reduced
                  ? undefined
                  : { y: -2, boxShadow: "0 8px 24px -8px rgba(201,161,93,0.5)" }
              }
              whileTap={reduced ? undefined : { scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-sm bg-blueprint-brass px-6 py-3 font-mono text-sm tracking-annotation text-blueprint-bg transition-colors duration-200 hover:bg-blueprint-brass/90"
            >
              BOOK A CALL
            </motion.button>
            <motion.a
              href="#stack"
              whileHover={
                reduced
                  ? undefined
                  : { y: -2, borderColor: "rgba(201,161,93,0.7)" }
              }
              whileTap={reduced ? undefined : { scale: 0.97 }}
              className="inline-flex items-center gap-2 border border-blueprint-grid/30 px-6 py-3 font-mono text-sm tracking-annotation text-blueprint-paper transition-colors duration-200 hover:border-blueprint-brass/60"
            >
              EXPLORE BLUEPRINT ↓
            </motion.a>
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={reduced ? undefined : { y: -2 }}
              whileTap={reduced ? undefined : { scale: 0.97 }}
              className="inline-flex items-center gap-2 px-2 py-3 font-mono text-sm tracking-annotation text-blueprint-muted underline decoration-blueprint-grid/40 underline-offset-4 transition-colors duration-200 hover:text-blueprint-brass"
            >
              DOWNLOAD RÉSUMÉ
            </motion.a>
          </motion.div>

          {/* Coordinate / caption */}
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: motionTokens.dur.base,
              delay: 0.95,
              ease: motionTokens.ease,
            }}
            className="mt-10 flex items-center gap-3 font-mono text-[10px] tracking-annotation text-blueprint-muted/60"
          >
            <span>25.7617° N · 80.1918° W</span>
            <span className="h-px w-6 bg-blueprint-grid/40" />
            <span>SHEET 01 / 07</span>
            <span className="h-px w-6 bg-blueprint-grid/40" />
            <span>SCALE 1:1</span>
          </motion.div>

          {/* Live terminal */}
          <TerminalBlock />
        </motion.div>
      </div>
    </section>
  );
}
