import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

/* ── Types ── */

export type ReferenceKind = "primitive" | "reference" | "shallow" | "deep";

export interface MemorySlot {
  variable: string;
  value: string;
  heapId: string | null;
  tone: "amber" | "emerald" | "cyan" | "violet" | "pink";
}

export interface HeapObject {
  id: string;
  label: string;
  props: { key: string; value: string }[];
  tone: "amber" | "emerald" | "cyan" | "violet" | "pink";
  isShared: boolean;
}

export interface ReferenceStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  consoleOutput: string[];
  memorySlots: MemorySlot[];
  heapObjects: HeapObject[];
}

export interface DeepCopyVariant {
  methodId: string;
  methodLabel: string;
  codeLines: SourceLine[];
  steps: ReferenceStep[];
}

export interface StandardExample extends ExampleOption {
  kind: "primitive" | "reference" | "shallow";
  codeLines: SourceLine[];
  steps: ReferenceStep[];
  variants?: undefined;
}

export interface VariantExample extends ExampleOption {
  kind: "deep";
  codeLines?: undefined;
  steps?: undefined;
  variants: DeepCopyVariant[];
}

export type ReferenceExample = StandardExample | VariantExample;
