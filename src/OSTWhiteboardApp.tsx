import React, { useState, useCallback } from "react";
import { useApiKey } from "./hooks/useApiKey";
import { useTree } from "./hooks/useTree";
import { useCanvas } from "./hooks/useCanvas";
import { useToast } from "./hooks/useToast";
import { generateOSTWithAI } from "./services/ai";
import { Header } from "./components/Header";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Canvas } from "./components/canvas/Canvas";
import { Toast } from "./components/Toast";

export default function OSTWhiteboardApp() {
  const [apiKey, setApiKey] = useApiKey();
  const [aiContext, setAiContext] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const {
    tree,
    nodes,
    links,
    rawJson,
    setRawJson,
    rebuildFromJson,
    exportTree,
    clearTree,
    hasTree,
  } = useTree();

  const { boardRef, transform, resetView, zoomIn, zoomOut } = useCanvas();
  const { showToast, toastMessage, showToastMessage } = useToast();

  const handleGenerate = useCallback(async () => {
    if (!apiKey || !aiContext) return;
    try {
      setAiLoading(true);
      setError("");
      const json = await generateOSTWithAI(apiKey, aiContext);
      const pretty = JSON.stringify(json, null, 2);
      setRawJson(pretty);
      const result = rebuildFromJson(pretty);
      if (result.success) {
        showToastMessage("Strategy tree generated successfully!");
      } else {
        setError(result.error || "Failed to generate tree");
      }
    } catch (e: any) {
      setError(e.message || "AI generation failed");
    } finally {
      setAiLoading(false);
    }
  }, [apiKey, aiContext, rebuildFromJson, showToastMessage]);

  const handleJsonUpdate = useCallback(() => {
    const result = rebuildFromJson(rawJson);
    if (result.success) {
      setError("");
    } else {
      setError(result.error || "Failed to parse JSON");
    }
  }, [rawJson, rebuildFromJson]);

  const handleExport = useCallback(() => {
    try {
      const json = exportTree();
      const pretty = JSON.stringify(json, null, 2);
      navigator.clipboard?.writeText(pretty);
      showToastMessage("JSON exported to clipboard!");
    } catch (e: any) {
      setError(e?.message || "Nothing to export yet");
    }
  }, [exportTree, showToastMessage]);

  const handleClear = useCallback(() => {
    if (window.confirm("Are you sure you want to clear your work? This cannot be undone.")) {
      clearTree();
      setAiContext("");
      setError("");
      setInfo("");
      resetView();
    }
  }, [clearTree, resetView]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-slate-50">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar
          apiKey={apiKey}
          onApiKeyChange={setApiKey}
          context={aiContext}
          onContextChange={setAiContext}
          onGenerate={handleGenerate}
          generateDisabled={!apiKey || !aiContext}
          loading={aiLoading}
          json={rawJson}
          onJsonChange={setRawJson}
          onJsonUpdate={handleJsonUpdate}
          onClear={handleClear}
          onExport={handleExport}
          error={error}
          info={info}
        />
        <Canvas
          boardRef={boardRef}
          transform={transform}
          hasTree={hasTree}
          tree={tree}
          nodes={nodes}
          links={links}
          loading={aiLoading}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onReset={resetView}
        />
      </main>
      <Toast show={showToast} message={toastMessage} />
    </div>
  );
}
