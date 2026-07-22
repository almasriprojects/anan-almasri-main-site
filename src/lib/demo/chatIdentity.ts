/**
 * Identity gate for the demo chat.
 *
 *  - Captures `{ name, email, capturedAt }` before the user can send a
 *    message. Stored in localStorage so refresh doesn't re-prompt.
 *  - Email is validated client-side; the server re-validates anyway.
 *  - Provides a `firstName` derivation for the greeting.
 */

const KEY = "aa-chat-identity";

export type ChatIdentity = {
  name: string;
  email: string;
  capturedAt: number;
};

const NAME_RE = /^[a-zA-Z\u0600-\u06FF .'-]{2,60}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidName(name: string): boolean {
  return NAME_RE.test(name.trim());
}

export function isValidEmail(email: string): boolean {
  return EMAIL_RE.test(email.trim().toLowerCase());
}

export function loadIdentity(): ChatIdentity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ChatIdentity;
    if (
      parsed &&
      typeof parsed.name === "string" &&
      isValidName(parsed.name) &&
      typeof parsed.email === "string" &&
      isValidEmail(parsed.email)
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveIdentity(name: string, email: string): ChatIdentity {
  const identity: ChatIdentity = {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    capturedAt: Date.now(),
  };
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(identity));
  }
  return identity;
}

export function clearIdentity() {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(KEY);
  }
}

export function firstName(full: string): string {
  const trimmed = full.trim();
  if (!trimmed) return "there";
  // Arabic or Latin first token.
  const parts = trimmed.split(/\s+/);
  return parts[0] ?? "there";
}
