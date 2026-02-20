/**
 * Shared utility functions for sandbox step generators.
 *
 * These helpers handle common AST-walking patterns that most topic generators
 * need: extracting line ranges, building labels, pulling callback bodies, etc.
 *
 * Topic-specific generators import what they need:
 * ```ts
 * import { getLineRange, expressionToLabel, extractCallbackBody, createError } from "@/lib/sandbox/generatorUtils";
 * ```
 */

import type {
  Node,
  ArrowFunctionExpression,
  FunctionExpression,
  Literal,
  Identifier,
  MemberExpression,
  TemplateLiteral,
} from "acorn";
import type { SandboxError, SandboxErrorType } from "@/types/sandbox";

/* ------------------------------------------------------------------ */
/*  Line tracking                                                      */
/* ------------------------------------------------------------------ */

/** Get all line numbers a node spans (1-based, inclusive). */
export function getLineRange(node: Node): number[] {
  if (!node.loc) return [];
  const lines: number[] = [];
  for (let l = node.loc.start.line; l <= node.loc.end.line; l++) lines.push(l);
  return lines;
}

/* ------------------------------------------------------------------ */
/*  Label helpers                                                      */
/* ------------------------------------------------------------------ */

/** Create a short label from a node's source text (truncated to `maxLen`). */
export function expressionToLabel(node: Node, source: string, maxLen = 45): string {
  const raw = source.slice(node.start, node.end);
  if (raw.length <= maxLen) return raw;
  return raw.slice(0, maxLen - 3) + "...";
}

/** Build a short callback label like `() => console.log('x')` from body source. */
export function callbackLabel(bodySource: string, maxLen = 30): string {
  const trimmed = bodySource.trim();
  if (trimmed.length <= maxLen) return `() => ${trimmed}`;
  return `() => ${trimmed.slice(0, maxLen - 3)}...`;
}

/* ------------------------------------------------------------------ */
/*  Callback extraction                                                */
/* ------------------------------------------------------------------ */

/**
 * Get the body statements from an arrow function or function expression.
 * Returns `null` if the node isn't a function.
 *
 * - BlockStatement body: returns the array of body statements
 * - Expression body (e.g. `() => expr`): returns `[expr]`
 */
export function getCallbackBody(node: Node): Node[] | null {
  if (
    node.type === "ArrowFunctionExpression" ||
    node.type === "FunctionExpression"
  ) {
    const fn = node as ArrowFunctionExpression | FunctionExpression;
    if (fn.body.type === "BlockStatement") return fn.body.body;
    return [fn.body];
  }
  return null;
}

/**
 * Extract callback info from a function argument node.
 * Returns label, body statements, and the line range of the body.
 */
export function extractCallbackFromArg(
  arg: Node,
  source: string,
): { label: string; body: Node[]; bodyLines: number[] } | null {
  const body = getCallbackBody(arg);
  if (!body) return null;
  const bodySource = body.map((s) => source.slice(s.start, s.end)).join(" ");
  return {
    label: callbackLabel(bodySource),
    body,
    bodyLines: body.flatMap(getLineRange),
  };
}

/* ------------------------------------------------------------------ */
/*  console.log detection                                              */
/* ------------------------------------------------------------------ */

/** Resolve a node into a display string, optionally using scoped identifier values. */
export function resolveNodeToString(
  node: Node,
  source: string,
  scope: Record<string, string> = {},
): string {
  if (node.type === "Literal") return String((node as Literal).value);

  if (node.type === "Identifier") {
    const name = (node as Identifier).name;
    return scope[name] ?? name;
  }

  if (node.type === "TemplateLiteral") {
    const tpl = node as unknown as TemplateLiteral;
    let out = "";
    for (let i = 0; i < tpl.quasis.length; i++) {
      const quasi = tpl.quasis[i];
      out += quasi.value.cooked ?? quasi.value.raw ?? "";
      const expr = tpl.expressions[i];
      if (expr) {
        out += resolveNodeToString(expr as Node, source, scope);
      }
    }
    return out;
  }

  return source.slice(node.start, node.end);
}

/**
 * If `node` is `console.log(arg)`, returns the string representation of the
 * first argument. Returns `null` otherwise.
 */
export function extractConsoleLogArg(
  node: { type: string; callee: Node; arguments: Node[] },
  source: string,
  scope: Record<string, string> = {},
): string | null {
  const callee = node.callee;
  if (
    callee.type === "MemberExpression" &&
    ((callee as unknown as MemberExpression).object as Identifier).name === "console" &&
    ((callee as unknown as MemberExpression).property as Identifier).name === "log"
  ) {
    if (node.arguments.length === 0) return "";
    return resolveNodeToString(node.arguments[0], source, scope);
  }
  return null;
}

/* ------------------------------------------------------------------ */
/*  Error factory                                                      */
/* ------------------------------------------------------------------ */

/** Convenience factory for creating `SandboxError` objects. */
export function createError(
  type: SandboxErrorType,
  message: string,
  line?: number,
  column?: number,
): SandboxError {
  return { type, message, ...(line != null ? { line } : {}), ...(column != null ? { column } : {}) };
}

/** Escape untrusted text before interpolating into HTML strings. */
export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
