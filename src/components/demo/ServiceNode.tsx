import { motion } from "framer-motion";
import type { ServiceNode as ServiceNodeData } from "../../data/systemDiagramData";
import { kindColor } from "../../data/systemDiagramData";

interface Props {
  node: ServiceNodeData;
  selected: boolean;
  highlighted: boolean;
  dimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
  onSelect: () => void;
}

/**
 * Interactive architecture-diagram node. SVG `<g>` so it lives in the parent
 * viewBox and scales with the diagram. Hover dims peers, click selects.
 */
export default function ServiceNode({
  node,
  selected,
  highlighted,
  dimmed,
  onHover,
  onLeave,
  onSelect,
}: Props) {
  const colors = kindColor[node.kind];
  const W = 110;
  const H = 44;

  return (
    <motion.g
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onSelect}
      style={{ cursor: "pointer" }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: dimmed ? 0.35 : 1,
        scale: 1,
      }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Hit target (larger than visible node for easier hover) */}
      <rect
        x={node.x - W / 2 - 6}
        y={node.y - H / 2 - 6}
        width={W + 12}
        height={H + 12}
        fill="transparent"
      />

      {/* Selection ring (animated) */}
      {(selected || highlighted) && (
        <motion.rect
          x={node.x - W / 2 - 4}
          y={node.y - H / 2 - 4}
          width={W + 8}
          height={H + 8}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={1.5}
          strokeOpacity={0.9}
          initial={{ opacity: 0 }}
          animate={{
            opacity: selected ? [0.4, 1, 0.4] : 0.7,
          }}
          transition={{
            duration: selected ? 1.6 : 0.4,
            repeat: selected ? Infinity : 0,
            ease: "easeInOut",
          }}
        />
      )}

      {/* Node body */}
      <rect
        x={node.x - W / 2}
        y={node.y - H / 2}
        width={W}
        height={H}
        rx={3}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={1.25}
        strokeOpacity={selected ? 1 : 0.65}
      />

      {/* Top brass tick — adds the "sheet" feel */}
      <line
        x1={node.x - 14}
        y1={node.y - H / 2}
        x2={node.x + 14}
        y2={node.y - H / 2}
        stroke="#C9A15D"
        strokeOpacity={0.7}
        strokeWidth={1.5}
      />

      {/* Ports */}
      <circle cx={node.x - W / 2} cy={node.y} r={2.25} fill="#C9A15D" />
      <circle cx={node.x + W / 2} cy={node.y} r={2.25} fill="#C9A15D" />

      {/* Label */}
      <text
        x={node.x}
        y={node.y - 4}
        textAnchor="middle"
        fontFamily='"IBM Plex Mono", monospace'
        fontSize="10"
        fontWeight={600}
        fill={colors.text}
        letterSpacing="0.5"
        style={{ pointerEvents: "none" }}
      >
        {node.label}
      </text>

      {/* Sub */}
      <text
        x={node.x}
        y={node.y + 10}
        textAnchor="middle"
        fontFamily='"IBM Plex Mono", monospace'
        fontSize="7.5"
        fill="#9FB0C4"
        letterSpacing="0.4"
        style={{ pointerEvents: "none" }}
      >
        {node.sub}
      </text>
    </motion.g>
  );
}
