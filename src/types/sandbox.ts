export interface SandboxConfig {
  topicId: string;
  defaultCode: string;
  supportedPatterns: string[];
  maxCodeLines: number;
  maxCodeLength: number;
}

export type SandboxErrorType =
  | "parse-error"
  | "unsupported-pattern"
  | "code-too-long"
  | "generation-error";

export interface SandboxError {
  type: SandboxErrorType;
  message: string;
  line?: number;
  column?: number;
}

export type StepGenerationResult<TStep, TCodeLine> =
  | { success: true; steps: TStep[]; codeLines: TCodeLine[] }
  | { success: false; error: SandboxError };

/** A generator function that turns a parsed AST + source into steps for a topic. */
export type StepGenerator<TStep, TCodeLine> = (
  ast: import("acorn").Program,
  source: string,
) => StepGenerationResult<TStep, TCodeLine>;
