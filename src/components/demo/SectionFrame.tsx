import { motion } from "framer-motion";
import { motionTokens, fadeUp } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface Props {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  /** Optional tight variant — used for the in-hero frame. */
  compact?: boolean;
}

/**
 * Standard full-bleed section wrapper with brass hairline + eyebrow + h2.
 * Used everywhere on the demo page.
 */
export default function SectionFrame({
  id,
  eyebrow,
  title,
  children,
  compact = false,
}: Props) {
  const reduced = useReducedMotion();

  return (
    <section
      id={id}
      className={`relative border-t border-blueprint-grid/15 ${
        compact ? "py-20 md:py-24" : "py-24 md:py-32"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          {...fadeUp(reduced)}
          className="mb-12 max-w-2xl"
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
            {eyebrow}
          </div>
          <h2 className="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">
            {title}
          </h2>
        </motion.div>

        {children}
      </div>
    </section>
  );
}
