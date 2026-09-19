import type { BaseStep } from "@/types/visualization";
export interface EventLoopStep extends BaseStep {
  stack: string[];
  webApis: string[];
  taskQueue: string[];
  microtaskQueue: string[];
  consoleOutput: string[];
  loopActive: boolean;
  loopLabel: "idle" | "checking" | "running";
}

export type QueueTone = "stack" | "web" | "task" | "micro";
