export type InternalNode = {
  id: string;
  depth: number;
  type: string;
  parentId: string | null;
  children: string[];
  x: number;
  y: number;
  title: string;
  description: string;
};

export type TreeModel = {
  byId: Map<string, InternalNode>;
  rootId: string | null;
};

export type Transform = {
  x: number;
  y: number;
  s: number;
};
