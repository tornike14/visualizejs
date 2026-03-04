import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";
import type { SourceLine } from "@/types/visualization";

export type GCKind = "algorithm" | "leak" | "weak";

export interface GCRoot {
  id: string;
  label: string;
  refsTo: string[];
  tone: "amber" | "emerald" | "cyan";
}

export interface HeapObject {
  id: string;
  label: string;
  props: { key: string; value: string }[];
  tone: "amber" | "emerald" | "cyan" | "violet";
  status: "alive" | "unreachable" | "collected";
}

export interface GCStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  roots: GCRoot[];
  heapObjects: HeapObject[];
  gcSweep?: boolean;
}

export interface GCExample extends ExampleOption {
  kind: GCKind;
  codeLines: SourceLine[];
  steps: GCStep[];
}
