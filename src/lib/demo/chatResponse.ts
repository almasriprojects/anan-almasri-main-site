/**
 * Normalizes chat transport payloads and derives optional quick replies.
 *
 * n8n workflows can return plain text, JSON, arrays of node results, or even
 * JSON encoded inside a string. The browser should only ever render the
 * assistant's actual message, never the transport envelope.
 */

export type ChatQuickReply = {
  label: string;
  value: string;
  kind: "answer" | "question";
};

const TEXT_KEYS = [
  "content",
  "output",
  "text",
  "message",
  "reply",
  "answer",
] as const;

const WRAPPER_KEYS = ["data", "body", "result", "response"] as const;
const MAX_UNWRAP_DEPTH = 6;
const MAX_QUICK_REPLIES = 5;

function extractText(value: unknown, depth = 0): string {
  if (depth > MAX_UNWRAP_DEPTH || value == null) return "";

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    // A workflow may JSON-stringify its response once (or more) before the
    // webhook sends it. Decode that safely, but retain genuine plain text.
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (typeof parsed === "string") {
        return extractText(parsed, depth + 1) || parsed.trim();
      }
      if (parsed && typeof parsed === "object") {
        return extractText(parsed, depth + 1);
      }
    } catch {
      // Not JSON: this is already displayable assistant text.
    }

    return trimmed;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const candidate = extractText(item, depth + 1);
      if (candidate) return candidate;
    }
    return "";
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>;

    for (const key of TEXT_KEYS) {
      if (!(key in record)) continue;
      const candidate = extractText(record[key], depth + 1);
      if (candidate) return candidate;
    }

    for (const key of WRAPPER_KEYS) {
      if (!(key in record)) continue;
      const candidate = extractText(record[key], depth + 1);
      if (candidate) return candidate;
    }
  }

  return "";
}

/** Returns only user-facing assistant text from a possibly wrapped payload. */
export function normalizeAssistantContent(value: unknown): string {
  return extractText(value).trim();
}

type LocatedQuestion = {
  text: string;
  start: number;
  end: number;
};

function cleanQuestion(value: string): string {
  return value
    .trim()
    .replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "")
    .replace(/^\*\*(.+)\*\*$/, "$1")
    .trim();
}

function findLastQuestion(text: string): LocatedQuestion | null {
  // Keep this intentionally conservative: only text ending in an English or
  // Arabic question mark is considered a follow-up.
  const questionPattern = /[^.!?\n\r؟]+[?؟]/g;
  let match: RegExpExecArray | null;
  let latest: LocatedQuestion | null = null;

  while ((match = questionPattern.exec(text))) {
    const cleaned = cleanQuestion(match[0]);
    if (cleaned.length < 4 || cleaned.length > 240) continue;
    latest = {
      text: cleaned,
      start: match.index,
      end: match.index + match[0].length,
    };
  }

  return latest;
}

function cleanOption(value: string): string {
  return value
    .trim()
    .replace(/^\s*(?:[-*•]|\d+[.)])\s+/, "")
    .replace(/^["'“”‘’`]+|["'“”‘’`]+$/g, "")
    .replace(/[.?!؟:：;؛،,]+$/g, "")
    .trim();
}

function splitOptions(raw: string): string[] {
  const normalized = raw
    .replace(/\s+(?:or|and|أو)\s+/gi, ",")
    .replace(/\s+\/\s+/g, ",");

  const unique = new Set<string>();
  const options: string[] = [];

  for (const item of normalized.split(/[,،;؛|]/)) {
    const option = cleanOption(item);
    if (option.length < 2 || option.length > 80) continue;
    const key = option.toLocaleLowerCase();
    if (unique.has(key)) continue;
    unique.add(key);
    options.push(option);
    if (options.length === MAX_QUICK_REPLIES) break;
  }

  return options.length >= 2 ? options : [];
}

function extractSuggestedOptions(text: string, question: LocatedQuestion): string[] {
  // Include text after the question because models often write:
  // "What is most manual? (e.g., dispatch, inventory, or invoicing)"
  const nearby = text.slice(
    Math.max(0, question.start - 120),
    Math.min(text.length, question.end + 420)
  );

  const examples = nearby.match(
    /(?:e\.?\s*g\.?|for example|for instance|options?|choices?|مثلًا|مثلاً|على سبيل المثال)\s*[:,：،-]?\s*([^)\]\n\r]+)/i
  );
  if (examples?.[1]) {
    const parsed = splitOptions(examples[1]);
    if (parsed.length) return parsed;
  }

  // Also support explicit bullet/number choices immediately after a question.
  const afterQuestion = text.slice(question.end, question.end + 500);
  const listed = afterQuestion
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.+)$/)?.[1] || "")
    .map(cleanOption)
    .filter((option) => option.length >= 2 && option.length <= 80)
    .slice(0, MAX_QUICK_REPLIES);
  if (listed.length >= 2) return Array.from(new Set(listed));

  // Finally support a compact question such as "Which area: CRM, HR, or finance?"
  const colon = question.text.lastIndexOf(":");
  if (colon !== -1) {
    return splitOptions(question.text.slice(colon + 1).replace(/[?؟]$/, ""));
  }

  return [];
}

/**
 * Builds answer chips when choices are present. Otherwise, the assistant's
 * final question becomes one clickable continuation chip.
 */
export function deriveQuickReplies(text: string): ChatQuickReply[] {
  const question = findLastQuestion(text);
  if (!question) return [];

  const options = extractSuggestedOptions(text, question);
  if (options.length) {
    return options.map((option) => ({
      label: option,
      value: option,
      kind: "answer" as const,
    }));
  }

  return [
    {
      label: question.text,
      value: question.text,
      kind: "question",
    },
  ];
}
