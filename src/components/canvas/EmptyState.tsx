import React from "react";
import { IconLayout } from "../icons";

export function EmptyState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
        <IconLayout />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Ready to map your strategy?</h2>
      <p className="text-slate-500 max-w-sm leading-relaxed mb-8">
        Enter your product goal on the left. Our AI will help you visualize the path from opportunities to experiments.
      </p>
      <div className="flex gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Goal
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="w-2 h-2 rounded-full bg-amber-400"></span> Opportunity
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span> Solution
        </div>
      </div>
    </div>
  );
}
