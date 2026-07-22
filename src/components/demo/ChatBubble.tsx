import { motion } from "framer-motion";
import type { ChatMessage } from "../../lib/demo/fallback";
import { projects } from "../../data/projectsData";
import { motionTokens } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import type { ChatQuickReply } from "../../lib/demo/chatResponse";

type Source = "openrouter" | "n8n" | "server-fallback" | "fallback" | null;

type Props = {
  message: ChatMessage;
  isLatest: boolean;
  model?: string;
  source?: Source;
  onQuickReply?: (reply: ChatQuickReply) => void;
  quickRepliesDisabled?: boolean;
};

/**
 * Tiny, safe markdown renderer.
 * Supports: **bold**, blank-line paragraphs, "- item" bullet lists,
 * numbered "1. item" lists, and inline `code`. Everything else is plain text.
 *
 * The renderer is intentionally line-based so it works without a library.
 */
function renderMarkdown(input: string): React.ReactNode {
  const blocks = input.split(/\n{2,}/);
  return blocks.map((block, bi) => {
    const lines = block.split("\n");

    // Bullet list
    if (lines.every((l) => /^\s*[-*]\s+/.test(l))) {
      return (
        <ul key={bi} className="my-2 list-disc space-y-1 pl-5">
          {lines.map((l, li) => (
            <li key={li}>{renderInline(l.replace(/^\s*[-*]\s+/, ""))}</li>
          ))}
        </ul>
      );
    }
    // Numbered list
    if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      return (
        <ol key={bi} className="my-2 list-decimal space-y-1 pl-5">
          {lines.map((l, li) => (
            <li key={li}>{renderInline(l.replace(/^\s*\d+\.\s+/, ""))}</li>
          ))}
        </ol>
      );
    }
    return (
      <p key={bi} className="my-1.5 leading-relaxed">
        {renderInline(block)}
      </p>
    );
  });
}

function renderInline(text: string): React.ReactNode[] {
  // Tokenize on `**...**` and `\`...\`` (and leave everything else as text).
  const out: React.ReactNode[] = [];
  const re = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      out.push(
        <strong key={i++} className="font-semibold text-blueprint-paper">
          {tok.slice(2, -2)}
        </strong>
      );
    } else if (tok.startsWith("`")) {
      out.push(
        <code
          key={i++}
          className="rounded-sm border border-blueprint-grid/25 bg-blueprint-bg/60 px-1 py-0.5 font-mono text-[0.85em] text-blueprint-brass"
        >
          {tok.slice(1, -1)}
        </code>
      );
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

/**
 * Single message bubble.
 *  - User: right-aligned, brass-tinted, mono.
 *  - Assistant: left-aligned, paper text, with a small "USED IN" pills row
 *    when the message references specific project sheets.
 */
export default function ChatBubble({
  message,
  isLatest,
  model,
  source,
  onQuickReply,
  quickRepliesDisabled = false,
}: Props) {
  const reduced = useReducedMotion();
  const isUser = message.role === "user";
  const modelShort = model ? model.split("/").pop() || model : "";
  const sourceLabel =
    source === "openrouter"
      ? modelShort || "openrouter"
      : source === "n8n"
      ? "n8n chatbot"
      : source === "server-fallback"
      ? "server-fallback"
      : source === "fallback"
      ? "local-router"
      : "";
  const sourceTitle =
    source === "openrouter"
      ? "Live OpenRouter model response"
      : source === "n8n"
      ? "Live n8n chatbot workflow"
      : source === "server-fallback"
      ? "Server fallback (no upstream reachable)"
      : source === "fallback"
      ? "Local deterministic fallback"
      : "";

  const sheetRefs = (message.projectRefs ?? [])
    .map((no) => projects.find((p) => p.sheetNo === no))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionTokens.dur.fast, ease: motionTokens.ease }}
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`max-w-[88%] ${isUser ? "text-right" : "text-left"}`}>
        <div
          className={`inline-block rounded-md border px-3 py-2 text-[13px] leading-relaxed ${
            isUser
              ? "border-blueprint-brass/40 bg-blueprint-brass/10 font-mono text-blueprint-paper"
              : "border-blueprint-grid/20 bg-blueprint-surface/70 text-blueprint-paper"
          }`}
        >
          {isUser ? (
            <span className="whitespace-pre-wrap">{message.text}</span>
          ) : (
            <div>{renderMarkdown(message.text)}</div>
          )}
        </div>

        {/* Meta row */}
        <div
          className={`mt-1 flex items-center gap-2 font-mono text-[10px] tracking-annotation text-blueprint-muted/60 ${
            isUser ? "justify-end" : "justify-start"
          }`}
        >
          <span>{isUser ? "USER" : "ASSISTANT"}</span>
          {!isUser && sourceLabel && (
            <>
              <span>·</span>
              <span
                className={
                  source === "openrouter" || source === "n8n"
                    ? "text-blueprint-brass/90"
                    : "text-blueprint-muted/70"
                }
                title={sourceTitle || undefined}
              >
                {sourceLabel}
              </span>
            </>
          )}
          <span>·</span>
          <span>{formatTime(message.ts)}</span>
          {!isUser && isLatest && (
            <>
              <span>·</span>
              <span className="text-blueprint-brass/80">●</span>
            </>
          )}
        </div>

        {/* Project refs */}
        {!isUser && sheetRefs.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <span className="font-mono text-[9px] tracking-annotation text-blueprint-muted/60">
              USED IN →
            </span>
            {sheetRefs.map((p) => (
              <a
                key={p.sheetNo}
                href={`#sheet-${p.sheetNo}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(`sheet-${p.sheetNo}`);
                  target?.scrollIntoView({ behavior: "smooth", block: "center" });
                }}
                className="border border-blueprint-grid/30 bg-blueprint-bg/40 px-2 py-0.5 font-mono text-[10px] tracking-annotation text-blueprint-muted transition-colors hover:border-blueprint-brass/60 hover:text-blueprint-brass"
              >
                {p.sheetNo} · {p.title}
              </a>
            ))}
          </div>
        )}

        {/* Contextual quick replies only belong to the current assistant turn. */}
        {!isUser &&
          isLatest &&
          onQuickReply &&
          message.quickReplies &&
          message.quickReplies.length > 0 && (
            <div className="mt-3" aria-label="Suggested replies">
              <div className="mb-1.5 font-mono text-[9px] tracking-annotation text-blueprint-muted/60">
                {message.quickReplies.some((reply) => reply.kind === "answer")
                  ? "CHOOSE A REPLY →"
                  : "ANSWER THIS →"}
              </div>
              <div className="flex flex-wrap gap-2">
                {message.quickReplies.map((reply, index) => (
                  <button
                    key={`${reply.kind}-${reply.value}-${index}`}
                    type="button"
                    onClick={() => onQuickReply(reply)}
                    disabled={quickRepliesDisabled}
                    aria-label={
                      reply.kind === "answer"
                        ? `Send answer: ${reply.label}`
                        : `Answer question: ${reply.label}`
                    }
                    className="min-h-[44px] max-w-full touch-manipulation whitespace-normal border border-blueprint-brass/45 bg-blueprint-brass/10 px-3 py-2 text-left font-mono text-[11px] leading-relaxed text-blueprint-paper transition-colors duration-200 hover:border-blueprint-brass hover:bg-blueprint-brass/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blueprint-brass focus-visible:ring-offset-2 focus-visible:ring-offset-blueprint-bg disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {reply.label}
                    <span aria-hidden="true" className="ml-1.5 text-blueprint-brass">
                      {reply.kind === "answer" ? "→" : "↳"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
      </div>
    </motion.div>
  );
}
