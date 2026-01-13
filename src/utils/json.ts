export function safeJsonParse(text: string) {
  const trimmed = (text || "").trim();
  if (!trimmed) throw new Error("JSON input is empty.");
  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error("Invalid JSON. Please check commas/quotes/brackets.");
  }
}
