/**
 * Intent router for the demo's "Ask the system" chat.
 *
 * The chat hits an n8n webhook with the user's question + context.
 * If the webhook fails (or returns nothing), we fall back to a local
 * intent-matcher that picks the best canned response from
 * `fallbackResponses.ts` and concatenates the relevant project sheets
 * so the demo always feels alive.
 *
 * This is intentionally NOT an LLM. It's deterministic, sub-millisecond,
 * and never breaks.
 */

import { projects, type Project } from "../../data/projectsData";
import { fallbackResponses, type FallbackResponse } from "../../data/fallbackResponses";
import type { ChatQuickReply } from "./chatResponse";

export type Intent =
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

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** Sheet numbers to render as "USED IN" pills, drawn from context. */
  projectRefs?: string[];
  /** Optional next-step actions derived from the assistant's final question. */
  quickReplies?: ChatQuickReply[];
  /** When the message was generated. */
  ts: number;
};

const STOPWORDS = new Set([
  "a","an","the","is","are","was","were","be","been","being","do","does","did",
  "i","you","he","she","it","we","they","me","him","her","us","them","my","your",
  "his","its","our","their","this","that","these","those","and","or","but","if",
  "to","of","in","on","at","by","for","with","about","as","from","into","so",
  "what","which","who","whom","how","when","where","why","can","could","would",
  "should","will","shall","may","might","must","do","does","did","have","has",
  "had","there","here","then","than","just","also","really","kindly","please",
  "thanks","thank","hi","hey","hello","yo","sup","ok","okay","yes","no","yeah","yep",
]);

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

const PROJECT_KEYWORDS: Record<string, string[]> = {
  "01": ["ananos", "business os", "all-in-one", "all in one", "crm", "accounting"],
  "02": ["pocket cfo", "cfo", "financial dashboard", "kpi", "kpis", "p&l", "pnl", "financials", "advisor"],
  "03": ["anora", "bank statement", "pdf", "p&l", "pnl", "profit", "loss", "categoriz", "stripe", "quickbooks", "whatsapp"],
  "04": ["raqeeb", "contract", "risk", "reminder", "gemini", "lovable"],
  "05": ["signdeal", "signature", "sign", "arabic", "rtl", "mena", "bilingual"],
  "06": ["eatsafe", "ingredient", "food", "ewg", "efsa", "fda", "label", "scan"],
  "07": ["baiti", "proptech", "real estate", "marketplace", "florida", "846"],
  "08": ["mizaan", "ميزان", "one-time", "ownership", "synapse", "small business", "smb"],
  "09": ["multi-agent", "multi agent", "agent", "orchestrator", "nocodb", "openrouter", "deepseek", "decomposition"],
};

function detectProjects(q: string): Project[] {
  const tokens = tokenize(q);
  if (tokens.length === 0) return [];
  const matched = new Set<string>();
  for (const [sheetNo, keywords] of Object.entries(PROJECT_KEYWORDS)) {
    for (const kw of keywords) {
      // word-boundary-ish: keyword must be present as a substring or token
      if (kw.includes(" ")) {
        if (q.toLowerCase().includes(kw)) matched.add(sheetNo);
      } else if (tokens.includes(kw)) {
        matched.add(sheetNo);
      }
    }
  }
  return projects.filter((p) => matched.has(p.sheetNo));
}

function scoreIntent(q: string, lowered: string): { intent: Intent; score: number } {
  const tokens = tokenize(q);
  if (tokens.length === 0) return { intent: "greeting", score: 0 };
  const t = new Set(tokens);

  let best: { intent: Intent; score: number } = { intent: "fallback", score: 0 };
  for (const resp of fallbackResponses) {
    let score = 0;
    for (const kw of resp.keywords) {
      if (kw.includes(" ")) {
        if (lowered.includes(kw)) score += 2;
      } else if (t.has(kw)) {
        score += 2;
      } else if (lowered.includes(kw)) {
        score += 1;
      }
    }
    if (score > best.score) best = { intent: resp.intent, score };
  }
  return best;
}

function detectGreeting(lowered: string): boolean {
  return /^(hi|hey|hello|yo|sup|salam|salaam|مرحبا|هلا|اهلين|أهلا)\b/.test(lowered.trim());
}

function detectSpecificProject(q: string): boolean {
  return detectProjects(q).length > 0;
}

function detectThanks(lowered: string): boolean {
  return /^(thanks|thank you|thx|ty|شكرا|merci)\b/.test(lowered.trim());
}

function detectBook(lowered: string): boolean {
  return /\b(book|booking|schedule|hire|hire you|work with|consultation|consult|call|meet|توكيل|احجز)\b/.test(
    lowered
  );
}

function detectAvailable(lowered: string): boolean {
  return /\b(available|availability|free|open|take work|take on|when can|start|new client|booking|حجز)\b/.test(
    lowered
  );
}

function detectPricing(lowered: string): boolean {
  return /\b(pricing|price|cost|rate|rates|fee|fees|how much|budget|quote|estimate|charge|سعر|تكلفة|كم)\b/.test(
    lowered
  );
}

function detectTimeline(lowered: string): boolean {
  return /\b(timeline|how long|when|deadline|deliver|turnaround|eta|time frame|deadlines|أمد|كم وقت|متى)\b/.test(
    lowered
  );
}

function detectProcess(lowered: string): string | null {
  if (/\b(process|workflow|how do you work|method|approach|stack of tools|tooling|أدواتك|كيف تشتغل)\b/.test(lowered))
    return "process";
  if (/\b(onboard|onboarding|sign ?up|start|get started|begin|first step|أبدأ)\b/.test(lowered)) return "onboarding";
  return null;
}

function detectAIChat(lowered: string): boolean {
  return /\b(ai|llm|claude|gpt|gpt-4|chat ?gpt|openai|deepseek|gemini|model|agent|agents|multi-?agent)\b/.test(
    lowered
  );
}

function detectStack(lowered: string): boolean {
  return /\b(stack|tech|technologies|tools|frameworks|infrastructure|backend|frontend|database|used|built with|ما تستخدم|تستخدم)\b/.test(
    lowered
  );
}

function detectAbout(lowered: string): boolean {
  if (/\b(who|who's|who is|about you|about yourself|tell me about|introduce|bio|background|من انت|عنك)\b/.test(lowered))
    return true;
  if (/\b(anan|almasri|أنان|الصري)\b/.test(lowered)) return true;
  return false;
}

export type RouteResult = {
  intent: Intent;
  response: FallbackResponse;
  projectRefs: Project[];
};

export function routeQuestion(raw: string): RouteResult {
  const q = raw.trim();
  const lowered = q.toLowerCase();
  const byLookup = scoreIntent(q, lowered);
  let intent: Intent = byLookup.intent;
  let projectRefs: Project[] = [];

  if (intent === "fallback" || byLookup.score <= 1) {
    if (detectGreeting(lowered)) intent = "greeting";
    else if (detectThanks(lowered)) intent = "thanks";
    else if (detectBook(lowered)) intent = "book";
    else if (detectAvailable(lowered)) intent = "available";
    else if (detectPricing(lowered)) intent = "pricing";
    else if (detectTimeline(lowered)) intent = "timeline";
    else {
      const proc = detectProcess(lowered);
      if (proc === "onboarding") intent = "onboarding";
      else if (proc === "process") intent = "process";
      else if (detectAIChat(lowered)) intent = "ai_chat";
      else if (detectStack(lowered)) intent = "stack";
      else if (detectAbout(lowered)) intent = "about";
      else if (detectSpecificProject(q)) intent = "specific_project";
    }
  }

  // Specific projects always return the project detail intent, but with refs.
  const projectHits = detectProjects(q);
  if (projectHits.length > 0) {
    intent = "specific_project";
    projectRefs = projectHits;
  } else if (intent === "specific_project") {
    // Tokens pointed at it but no concrete project matched — fall back to "about".
    intent = "about";
  }

  const response =
    fallbackResponses.find((r) => r.intent === intent) ??
    fallbackResponses.find((r) => r.intent === "fallback")!;

  return { intent, response, projectRefs };
}
