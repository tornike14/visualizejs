import { describe, expect, it } from "vitest";
import { parseUserCode } from "@/lib/sandbox/parser";

describe("parseUserCode", () => {
  it("returns a Program with locations for valid code", () => {
    const result = parseUserCode(
      "console.log('hi');\nsetTimeout(() => {}, 0);",
    );
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.ast.type).toBe("Program");
    expect(result.ast.body).toHaveLength(2);
    expect(result.ast.body[1].loc?.start.line).toBe(2);
  });

  it("parses an empty program", () => {
    const result = parseUserCode("");
    expect(result.success).toBe(true);
    if (result.success) expect(result.ast.body).toEqual([]);
  });

  it("accepts modern syntax up to ES2023", () => {
    const result = parseUserCode(
      "const { a = 1, ...rest } = obj;\nconst x = a ?? rest?.b;\nclass C { #p = 1; static s = 2; }",
    );
    expect(result.success).toBe(true);
  });

  it("rejects module syntax because the sandbox parses scripts", () => {
    const result = parseUserCode("import x from 'y';");
    expect(result.success).toBe(false);
  });

  it("reports the line and column of a syntax error", () => {
    const result = parseUserCode("console.log('a');\nconst = 5;");
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.line).toBe(2);
    expect(result.error.column).toBe(6);
    expect(result.error.message).toBe("Unexpected token");
  });

  it("strips the (line:column) suffix from the message", () => {
    const result = parseUserCode("foo(");
    expect(result.success).toBe(false);
    if (result.success) return;
    expect(result.error.message).not.toMatch(/\(\d+:\d+\)/);
    expect(result.error.message.trim()).toBe(result.error.message);
  });
});
