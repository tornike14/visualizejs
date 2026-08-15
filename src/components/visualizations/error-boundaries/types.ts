import type { SourceLine, TreeNodeData } from "@/types/visualization";
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

export interface ErrorBoundaryStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  componentTree: TreeNodeData;
  activeNodeId?: string;
  boundaries: ErrorBoundaryInfo[];
}

export interface ErrorBoundaryExample extends ExampleOption {
  kind: ErrorBoundaryKind;
  codeLines: SourceLine[];
  steps: ErrorBoundaryStep[];
}
