import { useMemo, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  edges,
  nodes,
  type ServiceEdge,
  type ServiceNode as SNode,
} from "../../data/systemDiagramData";
import { motionTokens } from "../../lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import ServiceNodeView from "./ServiceNode";
import FlowParticle from "./FlowParticle";
import NodeSidePanel from "./NodeSidePanel";

const VIEW_W = 1200;
const VIEW_H = 480;

// Orthogonal routing: horizontal then vertical then horizontal.
function pathFor(a: SNode, b: SNode): { x: number; y: number }[] {
  const ax = a.x + 55;
  const ay = a.y;
  const bx = b.x - 55;
  const by = b.y;
  const midX = (ax + bx) / 2;
  return [
    { x: ax, y: ay },
    { x: midX, y: ay },
    { x: midX, y: by },
    { x: bx, y: by },
  ];
}

function pointsToLength(points: { x: number; y: number }[]) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(
      points[i].x - points[i - 1].x,
      points[i].y - points[i - 1].y
    );
  }
  return total;
}

export default function AnimatedSystemDiagram() {
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [highlightedSheets, setHighlightedSheets] = useState<Set<string> | null>(
    null
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  // Only run particles after the diagram scrolls into view.
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { threshold: 0.15 }
    );
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const focusId = hovered ?? selected;

  useEffect(() => {
    if (!focusId) {
      setHighlightedSheets(null);
      return;
    }
    const node = nodes.find((n) => n.id === focusId);
    if (!node) return;
    setHighlightedSheets(new Set(node.sheets));
  }, [focusId]);

  const edgeGeometry = useMemo(() => {
    const byId = new Map(nodes.map((n) => [n.id, n] as const));
    return edges
      .map((e) => {
        const a = byId.get(e.from);
        const b = byId.get(e.to);
        if (!a || !b) return null;
        const points = pathFor(a, b);
        return { edge: e, a, b, points, length: pointsToLength(points) };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  }, []);

  const particleConfig = useMemo(
    () =>
      edgeGeometry.map((g, i) => ({
        ...g,
        count: g.edge.from === "router" ? 3 : 1,
        baseDuration: 2.4 + (i % 3) * 0.3,
      })),
    [edgeGeometry]
  );

  const focusedEdge = (e: ServiceEdge) =>
    focusId != null && (e.from === focusId || e.to === focusId);

  return (
    <section
      ref={containerRef}
      id="stack"
      className="relative border-t border-blueprint-grid/15 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: motionTokens.dur.base, ease: motionTokens.ease }}
          className="mb-10 max-w-2xl"
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
            SECTION 02 — ARCHITECTURE
          </div>
          <h2 className="font-mono text-3xl font-bold text-blueprint-paper sm:text-4xl">
            The Stack
          </h2>
          <p className="mt-3 font-sans text-[15px] leading-relaxed text-blueprint-muted">
            Hover any node to see how it works and which projects use it.
            Click to pin. Brass packets continuously flow along the edges —
            every connection in this system is something I've shipped.
          </p>
        </motion.div>

        <div className="relative overflow-hidden border border-blueprint-grid/20 bg-blueprint-surface/30">
          <div className="h-[2px] w-full bg-blueprint-brass/70" />

          <div className="flex items-center justify-between border-b border-blueprint-grid/15 bg-blueprint-surface/40 px-4 py-2 font-mono text-[10px] tracking-annotation text-blueprint-muted/80">
            <span>FIG.02 — SYSTEM ARCHITECTURE</span>
            <span>HOVER · CLICK</span>
            <span>12 NODES · {edges.length} EDGES</span>
          </div>

          <div className="relative">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="block w-full"
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="System architecture diagram"
            >
              <defs>
                <pattern id="diag-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#6E93B7" strokeOpacity="0.08" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#diag-grid)" />

              {edgeGeometry.map(({ edge, points, length }, i) => {
                const focused = focusedEdge(edge);
                const dimmed = focusId != null && !focused;
                const d = points
                  .map((p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
                  .join(" ");
                return (
                  <g key={`e-${i}`}>
                    <motion.path
                      d={d}
                      stroke={focused ? "#C9A15D" : "#6E93B7"}
                      strokeWidth={focused ? 1.5 : 1}
                      strokeOpacity={dimmed ? 0.18 : focused ? 0.9 : 0.4}
                      fill="none"
                      strokeLinecap="square"
                      animate={{ strokeOpacity: dimmed ? 0.18 : focused ? 0.9 : 0.4 }}
                      transition={{ duration: 0.3 }}
                    />
                    {edge.label && (() => {
                      const mid = points[Math.floor(points.length / 2)];
                      return (
                        <text
                          x={mid.x}
                          y={mid.y - 6}
                          textAnchor="middle"
                          fontFamily='"IBM Plex Mono", monospace'
                          fontSize="7"
                          fill="#C9A15D"
                          fillOpacity={dimmed ? 0.15 : focused ? 0.95 : 0.55}
                          letterSpacing="0.4"
                        >
                          {edge.label}
                        </text>
                      );
                    })()}

                    {inView && !reduced && length > 0 && (
                      <>
                        <FlowParticle
                          points={points}
                          length={length}
                          duration={particleConfig[i].baseDuration}
                          delay={0}
                        />
                        {particleConfig[i].count > 1 && (
                          <FlowParticle
                            points={points}
                            length={length}
                            duration={particleConfig[i].baseDuration}
                            delay={particleConfig[i].baseDuration / 3}
                          />
                        )}
                        {particleConfig[i].count > 2 && (
                          <FlowParticle
                            points={points}
                            length={length}
                            duration={particleConfig[i].baseDuration}
                            delay={(particleConfig[i].baseDuration * 2) / 3}
                          />
                        )}
                      </>
                    )}
                  </g>
                );
              })}

              {nodes.map((n) => (
                <ServiceNodeView
                  key={n.id}
                  node={n}
                  selected={selected === n.id}
                  highlighted={hovered === n.id || selected === n.id}
                  dimmed={focusId != null && focusId !== n.id}
                  onHover={() => setHovered(n.id)}
                  onLeave={() => setHovered((h) => (h === n.id ? null : h))}
                  onSelect={() => setSelected((s) => (s === n.id ? null : n.id))}
                />
              ))}
            </svg>

            <NodeSidePanel
              node={nodes.find((n) => n.id === focusId) ?? null}
              onClose={() => {
                setHovered(null);
                setSelected(null);
              }}
              highlightSheets={highlightedSheets}
              onSelectSheet={(s) => {
                const el = document.getElementById(`sheet-${s}`);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
              }}
            />
          </div>

          <div className="flex items-center justify-between border-t border-blueprint-grid/15 bg-blueprint-surface/40 px-4 py-2 font-mono text-[10px] tracking-annotation text-blueprint-muted/70">
            <span>{focusId ? `FOCUSED · ${focusId.toUpperCase()}` : "IDLE"}</span>
            <span>{selected ? "CLICK AGAIN TO CLEAR" : "CLICK A NODE TO PIN"}</span>
            <span>SCALE 1:1</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 font-mono text-[10px] tracking-annotation text-blueprint-muted/80 md:grid-cols-7">
          {(["trigger", "router", "agent", "vector", "db", "frontend", "action"] as const).map((k) => (
            <div key={k} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blueprint-brass/80" />
              <span className="uppercase">{k}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
