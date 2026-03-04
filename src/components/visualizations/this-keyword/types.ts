import type { SourceLine } from "@/types/visualization";

export type BindingKind = "implicit" | "explicit" | "new" | "arrow";

export type BindingRule =
  | "default"
  | "implicit"
  | "explicit-call"
  | "explicit-apply"
  | "explicit-bind"
  | "new"
  | "arrow"
  | "lost";

export interface MemoryObject {
  label: string;
  properties: { name: string; value: string }[];
  highlight?: "active" | "target" | "none";
}

export interface ThisBinding {
  rule: BindingRule;
  ruleLabel: string;
  value: string;
  callExpression: string;
}

export interface ThisStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  objects: MemoryObject[];
  thisBinding: ThisBinding | null;
  consoleOutput: string[];
}

export interface ThisExample {
  id: string;
  title: string;
  kind: BindingKind;
  description: string;
  codeLines: SourceLine[];
  steps: ThisStep[];
}
