import { useEffect, useRef, useState, useCallback, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { motionTokens } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { useBookCall } from "../BookCallModal/context";
import { ask, newUserMessage } from "../../lib/demo/aiClient";
import type { ChatMessage } from "../../lib/demo/fallback";
import type { ChatQuickReply } from "../../lib/demo/chatResponse";
import {
  loadIdentity,
  firstName,
  clearIdentity,
  type ChatIdentity,
} from "../../lib/demo/chatIdentity";
import IdentityGate from "./IdentityGate";
import ChatBubble from "./ChatBubble";

// Dev-mode flag: append `?dev=1` to the URL to reveal the [POSTMAN] trigger
// on the chat card. Disabled by default — it bypasses the identity gate
// and rate limits so you can fire the literal Postman body shape at the
// n8n webhook from inside the running site.
function isDevMode(): boolean {
  if (typeof window === "undefined") return false;
  const sp = new URLSearchParams(window.location.search);
  return sp.get("dev") === "1";
}

// Exact Postman body that worked against the n8n webhook when triggered
// by hand. The dev button fires this shape so the click is byte-for-byte
// equivalent to opening Postman.
const POSTMAN_BODY = {
  sessionId: "demo-session-42",
  chatInput:
    "Hi, I run a small logistics company and I keep hearing about AI automation but I don't really get what that means in practice. What does Anan actually build?",
  name: "",
  email: "",
  system: "",
  messages: [],
  context: { source: "postman-test", page: "/" },
} as const;

const SUGGESTED = [
  "What have you built?",
  "What's your stack?",
  "How much does it cost?",
  "Tell me about AnanOS",
  "How do you work?",
];

type Source = "openrouter" | "n8n" | "server-fallback" | "fallback" | null;

/**
 * Sprint-5 "Ask the system" chat.
 *
 *  - Mounted in the #chat section of DemoShell.
 *  - First visit shows IdentityGate (name → email). Once captured, the
 *    real chat is shown and persisted identity is reused on refresh.
 *  - Drives `ask()` from `lib/demo/aiClient.ts`, which POSTs to
 *    /api/chat (OpenRouter proxy) and logs every exchange to
 *    /api/chat-log. Falls back to a deterministic intent router if the
 *    server is offline.
 *  - Suggested-question chips for first-time users.
 *  - Identity-aware greeting ("Hi {firstName} …").
 */
export default function ChatPanel() {
  const reduced = useReducedMotion();
  const { openBookCall } = useBookCall();
  const [identity, setIdentity] = useState<ChatIdentity | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [lastSource, setLastSource] = useState<Source>(null);
  const [lastModel, setLastModel] = useState<string>("");
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const greetedRef = useRef(false);
  const [isDev, setIsDev] = useState<boolean>(false);
  const [postmanPending, setPostmanPending] = useState<boolean>(false);
  const [postmanStatus, setPostmanStatus] = useState<
    | { kind: "idle" }
    | { kind: "ok"; content: string; sent: unknown }
    | { kind: "err"; error: string; sent?: unknown }
  >({ kind: "idle" });

  // Hydrate identity from localStorage + dev flag from URL.
  useEffect(() => {
    setIdentity(loadIdentity());
    setIsDev(isDevMode());
  }, []);

  // Initial assistant greeting once identity is known.
  useEffect(() => {
    if (!identity || greetedRef.current) return;
    greetedRef.current = true;
    void ask(`hello ${firstName(identity.name)}`, [], identity).then((res) => {
      setMessages([res.message]);
      setLastSource(res.source);
      setLastModel(res.model || "");
    });
  }, [identity]);

  // Auto-scroll on new messages.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [messages, pending, reduced]);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || pending || !identity) return;
      setInput("");
      setPending(true);
      const userMsg = newUserMessage(q);
      const nextHistory = [...messages, userMsg];
      setMessages(nextHistory);
      try {
        const res = await ask(q, nextHistory, identity);
        setMessages((prev) => [...prev, res.message]);
        setLastSource(res.source);
        setLastModel(res.model || "");
      } finally {
        setPending(false);
        inputRef.current?.focus();
      }
    },
    [pending, identity, messages]
  );

  const handleQuickReply = useCallback(
    (reply: ChatQuickReply) => {
      if (pending) return;

      if (reply.kind === "answer") {
        void send(reply.value);
        return;
      }

      // A question from the assistant is a prompt for the visitor to answer,
      // not text that should be echoed back to the model. Focus the composer
      // and expose the question as context while they type their own response.
      setInput("");
      inputRef.current?.focus();
    },
    [pending, send]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input);
    }
  };

  // Dev-only: fire the literal Postman body at /api/chat-test. This is
  // byte-for-byte what the user verified works against the n8n webhook
  // when triggered by hand, so clicking this is equivalent to opening
  // Postman and clicking Send. The response (or error) is surfaced in
  // a small dev banner below the title bar — it does NOT enter the
  // normal chat history, so it can't pollute the user's real thread.
  const firePostman = useCallback(async () => {
    if (postmanPending) return;
    setPostmanPending(true);
    setPostmanStatus({ kind: "idle" });
    try {
      const r = await fetch("/api/chat-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(POSTMAN_BODY),
      });
      const json: unknown = await r.json().catch(() => null);
      if (r.ok && json && typeof json === "object" && (json as { ok?: unknown }).ok) {
        const obj = json as { content?: string; sent?: unknown };
        setPostmanStatus({
          kind: "ok",
          content: obj.content || "(empty response)",
          sent: obj.sent,
        });
      } else {
        let errMsg: string;
        if (json && typeof json === "object") {
          const e = (json as { error?: unknown }).error;
          errMsg = typeof e === "string" && e ? e : `HTTP ${r.status}`;
        } else {
          errMsg = `HTTP ${r.status}`;
        }
        setPostmanStatus({
          kind: "err",
          error: errMsg,
          sent:
            json && typeof json === "object"
              ? (json as { sent?: unknown }).sent
              : undefined,
        });
      }
    } catch (e) {
      setPostmanStatus({
        kind: "err",
        error: e instanceof Error ? e.message : String(e),
      });
    } finally {
      setPostmanPending(false);
    }
  }, [postmanPending]);

  return (
    <section
      id="chat"
      className="relative border-t border-blueprint-grid/15 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: motionTokens.dur.base, ease: motionTokens.ease }}
          className="mb-8 max-w-2xl"
        >
          <div className="mb-4 flex items-center gap-3 font-mono text-[11px] tracking-annotation text-blueprint-muted">
            <motion.span
              aria-hidden="true"
              initial={reduced ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: motionTokens.dur.base, ease: motionTokens.ease }}
              style={{ transformOrigin: "left center" }}
              className="h-px w-8 bg-blueprint-brass/70"
            />
            SECTION 04 — LIVE AI ASSISTANT
          </div>
          <h2 className="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">
            Ask the system
          </h2>
          <p className="mt-3 font-sans text-[15px] leading-relaxed text-blueprint-muted">
            {identity ? (
              <>
                Logged in as <span className="text-blueprint-paper">{identity.name}</span>{" "}
                (<span className="text-blueprint-brass/90">{identity.email}</span>). Each reply
                is captured server-side and logged per-client.{" "}
                <button
                  type="button"
                  onClick={() => {
                    clearIdentity();
                    setIdentity(null);
                    setMessages([]);
                    greetedRef.current = false;
                    setLastSource(null);
                    setLastModel("");
                  }}
                  className="underline decoration-blueprint-grid/40 underline-offset-2 hover:text-blueprint-brass"
                >
                  sign out
                </button>
                .
              </>
            ) : (
              <>
                Real chat surface that hits an n8n/OpenRouter proxy with your
                resume and the full projects set as context. We capture your
                name and email first so each conversation is logged per-client.
              </>
            )}
          </p>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_280px]">
          {/* Chat card OR IdentityGate */}
          {!identity ? (
            <IdentityGate onCaptured={(id) => setIdentity(id)} />
          ) : (
            <div className="relative flex h-[640px] flex-col border border-blueprint-grid/20 bg-blueprint-surface/40">
              {/* Title bar */}
              <div className="flex items-center justify-between border-b border-blueprint-grid/15 bg-blueprint-bg/40 px-4 py-2 font-mono text-[10px] tracking-annotation text-blueprint-muted">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blueprint-brass" />
                  <span>aa-chat.terminal</span>
                  <span className="text-blueprint-muted/50">·</span>
                  <span className="text-blueprint-muted/50">
                    {lastSource === "openrouter"
                      ? `via ${lastModel || "openrouter"}`
                      : lastSource === "n8n"
                      ? "via n8n chatbot"
                      : lastSource === "server-fallback"
                      ? "server offline (no upstream)"
                      : lastSource === "fallback"
                      ? "via local intent-router"
                      : "connecting…"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span>{messages.length} MSG</span>
                  <span className="text-blueprint-muted/50">·</span>
                  <span>{pending ? "TYPING…" : "IDLE"}</span>
                  <span className="text-blueprint-muted/50">·</span>
                  <span className="text-blueprint-paper">{firstName(identity.name)}</span>
                  {isDev && (
                    <>
                      <span className="text-blueprint-muted/50">·</span>
                      <button
                        type="button"
                        onClick={() => void firePostman()}
                        disabled={postmanPending}
                        title="Fire the literal Postman body at /api/chat-test (dev only)"
                        className="border border-amber-400/60 bg-amber-300/10 px-1.5 py-0.5 font-mono text-[9px] tracking-annotation text-amber-300 transition-colors hover:bg-amber-300/20 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {postmanPending ? "POSTING…" : "[ POSTMAN ]"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Dev-only Postman-mirror result banner. Sits above the
                  normal message list so it's visible without scrolling,
                  but never enters the chat history. */}
              {isDev && postmanStatus.kind !== "idle" && (
                <div
                  className={
                    "border-b px-4 py-2 font-mono text-[10px] tracking-annotation " +
                    (postmanStatus.kind === "ok"
                      ? "border-emerald-400/30 bg-emerald-400/5 text-emerald-200"
                      : "border-rose-400/30 bg-rose-400/5 text-rose-200")
                  }
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span className="font-bold">
                      {postmanStatus.kind === "ok" ? "POSTMAN OK" : "POSTMAN ERR"}
                    </span>
                    <span className="text-blueprint-muted/60">·</span>
                    <span className="text-blueprint-muted/60">
                      /api/chat-test → n8n
                    </span>
                    <button
                      type="button"
                      onClick={() => setPostmanStatus({ kind: "idle" })}
                      className="ml-auto text-blueprint-muted/60 hover:text-blueprint-paper"
                    >
                      ✕
                    </button>
                  </div>
                  {postmanStatus.kind === "ok" ? (
                    <div className="whitespace-pre-wrap break-words text-[11px] leading-relaxed text-blueprint-paper">
                      {postmanStatus.content}
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap break-words text-[11px] leading-relaxed">
                      {postmanStatus.error}
                    </div>
                  )}
                </div>
              )}

              {/* Message list */}
              <div
                ref={listRef}
                className="flex-1 space-y-4 overflow-y-auto px-4 py-4"
                style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(201,161,93,0.4) transparent" }}
              >
                {messages.map((m, i) => (
                  <ChatBubble
                    key={m.id}
                    message={m}
                    isLatest={i === messages.length - 1}
                    model={lastModel}
                    source={lastSource}
                    onQuickReply={handleQuickReply}
                    quickRepliesDisabled={pending}
                  />
                ))}

                <AnimatePresence>
                  {pending && (
                    <motion.div
                      key="pending"
                      initial={reduced ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: motionTokens.dur.fast, ease: motionTokens.ease }}
                      className="flex items-center gap-2 font-mono text-[10px] tracking-annotation text-blueprint-muted/70"
                    >
                      <span className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blueprint-brass/70 [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blueprint-brass/70 [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-blueprint-brass/70" />
                      </span>
                      FETCHING MODEL…
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Suggested chips */}
              {messages.length <= 1 && !pending && (
                <div className="flex flex-wrap items-center gap-2 border-t border-blueprint-grid/15 bg-blueprint-bg/30 px-4 py-3">
                  <span className="font-mono text-[10px] tracking-annotation text-blueprint-muted/60">
                    TRY →
                  </span>
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => void send(q)}
                      className="border border-blueprint-grid/25 bg-blueprint-surface/40 px-2 py-1 font-mono text-[10px] tracking-annotation text-blueprint-muted transition-colors hover:border-blueprint-brass/60 hover:text-blueprint-paper"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Composer */}
              <form
                onSubmit={onSubmit}
                className="flex items-end gap-2 border-t border-blueprint-grid/15 bg-blueprint-bg/40 px-3 py-3"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  rows={1}
                  placeholder={
                    messages[messages.length - 1]?.role === "assistant" &&
                    messages[messages.length - 1]?.quickReplies?.some(
                      (reply) => reply.kind === "question"
                    )
                      ? "Type your answer here…"
                      : "Ask about projects, stack, timeline, pricing, or how to work together…"
                  }
                  className="min-h-[40px] flex-1 resize-none border border-blueprint-grid/20 bg-blueprint-surface/50 px-3 py-2 font-mono text-[12px] leading-snug text-blueprint-paper placeholder:text-blueprint-muted/50 focus:border-blueprint-brass/60 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={pending || !input.trim()}
                  className="h-[40px] border border-blueprint-brass/50 bg-blueprint-brass/15 px-4 font-mono text-[11px] tracking-annotation text-blueprint-brass transition-colors hover:bg-blueprint-brass/25 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  SEND →
                </button>
              </form>
            </div>
          )}

          {/* Side panel */}
          <aside className="flex flex-col gap-3">
            <div className="border border-blueprint-grid/20 bg-blueprint-surface/40 p-4">
              <div className="mb-2 font-mono text-[10px] tracking-annotation text-blueprint-muted/70">
                CLIENT
              </div>
              {identity ? (
                <div className="font-mono text-[11px] text-blueprint-paper">
                  <div className="truncate">{identity.name}</div>
                  <div className="truncate text-blueprint-brass/90">{identity.email}</div>
                </div>
              ) : (
                <div className="font-sans text-[12px] text-blueprint-muted/70">
                  Awaiting identity capture.
                </div>
              )}
            </div>

            <div className="border border-blueprint-grid/20 bg-blueprint-surface/40 p-4">
              <div className="mb-2 font-mono text-[10px] tracking-annotation text-blueprint-muted/70">
                ENDPOINT
              </div>
              <div className="font-mono text-[11px] text-blueprint-paper">
                <div className="text-blueprint-brass/90">POST /api/chat</div>
                <div className="mt-1 text-blueprint-muted/70">n8n chatbot → OpenRouter fallback</div>
              </div>
            </div>

            <div className="border border-blueprint-grid/20 bg-blueprint-surface/40 p-4">
              <div className="mb-2 font-mono text-[10px] tracking-annotation text-blueprint-muted/70">
                LOG
              </div>
              <p className="font-sans text-[12px] leading-relaxed text-blueprint-muted">
                Every question and answer is appended to{" "}
                <span className="font-mono text-blueprint-paper">data/chat-log.ndjson</span>{" "}
                with your name, email, timestamp, model, and intent — so Anan
                has a real per-client transcript.
              </p>
            </div>

            <button
              type="button"
              onClick={openBookCall}
              className="border border-blueprint-brass/50 bg-blueprint-brass/15 px-4 py-3 font-mono text-[11px] tracking-annotation text-blueprint-brass transition-colors hover:bg-blueprint-brass/25"
            >
              BOOK A CALL →
            </button>
          </aside>
        </div>
      </div>
    </section>
  );
}
