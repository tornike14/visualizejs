import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type ConcurrentRenderingKind = "blocking" | "transition" | "deferred";

/** Real lane names from React's ReactFiberLane. */
export type LaneName = "SyncLane" | "DefaultLane" | "TransitionLane";

export type LaneStatus =
  | "queued"
  | "rendering"
  | "committed"
  | "discarded"
  | "suspended";

export interface LaneEntry {
  id: string;
  /** The call that scheduled the update, for example setQuery("a"). */
  update: string;
  lane: LaneName;
  status: LaneStatus;
}

export type WorkPhase =
  | "idle"
  | "sync"
  | "concurrent"
  | "yield"
  | "commit"
  | "discarded"
  | "suspended";

export type UnitStatus = "pending" | "active" | "done" | "skipped" | "stale";

export interface WorkUnit {
  id: string;
  label: string;
  status: UnitStatus;
}

export interface WorkLoopState {
  phase: WorkPhase;
  lane: LaneName | null;
  units: WorkUnit[];
  /** Share of the tree rendered so far, 0 to 1. */
  progress: number;
  /** Short note under the phase, for example "slice 6 of 24, 5 ms budget". */
  note: string | null;
}

export type FrameKind = "idle" | "input" | "blocked" | "slice" | "commit";

export interface FrameEntry {
  id: string;
  kind: FrameKind;
  /** One or two characters drawn inside the frame, for example the key typed. */
  marker?: string;
}

export type SuspenseStatus = "content" | "fallback";

export interface DomState {
  inputValue: string;
  listQuery: string;
  listCount: number;
  listDimmed: boolean;
  /** null when the example does not use useTransition. */
  isPending: boolean | null;
  /** null when the example has no Suspense boundary. */
  suspense: { status: SuspenseStatus; note: string } | null;
}

export interface ConcurrentRenderingStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  lanes: LaneEntry[];
  workLoop: WorkLoopState;
  frames: FrameEntry[];
  dom: DomState;
}

export interface ConcurrentRenderingExample extends ExampleOption {
  kind: ConcurrentRenderingKind;
  codeLines: SourceLine[];
  steps: ConcurrentRenderingStep[];
}
