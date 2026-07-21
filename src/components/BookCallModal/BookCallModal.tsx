import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { Step1, Step2, Step3 } from "./steps";
import { INITIAL_FORM, WEBHOOK_URL, type FormData } from "./types.ts";

// ---------------------------------------------------------------------------
// Validation helpers
// ---------------------------------------------------------------------------

function validateStep1(form: FormData) {
  const errors: Partial<Record<keyof FormData, string>> = {};
  if (!form.date) errors.date = "Please select a date";
  if (!form.timeSlot) errors.timeSlot = "Please select a time slot";
  return errors;
}

function validateStep2(form: FormData) {
  const errors: Partial<Record<keyof FormData, string>> = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address";
  return errors;
}

// ---------------------------------------------------------------------------
// Main Modal
// ---------------------------------------------------------------------------

export default function BookCallModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<string | number | symbol, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  function update(field: string | number | symbol, value: string) {
    setForm((prev) => ({ ...prev, [field as keyof FormData]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function handleNext() {
    const v = validateStep1(form);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setErrors({});
    setStep(2);
  }

  function handleBack() {
    setStep(1);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const v = validateStep2(form);
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        ...form,
        timestamp: new Date().toISOString(),
      };
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Something went wrong. Please try again.");
      setStep(3);
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    setStep(1);
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitError("");
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-blueprint-bg/85 backdrop-blur-sm p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
          }}
        >
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-lg rounded border border-blueprint-grid/30 bg-blueprint-surface bp-grid-fine p-6 shadow-xl overflow-hidden"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 text-blueprint-muted/60 transition-colors hover:text-blueprint-paper"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            {/* Step indicator */}
            <div className="mb-6 flex items-center gap-1.5">
              {[1, 2, 3].map((s) => (
                <span
                  key={s}
                  className={`h-1 flex-1 rounded transition-colors ${
                    s <= step ? "bg-blueprint-brass" : "bg-blueprint-grid/20"
                  }`}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && (
                <Step1
                  key="step1"
                  reduced={reduced}
                  form={form}
                  update={update}
                  errors={errors}
                  onNext={handleNext}
                />
              )}
              {step === 2 && (
                <Step2
                  key="step2"
                  reduced={reduced}
                  form={form}
                  update={update}
                  errors={errors}
                  submitError={submitError}
                  isSubmitting={isSubmitting}
                  onBack={handleBack}
                  onSubmit={handleSubmit}
                />
              )}
              {step === 3 && (
                <Step3
                  key="step3"
                  reduced={reduced}
                  form={form}
                  onClose={handleClose}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}