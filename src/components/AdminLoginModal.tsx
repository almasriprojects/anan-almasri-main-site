import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const OTP_WEBHOOK_URL =
  (import.meta as any).env?.VITE_ADMIN_OTP_WEBHOOK_URL ??
  "https://n8n.ananalmasri.com/webhook/admin-login";

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminLoginModal({ isOpen, onClose }: AdminLoginModalProps) {
  const [step, setStep] = useState<"request" | "verify">("request");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function normalizeN8nResponse(raw: any) {
    if (Array.isArray(raw) && raw.length > 0) {
      const firstItem = raw[0];
      return firstItem?.json ?? firstItem;
    }
    if (raw?.json) {
      return raw.json;
    }
    return raw;
  }

  async function requestOtp() {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(OTP_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "request_code" }),
      });

      const rawData = await response.json();
      const data = normalizeN8nResponse(rawData);

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message ?? "Unable to request OTP. Please try again.");
      }

      setStep("verify");
      setMessage(data?.message ?? "OTP sent to Telegram. Enter the code below.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp() {
    if (!otp.trim()) {
      setError("Please enter the code you received.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(OTP_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_code", code: otp.trim() }),
      });

      const rawData = await response.json();
      const data = normalizeN8nResponse(rawData);

      if (!response.ok || data?.success !== true) {
        throw new Error(data?.message ?? "Invalid code. Please try again.");
      }

      onClose();
      window.location.href = "/dashboard";
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/45 px-4 py-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-xl rounded-[1.25rem] border border-blueprint-grid/20 bg-blueprint-surface p-8 shadow-2xl shadow-black/20 z-[10000]"
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.34em] text-blueprint-brass/90">
                  Admin Login
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-blueprint-paper">
                  Secure access
                </h2>
              </div>
              <button
                className="text-blueprint-paper/80 transition hover:text-blueprint-paper"
                onClick={onClose}
                aria-label="Close admin login"
                type="button"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <p className="text-sm leading-6 text-blueprint-muted">
                Request a one-time code via Telegram, then enter it below to continue.
              </p>
              {message && (
                <div className="rounded-2xl border border-blueprint-grid/20 bg-blueprint-bg p-4 text-sm text-blueprint-paper">
                  {message}
                </div>
              )}
              {error && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200">
                  {error}
                </div>
              )}

              {step === "request" ? (
                <button
                  type="button"
                  onClick={requestOtp}
                  disabled={loading}
                  className="w-full rounded-2xl bg-blueprint-brass px-6 py-3 text-sm font-semibold text-blueprint-bg transition hover:bg-blueprint-brass/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Requesting code..." : "Request OTP"}
                </button>
              ) : (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    verifyOtp();
                  }}
                  className="space-y-4"
                >
                  <label className="block text-sm text-blueprint-paper">
                    One-time code
                    <input
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                      className="mt-2 w-full rounded-2xl border border-blueprint-grid/20 bg-blueprint-bg px-4 py-3 text-sm text-blueprint-paper outline-none transition focus:border-blueprint-brass"
                      placeholder="Enter 6-digit code"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                    />
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 rounded-2xl bg-blueprint-brass px-6 py-3 text-sm font-semibold text-blueprint-bg transition hover:bg-blueprint-brass/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Verifying..." : "Verify code"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep("request")}
                      disabled={loading}
                      className="flex-1 rounded-2xl border border-blueprint-grid/20 bg-transparent px-6 py-3 text-sm font-semibold text-blueprint-paper transition hover:border-blueprint-brass"
                    >
                      Request again
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
