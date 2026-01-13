import { MAX_CHARS_PER_LINE } from "../constants";
import { normalizeLabel } from "./string";

export function wrapLines(text: string, maxChars = MAX_CHARS_PER_LINE) {
  const words = normalizeLabel(text).split(" ").filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (next.length > maxChars) {
      if (line) lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}
