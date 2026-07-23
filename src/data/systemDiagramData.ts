/**
 * The Stack — Sprint-2 system diagram data.
 *
 * A real architecture map of the systems I build with. Each node links to:
 *   - which projects use it (sheet numbers from projectsData.ts)
 *   - a 4–6 line code or config snippet
 *   - the role it plays
 */

export type NodeKind = "trigger" | "router" | "agent" | "db" | "vector" | "action" | "frontend" | "infra";

export interface ServiceNode {
  id: string;
  label: string;
  sub: string;
  kind: NodeKind;
  /** Position on the canvas in px (canvas is 1200 × 480). */
  x: number;
  y: number;
  /** Tech used (shown in side panel). */
  tech: string[];
  /** Short role blurb. */
  role: string;
  /** A real-ish 4–6 line snippet. */
  snippet: string;
  /** Project sheet numbers that use this node. */
  sheets: string[];
}

export interface ServiceEdge {
  from: string;
  to: string;
  /** Optional label shown above the edge midpoint. */
  label?: string;
}

export const nodes: ServiceNode[] = [
  // Triggers (left column)
  {
    id: "stripe",
    label: "STRIPE",
    sub: "trigger",
    kind: "trigger",
    x: 90,
    y: 90,
    tech: ["Stripe API", "webhooks"],
    role: "Payment events from Stripe fire downstream automations.",
    snippet:
      "POST /v1/webhook_endpoints\n  → events: checkout.session.completed\n  → forwards to n8n trigger.create",
    sheets: ["01", "03", "08"],
  },
  {
    id: "webhook",
    label: "WEBHOOK",
    sub: "generic",
    kind: "trigger",
    x: 90,
    y: 220,
    tech: ["Express", "Cloudflare Tunnel"],
    role: "Generic HTTP entry point — anything with a POST can land here.",
    snippet:
      "app.post('/hook', (req, res) => {\n  await n8n.forward(req.body);\n  res.sendStatus(204);\n});",
    sheets: ["03", "04", "05"],
  },
  {
    id: "schedule",
    label: "CRON",
    sub: "schedule",
    kind: "trigger",
    x: 90,
    y: 350,
    tech: ["pg_cron", "n8n Schedule"],
    role: "Time-based triggers — weekly reports, reminders, cleanup jobs.",
    snippet:
      "select cron.schedule('weekly-pnl',\n  '0 9 * * 1', $$ notify_report $$);",
    sheets: ["03", "04"],
  },

  // Router
  {
    id: "router",
    label: "ROUTER",
    sub: "branch",
    kind: "router",
    x: 320,
    y: 220,
    tech: ["n8n IF/Switch"],
    role: "Routes events by type — payments to ledger, contracts to AI, etc.",
    snippet:
      "switch (event.type) {\n  case 'checkout':  ledger.upsert(...);\n  case 'contract': ai.analyze(...);\n}",
    sheets: ["01", "03", "04"],
  },

  // AI
  {
    id: "agent",
    label: "AI AGENT",
    sub: "claude · gpt",
    kind: "agent",
    x: 560,
    y: 130,
    tech: ["Claude 3.5", "OpenRouter", "function-calling"],
    role: "LLM-driven reasoning, summarization, and tool use.",
    snippet:
      "await agent.invoke({\n  model: 'claude-3.5-sonnet',\n  tools: [calendar, email, crm],\n  context: resume,\n});",
    sheets: ["02", "03", "04", "09"],
  },

  // Vector
  {
    id: "vector",
    label: "VECTOR DB",
    sub: "pgvector",
    kind: "vector",
    x: 560,
    y: 310,
    tech: ["Supabase", "pgvector", "HNSW index"],
    role: "Embeddings store for semantic search across docs and contracts.",
    snippet:
      "create index on docs using hnsw (embedding vector_cosine_ops);\nselect * from docs order by embedding <=> $1 limit 8;",
    sheets: ["02", "04", "09"],
  },

  // Postgres
  {
    id: "db",
    label: "POSTGRES",
    sub: "primary",
    kind: "db",
    x: 800,
    y: 310,
    tech: ["Supabase", "RLS", "migrations"],
    role: "Source of truth — typed schema with row-level security.",
    snippet:
      "create policy \"own rows\" on contacts\n  for select using (user_id = auth.uid());",
    sheets: ["01", "02", "05", "07", "08"],
  },

  // Frontend
  {
    id: "frontend",
    label: "REACT UI",
    sub: "frontend",
    kind: "frontend",
    x: 1040,
    y: 130,
    tech: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    role: "Typed frontends with row-level-secured Supabase clients.",
    snippet:
      "const { data } = await supabase\n  .from('contacts')\n  .select('*')\  .eq('owner', user.id);\n  // RLS enforces it server-side.",
    sheets: ["01", "02", "05", "06", "07"],
  },

  // Action destinations
  {
    id: "notify",
    label: "NOTIFY",
    sub: "email · sms",
    kind: "action",
    x: 1040,
    y: 310,
    tech: ["Resend", "Twilio", "WhatsApp API"],
    role: "Outbound notifications — emails, SMS, WhatsApp.",
    snippet:
      "await resend.emails.send({\n  to, subject,\n  react: <Report data={pnl} />,\n});",
    sheets: ["03", "04", "06"],
  },

  // Infra
  {
    id: "infra",
    label: "INFRA",
    sub: "self-hosted",
    kind: "infra",
    x: 800,
    y: 130,
    tech: ["Docker", "Hetzner VPS", "Caddy", "n8n"],
    role: "Self-hosted on Hetzner — keeps data, models, and compute under your control.",
    snippet:
      "docker compose up -d\n  caddy → n8n :5678\n  supabase :54321\n  agent-ollama :11434",
    sheets: ["01", "08", "09"],
  },
];

export const edges: ServiceEdge[] = [
  { from: "stripe", to: "router" },
  { from: "webhook", to: "router" },
  { from: "schedule", to: "router" },
  { from: "router", to: "agent", label: "ask" },
  { from: "router", to: "vector", label: "embed" },
  { from: "router", to: "db", label: "log" },
  { from: "agent", to: "vector", label: "search" },
  { from: "agent", to: "frontend", label: "render" },
  { from: "vector", to: "agent", label: "context" },
  { from: "db", to: "frontend", label: "rows" },
  { from: "infra", to: "router" },
  { from: "infra", to: "db" },
  { from: "agent", to: "notify", label: "deliver" },
  { from: "frontend", to: "notify", label: "user action" },
];

export const kindColor: Record<NodeKind, { stroke: string; fill: string; text: string }> = {
  trigger: { stroke: "#C9A15D", fill: "#16283F", text: "#C9A15D" },
  router: { stroke: "#9FB0C4", fill: "#16283F", text: "#EDE8DC" },
  agent: { stroke: "#C9A15D", fill: "#16283F", text: "#EDE8DC" },
  vector: { stroke: "#6E93B7", fill: "#16283F", text: "#EDE8DC" },
  db: { stroke: "#6E93B7", fill: "#16283F", text: "#EDE8DC" },
  frontend: { stroke: "#C9A15D", fill: "#16283F", text: "#EDE8DC" },
  action: { stroke: "#C9A15D", fill: "#16283F", text: "#EDE8DC" },
  infra: { stroke: "#9FB0C4", fill: "#16283F", text: "#EDE8DC" },
};
