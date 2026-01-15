import React, { useState, useEffect } from "react";
import { IconX } from "./icons";
import { getActualModelId } from "../utils/modelHandlers";
import {
  API_KEYS_STORAGE_KEY,
  MODEL_ID_STORAGE_KEY,
  CUSTOM_MODEL_ID_STORAGE_KEY,
} from "../constants";

interface ModelKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  modelId: string;
  onModelIdChange: (id: string) => void;
  customModelId: string;
  onCustomModelIdChange: (id: string) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
}

const MODEL_OPTIONS = [
  {
    group: "Google Gemini (Free)",
    options: [
      { value: "gemini-3-flash-preview", label: "Gemini 3 Flash Preview" },
      { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
      { value: "gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
    ],
  },
  {
    group: "Google Gemini (Paid)",
    options: [
      { value: "gemini-3-pro-preview", label: "Gemini 3 Pro Preview" },
    ],
  },
  {
    group: "OpenAI GPT-5 Series (Paid)",
    options: [
      { value: "gpt-5.2", label: "GPT-5.2" },
      { value: "gpt-5.1", label: "GPT-5.1" },
    ],
  },
];

export function ModelKeySettings({
  isOpen,
  onClose,
  modelId,
  onModelIdChange,
  customModelId,
  onCustomModelIdChange,
  apiKey,
  onApiKeyChange,
}: ModelKeySettingsProps) {
  const [localApiKey, setLocalApiKey] = useState(apiKey);

  // Sync local state with prop
  useEffect(() => {
    setLocalApiKey(apiKey);
  }, [apiKey]);

  // Load API key when model changes
  useEffect(() => {
    if (modelId !== "custom") {
      try {
        const storedKeys = JSON.parse(
          localStorage.getItem(API_KEYS_STORAGE_KEY) || "{}"
        );
        const keyForModel = storedKeys[modelId] || "";
        setLocalApiKey(keyForModel);
        onApiKeyChange(keyForModel);
      } catch (error) {
        console.error("Failed to load API key for model:", error);
      }
    }
  }, [modelId, onApiKeyChange]);

  const handleModelChange = (newModelId: string) => {
    onModelIdChange(newModelId);

    // Load API key for the new model
    if (newModelId !== "custom") {
      try {
        const storedKeys = JSON.parse(
          localStorage.getItem(API_KEYS_STORAGE_KEY) || "{}"
        );
        const keyForModel = storedKeys[newModelId] || "";
        setLocalApiKey(keyForModel);
        onApiKeyChange(keyForModel);
      } catch (error) {
        console.error("Failed to load API key for model:", error);
      }
    }
  };

  const handleApiKeyChange = (newKey: string) => {
    setLocalApiKey(newKey);
    onApiKeyChange(newKey);

    // Save to localStorage as a pair with model
    try {
      const storedKeys = JSON.parse(
        localStorage.getItem(API_KEYS_STORAGE_KEY) || "{}"
      );
      const actualId = getActualModelId(modelId, customModelId || null);
      if (actualId) {
        storedKeys[actualId] = newKey;
        localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(storedKeys));
      }
    } catch (error) {
      console.error("Failed to save API key:", error);
    }
  };

  const getProviderName = (): string => {
    if (modelId === "custom") {
      return customModelId?.toLowerCase().includes("gpt") ||
        customModelId?.toLowerCase().includes("openai")
        ? "OpenAI"
        : "Gemini";
    }
    if (modelId.startsWith("gpt-") || modelId.startsWith("o1-") || modelId.startsWith("o3-")) {
      return "OpenAI";
    }
    return "Gemini";
  };

  const getApiKeyLink = (): string => {
    const provider = getProviderName();
    if (provider === "OpenAI") {
      return "https://platform.openai.com/api-keys";
    }
    return "https://aistudio.google.com/app/apikey";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">
            Model & API Key Settings
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <IconX />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Model Selection */}
          <div className="space-y-2">
            <label
              htmlFor="model-select"
              className="block text-sm font-semibold text-slate-700"
            >
              Select Model
            </label>
            <div className="relative">
              <select
                id="model-select"
                value={modelId}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm appearance-none bg-white pr-10"
              >
                {MODEL_OPTIONS.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
                <option value="custom">Custom Model ID...</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            {/* Custom Model Input */}
            {modelId === "custom" && (
              <div className="mt-3">
                <input
                  type="text"
                  value={customModelId}
                  onChange={(e) => onCustomModelIdChange(e.target.value)}
                  placeholder="Enter custom model ID (e.g., gpt-4, gemini-pro)"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm placeholder:text-slate-400"
                />
              </div>
            )}
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <label
              htmlFor="api-key-input"
              className="block text-sm font-semibold text-slate-700"
            >
              API Key ({getProviderName()})
            </label>
            <input
              type="password"
              id="api-key-input"
              value={localApiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder={`Enter ${getProviderName()} API Key`}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm placeholder:text-slate-400"
            />
            <a
              href={getApiKeyLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-indigo-600 hover:text-indigo-700 underline"
            >
              Get {getProviderName()} API Key
            </a>
            <p className="text-xs text-slate-500 mt-1">
              API keys are saved per model. Each model will remember its own API
              key.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
