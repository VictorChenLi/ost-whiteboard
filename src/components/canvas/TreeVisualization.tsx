import React from "react";
import { TreeModel, InternalNode, Transform } from "../../types";
import { NODE_W, PAD_X, PAD_Y, LINE_H } from "../../constants";
import { computeNodeHeight, wrapLines } from "../../utils/tree";
import { nodeStyle } from "../../utils/nodeStyle";

interface TreeVisualizationProps {
  tree: TreeModel;
  transform: Transform;
  nodes: InternalNode[];
  links: Array<{ from: string; to: string }>;
}

export function TreeVisualization({ tree, transform, nodes, links }: TreeVisualizationProps) {
  return (
    <svg width="100%" height="100%" className="tree-node-appear">
      <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.s})`}>
        {/* Links */}
        {links.map((l) => {
          const a = tree.byId.get(l.from);
          const b = tree.byId.get(l.to);
          if (!a || !b) return null;

          const ah = computeNodeHeight(a.title, a.description);
          const midY = (a.y + ah + b.y) / 2;
          const d = `M ${a.x + NODE_W / 2} ${a.y + ah} C ${a.x + NODE_W / 2} ${midY}, ${b.x + NODE_W / 2} ${midY}, ${b.x + NODE_W / 2} ${b.y}`;
          return <path key={`${l.from}-${l.to}`} d={d} fill="none" stroke="rgba(0,0,0,.25)" strokeWidth={2} />;
        })}

        {/* Nodes */}
        {nodes.map((n) => {
          const h = computeNodeHeight(n.title, n.description);
          const { fill, stroke } = nodeStyle(n.type);
          const titleLines = wrapLines(n.title || "(untitled)");
          const descLines = wrapLines(n.description || "");

          return (
            <g key={n.id} transform={`translate(${n.x} ${n.y})`} className="tree-node-appear">
              <rect width={NODE_W} height={h} rx={20} fill={fill} stroke={stroke} strokeWidth={1.5} />
              <text x={PAD_X} y={22} fontSize={10} fill="#374151" style={{ letterSpacing: 0.4 }}>
                {n.type.toUpperCase()}
              </text>
              {titleLines.map((ln, i) => (
                <text key={i} x={PAD_X} y={PAD_Y + 30 + i * LINE_H} fontSize={14} fontWeight={700} fill="rgba(17,24,39,.92)">
                  {ln}
                </text>
              ))}
              {descLines.map((ln, i) => (
                <text
                  key={`d-${i}`}
                  x={PAD_X}
                  y={PAD_Y + 30 + titleLines.length * LINE_H + 8 + i * LINE_H}
                  fontSize={12}
                  fill="rgba(17,24,39,.78)"
                >
                  {ln}
                </text>
              ))}
            </g>
          );
        })}
      </g>
    </svg>
  );
}
