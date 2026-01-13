import React from "react";
import { IconSparkles, IconWand } from "../icons";

interface PromptSectionProps {
  context: string;
  onContextChange: (context: string) => void;
  onGenerate: () => void;
  disabled: boolean;
  loading: boolean;
}

export function PromptSection({
  context,
  onContextChange,
  onGenerate,
  disabled,
  loading,
}: PromptSectionProps) {
  return (
    <section className="space-y-3">
      <label htmlFor="prompt" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <IconSparkles />
        Strategy Context
      </label>
      <textarea
        id="prompt"
        rows={5}
        placeholder="Describe your product goal and customer pain points (e.g., 'Increase monthly active users for our fitness app by solving the lack of motivation in winter months...')"
        value={context}
        onChange={(e) => onContextChange(e.target.value)}
        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm leading-relaxed placeholder:text-slate-400"
      />
      
      <button
        id="generate-btn"
        disabled={disabled || loading}
        onClick={onGenerate}
        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-md hover:shadow-lg"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <IconWand />
            <span>Generate Strategy Tree</span>
          </>
        )}
      </button>
    </section>
  );
}
