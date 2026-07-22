/**
 * AI client for the demo chat (Sprint 5+).
 *
 *  - POSTs `{ sessionId, chatInput, name, email, system, messages, context }`
 *    to /api/chat, which proxies to OpenRouter (directly, or via the n8n
 *    webhook) using server-side credentials.
 *  - `sessionId` is generated once per browser (localStorage) and sent on
 *    every request — this is the key NocoDB/n8n uses to thread memory for
 *    a visitor, independent of whether they've given a name/email yet.
 *  - Default model selection lives server-side (VITE_OPENROUTER_MODEL /
 *    n8n workflow); this client doesn't hardcode a model.
 *  - On any failure (offline, 4xx/5xx, empty body, rate-limited), retries
 *    once with backoff, then falls back to the deterministic intent
 *    router so the demo never goes silent.
 *  - Guards against stale responses: if a second message is sent before
 *    the first request resolves, the older response is discarded so it
 *    can never clobber a newer answer in the UI.
 *  - After every assistant reply, fire-and-forget logs the exchange to
 *    /api/chat-log so Anan has a real per-client transcript.
 */

import { projects } from "../../data/projectsData";
import { buildSystemMessage } from "../../data/chatSystemPrompt";
import { routeQuestion, type ChatMessage, type Intent } from "./fallback";
import type { ChatIdentity } from "./chatIdentity";
import { deriveQuickReplies, normalizeAssistantContent } from "./chatResponse";

const CHAT_TIMEOUT_MS = 60_000; // server has its own timeout too; this is a hard ceiling
const MAX_RETRIES = 1; // one retry with backoff before falling back locally
const RETRY_BASE_DELAY_MS = 600;
const SESSION_STORAGE_KEY = "chatSessionId";

type WireMessage = { role: "user" | "assistant"; content: string };

type ServerOk = {
  ok: true;
  source: "openrouter" | "n8n" | "server-fallback";
  content: string;
  model?: string;
};

type ServerErr = {
  ok: false;
  error: string;
  detail?: string;
};

type ServerResponse = ServerOk | ServerErr;

export type AssistantResult = {
  message: ChatMessage;
  intent: Intent | "webhook" | "server-fallback" | "openrouter" | "n8n";
  source: "openrouter" | "n8n" | "server-fallback" | "fallback";
  projectRefs: string[];
  model?: string;
};

function makeId(): string {
  return "msg-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function newUserMessage(text: string): ChatMessage {
  return {
    id: makeId(),
    role: "user",
    text,
    ts: Date.now(),
  };
}

// ---------------------------------------------------------------------------
// Session identity — separate from name/email identity. This is what threads
// a conversation together in NocoDB regardless of whether the visitor has
// given their name yet.
// ---------------------------------------------------------------------------

let cachedSessionId: string | null = null;

export function getChatSessionId(): string {
  if (cachedSessionId) return cachedSessionId;
  try {
    const existing = window.localStorage.getItem(SESSION_STORAGE_KEY);
    if (existing) {
      cachedSessionId = existing;
      return existing;
    }
  } catch {
    /* localStorage unavailable (private mode, SSR, etc.) — fall through */
  }
  const fresh =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : "sess-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  cachedSessionId = fresh;
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, fresh);
  } catch {
    /* ignore — session just won't persist across reloads in this browser */
  }
  return fresh;
}

/** Starts a fresh conversation thread — call this from a "New chat" button. */
export function resetChatSession(): string {
  const fresh =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : "sess-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  cachedSessionId = fresh;
  try {
    window.localStorage.setItem(SESSION_STORAGE_KEY, fresh);
  } catch {
    /* ignore */
  }
  return fresh;
}

// ---------------------------------------------------------------------------
// Stale-response guard — if the user sends message #2 before message #1's
// request resolves, message #1's (older) response must never overwrite the
// UI after message #2's response has already landed.
// ---------------------------------------------------------------------------

let requestGeneration = 0;

function toWire(messages: ChatMessage[]): WireMessage[] {
  return messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-12)
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.text }));
}

function isServerOk(value: unknown): value is ServerOk {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    v.ok === true &&
    typeof v.content === "string" &&
    v.content.trim().length > 0 &&
    (v.source === "openrouter" || v.source === "n8n" || v.source === "server-fallback")
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function postJSON<T>(
  url: string,
  body: unknown,
  timeoutMs: number
): Promise<{ data: T | null; failedTransiently: boolean }> {
  const controller = new AbortController();
  const t = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) {
      // 5xx / 429 are worth retrying; 4xx client errors are not.
      const transient = res.status >= 500 || res.status === 429;
      return { data: null, failedTransiently: transient };
    }
    const json = (await res.json()) as T;
    return { data: json, failedTransiently: false };
  } catch {
    // Network error / abort — treat as transient (worth one retry).
    return { data: null, failedTransiently: true };
  } finally {
    window.clearTimeout(t);
  }
}

function postFireAndForget(url: string, body: unknown) {
  try {
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    /* ignore — logging is best-effort, never blocks the user's chat */
  }
}

async function callServer(
  identity: ChatIdentity | null | undefined,
  history: ChatMessage[],
  question: string,
  sessionId: string
): Promise<ServerResponse | null> {
  const system = buildSystemMessage({
    name: identity?.name?? "",
    email: identity?.email?? "",
  });
  const messages = toWire(history);
  const payload = {
    sessionId,
    chatInput: question,
    name: identity?.name ?? "",
    email: identity?.email ?? "",
    system,
    messages,
    context: {
      source: "site-widget",
      page: typeof window !== "undefined" ? window.location.pathname : "",
    },
  };

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const { data, failedTransiently } = await postJSON<ServerResponse>(
      "/api/chat",
      payload,
      CHAT_TIMEOUT_MS
    );

    if (data && isServerOk(data)) return data;
    if (data && !isServerOk(data) && (data as ServerErr).ok === false) {
      // A well-formed error response — no point retrying a 4xx-style rejection.
      return data;
    }
    if (!failedTransiently) return null;
    if (attempt < MAX_RETRIES) await sleep(RETRY_BASE_DELAY_MS * (attempt + 1));
  }
  return null;
}

/**
 * Send a question. Always returns a fully-formed assistant ChatMessage.
 * If the server proxy fails after retrying (or returns empty), the
 * deterministic intent-router supplies a fallback reply.
 *
 * Safe to call again before a previous call resolves — only the response
 * matching the most recent call will be returned as a "fresh" result; a
 * stale in-flight call still resolves (so logging still happens) but its
 * `stale` flag lets the caller ignore it in the UI if needed.
 */
export async function ask(
  question: string,
  history: ChatMessage[] = [],
  identity?: ChatIdentity | null
): Promise<AssistantResult & { stale?: boolean }> {
  const myGeneration = ++requestGeneration;
  const trimmedHistory = history.slice(-12);
  const sessionId = getChatSessionId();

  const serverResp = await callServer(identity, trimmedHistory, question, sessionId);
  const stale = myGeneration !== requestGeneration;

  if (serverResp && serverResp.ok && serverResp.content && serverResp.source !== "server-fallback") {
    const upstream = serverResp.source; // "n8n" or "openrouter"
    // Defense in depth: the server already normalizes n8n payloads, but a
    // serialized JSON envelope must never reach the visible chat if an older
    // server or future workflow returns one unexpectedly.
    const cleanContent = normalizeAssistantContent(serverResp.content);
    if (!cleanContent) {
      return buildLocalFallback(question, sessionId, identity, stale);
    }
    const assistantMsg: ChatMessage = {
      id: makeId(),
      role: "assistant",
      text: cleanContent,
      quickReplies: deriveQuickReplies(cleanContent),
      ts: Date.now(),
    };
    postFireAndForget("/api/chat-log", {
      sessionId,
      name: identity?.name ?? "",
      email: identity?.email ?? "",
      question,
      answer: cleanContent,
      source: upstream,
      model: serverResp.model || "",
      intent: upstream,
      ts: Date.now(),
    });
    return {
      message: assistantMsg,
      intent: upstream,
      source: upstream,
      projectRefs: [],
      model: serverResp.model,
      stale,
    };
  }

  if (serverResp && serverResp.ok && serverResp.source === "server-fallback") {
    // Server ran but has no upstream key/route configured — surface that.
    const cleanContent = normalizeAssistantContent(serverResp.content);
    const assistantMsg: ChatMessage = {
      id: makeId(),
      role: "assistant",
      text: cleanContent || serverResp.content,
      quickReplies: deriveQuickReplies(cleanContent || serverResp.content),
      ts: Date.now(),
    };
    postFireAndForget("/api/chat-log", {
      sessionId,
      name: identity?.name ?? "",
      email: identity?.email ?? "",
      question,
      answer: cleanContent || serverResp.content,
      source: "server-fallback",
      model: "",
      intent: "server-fallback",
      ts: Date.now(),
    });
    return {
      message: assistantMsg,
      intent: "server-fallback",
      source: "server-fallback",
      projectRefs: [],
      stale,
    };
  }

  // Deterministic local fallback — server unreachable, timed out, or errored.
  return buildLocalFallback(question, sessionId, identity, stale);
}

function buildLocalFallback(
  question: string,
  sessionId: string,
  identity: ChatIdentity | null | undefined,
  stale: boolean
): AssistantResult & { stale?: boolean } {
  const routed = routeQuestion(question);
  const assistantMsg: ChatMessage = {
    id: makeId(),
    role: "assistant",
    text: routed.response.body,
    quickReplies: deriveQuickReplies(routed.response.body),
    ts: Date.now(),
    projectRefs: routed.projectRefs.map((p) => p.sheetNo),
  };

  postFireAndForget("/api/chat-log", {
    sessionId,
    name: identity?.name ?? "",
    email: identity?.email ?? "",
    question,
    answer: routed.response.body,
    source: "fallback",
    model: "",
    intent: routed.intent,
    ts: Date.now(),
  });

  return {
    message: assistantMsg,
    intent: routed.intent,
    source: "fallback",
    projectRefs: routed.projectRefs.map((p) => p.sheetNo),
    stale,
  };
}

/** Re-export so callers can pull projects from a single import path. */
export { projects };