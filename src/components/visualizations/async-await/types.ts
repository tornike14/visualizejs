import type { SourceLine, BaseStep } from "@/types/visualization";
import type { ExampleOption } from "@/components/visualization-ui/ExampleSelector";

export type AsyncAwaitKind = "order" | "parallel" | "errors";

export type QueueTone = "stack" | "micro";

export type AsyncFnStatus = "idle" | "running" | "suspended" | "done";

export type PromiseState = "pending" | "fulfilled" | "rejected";

export interface AsyncFnState {
  id: string;
  name: string;
  status: AsyncFnStatus;
  /** Line the function is parked on while suspended at an await. */
  suspendedAt: number | null;
  promise: {
    name: string;
    state: PromiseState;
    value: string;
  };
}

export interface TimerItem {
  id: string;
  label: string;
  remainingMs: number;
  status: "waiting" | "due";
}

export interface TimelineBar {
  id: string;
  label: string;
  startMs: number;
  endMs: number;
  tone: "cyan" | "green";
  status: "pending" | "done";
}

export interface AsyncAwaitStep extends BaseStep {
  stack: string[];
  microtasks: string[];
  functions: AsyncFnState[];
  timers: TimerItem[];
  timeline: TimelineBar[];
  elapsedMs: number;
  consoleOutput: string[];
}

export interface AsyncAwaitExample extends ExampleOption {
  kind: AsyncAwaitKind;
  codeLines: SourceLine[];
  steps: AsyncAwaitStep[];
}
