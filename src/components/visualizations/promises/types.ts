import type { SourceLine, BaseStep } from "@/types/visualization";

export type PromiseKind = "basic" | "chaining" | "async-await";

export interface PromiseObj {
  name: string;
  state: "pending" | "fulfilled" | "rejected";
  value: string;
}

export interface PromiseStep extends BaseStep {
  promises: PromiseObj[];
  microtasks: string[];
  consoleOutput: string[];
}

export interface PromiseExample {
  id: string;
  title: string;
  kind: PromiseKind;
  description: string;
  codeLines: SourceLine[];
  steps: PromiseStep[];
}
