import React, { useState, useCallback, useEffect } from "react";
import { useModel } from "./hooks/useModel";
import { useTree } from "./hooks/useTree";
import { useCanvas } from "./hooks/useCanvas";
import { useToast } from "./hooks/useToast";
import { useOSTGeneration } from "./hooks/useOSTGeneration";
import { MAX_RETRY_ATTEMPTS } from "./constants";
import { Header } from "./components/Header";
import { ModelKeySettings } from "./components/ModelKeySettings";
import { Sidebar } from "./components/sidebar/Sidebar";
import { Canvas } from "./components/canvas/Canvas";
import { Toast } from "./components/Toast";

export default function OSTWhiteboardApp() {
  const {
    modelId,
    customModelId,
    apiKey,
    setModelId,
    setCustomModelId,
    setApiKey,
  } = useModel();
  const [showSettings, setShowSettings] = useState(false);
  const [aiContext, setAiContext] = useState("");
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
  
  // Use the OST generation hook with retry logic
  const {
    generate: generateOST,
    loading: aiLoading,
    error: generationError,
    retryCount,
    isRetrying,
  } = useOSTGeneration();

  // Sync generation error with local error state for display
  const [error, setError] = useState("");

  useEffect(() => {
    setError(generationError || "");
  }, [generationError]);

  // Show retry feedback
  useEffect(() => {
    if (isRetrying && retryCount > 0) {
      showToastMessage(
        `Retrying generation (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS + 1})...`
      );
    }
  }, [isRetrying, retryCount, showToastMessage]);

  const handleGenerate = useCallback(async () => {
    if (!apiKey || !aiContext) return;
    try {
      setError("");
      setInfo("");
      const json = await generateOST({
        modelId,
        apiKey,
        context: aiContext,
        customModelId: customModelId || null,
      });
      const pretty = JSON.stringify(json, null, 2);
      setRawJson(pretty);
      const result = rebuildFromJson(pretty);
      if (result.success) {
        const successMessage =
          retryCount > 0
            ? `Strategy tree generated successfully after ${retryCount + 1} attempt(s)!`
            : "Strategy tree generated successfully!";
        showToastMessage(successMessage);
      } else {
        setError(result.error || "Failed to generate tree");
      }
    } catch (e: any) {
      setError(e.message || "AI generation failed");
    }
  }, [
    modelId,
    customModelId,
    apiKey,
    aiContext,
    generateOST,
    rebuildFromJson,
    showToastMessage,
    retryCount,
  ]);

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
      <Header
        modelId={modelId}
        customModelId={customModelId}
        apiKey={apiKey}
        onToggleSettings={() => setShowSettings(true)}
      />
      <main className="flex flex-1 overflow-hidden">
        <Sidebar
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
      <ModelKeySettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        modelId={modelId}
        onModelIdChange={setModelId}
        customModelId={customModelId}
        onCustomModelIdChange={setCustomModelId}
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
      />
      <Toast show={showToast} message={toastMessage} />
    </div>
  );
}
