import React from "react";
import { IconCode, IconChevronDown, IconRefresh } from "../icons";

interface AdvancedEditorProps {
  json: string;
  onJsonChange: (json: string) => void;
  onUpdate: () => void;
}

export function AdvancedEditor({ json, onJsonChange, onUpdate }: AdvancedEditorProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <section>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between cursor-pointer text-sm font-semibold text-slate-700"
      >
        <span className="flex items-center gap-2">
          <IconCode />
          Advanced: Edit Tree Data
        </span>
        <IconChevronDown className={isOpen ? "rotate-180" : ""} />
      </button>
      {isOpen && (
        <div className="mt-4 space-y-3">
          <textarea
            value={json}
            onChange={(e) => onJsonChange(e.target.value)}
            className="w-full h-48 p-3 font-mono text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
            placeholder="Paste or edit your strategy tree JSON here..."
            spellCheck={false}
          />
          <button
            onClick={onUpdate}
            className="w-full py-2 px-4 border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
          >
            <IconRefresh />
            Update Visualization
          </button>
        </div>
      )}
    </section>
  );
}
