import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useBookCall } from "./BookCallModal/context";
import { motionTokens } from "../lib/motion";

// Container for the headline letters
const headlineContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.15,
    },
  },
};

// Each letter rises into place
const headlineLetter: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: motionTokens.dur.base, ease: motionTokens.ease },
  },
};

function splitWords(text: string) {
  return text.split(" ").map((word, wi) => (
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
      {/* word gap */}
      <span className="inline-block">&nbsp;</span>
    </span>
  ));
}

export default function Hero() {
  const reduced = useReducedMotion();
  const { openBookCall } = useBookCall();

  return (
    <section id="top" className="relative bp-grid overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-36">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: motionTokens.y.base }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionTokens.dur.slow, ease: motionTokens.ease }}
          className="max-w-3xl"
        >
          <div className="mb-5 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
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
            DRAWING NO. AA-001 — REV 10
          </div>

          {reduced ? (
            <h1 className="font-mono text-4xl font-bold leading-tight text-blueprint-paper sm:text-5xl md:text-6xl">
              Full-Stack AI Automation Engineer
            </h1>
          ) : (
            <motion.h1
              variants={headlineContainer}
              initial="hidden"
              animate="show"
              className="font-mono text-4xl font-bold leading-tight text-blueprint-paper sm:text-5xl md:text-6xl"
            >
              {splitWords("Full-Stack AI Automation Engineer")}
            </motion.h1>
          )}

          <motion.p
            initial={reduced ? false : { opacity: 0, y: motionTokens.y.small }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionTokens.dur.base,
              delay: 0.85,
              ease: motionTokens.ease,
            }}
            className="mt-6 max-w-2xl font-sans text-[16px] leading-relaxed text-blueprint-muted md:text-[17px]"
          >
            I design and ship self-hosted AI systems, automation pipelines, and
            production-grade web apps — from schematic to deployed product.
          </motion.p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <motion.button
              type="button"
              onClick={() => openBookCall()}
              initial={reduced ? false : { opacity: 0, y: motionTokens.y.small }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: motionTokens.dur.base,
                delay: 1.0,
                ease: motionTokens.ease,
              }}
              whileHover={
                reduced
                  ? undefined
                  : { y: -2, boxShadow: "0 8px 24px -8px rgba(201,161,93,0.5)" }
              }
              whileTap={reduced ? undefined : { scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-sm bg-blueprint-brass px-5 py-3 font-mono text-[12px] font-semibold tracking-annotation text-blueprint-bg transition-colors duration-200 hover:bg-blueprint-brass/90"
            >
              BOOK A CALL
            </motion.button>
            <motion.a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              initial={reduced ? false : { opacity: 0, y: motionTokens.y.small }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: motionTokens.dur.base,
                delay: 1.1,
                ease: motionTokens.ease,
              }}
              whileHover={
                reduced
                  ? undefined
                  : { y: -2, borderColor: "rgba(201,161,93,0.7)" }
              }
              whileTap={reduced ? undefined : { scale: 0.97 }}
              className="inline-flex items-center gap-2 border border-blueprint-grid/30 px-5 py-3 font-mono text-[12px] font-semibold tracking-annotation text-blueprint-paper transition-colors duration-200 hover:border-blueprint-brass/60"
            >
              DOWNLOAD RESUME (PDF)
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
