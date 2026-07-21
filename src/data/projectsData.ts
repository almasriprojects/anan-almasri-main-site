export type Project = {
  sheetNo: string;
  title: string;
  type: string;
  problem: string;
  solution: string;
  stack: string;
  result: string;
};

export const projects: Project[] = [
  {
    sheetNo: "01",
    title: "AnanOS",
    type: "Business OS",
    problem:
      "Small businesses juggle five to ten separate subscriptions to run CRM, accounting, and operations — none of them talk to each other.",
    solution:
      "AnanOS is a self-hosted, all-in-one business operating system combining a CRM module and full accounting software, with AI woven through every part of it.",
    stack:
      "React, Tailwind CSS, Supabase, n8n, Claude API, Docker on a self-hosted VPS.",
    result:
      "Bundled as the centerpiece of the AI Business Stack package — one system replacing an entire subscription stack.",
  },
  {
    sheetNo: "02",
    title: "Pocket CFO",
    type: "Financial Dashboard",
    problem:
      "Internal CFOs need fast, relevant visibility into company financials — not another tool for manually entering data they already have.",
    solution:
      "A read-only financial dashboard built specifically for a single company's internal CFO, surfacing the KPIs that matter, paired with an agentic AI chat that can converse directly with the company's financial data.",
    stack: "Supabase, Claude API agent, designed in Stitch.",
    result:
      "The AI chat functions as both an analyst answering direct questions and a proactive advisor flagging issues before they're asked about.",
  },
  {
    sheetNo: "03",
    title: "ANORA",
    type: "Automation",
    problem:
      "Turning a stack of bank statement PDFs into a categorized profit-and-loss report is slow, manual, and error-prone — especially catching duplicate or false-positive transfers.",
    solution:
      "ANORA converts bank statement PDFs into a categorized P&L in roughly 4 seconds, with built-in deduplication and false-positive transfer detection. Extended with an automated weekly reporting layer that pulls from Stripe, QuickBooks, Sheets, and CRM tools, has Claude write a plain-English summary, and delivers it via email or WhatsApp.",
    stack: "n8n, Claude API, Supabase.",
    result:
      "~4-second PDF-to-P&L turnaround, plus fully automated recurring cross-tool reporting with zero manual assembly.",
  },
  {
    sheetNo: "04",
    title: "RAQEEB",
    type: "Contract AI",
    problem:
      "Manually reviewing contracts for risk is slow, easy to get wrong, and deadlines slip through the cracks.",
    solution:
      "RAQEEB analyzes contracts, flags risk, and generates counter-language automatically, with scheduled reminder emails so nothing gets missed.",
    stack: "Lovable, Supabase, Gemini Flash, Resend, pg_cron.",
    result:
      "Automated risk flagging and counter-language generation running alongside a scheduled reminder system.",
  },
  {
    sheetNo: "05",
    title: "SignDeal",
    type: "E-Signature",
    problem:
      "Most e-signature platforms handle Arabic text and right-to-left layout poorly, if at all — a real gap for MENA-region businesses.",
    solution:
      "A bilingual Arabic/English e-signature platform with proper RTL document generation, seeded with real companies and templates.",
    stack:
      "pdf-lib, Web Crypto API, an HTML-to-print PDF generation approach using the Amiri font and CSS grid RTL layout.",
    result:
      "Fully bilingual, legally-structured e-signature documents rendering correctly in both languages.",
  },
  {
    sheetNo: "06",
    title: "EatSafe",
    type: "Consumer App",
    problem:
      "Consumers can't easily tell whether a product's ingredients are actually safe, especially with conflicting regulatory standards across regions.",
    solution:
      "EatSafe scans product labels and rates ingredients on a 4-tier system — EAT, LIMIT, AVOID, NEVER — using EWG methodology, favoring stricter EU/EFSA standards over the FDA where they differ.",
    stack:
      "Open Food Facts data with an AI fallback, backed by a canonical ingredients dictionary.",
    result: "A clear 4-tier safety rating any consumer can act on instantly.",
  },
  {
    sheetNo: "07",
    title: "Baiti.ai",
    type: "PropTech Marketplace",
    problem:
      "PropTech marketplaces rarely account for the full regulatory complexity real estate transactions actually involve.",
    solution:
      "A fully-specified PropTech marketplace covering 846 features across 24 domains, with Florida regulatory compliance mapped directly into the spec.",
    stack: "Full-stack marketplace architecture, specification-driven build.",
    result:
      "An 846-feature specification ready to build against, with compliance handled from the ground up rather than bolted on after.",
  },
  {
    sheetNo: "08",
    title: "Mizaan",
    type: "Business OS",
    problem:
      "SMBs want an all-in-one AI business OS, but subscription pricing doesn't match how they actually want to own their tools.",
    solution:
      "Mizaan (ميزان) is an AI-powered business operating system for SMBs sold on a one-time ownership model, built around a signature 'synapse' feature that cross-references bank statements directly against contracts.",
    stack: "Supabase (dedicated per-project instance).",
    result:
      "Currently in a two-week manual validation sprint — 25 outreach messages, 10 discovery interviews, 3 manual audits — before any code is written, to validate demand first.",
  },
  {
    sheetNo: "09",
    title: "Multi-Agent Build System",
    type: "Dev Infrastructure",
    problem:
      "Existing AI app builders can generate a UI quickly, but they can't handle real production-scale decomposition, agent-level code review, or security checks.",
    solution:
      "A multi-agent orchestration system where a manager agent oversees builder agents, a review agent, and a security agent — recursively decomposed through developer, designer, and business-strategist lenses down to roughly 200+ granular steps.",
    stack: "n8n, OpenRouter/DeepSeek V4 Flash, NocoDB for shared agent task state.",
    result:
      "Level 0 Orchestrator and all three Level 1 department leads (Business, Design, Engineering) built and chained end-to-end, tested successfully against a real idea. Level 2 backend decomposition in active development.",
  },
];
