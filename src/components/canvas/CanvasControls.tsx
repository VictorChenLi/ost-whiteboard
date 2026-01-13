import React from "react";
import { IconZoomIn, IconZoomOut, IconReset } from "../icons";

interface CanvasControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

export function CanvasControls({ onZoomIn, onZoomOut, onReset }: CanvasControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col gap-2 z-20">
      <button
        onClick={onZoomIn}
        className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500 hover:text-slate-800 transition-colors"
        title="Zoom In"
      >
        <IconZoomIn />
      </button>
      <button
        onClick={onZoomOut}
        className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500 hover:text-slate-800 transition-colors"
        title="Zoom Out"
      >
        <IconZoomOut />
      </button>
      <button
        onClick={onReset}
        className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-sm text-slate-500 hover:text-slate-800 transition-colors"
        title="Reset View"
      >
        <IconReset />
      </button>
    </div>
  );
}
