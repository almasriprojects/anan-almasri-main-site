import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { Check } from "lucide-react";

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

export default function Experience() {
  const reduced = useReducedMotion();

  return (
    <section id="experience" className="relative bp-grid py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* ──────────────────────────────────────────────────────────
            PART 1 — REVISION HISTORY
        ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-14 max-w-2xl"
        >
          <div className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
            <span className="h-px w-8 bg-blueprint-brass/70" />
            CAREER LOG
          </div>
          <h2 className="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">
            Revision History
          </h2>
        </motion.div>

        {/* Revision block — table on desktop, stacked cards on mobile */}
        <div className="border-t border-blueprint-grid/20">
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
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: i * 0.1,
                  ease: "easeOut",
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
                <span className="absolute left-0 top-1/2 hidden h-6 w-[2px] -translate-y-1/2 bg-blueprint-brass/0 transition-colors duration-300 group-hover:bg-blueprint-brass/60 md:block" />
              </motion.li>
            ))}
          </ol>
        </div>

        {/* ──────────────────────────────────────────────────────────
            PART 2 — PERFORMANCE DATA
        ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-24 md:mt-32"
        >
          <div className="mb-10 max-w-2xl">
            <div className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
              <span className="h-px w-8 bg-blueprint-brass/70" />
              PERFORMANCE DATA — MEASURED OUTCOMES
            </div>
            <h2 className="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">
              Results
            </h2>
          </div>

          {/* column header (desktop only) */}
          <div className="hidden md:grid grid-cols-[1fr_140px_1fr] gap-6 border-t border-b border-blueprint-grid/20 py-3 font-mono text-[10px] tracking-annotation text-blueprint-muted/70">
            <span>METRIC</span>
            <span>RESULT</span>
            <span>CONTEXT</span>
          </div>

          {/* two-column grid on desktop, single column on mobile */}
          <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            {performanceData.map((row, i) => (
              <motion.div
                key={`${row.metric}-${i}`}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.4,
                  delay: (i % 2) * 0.06 + Math.floor(i / 2) * 0.04,
                  ease: "easeOut",
                }}
                className="border-b border-blueprint-grid/15 py-5"
              >
                {/* desktop row */}
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

                {/* mobile stacked */}
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
              </motion.div>
            ))}
          </div>

          <p className="mt-6 font-sans text-[13px] text-blueprint-muted">
            Full detail available in the downloadable resume below.
          </p>
        </motion.div>

        {/* ──────────────────────────────────────────────────────────
            PART 3 — BILL OF MATERIALS
        ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-24 md:mt-32"
        >
          <div className="mb-10 max-w-2xl">
            <div className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
              <span className="h-px w-8 bg-blueprint-brass/70" />
              BOM — SKILLS
            </div>
            <h2 className="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">
              Bill of Materials
            </h2>
          </div>

          {/* Responsive grid of category blocks:
              1 col (mobile) → 2 cols (sm) → 3 cols (lg) */}
          <div className="grid grid-cols-1 gap-px border-t border-l border-blueprint-grid/20 bg-blueprint-grid/10 sm:grid-cols-2 lg:grid-cols-3">
            {bom.map((group) => (
              <div
                key={group.category}
                className="relative border-b border-r border-blueprint-grid/20 bg-blueprint-surface/40 p-6 md:p-7"
              >
                {/* brass top edge — subtle title-block accent */}
                <span className="absolute left-0 top-0 h-px w-10 bg-blueprint-brass/60" />

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
              </div>
            ))}
          </div>

          <p className="mt-6 font-sans text-[13px] text-blueprint-muted">
            Bilingual — English &amp; Arabic. MENA market experience.
          </p>
        </motion.div>

        {/* ──────────────────────────────────────────────────────────
            PART 4 — RESUME PANEL
        ────────────────────────────────────────────────────────── */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mt-24 md:mt-32"
        >
          <div className="relative border border-blueprint-grid/20 bg-blueprint-surface/50 p-8 md:p-12">
            {/* brass top edge */}
            <span className="absolute left-0 top-0 h-[2px] w-full bg-blueprint-brass/70" />
            {/* corner ticks */}
            <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-blueprint-brass/50" />
            <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-blueprint-brass/50" />

            <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
                  OUTPUT — FULL SPEC
                </div>
                <h3 className="font-mono text-xl font-semibold text-blueprint-paper">
                  Full Resume
                </h3>
                <p className="mt-2 font-sans text-[14px] text-blueprint-muted">
                  Complete career history, references, and project archive.
                </p>
              </div>

              <div className="flex flex-col items-start gap-2 md:items-end">
                <a
                  href="#"
                  className="inline-flex items-center gap-2 rounded-sm bg-blueprint-brass px-5 py-3 font-mono text-[12px] font-semibold tracking-annotation text-blueprint-bg transition-colors duration-200 hover:bg-blueprint-brass/90"
                >
                  Download Full Resume (PDF)
                </a>
                <span className="font-mono text-[11px] text-blueprint-muted/70">
                  Last updated: [DATE]
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
