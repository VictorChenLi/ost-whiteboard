import React from "react";
import { IconTrash, IconDownload } from "../icons";

interface SidebarFooterProps {
  onClear: () => void;
  onExport: () => void;
}

export function SidebarFooter({ onClear, onExport }: SidebarFooterProps) {
  return (
    <div className="p-4 border-t bg-slate-50 flex items-center justify-between gap-3 shrink-0">
      <button
        onClick={onClear}
        className="flex-1 py-2.5 px-4 text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all"
      >
        <IconTrash />
        Clear All
      </button>
      <button
        onClick={onExport}
        className="flex-1 py-2.5 px-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
      >
        <IconDownload />
        Export JSON
      </button>
    </div>
  );
}
