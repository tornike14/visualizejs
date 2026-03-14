import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

/* ── Types ── */

export type SpreadRestKind = "array-spread" | "object-spread" | "rest-params" | "rest-destructuring";

export interface VariableBinding {
  name: string;
  value: string;
  isNew: boolean;
  tone: "amber" | "cyan" | "emerald" | "violet" | "pink";
}

export interface SpreadRestStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  bindings: VariableBinding[];
}

export interface SpreadRestExample extends ExampleOption {
  kind: SpreadRestKind;
  codeLines: SourceLine[];
  steps: SpreadRestStep[];
}
