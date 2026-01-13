import React from "react";
import { IconCheck } from "./icons";

interface ToastProps {
  show: boolean;
  message: string;
}

export function Toast({ show, message }: ToastProps) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-slate-900 text-white rounded-full shadow-2xl flex items-center gap-3 z-50 animate-slide-up">
      <IconCheck />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
