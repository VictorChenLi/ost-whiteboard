import { useState, useEffect } from "react";
import {
  API_KEYS_STORAGE_KEY,
  MODEL_ID_STORAGE_KEY,
  CUSTOM_MODEL_ID_STORAGE_KEY,
} from "../constants";
import { getActualModelId } from "../utils/modelHandlers";

export function useModel() {
  const [modelId, setModelId] = useState(() => {
    try {
      return localStorage.getItem(MODEL_ID_STORAGE_KEY) || "gemini-3-flash-preview";
    } catch (error) {
      return "gemini-3-flash-preview";
    }
  });

  const [customModelId, setCustomModelId] = useState(() => {
    try {
      return localStorage.getItem(CUSTOM_MODEL_ID_STORAGE_KEY) || "";
    } catch (error) {
      return "";
    }
  });

  const [apiKey, setApiKey] = useState(() => {
    try {
      const storedKeys = JSON.parse(
        localStorage.getItem(API_KEYS_STORAGE_KEY) || "{}"
      );
      const initialModelId =
        localStorage.getItem(MODEL_ID_STORAGE_KEY) || "gemini-3-flash-preview";
      const actualModelId = getActualModelId(initialModelId, customModelId || null);
      return actualModelId ? storedKeys[actualModelId] || "" : "";
    } catch (error) {
      return "";
    }
  });

  // Persist model ID
  useEffect(() => {
    try {
      localStorage.setItem(MODEL_ID_STORAGE_KEY, modelId);
    } catch (error) {
      console.error("Failed to save model ID to localStorage:", error);
    }
  }, [modelId]);

  // Persist custom model ID
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_MODEL_ID_STORAGE_KEY, customModelId);
    } catch (error) {
      console.error("Failed to save custom model ID to localStorage:", error);
    }
  }, [customModelId]);

  // Auto-load API key on model change
  useEffect(() => {
    try {
      const storedKeys = JSON.parse(
        localStorage.getItem(API_KEYS_STORAGE_KEY) || "{}"
      );
      const actualModelId = getActualModelId(modelId, customModelId || null);
      const keyForModel = actualModelId ? storedKeys[actualModelId] || "" : "";
      setApiKey(keyForModel);
    } catch (error) {
      console.error("Failed to load API key for model:", error);
    }
  }, [modelId, customModelId]);

  const updateModelId = (id: string) => {
    setModelId(id);
  };

  const updateCustomModelId = (id: string) => {
    setCustomModelId(id);
  };

  const updateApiKey = (key: string) => {
    setApiKey(key);
    // Save to localStorage
    try {
      const storedKeys = JSON.parse(
        localStorage.getItem(API_KEYS_STORAGE_KEY) || "{}"
      );
      const actualModelId = getActualModelId(modelId, customModelId || null);
      if (actualModelId) {
        storedKeys[actualModelId] = key;
        localStorage.setItem(API_KEYS_STORAGE_KEY, JSON.stringify(storedKeys));
      }
    } catch (error) {
      console.error("Failed to save API key:", error);
    }
  };

  return {
    modelId,
    customModelId,
    apiKey,
    setModelId: updateModelId,
    setCustomModelId: updateCustomModelId,
    setApiKey: updateApiKey,
  };
}
