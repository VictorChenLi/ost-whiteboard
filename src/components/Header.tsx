import React, { useState } from "react";
import { IconGitBranch, IconHelp, IconCheck, IconSettings } from "./icons";

interface HeaderProps {
  modelId: string;
  customModelId: string;
  apiKey: string;
  onToggleSettings: () => void;
}

const getModelDisplayName = (modelId: string, customModelId: string): string => {
  if (modelId === "custom") {
    return customModelId || "Custom Model";
  }

  const modelNames: Record<string, string> = {
    "gemini-3-flash-preview": "Gemini 3 Flash",
    "gemini-2.5-flash": "Gemini 2.5 Flash",
    "gemini-2.5-flash-lite": "Gemini 2.5 Flash Lite",
    "gemini-3-pro-preview": "Gemini 3 Pro",
    "gpt-5.2": "GPT-5.2",
    "gpt-5.1": "GPT-5.1",
  };

  return modelNames[modelId] || modelId;
};

export function Header({
  modelId,
  customModelId,
  apiKey,
  onToggleSettings,
}: HeaderProps) {
  const [showOSTTooltip, setShowOSTTooltip] = useState(false);
  const hasApiKey = !!apiKey;
  const modelDisplayName = getModelDisplayName(modelId, customModelId);

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 z-20 shrink-0">
      <div className="flex items-center gap-2">
        <div className="bg-indigo-600 p-1.5 rounded-lg">
          <IconGitBranch />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">
          StrategyFlow
        </h1>
        <span className="ml-2 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-xs font-semibold rounded-full border border-indigo-100 uppercase tracking-wider">
          Beta
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Model Selection Button */}
        <button
          onClick={onToggleSettings}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          <span className="text-sm font-medium text-slate-700">
            {modelDisplayName}
          </span>
          {hasApiKey ? (
            <IconCheck className="w-4 h-4 text-green-600" />
          ) : null}
          <IconSettings className="w-4 h-4 text-slate-500" />
        </button>

        <div className="relative group">
          <button
            className="flex items-center gap-1 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
            onMouseEnter={() => setShowOSTTooltip(true)}
            onMouseLeave={() => setShowOSTTooltip(false)}
          >
            <IconHelp />
            What is an OST?
          </button>
          {showOSTTooltip && (
            <div className="absolute right-0 top-full mt-2 w-72 p-4 bg-white rounded-xl shadow-xl border border-slate-100 z-50">
              <p className="text-sm text-slate-600 leading-relaxed">
                An <strong>Opportunity Solution Tree</strong> is a visual aid
                that helps product teams map out their strategy by connecting
                high-level goals to specific customer pain points and solutions.
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
