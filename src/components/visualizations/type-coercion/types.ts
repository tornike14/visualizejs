import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { SourceLine, BaseStep } from "@/types/visualization";

export type CoercionKind = "equality" | "truthy" | "null" | "nan";

export interface CoercionOperation {
  label: string;
  result: string;
  color: "amber" | "emerald" | "red" | "cyan";
}

export interface CoercionStep extends BaseStep {
  consoleOutput: string[];
  coercionOps: CoercionOperation[];
}

export interface CoercionExample extends ExampleOption {
  kind: CoercionKind;
  codeLines: SourceLine[];
  steps: CoercionStep[];
}
