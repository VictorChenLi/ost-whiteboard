import { useState } from "react";
import { LS_API_KEY } from "../constants";

export function useApiKey() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(LS_API_KEY) || "");

  const updateApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem(LS_API_KEY, key);
  };

  return [apiKey, updateApiKey] as const;
}
