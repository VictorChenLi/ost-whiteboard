import React from "react";
import { IconKey, IconShield } from "../icons";

interface ApiKeySectionProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

export function ApiKeySection({ apiKey, onApiKeyChange }: ApiKeySectionProps) {
  return (
    <section className="space-y-3">
      <label htmlFor="api-key" className="text-sm font-semibold text-slate-700 flex items-center gap-2">
        <IconKey />
        OpenAI API Key
      </label>
      <input
        type="password"
        id="api-key"
        placeholder="sk-..."
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm placeholder:text-slate-400"
      />
      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
        <IconShield />
        Your key is stored locally in your browser and never sent to our servers.
      </p>
    </section>
  );
}
