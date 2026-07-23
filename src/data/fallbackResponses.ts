/**
 * Canned responses for the demo's "Ask the system" chat.
 * Each response is keyed by an `intent` from `fallback.ts` and ships
 * with a list of trigger keywords (lower-case, single-word OR multi-word phrase).
 *
 * Markdown is rendered by the chat panel via a small inline renderer.
 */

export type FallbackResponse = {
  intent:
    | "greeting"
    | "about"
    | "stack"
    | "pricing"
    | "timeline"
    | "process"
    | "onboarding"
    | "specific_project"
    | "available"
    | "book"
    | "ai_chat"
    | "system"
    | "thanks"
    | "fallback";
  /** Lower-case keywords. Multi-word phrases are matched as substrings. */
  keywords: string[];
  /** Markdown body. The chat panel renders `**bold**`, lists, and paragraphs. */
  body: string;
};

export const fallbackResponses: FallbackResponse[] = [
  {
    intent: "greeting",
    keywords: ["hi", "hey", "hello", "salam", "salaam", "yo", "sup", "greetings"],
    body:
      "Hi — I'm Anan's demo assistant. I can tell you about his projects, stack, process, and availability. " +
      "Try asking **\"What have you built?\"**, **\"What's your stack?\"**, or **\"How much does it cost?\"**.",
  },
  {
    intent: "about",
    keywords: [
      "who",
      "about you",
      "about yourself",
      "tell me about",
      "bio",
      "background",
      "introduce",
      "anan",
      "almasri",
    ],
    body:
      "Anan Almasri is a full-stack AI engineer building **production-grade systems** — not just LLM demos. " +
      "He ships self-hosted business operating systems, agentic financial dashboards, multi-agent build pipelines, and bilingual (AR/EN) SaaS products. " +
      "He works end-to-end: from a 2-week manual validation sprint through to Docker-shipped, customer-deployed code on a self-hosted VPS.",
  },
  {
    intent: "stack",
    keywords: [
      "stack",
      "tech",
      "technologies",
      "tools",
      "frameworks",
      "infrastructure",
      "backend",
      "frontend",
      "database",
      "built with",
    ],
    body:
      "Core stack:\n\n" +
      "- **Frontend:** React, TypeScript, Tailwind CSS\n" +
      "- **Backend / Data:** Supabase (Postgres + pgvector + pg_cron), NocoDB\n" +
      "- **Automation / Agents:** n8n, Claude API, OpenRouter (DeepSeek V4 Flash), Gemini Flash\n" +
      "- **Infra:** Docker on a self-hosted VPS, Resend (email), Stripe, pdf-lib, Web Crypto API\n" +
      "- **AI Patterns:** agentic chat against structured data, multi-agent orchestration, RAG with pgvector\n\n" +
      "Heavily biased toward **self-hosting** and **per-project dedicated instances** rather than shared SaaS subscriptions.",
  },
  {
    intent: "pricing",
    keywords: [
      "pricing",
      "price",
      "cost",
      "rate",
      "rates",
      "fee",
      "fees",
      "how much",
      "budget",
      "quote",
      "estimate",
      "charge",
    ],
    body:
      "Anan prices on **scope**, not hours. Engagements typically fall into three tiers:\n\n" +
      "1. **AI Business Stack package** — AnanOS as the centerpiece, deployed self-hosted on your VPS. Fixed package price.\n" +
      "2. **Custom agentic system** — pocket-CFO-style dashboards, contract analysis, automated reporting. Scoped per data source + agent count.\n" +
      "3. **Multi-agent build system access** — leverage his Level-0/1/2 orchestrator for your own product. Subscription or one-time.\n\n" +
      "Best next step: tap **BOOK A CALL** in the top nav and bring 2-3 example workflows you want automated.",
  },
  {
    intent: "timeline",
    keywords: [
      "timeline",
      "how long",
      "when",
      "deadline",
      "deliver",
      "turnaround",
      "eta",
      "time frame",
    ],
    body:
      "Typical turnarounds:\n\n" +
      "- **PDF-to-P&L (ANORA-class):** ~4 seconds per document end-to-end once the pipeline is deployed.\n" +
      "- **Pocket-CFO-class dashboard:** 2-4 weeks from kickoff to a working internal build.\n" +
      "- **AnanOS / Business OS package:** 4-8 weeks depending on which modules you activate.\n" +
      "- **Custom greenfield build:** Sprint-0 (manual validation) is 2 weeks, then 6-12 weeks for engineering.\n\n" +
      "Anan runs a **2-week manual validation sprint before any code is written** on greenfield products to make sure the build is worth doing.",
  },
  {
    intent: "process",
    keywords: ["process", "workflow", "how do you work", "method", "approach", "tooling"],
    body:
      "Anan's process is **validate → build → deploy → own**:\n\n" +
      "1. **Validate** — 2 weeks of manual outreach and interviews to confirm real demand (Mizaan is currently in this phase).\n" +
      "2. **Build** — spec-driven implementation. For AI apps, that means a 200+ step decomposition routed through a multi-agent build system with separate review and security agents.\n" +
      "3. **Deploy** — Docker on a self-hosted VPS, not a managed SaaS dependency.\n" +
      "4. **Own** — one-time ownership model available instead of subscriptions, where appropriate.",
  },
  {
    intent: "onboarding",
    keywords: ["onboard", "onboarding", "sign up", "start", "get started", "begin", "first step"],
    body:
      "Best first step: **book a 30-min call** (top-right of the page). Bring 2-3 example workflows you want automated. " +
      "Anan will tell you straight whether your project is a fit for self-hosted AI engineering, a packaged product, or a faster no-code solution. " +
      "If the answer is \"this should be a no-code tool\", he'll say so.",
  },
  {
    intent: "specific_project",
    keywords: [],
    body:
      "Here are the projects that match. Each card below has the full PROBLEM / SOLUTION / STACK / RESULT breakdown.",
  },
  {
    intent: "available",
    keywords: ["available", "availability", "free", "open", "take work", "new client", "start"],
    body:
      "Anan takes on a small number of engagements at a time. The fastest way to find out if he can take your project is a 30-min call — " +
      "tap **BOOK A CALL** above. He responds within 24h on weekdays.",
  },
  {
    intent: "book",
    keywords: ["book", "booking", "schedule", "hire", "hire you", "work with", "consultation", "consult", "call", "meet"],
    body:
      "Great — the **BOOK A CALL** button at the top of the page opens the booking flow. It's a 3-step modal: " +
      "1) pick a slot, 2) tell Anan what you want to automate, 3) confirm. He replies within 24h.",
  },
  {
    intent: "ai_chat",
    keywords: ["ai", "llm", "claude", "gpt", "openai", "deepseek", "gemini", "model", "agent", "agents", "multi-agent"],
    body:
      "Anan uses LLMs as **components inside production systems**, not as a UI. Concrete patterns:\n\n" +
      "- **Pocket CFO:** Claude agent that converses directly with a company's financial data and proactively surfaces anomalies.\n" +
      "- **RAQEEB:** Gemini Flash reads contracts, flags risk, drafts counter-language on a schedule.\n" +
      "- **Multi-Agent Build System:** a Level-0 orchestrator oversees a manager agent, builder agents, a reviewer, and a security agent — recursively decomposed through developer / designer / business-strategist lenses.\n\n" +
      "He uses **pgvector** for retrieval, **NocoDB** for shared agent task state, and prefers **Claude Sonnet** for reasoning + **Gemini Flash / DeepSeek V4 Flash** for cheap high-volume work.",
  },
  {
    intent: "system",
    keywords: ["system", "blueprint", "site", "this page", "demo"],
    body:
      "You're looking at the **Blueprint Eternity** demo. Sections: §1 PlottingHero, §2 AnimatedSystemDiagram, §3 HorizontalGallery, §4 this chat. " +
      "It's a 4-sprint build to show the full skill set: motion design, data viz, layout, and a real (fallback-backed) AI surface.",
  },
  {
    intent: "thanks",
    keywords: ["thanks", "thank you", "thx", "ty", "merci"],
    body: "Anytime. If you want a real conversation, tap **BOOK A CALL** at the top.",
  },
  {
    intent: "fallback",
    keywords: [],
    body:
      "I didn't catch a confident match for that. I can answer well about: **projects, stack, pricing, timeline, process, AI patterns, availability, booking**. " +
      "Try one of those, or open a question with a project name like **AnanOS**, **Pocket CFO**, **ANORA**, or **RAQEEB**.",
  },
];
