import * as acorn from "acorn";

export interface ParseSuccess {
  success: true;
  ast: acorn.Program;
}

export interface ParseFailure {
  success: false;
  error: { message: string; line: number; column: number };
}

export type ParseResult = ParseSuccess | ParseFailure;

export function parseUserCode(code: string): ParseResult {
  try {
    const ast = acorn.parse(code, {
      ecmaVersion: 2023,
      sourceType: "script",
      locations: true,
    });
    return { success: true, ast };
  } catch (e: unknown) {
    const err = e as SyntaxError & { loc?: { line: number; column: number } };
    return {
      success: false,
      error: {
        message: err.message.replace(/\(\d+:\d+\)$/, "").trim(),
        line: err.loc?.line ?? 1,
        column: err.loc?.column ?? 0,
      },
    };
  }
}
