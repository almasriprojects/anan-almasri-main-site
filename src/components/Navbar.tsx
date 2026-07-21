import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useReducedMotion } from "../hooks/useReducedMotion";

const links = [
  { label: "Home", href: "#home" },
  { label: "Projects", href: "#projects" },
  { label: "Services", href: "#services" },
  { label: "AnanOS", href: "#ananos" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

interface NavbarProps {
  onAdminClick: () => void;
}

export default function Navbar({ onAdminClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-blueprint-surface/90 backdrop-blur-sm border-b border-blueprint-grid/20"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          {/* Monogram */}
          <a href="#home" className="group flex items-center gap-2" aria-label="Anan Almasri — home">
            <span className="font-mono text-blueprint-grid/70 text-xs select-none">[</span>
            <span className="font-mono text-lg font-semibold tracking-widest text-blueprint-paper">
              AA
            </span>
            <span className="font-mono text-blueprint-grid/70 text-xs select-none">]</span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="font-mono text-[13px] tracking-annotation text-blueprint-muted transition-colors duration-200 hover:text-blueprint-paper"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <button
              onClick={onAdminClick}
              className="font-mono text-[13px] tracking-annotation text-blueprint-brass border border-blueprint-brass/60 px-4 py-2 transition-colors duration-200 hover:bg-blueprint-brass/10 hover:border-blueprint-brass"
            >
              Admin Login
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
              {links.map((l, i) => (
                <motion.li
                  key={l.label}
                  initial={reduced ? false : { opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.3 }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-blueprint-grid/15 py-4 font-mono text-2xl text-blueprint-paper"
                  >
                    <span className="text-blueprint-brass mr-3 text-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {l.label}
                  </a>
                </motion.li>
              ))}
              <motion.li
                initial={reduced ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + links.length * 0.06, duration: 0.3 }}
                className="mt-8"
              >
                <button
                  onClick={() => {
                    setOpen(false);
                    onAdminClick();
                  }}
                  className="block border border-blueprint-brass px-4 py-3 text-center font-mono tracking-annotation text-blueprint-brass w-full"
                >
                  Admin Login
                </button>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
