import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { staggerContainer, staggerItem } from "../../lib/motion";

/**
 * Container that staggers its children when entering the viewport.
 * Each child must be wrapped in <StaggerItem>.
 */
export function StaggerGroup({
  children,
  className = "",
  as = "div",
  staggerChildren,
  delayChildren,
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul" | "ol" | "section";
  /** Optional override for the per-child delay (seconds). */
  staggerChildren?: number;
  /** Optional override for the initial delay (seconds). */
  delayChildren?: number;
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  const variants: Variants | undefined = reduced
    ? undefined
    : {
        hidden: {},
        show: {
          transition: {
            ...(staggerChildren !== undefined ? { staggerChildren } : {}),
            ...(delayChildren !== undefined ? { delayChildren } : {}),
            // fall back to the preset if neither override is given
            ...(staggerChildren === undefined && delayChildren === undefined
              ? (staggerContainer.show as { transition?: object })?.transition ?? {}
              : {}),
          },
        },
      };

  return (
    <Tag
      {...(variants
        ? { variants, initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" } }
        : {})}
      className={className}
    >
      {children}
    </Tag>
  );
}

/**
 * A child of <StaggerGroup>. Animates in with the shared staggerItem preset.
 */
export function StaggerItem({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article" | "span";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      variants={reduced ? undefined : staggerItem}
      className={className}
    >
      {children}
    </Tag>
  );
}
