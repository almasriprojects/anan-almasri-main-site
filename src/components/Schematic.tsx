import { motion } from "framer-motion";
import { useReducedMotion } from "../hooks/useReducedMotion";

/**
 * n8n-style automation workflow schematic.
 * Lines draw in sequence via stroke-dasharray; nodes fade in as their
 * connecting line completes; a few measurement-style annotations appear.
 * One orchestrated ~2.6s sequence on load. Respects reduced motion.
 */

type Node = {
  id: string;
  x: number;
  y: number;
  label: string;
  sub: string;
};

const nodes: Node[] = [
  { id: "webhook", x: 70, y: 90, label: "WEBHOOK", sub: "trigger" },
  { id: "router", x: 230, y: 90, label: "ROUTER", sub: "branch" },
  { id: "agent", x: 400, y: 50, label: "AI AGENT", sub: "llm" },
  { id: "supabase", x: 400, y: 150, label: "SUPABASE", sub: "db" },
  { id: "transform", x: 570, y: 50, label: "TRANSFORM", sub: "shape" },
  { id: "notify", x: 720, y: 100, label: "NOTIFY", sub: "slack" },
];

// edges as index pairs into nodes
const edges: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [2, 4],
  [4, 5],
  [3, 5],
];

const annotations = [
  { nodeIdx: 2, text: "τ ≈ 320ms", dx: 18, dy: -34 },
  { nodeIdx: 3, text: "pgvector", dx: 18, dy: 38 },
  { nodeIdx: 5, text: "async", dx: -86, dy: -28 },
];

export default function Schematic() {
  const reduced = useReducedMotion();

  const lineDuration = 0.5;
  const lineGap = 0.18;
  const nodeBase = 0.4; // first node appears after first line

  const edgeDelay = (i: number) => i * lineGap;
  const nodeDelay = (nodeId: string) => {
    // node appears after the latest edge that points to it completes
    const incoming = edges
      .map((e, i) => (nodes[e[1]].id === nodeId ? i : -1))
      .filter((i) => i >= 0);
    const last = incoming.length ? Math.max(...incoming) : 0;
    return nodeBase + last * lineGap + lineDuration * 0.6;
  };

  const pathFor = (a: Node, b: Node) => {
    // orthogonal "circuit" routing: horizontal then vertical then horizontal
    const midX = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`;
  };

  return (
    <div className="relative w-full">
      {/* Title-block style micro label */}
      <div className="mb-4 flex items-center justify-between font-mono text-[10px] tracking-annotation text-blueprint-muted/80">
        <span>FIG.01 — AUTOMATION FLOW</span>
        <span>SCALE 1:1</span>
      </div>

      <svg
        viewBox="0 0 800 220"
        className="w-full h-auto"
        fill="none"
        aria-label="Automation workflow schematic"
      >
        {/* faint reference grid inside schematic */}
        <defs>
          <pattern id="bp-fine" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#6E93B7"
              strokeOpacity="0.08"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect x="0" y="0" width="800" height="220" fill="url(#bp-fine)" />

        {/* border frame */}
        <rect
          x="8"
          y="8"
          width="784"
          height="204"
          stroke="#6E93B7"
          strokeOpacity="0.18"
          strokeWidth="1"
        />

        {/* edges */}
        {edges.map(([ai, bi], i) => {
          const a = nodes[ai];
          const b = nodes[bi];
          const d = pathFor(a, b);
          return (
            <motion.path
              key={`edge-${i}`}
              d={d}
              stroke="#6E93B7"
              strokeOpacity="0.55"
              strokeWidth="1.25"
              strokeLinecap="square"
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: reduced ? 0 : lineDuration,
                delay: reduced ? 0 : edgeDelay(i),
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* nodes */}
        {nodes.map((n) => (
          <motion.g
            key={n.id}
            initial={reduced ? false : { opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: reduced ? 0 : 0.35,
              delay: reduced ? 0 : nodeDelay(n.id),
              ease: "easeOut",
            }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            {/* node body */}
            <rect
              x={n.x - 34}
              y={n.y - 16}
              width="68"
              height="32"
              rx="3"
              fill="#16283F"
              stroke="#6E93B7"
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            {/* node port dots */}
            <circle cx={n.x - 34} cy={n.y} r="2" fill="#C9A15D" />
            <circle cx={n.x + 34} cy={n.y} r="2" fill="#C9A15D" />
            <text
              x={n.x}
              y={n.y - 1}
              textAnchor="middle"
              className="font-mono"
              fontSize="9"
              fill="#EDE8DC"
              letterSpacing="0.5"
            >
              {n.label}
            </text>
            <text
              x={n.x}
              y={n.y + 9}
              textAnchor="middle"
              className="font-mono"
              fontSize="7"
              fill="#9FB0C4"
            >
              {n.sub}
            </text>
          </motion.g>
        ))}

        {/* annotations */}
        {annotations.map((ann, i) => {
          const n = nodes[ann.nodeIdx];
          const ax = n.x + ann.dx;
          const ay = n.y + ann.dy;
          return (
            <motion.g
              key={`ann-${i}`}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reduced ? 0 : 0.4,
                delay: reduced ? 0 : nodeDelay(n.id) + 0.25,
              }}
            >
              {/* leader line */}
              <line
                x1={n.x}
                y1={n.y}
                x2={ax}
                y2={ay}
                stroke="#C9A15D"
                strokeOpacity="0.6"
                strokeWidth="0.75"
                strokeDasharray="2 2"
              />
              {/* tick */}
              <line
                x1={ax - 3}
                y1={ay}
                x2={ax + 3}
                y2={ay}
                stroke="#C9A15D"
                strokeWidth="1"
              />
              <text
                x={ann.dx > 0 ? ax + 6 : ax - 6}
                y={ay + 3}
                textAnchor={ann.dx > 0 ? "start" : "end"}
                className="font-mono"
                fontSize="8"
                fill="#C9A15D"
                letterSpacing="0.5"
              >
                {ann.text}
              </text>
            </motion.g>
          );
        })}
      </svg>

      <div className="mt-3 flex items-center justify-between font-mono text-[10px] tracking-annotation text-blueprint-muted/70">
        <span>REV 2025.01</span>
        <span>DRAWN BY: A.A.</span>
      </div>
    </div>
  );
}
