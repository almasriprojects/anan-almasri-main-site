import { type FormEvent } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock, Check, Loader2 } from "lucide-react";
import type { FormData } from "./types.ts";

// ---------------------------------------------------------------------------
// Shared input class
// ---------------------------------------------------------------------------

export function inputClass(error?: string): string {
  const base =
    "mt-1 w-full rounded border bg-blueprint-bg px-3 py-2.5 font-sans text-sm text-blueprint-paper placeholder:text-blueprint-muted/40 outline-none transition-colors";
  const border = error
    ? "border-red-400/60 focus:border-red-400"
    : "border-blueprint-grid/30 focus:border-blueprint-brass";
  return `${base} ${border}`;
}

// ---------------------------------------------------------------------------
// Field wrapper
// ---------------------------------------------------------------------------

export function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] tracking-annotation text-blueprint-muted">
        {label}
        {required && <span className="text-blueprint-brass ml-0.5">*</span>}
      </span>
      {children}
      {error && (
        <p className="mt-0.5 font-mono text-[10px] text-red-400/80">{error}</p>
      )}
    </label>
  );
}

// ---------------------------------------------------------------------------
// Step 1: Calendar + Time Slots
// ---------------------------------------------------------------------------

export function Step1({
  reduced,
  form,
  update,
  errors,
  onNext,
}: {
  reduced: boolean;
  form: FormData;
  update: (f: string | number | symbol, v: string) => void;
  errors: Partial<Record<string | number | symbol, string>>;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduced ? undefined : { opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="font-mono text-lg font-semibold text-blueprint-paper mb-1">
        Select a Date &amp; Time
      </h3>
      <p className="font-sans text-sm text-blueprint-muted mb-6">
        30-minute consultation — weekdays, 9 AM – 5 PM EST.
      </p>

      {/* Date */}
      <label className="block font-mono text-[11px] tracking-annotation text-blueprint-muted mb-2">
        DATE
      </label>
      <div className="relative">
        <Calendar
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-blueprint-muted/60 pointer-events-none"
        />
        <input
          type="date"
          value={form.date}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => update("date", e.target.value)}
          className={`w-full rounded border bg-blueprint-bg px-4 py-2.5 pl-10 font-mono text-sm text-blueprint-paper outline-none transition-colors ${
            errors.date
              ? "border-red-400/60"
              : "border-blueprint-grid/30 focus:border-blueprint-brass"
          }`}
        />
      </div>
      {errors.date && (
        <p className="mt-1 font-mono text-[10px] text-red-400/80">{errors.date}</p>
      )}

      {/* Time slots */}
      <label className="mt-5 block font-mono text-[11px] tracking-annotation text-blueprint-muted mb-2">
        TIME SLOT
      </label>
      <div className="grid grid-cols-3 gap-2">
        {TIME_SLOTS.map((slot) => {
          const disabled = !form.date || isSlotInPast(form.date, slot);
          const selected = form.timeSlot === slot;
          return (
            <button
              key={slot}
              type="button"
              disabled={disabled}
              onClick={() => update("timeSlot", slot)}
              className={`rounded border px-2 py-2 font-mono text-[11px] transition-colors ${
                disabled
                  ? "border-blueprint-grid/10 text-blueprint-muted/30 cursor-not-allowed"
                  : selected
                  ? "border-blueprint-brass bg-blueprint-brass/10 text-blueprint-brass"
                  : "border-blueprint-grid/25 text-blueprint-muted hover:border-blueprint-brass/50 hover:text-blueprint-paper"
              }`}
            >
              <Clock size={10} className="inline mr-1 opacity-60" />
              {slot}
            </button>
          );
        })}
      </div>
      {errors.timeSlot && (
        <p className="mt-1 font-mono text-[10px] text-red-400/80">{errors.timeSlot}</p>
      )}

      {/* Next */}
      <div className="mt-7">
        <button
          type="button"
          onClick={onNext}
          className="group inline-flex w-full items-center justify-center gap-2 bg-blueprint-brass px-6 py-3 font-mono text-sm tracking-annotation text-blueprint-bg transition-all duration-200 hover:bg-[#d8b06a]"
        >
          Next: Your Details
          <ArrowRight
            size={16}
            className="transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Step 2: Intake Form
// ---------------------------------------------------------------------------

export function Step2({
  reduced,
  form,
  update,
  errors,
  submitError,
  isSubmitting,
  onBack,
  onSubmit,
}: {
  reduced: boolean;
  form: FormData;
  update: (f: string | number | symbol, v: string) => void;
  errors: Partial<Record<string | number | symbol, string>>;
  submitError: string;
  isSubmitting: boolean;
  onBack: () => void;
  onSubmit: (e: FormEvent) => void;
}) {
  return (
    <motion.form
      onSubmit={onSubmit}
      initial={reduced ? false : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={reduced ? undefined : { opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="font-mono text-lg font-semibold text-blueprint-paper mb-1">
        Your Details
      </h3>
      <p className="font-sans text-sm text-blueprint-muted mb-6">
        Tell me a bit about your project so I come prepared.
      </p>

      {/* Selected slot chip */}
      {form.date && form.timeSlot && (
        <div className="mb-5 inline-flex items-center gap-2 rounded border border-blueprint-brass/40 bg-blueprint-brass/5 px-3 py-1.5 font-mono text-[11px] text-blueprint-brass">
          <Calendar size={12} />
          {form.date} · {form.timeSlot}
        </div>
      )}

      <div className="space-y-4">
        <Field label="NAME" error={errors.name} required>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Jane Doe"
            className={inputClass(errors.name)}
          />
        </Field>

        <Field label="EMAIL" error={errors.email} required>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="jane@example.com"
            className={inputClass(errors.email)}
          />
        </Field>

        <Field label="COMPANY">
          <input
            type="text"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Acme Corp (optional)"
            className={inputClass()}
          />
        </Field>

        <Field label="PROJECT TYPE">
          <select
            value={form.projectType}
            onChange={(e) => update("projectType", e.target.value)}
            className={inputClass()}
          >
            <option value="">Select one (optional)</option>
            <option value="n8n-workflow">n8n Workflow</option>
            <option value="ai-agent">AI Agent</option>
            <option value="full-stack">Full-Stack App</option>
            <option value="consulting">Consulting / Strategy</option>
            <option value="other">Other</option>
          </select>
        </Field>

        <Field label="MESSAGE">
          <textarea
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            rows={3}
            placeholder="Tell me about your idea, stack, or problem..."
            className={`${inputClass()} resize-none`}
          />
        </Field>
      </div>

      {submitError && (
        <p className="mt-4 rounded border border-red-400/30 bg-red-400/5 px-3 py-2 font-mono text-[11px] text-red-400/90">
          {submitError}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 border border-blueprint-grid/30 px-5 py-3 font-mono text-sm tracking-annotation text-blueprint-muted transition-colors hover:border-blueprint-paper/50 hover:text-blueprint-paper"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex flex-1 items-center justify-center gap-2 bg-blueprint-brass px-6 py-3 font-mono text-sm tracking-annotation text-blueprint-bg transition-all duration-200 hover:bg-[#d8b06a] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Book Consultation
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </>
          )}
        </button>
      </div>
    </motion.form>
  );
}

// ---------------------------------------------------------------------------
// Step 3: Confirmation
// ---------------------------------------------------------------------------

export function Step3({
  reduced,
  form,
  onClose,
}: {
  reduced: boolean;
  form: FormData;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="text-center"
    >
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-blueprint-brass/40 bg-blueprint-brass/10">
        <Check size={24} className="text-blueprint-brass" />
      </div>

      <h3 className="font-mono text-xl font-semibold text-blueprint-paper">
        Consultation Booked
      </h3>

      <p className="mt-3 font-sans text-sm text-blueprint-muted leading-relaxed">
        Thanks{form.name ? `, ${form.name.split(" ")[0]}` : ""}! I'll review your
        request and confirm via email.
      </p>

      {form.date && form.timeSlot && (
        <div className="mt-4 inline-flex items-center gap-2 rounded border border-blueprint-grid/20 bg-blueprint-bg px-4 py-2 font-mono text-sm text-blueprint-brass">
          <Calendar size={14} />
          {form.date} at {form.timeSlot}
        </div>
      )}

      <div className="mt-7">
        <button
          type="button"
          onClick={onClose}
          className="bg-blueprint-brass px-7 py-3 font-mono text-sm tracking-annotation text-blueprint-bg transition-all duration-200 hover:bg-[#d8b06a]"
        >
          Close
        </button>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Time slot helpers
// ---------------------------------------------------------------------------

function generateTimeSlots(): string[] {
  const slots: string[] = [];
  for (let h = 9; h < 17; h++) {
    for (const m of [0, 30]) {
      if (h === 16 && m === 30) break;
      const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
      const ampm = h >= 12 ? "PM" : "AM";
      const label = `${hour12}:${String(m).padStart(2, "0")} ${ampm} EST`;
      slots.push(label);
    }
  }
  return slots;
}

const TIME_SLOTS = generateTimeSlots();

function isSlotInPast(date: string, slot: string): boolean {
  if (!date) return false;
  const today = new Date().toISOString().split("T")[0];
  if (date > today) return false;
  if (date < today) return true;

  const now = new Date();
  const match = slot.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return false;
  let hour = parseInt(match[1], 10);
  const min = parseInt(match[2], 10);
  const ampm = match[3].toUpperCase();
  if (ampm === "PM" && hour !== 12) hour += 12;
  if (ampm === "AM" && hour === 12) hour = 0;

  const slotDate = new Date(date);
  slotDate.setHours(hour, min, 0, 0);
  return slotDate <= now;
}
