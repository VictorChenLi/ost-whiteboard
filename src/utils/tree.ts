import { TreeModel, InternalNode } from "../types";
import { safeJsonParse } from "./json";
import { normalizeType } from "./string";
import { uuid } from "./math";
import { X_GAP, Y_GAP, NODE_W, MIN_NODE_H, PAD_Y, LINE_H } from "../constants";
import { wrapLines } from "./text";

// Re-export wrapLines for convenience
export { wrapLines };

export function parseOSTJson(textOrObj: string | any): TreeModel {
  const obj = typeof textOrObj === "string" ? safeJsonParse(textOrObj) : textOrObj;
  const root = obj?.root;
  if (!root || typeof root !== "object") throw new Error('JSON must include a top-level "root" object.');

  const byId = new Map<string, InternalNode>();

  function visit(node: any, parentId: string | null, depth: number) {
    const id = node.id || uuid();
    const internal: InternalNode = {
      id,
      depth,
      type: normalizeType(node.type),
      title: node.title || "",
      description: node.description || "",
      parentId,
      children: [],
      x: 0,
      y: 0,
    };

    byId.set(id, internal);
    (node.children || []).forEach((c: any) => internal.children.push(visit(c, id, depth + 1)));
    return id;
  }

  const rootId = visit(root, null, 0);
  return { byId, rootId };
}

export function exportToOSTJson(tree: TreeModel) {
  function build(id: string): any {
    const n = tree.byId.get(id)!;
    return {
      id: n.id,
      type: n.type,
      title: n.title || n.type,
      description: n.description || "",
      children: n.children.map(build),
    };
  }
  return { schemaVersion: "1.0", root: tree.rootId ? build(tree.rootId) : null };
}

export function computeNodeHeight(title: string, description: string) {
  const lines = Math.max(1, wrapLines(title).length) + wrapLines(description).length;
  return Math.max(MIN_NODE_H, PAD_Y * 2 + 22 + lines * LINE_H);
}

export function autoLayout(tree: TreeModel) {
  if (!tree.rootId) return;

  // Assign X positions by leaves; Y by depth
  let nextLeafX = 0;

  function dfsX(id: string) {
    const n = tree.byId.get(id)!;
    if (!n.children.length) {
      n.x = nextLeafX;
      nextLeafX += X_GAP;
      return n.x;
    }
    const childXs = n.children.map(dfsX);
    n.x = childXs.reduce((a, b) => a + b, 0) / childXs.length;
    return n.x;
  }

  dfsX(tree.rootId);

  for (const n of tree.byId.values()) {
    n.y = n.depth * Y_GAP;
  }

  // Normalize minX/minY into positive space
  let minX = Infinity, minY = Infinity;
  for (const n of tree.byId.values()) {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
  }
  for (const n of tree.byId.values()) {
    n.x = n.x - minX + 120;
    n.y = n.y - minY + 90;
  }
}
