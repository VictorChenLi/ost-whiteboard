import { useState, useMemo, useCallback } from "react";
import { TreeModel } from "../types";
import { parseOSTJson, autoLayout, exportToOSTJson } from "../utils/tree";

export function useTree() {
  const [tree, setTree] = useState<TreeModel | null>(null);
  const [rawJson, setRawJson] = useState("");

  const nodes = useMemo(() => (tree ? Array.from(tree.byId.values()) : []), [tree]);
  
  const links = useMemo(
    () => (tree ? nodes.flatMap((n) => n.children.map((c) => ({ from: n.id, to: c }))) : []),
    [tree, nodes]
  );

  const rebuildFromJson = useCallback((json: string) => {
    try {
      const t = parseOSTJson(json);
      autoLayout(t);
      setTree(t);
      setRawJson(json);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || "Failed to parse JSON" };
    }
  }, []);

  const exportTree = useCallback(() => {
    if (!tree) throw new Error("Nothing to export");
    return exportToOSTJson(tree);
  }, [tree]);

  const clearTree = useCallback(() => {
    setTree(null);
    setRawJson("");
  }, []);

  return {
    tree,
    nodes,
    links,
    rawJson,
    setRawJson,
    rebuildFromJson,
    exportTree,
    clearTree,
    hasTree: tree !== null && nodes.length > 0,
  };
}
