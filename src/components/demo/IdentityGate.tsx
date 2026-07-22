import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { motionTokens } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import {
  isValidEmail,
  isValidName,
  saveIdentity,
  type ChatIdentity,
} from "../../lib/demo/chatIdentity";

type Props = {
  onCaptured: (identity: ChatIdentity) => void;
};

/**
 * Two-step identity gate rendered in-place inside the chat card.
 *
 *  Step 1: Name (FIRST, WHO ARE YOU?)
 *  Step 2: Email (WHERE CAN WE REACH YOU?)
 *
 * Captured → onCaptured() fires once; the parent unmounts the gate
 * and shows the live chat. Identity is persisted to localStorage so
 * a refresh doesn't re-prompt.
 */
export default function IdentityGate({ onCaptured }: Props) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const submitName = (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    if (!isValidName(n)) {
      setError("Please enter a name (letters only, 2–60 chars).");
      return;
    }
    setError(null);
    setStep(2);
  };

  const submitEmail = (e: FormEvent) => {
    e.preventDefault();
    const em = email.trim().toLowerCase();
    if (!isValidEmail(em)) {
      setError("That email doesn't look right. Try again.");
      return;
    }
    setError(null);
    const identity = saveIdentity(name, em);
    onCaptured(identity);
  };

  return (
    <div className="relative flex h-[640px] flex-col border border-blueprint-grid/20 bg-blueprint-surface/40">
      {/* Title bar */}
      <div className="flex items-center justify-between border-b border-blueprint-grid/15 bg-blueprint-bg/40 px-4 py-2 font-mono text-[10px] tracking-annotation text-blueprint-muted">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blueprint-brass" />
          <span>aa-chat.identity-gate</span>
        </div>
        <div className="flex items-center gap-2">
          <span>STEP {step} / 2</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <AnimateStep keyProp={`step-${step}`}>
          {step === 1 ? (
            <form onSubmit={submitName} className="w-full max-w-md">
              <div className="mb-2 font-mono text-[10px] tracking-annotation text-blueprint-brass/80">
                FIRST, WHO ARE YOU?
              </div>
              <h3 className="mb-1 font-mono text-2xl font-bold text-blueprint-paper">
                Identify yourself.
              </h3>
              <p className="mb-6 font-sans text-[13px] leading-relaxed text-blueprint-muted">
                Your name and email let me keep a per-client transcript of our
                conversation. They're stored locally and only logged when you
                message.
              </p>

              <label className="mb-2 block font-mono text-[10px] tracking-annotation text-blueprint-muted/80">
                FULL NAME
              </label>
              <input
                type="text"
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anan Almasri"
                className="mb-4 w-full border border-blueprint-grid/25 bg-blueprint-bg/40 px-3 py-2 font-mono text-[14px] text-blueprint-paper placeholder:text-blueprint-muted/40 focus:border-blueprint-brass/60 focus:outline-none"
              />

              {error && (
                <div className="mb-3 border border-blueprint-brass/40 bg-blueprint-brass/10 px-3 py-2 font-mono text-[11px] text-blueprint-brass">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full border border-blueprint-brass/50 bg-blueprint-brass/15 px-4 py-3 font-mono text-[11px] tracking-annotation text-blueprint-brass transition-colors hover:bg-blueprint-brass/25"
              >
                NEXT →
              </button>
            </form>
          ) : (
            <form onSubmit={submitEmail} className="w-full max-w-md">
              <div className="mb-2 font-mono text-[10px] tracking-annotation text-blueprint-brass/80">
                WHERE CAN WE REACH YOU?
              </div>
              <h3 className="mb-1 font-mono text-2xl font-bold text-blueprint-paper">
                Hi {name.trim().split(/\s+/)[0] || "there"}.
              </h3>
              <p className="mb-6 font-sans text-[13px] leading-relaxed text-blueprint-muted">
                Drop an email so Anan can follow up if you decide to book a
                call. No newsletter, no marketing — just a single reply.
              </p>

              <label className="mb-2 block font-mono text-[10px] tracking-annotation text-blueprint-muted/80">
                EMAIL ADDRESS
              </label>
              <input
                type="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="mb-4 w-full border border-blueprint-grid/25 bg-blueprint-bg/40 px-3 py-2 font-mono text-[14px] text-blueprint-paper placeholder:text-blueprint-muted/40 focus:border-blueprint-brass/60 focus:outline-none"
              />

              {error && (
                <div className="mb-3 border border-blueprint-brass/40 bg-blueprint-brass/10 px-3 py-2 font-mono text-[11px] text-blueprint-brass">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setError(null);
                  }}
                  className="border border-blueprint-grid/25 bg-blueprint-surface/40 px-4 py-3 font-mono text-[11px] tracking-annotation text-blueprint-muted transition-colors hover:border-blueprint-brass/60 hover:text-blueprint-paper"
                >
                  ← BACK
                </button>
                <button
                  type="submit"
                  className="flex-1 border border-blueprint-brass/50 bg-blueprint-brass/15 px-4 py-3 font-mono text-[11px] tracking-annotation text-blueprint-brass transition-colors hover:bg-blueprint-brass/25"
                >
                  START CHAT →
                </button>
              </div>
            </form>
          )}
        </AnimateStep>
      </div>

      <div className="border-t border-blueprint-grid/15 bg-blueprint-bg/30 px-4 py-3 font-mono text-[10px] tracking-annotation text-blueprint-muted/60">
        Captured info is stored in your browser and logged per-conversation.
        You can wipe it by clearing site data.
      </div>
    </div>
  );

  function AnimateStep({ children, keyProp }: { children: React.ReactNode; keyProp: string }) {
    return (
      <motion.div
        key={keyProp}
        initial={reduced ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionTokens.dur.base, ease: motionTokens.ease }}
        className="w-full"
      >
        {children}
      </motion.div>
    );
  }
}
