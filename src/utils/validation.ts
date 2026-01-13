import { safeJsonParse } from "./json";

export function validateStrictOSTJson(obj: any) {
  if (!obj || typeof obj !== "object") throw new Error("AI output is not an object");
  if (obj.schemaVersion !== "1.0") throw new Error("schemaVersion must be '1.0'");
  if (!obj.root || typeof obj.root !== "object") throw new Error("Missing root object");

  const validTypes = new Set(["Outcome", "Opportunity", "Solution", "Experiment"]);

  function walk(n: any, isRoot = false) {
    if (!n.id || !n.type) throw new Error("Each node must have id and type");
    if (!validTypes.has(n.type)) throw new Error(`Invalid node type: ${n.type}`);
    if (isRoot && n.type !== "Outcome") throw new Error("Root type must be Outcome");
    if (!Array.isArray(n.children)) throw new Error("children must be an array");
    n.children.forEach((c: any) => walk(c));
  }

  walk(obj.root, true);
  return obj;
}
