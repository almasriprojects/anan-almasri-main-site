import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useActiveSection } from "../hooks/useActiveSection";
import { motionTokens } from "../lib/motion";

const DEFAULT_LINKS = [
  { label: "Home", href: "#top" },
  { label: "Skills", href: "#whatibuild" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  onLoginClick?: () => void;
  links?: { label: string; href: string }[];
}

export default function Navbar({ onLoginClick, links = DEFAULT_LINKS }: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const sectionIds = links.map((l) => l.href.slice(1));
  const active = useActiveSection(sectionIds);

  // ── Scroll progress (lives INSIDE the header, on its bottom edge) ──
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 32,
    mass: 0.4,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ── Magic-line: measure the active link's position so we can draw
  //    a single absolute underline that glides between items.
  const navRef = useRef<HTMLUListElement | null>(null);
  const [magic, setMagic] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });
  useEffect(() => {
    if (!navRef.current) return;
    const el = navRef.current.querySelector<HTMLAnchorElement>(
      `[data-nav-id="${active}"]`,
    );
    if (!el) {
      setMagic((m) => ({ ...m, opacity: 0 }));
      return;
    }
    const navRect = navRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setMagic({
      left: r.left - navRect.left,
      width: r.width,
      opacity: 1,
    });
  }, [active, open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-blueprint-surface/90 backdrop-blur-sm border-b border-blueprint-grid/20"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 md:px-10">
          {/* Monogram */}
          <a
            href="#top"
            className="flex shrink-0 items-center gap-2"
            aria-label="Anan Almasri — home"
          >
            <span className="font-mono text-blueprint-grid/70 text-xs select-none">[</span>
            <span className="font-mono text-lg font-semibold tracking-widest text-blueprint-paper">
              AA
            </span>
            <span className="font-mono text-blueprint-grid/70 text-xs select-none">]</span>
          </a>

          {/* Desktop links — centered, with a single "magic line" underline */}
          <ul
            ref={navRef}
            className="relative hidden flex-1 items-center justify-center gap-8 md:flex"
          >
            {links.map((l) => {
              const id = l.href.slice(1);
              const isActive = active === id;
              return (
                <li key={l.label}>
                  <a
                    href={l.href}
                    data-nav-id={id}
                    className={`relative inline-block py-2 font-mono text-[13px] tracking-annotation transition-colors duration-200 ${
                      isActive
                        ? "text-blueprint-brass"
                        : "text-blueprint-muted hover:text-blueprint-paper"
                    }`}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
            {/* The single magic line */}
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ left: magic.left, width: magic.width, opacity: magic.opacity }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="pointer-events-none absolute -bottom-0 h-px bg-blueprint-brass"
              style={{ height: 1 }}
            />
          </ul>

          <div className="hidden shrink-0 md:block">
            <button
              type="button"
              onClick={() => onLoginClick?.()}
              className="font-mono text-[13px] tracking-annotation text-blueprint-brass border border-blueprint-brass/60 px-4 py-2 transition-colors duration-200 hover:bg-blueprint-brass/10 hover:border-blueprint-brass"
            >
              Admin
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-blueprint-paper"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </nav>

        {/* Brass scroll-progress line: pinned to the very bottom edge of
            the header (lives inside the header so it can never cross
            through the nav content). */}
        {!reduced && (
          <motion.div
            aria-hidden="true"
            style={{
              scaleX,
              transformOrigin: "0% 50%",
            }}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[1.5px] bg-gradient-to-r from-blueprint-brass/0 via-blueprint-brass/95 to-blueprint-brass/0"
          />
        )}
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] bg-blueprint-bg md:hidden"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="font-mono text-lg font-semibold tracking-widest text-blueprint-paper">
                AA
              </span>
              <button
                className="text-blueprint-paper"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <ul className="mt-10 flex flex-col gap-2 px-6">
              {links.map((l, i) => {
                const id = l.href.slice(1);
                const isActive = active === id;
                return (
                  <motion.li
                    key={l.label}
                    initial={reduced ? false : { opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.08 + i * 0.06,
                      duration: motionTokens.dur.base,
                      ease: motionTokens.ease,
                    }}
                  >
                    <a
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className={`block border-b border-blueprint-grid/15 py-4 font-mono text-2xl ${
                        isActive ? "text-blueprint-brass" : "text-blueprint-paper"
                      }`}
                    >
                      <span className="text-blueprint-brass mr-3 text-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {l.label}
                    </a>
                  </motion.li>
                );
              })}
              <motion.li
                initial={reduced ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 0.08 + links.length * 0.06,
                  duration: motionTokens.dur.base,
                  ease: motionTokens.ease,
                }}
                className="mt-8"
              >
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onLoginClick?.();
                  }}
                  className="block w-full border border-blueprint-brass px-4 py-3 text-center font-mono tracking-annotation text-blueprint-brass"
                >
                  Admin
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
