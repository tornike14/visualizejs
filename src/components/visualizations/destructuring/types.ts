import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

/* ── Types ── */

export type DestructuringKind = "array" | "object" | "nested" | "params";

export interface VariableBinding {
  name: string;
  value: string;
  isNew: boolean;
  tone: "amber" | "cyan" | "emerald" | "violet" | "pink";
}

export interface DestructuringStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  bindings: VariableBinding[];
}

export interface DestructuringExample extends ExampleOption {
  kind: DestructuringKind;
  codeLines: SourceLine[];
  steps: DestructuringStep[];
}
