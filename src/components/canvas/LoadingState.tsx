import React from "react";

export function LoadingState() {
  return (
    <div className="absolute inset-0 z-30 bg-white/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
      <p className="text-indigo-700 font-semibold animate-pulse">AI is mapping your strategy...</p>
    </div>
  );
}
