import * as acorn from "acorn";
import type { CallExpression, ExpressionStatement, Node } from "acorn";
import { describe, expect, it } from "vitest";
import {
  callbackLabel,
  createError,
  escapeHtml,
  expressionToLabel,
  extractCallbackFromArg,
  extractConsoleLogArg,
  getCallbackBody,
  getLineRange,
  resolveNodeToString,
} from "@/lib/sandbox/generatorUtils";

const parse = (source: string) =>
  acorn.parse(source, { ecmaVersion: 2023, locations: true });

const firstExpression = (source: string) =>
  (parse(source).body[0] as ExpressionStatement).expression;

const firstCall = (source: string) =>
  firstExpression(source) as unknown as CallExpression & {
    callee: Node;
    arguments: Node[];
  };

describe("getLineRange", () => {
  it("lists every line a node spans, inclusive", () => {
    const source = "setTimeout(() => {\n  a();\n  b();\n}, 0);";
    expect(getLineRange(parse(source).body[0])).toEqual([1, 2, 3, 4]);
  });

  it("returns a single line for a one-line node", () => {
    expect(getLineRange(parse("x;").body[0])).toEqual([1]);
  });

  it("returns nothing when the node has no location info", () => {
    const node = acorn.parse("x;", { ecmaVersion: 2023 }).body[0];
    expect(getLineRange(node)).toEqual([]);
  });
});

describe("expressionToLabel", () => {
  it("returns the source text when it fits", () => {
    const source = "console.log('short');";
    expect(expressionToLabel(firstExpression(source), source)).toBe(
      "console.log('short')",
    );
  });

  it("truncates long source with an ellipsis at the limit", () => {
    const source =
      "someFunction('a very long argument that keeps going and going');";
    const label = expressionToLabel(firstExpression(source), source, 20);
    expect(label).toBe("someFunction('a v...");
    expect(label).toHaveLength(20);
  });
});

describe("callbackLabel", () => {
  it("wraps trimmed body source in an arrow", () => {
    expect(callbackLabel("  console.log('x')  ")).toBe(
      "() => console.log('x')",
    );
  });

  it("truncates long bodies", () => {
    expect(callbackLabel("console.log('a much longer body here')", 12)).toBe(
      "() => console.l...",
    );
  });
});

describe("getCallbackBody", () => {
  it("returns block statements for a block body", () => {
    const call = firstCall("run(() => { a(); b(); });");
    const body = getCallbackBody(call.arguments[0]);
    expect(body?.map((node) => node.type)).toEqual([
      "ExpressionStatement",
      "ExpressionStatement",
    ]);
  });

  it("wraps an expression body in an array", () => {
    const call = firstCall("run(() => a());");
    const body = getCallbackBody(call.arguments[0]);
    expect(body?.map((node) => node.type)).toEqual(["CallExpression"]);
  });

  it("supports function expressions", () => {
    const call = firstCall("run(function () { a(); });");
    expect(getCallbackBody(call.arguments[0])).toHaveLength(1);
  });

  it("returns null for non-function arguments", () => {
    const call = firstCall("run(42);");
    expect(getCallbackBody(call.arguments[0])).toBeNull();
  });
});

describe("extractCallbackFromArg", () => {
  it("builds a label, body, and line range", () => {
    const source = "setTimeout(() => {\n  a();\n  b();\n}, 0);";
    const call = firstCall(source);
    const info = extractCallbackFromArg(call.arguments[0], source);
    expect(info).toEqual({
      label: "() => a(); b();",
      body: expect.any(Array),
      bodyLines: [2, 3],
    });
    expect(info?.body).toHaveLength(2);
  });

  it("returns null when the argument is not a function", () => {
    const source = "setTimeout('a', 0);";
    expect(
      extractCallbackFromArg(firstCall(source).arguments[0], source),
    ).toBeNull();
  });
});

describe("resolveNodeToString", () => {
  it("prints literals by value", () => {
    const source = "42;";
    expect(resolveNodeToString(firstExpression(source), source)).toBe("42");
    const text = "'hello';";
    expect(resolveNodeToString(firstExpression(text), text)).toBe("hello");
  });

  it("substitutes identifiers from scope and keeps unknown names", () => {
    const source = "name;";
    const node = firstExpression(source);
    expect(resolveNodeToString(node, source, { name: "Ann" })).toBe("Ann");
    expect(resolveNodeToString(node, source)).toBe("name");
  });

  it("interpolates template literals using scope", () => {
    const source = "`Hi ${name}, you are ${age}`;";
    expect(
      resolveNodeToString(firstExpression(source), source, { name: "Bo" }),
    ).toBe("Hi Bo, you are age");
  });

  it("falls back to the source text for other expressions", () => {
    const source = "a + b;";
    expect(resolveNodeToString(firstExpression(source), source)).toBe("a + b");
  });
});

describe("extractConsoleLogArg", () => {
  it("returns the first argument of console.log", () => {
    const source = "console.log('Start');";
    expect(extractConsoleLogArg(firstCall(source), source)).toBe("Start");
  });

  it("resolves identifiers through scope", () => {
    const source = "console.log(msg);";
    expect(extractConsoleLogArg(firstCall(source), source, { msg: "hi" })).toBe(
      "hi",
    );
  });

  it("returns an empty string for console.log()", () => {
    const source = "console.log();";
    expect(extractConsoleLogArg(firstCall(source), source)).toBe("");
  });

  it("returns null for other calls", () => {
    const warn = "console.warn('x');";
    expect(extractConsoleLogArg(firstCall(warn), warn)).toBeNull();
    const plain = "log('x');";
    expect(extractConsoleLogArg(firstCall(plain), plain)).toBeNull();
    const member = "logger.log('x');";
    expect(extractConsoleLogArg(firstCall(member), member)).toBeNull();
  });
});

describe("createError", () => {
  it("omits line and column when they are not given", () => {
    expect(createError("parse-error", "bad")).toEqual({
      type: "parse-error",
      message: "bad",
    });
  });

  it("includes line and column when given, even zero", () => {
    expect(createError("unsupported-pattern", "bad", 3, 0)).toEqual({
      type: "unsupported-pattern",
      message: "bad",
      line: 3,
      column: 0,
    });
  });
});

describe("escapeHtml", () => {
  it("escapes every character that can break out of markup", () => {
    expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe(
      "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;",
    );
  });

  it("leaves safe text alone", () => {
    expect(escapeHtml("plain text 123")).toBe("plain text 123");
  });

  it("escapes ampersands first so entities are not double encoded", () => {
    expect(escapeHtml("&lt;")).toBe("&amp;lt;");
  });
});
