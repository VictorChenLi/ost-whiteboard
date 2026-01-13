export function normalizeLabel(label: string) {
  return (label || "").replace(/\s+/g, " ").trim();
}

export function normalizeType(type: string) {
  const t = normalizeLabel(type || "");
  if (!t) return "Opportunity";
  if (/^outcome$/i.test(t)) return "Outcome";
  if (/^(opportunity|problem)$/i.test(t)) return "Opportunity";
  if (/^solution$/i.test(t)) return "Solution";
  if (/^experiment$/i.test(t)) return "Experiment";
  return t;
}
