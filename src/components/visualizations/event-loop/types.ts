export interface EventLoopStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  stack: string[];
  webApis: string[];
  taskQueue: string[];
  microtaskQueue: string[];
  consoleOutput: string[];
  loopActive: boolean;
  loopLabel: "idle" | "checking" | "running";
}

export type QueueTone = "stack" | "web" | "task" | "micro";
