import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { SourceLine } from "@/types/visualization";

export type GeneratorKind = "basic" | "data-flow" | "iterator";

export type GeneratorStatus = "created" | "suspended" | "executing" | "completed";

export interface GeneratorState {
  status: GeneratorStatus;
  nextArg?: string;
  yieldValue?: string;
  done: boolean;
}

export interface CallFlowEntry {
  id: number;
  caller: string;
  response: string;
  direction: "call" | "yield" | "return";
}

export interface GeneratorStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  generatorState: GeneratorState | null;
  callFlow: CallFlowEntry[];
}

export interface GeneratorExample extends ExampleOption {
  kind: GeneratorKind;
  codeLines: SourceLine[];
  steps: GeneratorStep[];
}
