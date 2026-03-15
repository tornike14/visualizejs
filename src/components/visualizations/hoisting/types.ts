export type HoistingKind = "var" | "function" | "let" | "const" | "function-expr";

export interface CodeLine {
  text: string;
  indent: number;
  id: string;
}

export interface HoistedLine extends CodeLine {
  isHoisted: boolean;
  isTDZ: boolean;
}

export type StepKind =
  | "idle"
  | "hoist"
  | "execute"
  | "tdz-error"
  | "result";

export interface ExecutionStep {
  kind: StepKind;
  highlightOriginal: string[];
  highlightHoisted: string[];
  consoleOutput: string[];
  explanation: string;
  floatingLineIds: string[];
  tdzLineIds: string[];
}

export interface HoistingExample {
  id: string;
  title: string;
  kind: HoistingKind;
  description: string;
  original: CodeLine[];
  hoisted: HoistedLine[];
  steps: ExecutionStep[];
}
