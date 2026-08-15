import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

/* ── Types ── */

export type ModulesKind = "named-default" | "live-bindings" | "circular";

export type ModulePhase =
  | "unlinked"
  | "linking"
  | "linked"
  | "evaluating"
  | "evaluated";

export interface ModuleNode {
  id: string;
  filename: string;
  phase: ModulePhase;
  exports: string[];
  highlight?: "active" | "none";
}

export interface ModuleEdge {
  from: string;
  to: string;
  imports: string[];
  highlight?: "active" | "resolved";
}

export interface Binding {
  name: string;
  sourceModule: string;
  sourceExport: string;
  value: string;
  isLive: boolean;
}

export interface ModulesStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  modules: ModuleNode[];
  edges: ModuleEdge[];
  bindings: Binding[];
}

export interface ModulesExample extends ExampleOption {
  kind: ModulesKind;
  codeLines: SourceLine[];
  steps: ModulesStep[];
}
