import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type HeapStackKind = "stack" | "heap" | "call-stack" | "gc";

export interface FrameVariable {
  name: string;
  value: string;
  heapRef: string | null;
}

export interface StackFrame {
  id: string;
  label: string;
  variables: FrameVariable[];
}

export interface HeapAllocation {
  id: string;
  label: string;
  props: { key: string; value: string }[];
  tone: "amber" | "emerald" | "cyan" | "violet";
  status: "alive" | "unreachable" | "collected";
}

export interface HeapStackStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  stackFrames: StackFrame[];
  heapAllocations: HeapAllocation[];
  gcSweep?: boolean;
}

export interface HeapStackExample extends ExampleOption {
  kind: HeapStackKind;
  codeLines: SourceLine[];
  steps: HeapStackStep[];
}
