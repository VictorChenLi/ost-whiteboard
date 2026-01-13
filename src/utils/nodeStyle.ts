export function nodeStyle(type: string) {
  if (type === "Outcome") return { fill: "#a7f3d0", stroke: "rgba(16,185,129,.55)" };
  if (type === "Opportunity") return { fill: "#fde68a", stroke: "rgba(245,158,11,.55)" };
  if (type === "Solution") return { fill: "#93c5fd", stroke: "rgba(59,130,246,.55)" };
  if (type === "Experiment") return { fill: "#fca5a5", stroke: "rgba(239,68,68,.55)" };
  return { fill: "#e5e7eb", stroke: "rgba(107,114,128,.5)" };
}
