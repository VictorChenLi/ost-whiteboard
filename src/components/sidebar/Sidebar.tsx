import React, { useState } from "react";
import { PromptSection } from "./PromptSection";
import { AdvancedEditor } from "./AdvancedEditor";
import { SidebarFooter } from "./SidebarFooter";

interface SidebarProps {
  context: string;
  onContextChange: (context: string) => void;
  onGenerate: () => void;
  generateDisabled: boolean;
  loading: boolean;
  json: string;
  onJsonChange: (json: string) => void;
  onJsonUpdate: () => void;
  onClear: () => void;
  onExport: () => void;
  error?: string;
  info?: string;
}

export function Sidebar({
  context,
  onContextChange,
  onGenerate,
  generateDisabled,
  loading,
  json,
  onJsonChange,
  onJsonUpdate,
  onClear,
  onExport,
  error,
  info,
}: SidebarProps) {
  return (
    <aside className="w-[400px] border-r bg-white flex flex-col z-10 shadow-sm shrink-0">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <PromptSection
          context={context}
          onContextChange={onContextChange}
          onGenerate={onGenerate}
          disabled={generateDisabled}
          loading={loading}
        />
        <hr className="border-slate-100" />
        <AdvancedEditor json={json} onJsonChange={onJsonChange} onUpdate={onJsonUpdate} />
        
        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
            {error}
          </div>
        )}
        {info && (
          <div className="text-xs text-emerald-700 bg-emerald-50 p-3 rounded-lg border border-emerald-100">
            {info}
          </div>
        )}
      </div>
      <SidebarFooter onClear={onClear} onExport={onExport} />
    </aside>
  );
}
