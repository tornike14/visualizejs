import type { SourceLine, TreeNodeData, BaseStep } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type SuspenseKind = "single" | "nested" | "parallel";

export type BoundaryStatus =
  | "idle"
  | "suspended"
  | "fallback-visible"
  | "resolved";

export interface SuspenseBoundary {
  id: string;
  label: string;
  status: BoundaryStatus;
  fallbackLabel: string;
  promiseLabel?: string;
}

export interface SuspenseStep extends BaseStep {
  componentTree: TreeNodeData;
  activeNodeId?: string;
  boundaries: SuspenseBoundary[];
}

export interface SuspenseExample extends ExampleOption {
  kind: SuspenseKind;
  codeLines: SourceLine[];
  steps: SuspenseStep[];
}
