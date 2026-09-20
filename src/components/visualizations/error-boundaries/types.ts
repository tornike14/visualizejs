import type { SourceLine, TreeNodeData, BaseStep } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

/* ── Types ── */

export type ErrorBoundaryKind = "basic" | "nested" | "recovery";

export type BoundaryPhase =
  | "normal"
  | "error-thrown"
  | "getDerivedStateFromError"
  | "componentDidCatch"
  | "fallback-rendered"
  | "recovered";

export interface ErrorBoundaryInfo {
  id: string;
  label: string;
  phase: BoundaryPhase;
  errorMessage?: string;
  fallbackLabel?: string;
}

export interface ErrorBoundaryStep extends BaseStep {
  componentTree: TreeNodeData;
  activeNodeId?: string;
  boundaries: ErrorBoundaryInfo[];
}

export interface ErrorBoundaryExample extends ExampleOption {
  kind: ErrorBoundaryKind;
  codeLines: SourceLine[];
  steps: ErrorBoundaryStep[];
}
