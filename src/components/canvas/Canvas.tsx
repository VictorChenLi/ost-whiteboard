import React from "react";
import { TreeModel, Transform, InternalNode } from "../../types";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { TreeVisualization } from "./TreeVisualization";
import { CanvasControls } from "./CanvasControls";

interface CanvasProps {
  boardRef: React.RefObject<HTMLDivElement>;
  transform: Transform;
  hasTree: boolean;
  tree: TreeModel | null;
  nodes: InternalNode[];
  links: Array<{ from: string; to: string }>;
  loading: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function Canvas({
  boardRef,
  transform,
  hasTree,
  tree,
  nodes,
  links,
  loading,
  onZoomIn,
  onZoomOut,
  onReset,
}: CanvasProps) {
  return (
    <div
      ref={boardRef}
      className="flex-1 relative overflow-hidden"
      style={{
        backgroundImage: "radial-gradient(#e2e8f0 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        backgroundPosition: "0 0",
        backgroundColor: "#f8fafc",
        touchAction: "none",
      }}
    >
      {!hasTree && <EmptyState />}
      {loading && <LoadingState />}
      {hasTree && !loading && tree && (
        <>
          <TreeVisualization tree={tree} transform={transform} nodes={nodes} links={links} />
          <CanvasControls onZoomIn={onZoomIn} onZoomOut={onZoomOut} onReset={onReset} />
        </>
      )}
    </div>
  );
}
