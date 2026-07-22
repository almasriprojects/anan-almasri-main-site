import { useEffect, useState } from "react";

/**
 * Looping typewriter. Cycles through a list of strings, typing each one
 * in and then deleting it before moving on. Used by the TerminalBlock.
 *
 * Respects prefers-reduced-motion (returns the first string immediately).
 */
export function useTypewriter(
  lines: string[],
  opts: { typeMs?: number; holdMs?: number; deleteMs?: number } = {}
) {
  const { typeMs = 38, holdMs = 1400, deleteMs = 22 } = opts;
  const [text, setText] = useState("");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    if (reduced) {
      setText(lines[0] ?? "");
      return;
    }
    let i = 0; // line index
    let j = 0; // char index
    let mode: "type" | "hold" | "delete" = "type";
    let timer: number | undefined;

    const tick = () => {
      const line = lines[i % lines.length];
      if (mode === "type") {
        j++;
        setText(line.slice(0, j));
        if (j >= line.length) {
          mode = "hold";
          timer = window.setTimeout(tick, holdMs);
          return;
        }
        timer = window.setTimeout(tick, typeMs);
      } else if (mode === "hold") {
        mode = "delete";
        timer = window.setTimeout(tick, deleteMs);
      } else {
        j--;
        setText(line.slice(0, Math.max(0, j)));
        if (j <= 0) {
          i++;
          mode = "type";
          timer = window.setTimeout(tick, typeMs);
          return;
        }
        timer = window.setTimeout(tick, deleteMs);
      }
    };
    timer = window.setTimeout(tick, typeMs);
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [reduced, lines, typeMs, holdMs, deleteMs]);

  return text;
}
