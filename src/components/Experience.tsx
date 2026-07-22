import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Check } from "lucide-react";
import { motionTokens } from "../lib/motion";
import { StaggerGroup, StaggerItem } from "./motion/StaggerGroup";

type Revision = {
  rev: string;
  date: string;
  role: string;
  desc: string;
  current?: boolean;
  sideNote?: string;
  subLine?: string;
};

const revisions: Revision[] = [
  {
    rev: "10",
    date: "2023–Present",
    role: "Founder & AI Automation Consultant, Anan Technology LLC (Miami)",
    desc: "Founded Anan Technology LLC in Miami, building full-stack AI automation systems spanning frontend, backend, Supabase, and n8n-driven automation.",
    current: true,
  },
  {
    rev: "09",
    date: "Aug 2025–Mar 2026",
    role: "Senior Product Manager, Robotic Imaging (Brickell, Miami)",
    desc: "Served as Senior Product Manager at Robotic Imaging, leading product direction on robotics/imaging systems.",
  },
  {
    rev: "08",
    date: "Feb 2022–Aug 2025",
    role: "Founder & Product Architect, JOBR (Miami)",
    desc: "Founded and architected JOBR, an all-in-one business platform (marketplace, POS, driver app), from Figma to live product, leading a 13-person cross-functional team.",
  },
  {
    rev: "07",
    date: "Apr 2021–Jan 2023",
    role: "VP of Product Development, Purekana (Miami)",
    desc: "As VP of Product Development at Purekana, launched 16 new product lines and built a B2B eCommerce platform on Shopify with a custom admin dashboard.",
  },
  {
    rev: "06",
    date: "Aug 2015–May 2021",
    role: "Chief Executive Officer, Lake Tiberias (Saudi Arabia)",
    desc: "Led Lake Tiberias as CEO, achieving a 25% reduction in purchasing costs, a 60% improvement in labor cost estimation accuracy, and 400,000 SAR in new recurring revenue. Conducted final quality checks and sign-offs on all MEP designs for SPASA compliance.",
    sideNote: "Concurrently ran Coin Arabia FZE, a cryptocurrency exchange platform, 2017–2019.",
  },
  {
    rev: "05",
    date: "Apr 2014–Aug 2015",
    role: "COO / Co-Founder, Worry Free Boat Club (Dubai)",
    desc: "Co-founded Worry Free Boat Club in Dubai, launching a boat-fleet membership startup and securing an Emirates Aviation Club partnership generating 1.8M AED in revenue.",
  },
  {
    rev: "04",
    date: "Sep 2011–Nov 2013",
    role: "Facility Manager, Total Care",
    desc: "Managed warehouse and office facilities at the Aramex Jebel Ali warehouse (client site), developing Site Operation Reports covering KPIs, cost savings, and energy consumption.",
    subLine: "Client site: Aramex, Dubai.",
  },
  {
    rev: "03",
    date: "Mar 2011–Sep 2011",
    role: "Projects Coordinator, EMCO Engineering (Dubai)",
    desc: "Coordinated engineering projects at EMCO Engineering in Dubai.",
  },
  {
    rev: "02",
    date: "Jun 2009–Mar 2011",
    role: "Projects Mechanical Engineer, AlMalki Establishment / Almalki Fountains (Riyadh)",
    desc: "Created Excel-based software for MEP equipment and pipe/tank sizing selection in swimming pool design. Self-taught and built a dancing fountain control system in Al-Khubar, Saudi Arabia using OASE technology.",
  },
  {
    rev: "01",
    date: "2003–2015",
    role: "Education",
    desc: "BSc Mechanical Engineering, American University of Sharjah (2003–2009). MSc Facilities Management, Heriot-Watt University Dubai (2014–2015).",
  },
];

const performanceData = [
  { metric: "Purchasing costs", result: "25% reduction", context: "Lake Tiberias" },
  { metric: "New recurring revenue", result: "400,000 SAR", context: "Lake Tiberias" },
  { metric: "Labor cost estimation accuracy", result: "60% improvement", context: "Lake Tiberias" },
  { metric: "Design calculation time", result: "2 days → 30 minutes", context: "Lake Tiberias (in-house iOS software)" },
  { metric: "Water & electricity consumption", result: "22% reduction", context: "VFD pool pump installation" },
  { metric: "Energy consumption", result: "17% reduction", context: "Motion sensor lighting retrofit" },
  { metric: "Monthly job completion rate", result: "78% → 95%", context: "Facility ops org-chart redesign" },
  { metric: "Maintenance schedule throughput", result: "32% increase", context: "MS Visio workflow redesign" },
  { metric: "Partnership revenue", result: "1.8M AED", context: "Emirates Aviation Club partnership" },
  { metric: "Product ecosystem shipped", result: "5 interconnected apps", context: "JOBR" },
  { metric: "New product lines launched", result: "16", context: "Purekana" },
];

const bom = [
  { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Figma", "Lovable"] },
  { category: "Backend & DB", items: ["Supabase", "PostgreSQL", "REST APIs", "FastAPI", "Python", "Webhooks"] },
  { category: "AI", items: ["Claude API", "Claude Code", "Codex", "RAG", "AI Agents"] },
  { category: "Automation & AI Builders", items: ["n8n", "bolt.diy", "Telegram Bots"] },
  { category: "Cloud & Deployment", items: ["AWS", "Google Cloud", "Firebase", "Hetzner VPS", "Docker", "Cloudflare Tunnel"] },
  { category: "Dev Tools", items: ["VS Code", "Git"] },
  { category: "Infrastructure & Security", items: ["Infisical", "NocoDB"] },
  { category: "Payments", items: ["Stripe"] },
];

function SectionHeading({ label, title, sub }: { label: string; title: string; sub?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: motionTokens.y.base }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: motionTokens.dur.base, ease: motionTokens.ease }}
      className="mb-10 max-w-2xl"
    >
      <div className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
        <motion.span
          aria-hidden="true"
          initial={reduced ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            duration: motionTokens.dur.base,
            delay: 0.1,
            ease: motionTokens.ease,
          }}
          style={{ transformOrigin: "left center" }}
          className="h-px w-8 bg-blueprint-brass/70"
        />
        {label}
      </div>
      <h2 className="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 font-sans text-sm text-blueprint-muted">{sub}</p>}
    </motion.div>
  );
}

export default function Experience() {
  const reduced = useReducedMotion();

  return (
    <section id="experience" className="relative bp-grid py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* ─── PART 1 — REVISION HISTORY ─── */}
        <SectionHeading label="CAREER LOG" title="Revision History" />

        {/* Revision block — table on desktop, stacked cards on mobile */}
        <div className="relative border-t border-blueprint-grid/20">
          {/* Growing brass left rail that scales in as the user scrolls into the section */}
          <motion.span
            aria-hidden="true"
            initial={reduced ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: motionTokens.dur.slow, ease: motionTokens.ease }}
            style={{ transformOrigin: "top center" }}
            className="pointer-events-none absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-blueprint-brass/40 via-blueprint-brass/10 to-transparent md:block"
          />

          {/* column header (desktop only) */}
          <div className="hidden md:grid grid-cols-[60px_160px_1fr] gap-6 border-b border-blueprint-grid/20 py-3 font-mono text-[10px] tracking-annotation text-blueprint-muted/70">
            <span>REV</span>
            <span>DATE RANGE</span>
            <span>ROLE / DESCRIPTION</span>
          </div>

          <ol className="divide-y divide-blueprint-grid/15">
            {revisions.map((r, i) => (
              <motion.li
                key={r.rev}
                initial={
                  reduced ? false : { opacity: 0, y: motionTokens.y.base }
                }
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: motionTokens.dur.base,
                  delay: i * 0.06,
                  ease: motionTokens.ease,
                }}
                className="group relative py-6 md:py-7"
              >
                {/* desktop row */}
                <div className="hidden md:grid grid-cols-[60px_160px_1fr] gap-6 items-start">
                  <span className="font-mono text-sm font-semibold text-blueprint-brass">
                    {r.rev}
                  </span>
                  <span className="font-mono text-[12px] text-blueprint-muted">
                    {r.date}
                  </span>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-mono text-[15px] font-semibold text-blueprint-paper">
                        {r.role}
                      </h3>
                      {r.current && (
                        <span className="inline-flex items-center gap-1 rounded-sm border border-blueprint-brass/40 bg-blueprint-brass/10 px-1.5 py-0.5 font-mono text-[9px] tracking-annotation text-blueprint-brass">
                          <Check size={10} strokeWidth={2.5} />
                          CURRENT
                        </span>
                      )}
                    </div>
                    {r.subLine && (
                      <p className="mt-1 font-mono text-[11px] text-blueprint-muted/70">
                        {r.subLine}
                      </p>
                    )}
                    <p className="mt-2 font-sans text-[14px] leading-relaxed text-blueprint-muted">
                      {r.desc}
                    </p>
                    {r.sideNote && (
                      <p className="mt-3 border-l border-blueprint-grid/20 pl-4 font-sans text-[12px] italic leading-relaxed text-blueprint-muted/60">
                        {r.sideNote}
                      </p>
                    )}
                  </div>
                </div>

                {/* mobile stacked card */}
                <div className="md:hidden">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-sm font-semibold text-blueprint-brass">
                      REV {r.rev}
                    </span>
                    {r.current && (
                      <span className="inline-flex items-center gap-1 rounded-sm border border-blueprint-brass/40 bg-blueprint-brass/10 px-1.5 py-0.5 font-mono text-[9px] tracking-annotation text-blueprint-brass">
                        <Check size={10} strokeWidth={2.5} />
                        CURRENT
                      </span>
                    )}
                  </div>
                  <span className="mt-1 block font-mono text-[11px] text-blueprint-muted/80">
                    {r.date}
                  </span>
                  <h3 className="mt-2 font-mono text-[15px] font-semibold text-blueprint-paper">
                    {r.role}
                  </h3>
                  {r.subLine && (
                    <p className="mt-1 font-mono text-[11px] text-blueprint-muted/70">
                      {r.subLine}
                    </p>
                  )}
                  <p className="mt-2 font-sans text-[14px] leading-relaxed text-blueprint-muted">
                    {r.desc}
                  </p>
                  {r.sideNote && (
                    <p className="mt-3 border-l border-blueprint-grid/20 pl-4 font-sans text-[12px] italic leading-relaxed text-blueprint-muted/60">
                      {r.sideNote}
                    </p>
                  )}
                </div>

                {/* hover hairline accent on the left edge */}
                <motion.span
                  aria-hidden="true"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute left-0 top-1/2 hidden h-6 w-[2px] -translate-y-1/2 bg-blueprint-brass/60 md:block"
                />
              </motion.li>
            ))}
          </ol>
        </div>

        {/* ─── PART 2 — PERFORMANCE DATA (weave reveal) ─── */}
        <div className="mt-24 md:mt-32">
          <SectionHeading
            label="PERFORMANCE DATA — MEASURED OUTCOMES"
            title="Results"
          />

          {/* column header (desktop only) */}
          <div className="hidden md:grid grid-cols-[1fr_140px_1fr] gap-6 border-t border-b border-blueprint-grid/20 py-3 font-mono text-[10px] tracking-annotation text-blueprint-muted/70">
            <span>METRIC</span>
            <span>RESULT</span>
            <span>CONTEXT</span>
          </div>

          <StaggerGroup
            as="div"
            staggerChildren={0.05}
            delayChildren={0.05}
            className="grid grid-cols-1 gap-x-12 md:grid-cols-2"
          >
            {performanceData.map((row) => (
              <StaggerItem
                key={`${row.metric}-${row.result}`}
                as="div"
                className="border-b border-blueprint-grid/15 py-5"
              >
                <div className="hidden md:grid grid-cols-[1fr_140px_1fr] gap-6 items-baseline">
                  <span className="font-sans text-[14px] text-blueprint-paper/90">
                    {row.metric}
                  </span>
                  <span className="font-mono text-[14px] font-bold text-blueprint-brass">
                    {row.result}
                  </span>
                  <span className="font-sans text-[13px] text-blueprint-muted">
                    {row.context}
                  </span>
                </div>

                <div className="md:hidden">
                  <span className="block font-sans text-[14px] text-blueprint-paper/90">
                    {row.metric}
                  </span>
                  <span className="mt-1 block font-mono text-[15px] font-bold text-blueprint-brass">
                    {row.result}
                  </span>
                  <span className="mt-1 block font-sans text-[13px] text-blueprint-muted">
                    {row.context}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <p className="mt-6 font-sans text-[13px] text-blueprint-muted">
            Full detail available in the downloadable resume above.
          </p>
        </div>

        {/* ─── PART 3 — BILL OF MATERIALS (scale-in stagger) ─── */}
        <div className="mt-24 md:mt-32">
          <SectionHeading label="BOM — SKILLS" title="Bill of Materials" />

          <StaggerGroup
            as="div"
            staggerChildren={0.06}
            delayChildren={0.05}
            className="grid grid-cols-1 gap-px border-t border-l border-blueprint-grid/20 bg-blueprint-grid/10 sm:grid-cols-2 lg:grid-cols-3"
          >
            {bom.map((group) => (
              <StaggerItem
                key={group.category}
                as="div"
                className="group relative border-b border-r border-blueprint-grid/20 bg-blueprint-surface/40 p-6 md:p-7 hover:bg-blueprint-surface/60 transition-colors"
              >
                <span className="absolute left-0 top-0 h-px w-10 bg-blueprint-brass/60 transition-all duration-500 group-hover:w-20" />
                <div className="mb-4 flex items-center gap-2">
                  <span className="font-mono text-[11px] tracking-annotation text-blueprint-muted">
                    {group.category}
                  </span>
                </div>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-sm border border-blueprint-grid/25 bg-blueprint-bg/40 px-2.5 py-1 font-mono text-[12px] text-blueprint-paper/90"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <p className="mt-6 font-sans text-[13px] text-blueprint-muted">
            Bilingual — English & Arabic. MENA market experience.
          </p>
        </div>
      </div>
    </section>
  );
}
