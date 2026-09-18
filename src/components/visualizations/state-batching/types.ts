import type { SourceLine } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type StateBatchingKind = "batch" | "updater" | "automatic";

export type UpdateStatus = "queued" | "applying" | "applied";

export interface QueuedUpdate {
  id: string;
  /** Hook the update belongs to, e.g. "count" */
  hook: string;
  /** The call as written, e.g. "setCount(count + 1)" */
  call: string;
  /** What was actually stored on the queue, e.g. "1" or "c => c + 1" */
  payload: string;
  payloadKind: "value" | "updater";
  status: UpdateStatus;
  /** Filled in once processed, e.g. "0 -> 1" */
  result?: string;
}

export interface HookSnapshot {
  name: string;
  /** Value the last committed render saw */
  current: string;
  /** Value computed from the queue during the in-progress render */
  pending: string | null;
}

export type RenderLogKind = "render" | "commit" | "legacy" | "note";

export interface RenderLogEntry {
  id: string;
  kind: RenderLogKind;
  label: string;
  detail: string;
}

export interface RenderTotals {
  react17: number;
  react18: number;
}

export type EventLoopRunKind = "idle" | "task" | "microtask" | "react";

export interface PendingWork {
  label: string;
  kind: "task" | "microtask";
}

export interface EventLoopSnapshot {
  running: string | null;
  runningKind: EventLoopRunKind;
  pending: PendingWork[];
}

export interface StateBatchingStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  updateQueue: QueuedUpdate[];
  hooks: HookSnapshot[];
  renderLog: RenderLogEntry[];
  renderTotals?: RenderTotals;
  eventLoop: EventLoopSnapshot;
  consoleOutput: string[];
}

export interface StateBatchingExample extends ExampleOption {
  kind: StateBatchingKind;
  codeLines: SourceLine[];
  steps: StateBatchingStep[];
}
