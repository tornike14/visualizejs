import { describe, expect, it } from "vitest";
import {
  TOKEN_CLASS_MAP,
  tokenize,
  type Token,
} from "@/lib/visualization/syntax";

const types = (text: string) => tokenize(text).map((token) => token.type);
const values = (text: string) => tokenize(text).map((token) => token.value);
const joined = (tokens: Token[]) => tokens.map((token) => token.value).join("");

describe("tokenize", () => {
  it("round-trips the input text exactly", () => {
    const samples = [
      "const fn = outer();",
      "  console.log(`Hi ${name}`); // greet",
      "if (a >= 2 && b !== 'x') { return null; }",
      "let total = 0.5 + 12;",
      "",
      "   ",
      "\t\tfoo($bar_1)",
    ];
    for (const sample of samples) {
      expect(joined(tokenize(sample))).toBe(sample);
    }
  });

  it("returns no tokens for an empty string", () => {
    expect(tokenize("")).toEqual([]);
  });

  it("classifies keywords, builtins, and builtin methods", () => {
    expect(tokenize("const")).toEqual([{ type: "keyword", value: "const" }]);
    expect(tokenize("console")).toEqual([
      { type: "builtin", value: "console" },
    ]);
    expect(tokenize("log")).toEqual([{ type: "function", value: "log" }]);
    expect(tokenize("Promise.then")).toEqual([
      { type: "builtin", value: "Promise" },
      { type: "punctuation", value: "." },
      { type: "function", value: "then" },
    ]);
  });

  it("treats unknown identifiers as plain text", () => {
    expect(tokenize("myVariable_2$")).toEqual([
      { type: "plain", value: "myVariable_2$" },
    ]);
  });

  it("keeps whitespace runs as a single plain token", () => {
    expect(tokenize("a   b")).toEqual([
      { type: "plain", value: "a" },
      { type: "plain", value: "   " },
      { type: "plain", value: "b" },
    ]);
  });

  it("tokenizes single, double, and backtick strings including escapes", () => {
    expect(values("'it\\'s'")).toEqual(["'it\\'s'"]);
    expect(types("'it\\'s'")).toEqual(["string"]);
    expect(tokenize('"a" + `b`')).toEqual([
      { type: "string", value: '"a"' },
      { type: "plain", value: " " },
      { type: "punctuation", value: "+" },
      { type: "plain", value: " " },
      { type: "string", value: "`b`" },
    ]);
  });

  it("swallows the rest of the line for an unterminated string", () => {
    expect(tokenize("'open string")).toEqual([
      { type: "string", value: "'open string" },
    ]);
  });

  it("treats everything after // as one comment token", () => {
    expect(tokenize("x = 1; // set 'x' to 1")).toEqual([
      { type: "plain", value: "x" },
      { type: "plain", value: " " },
      { type: "punctuation", value: "=" },
      { type: "plain", value: " " },
      { type: "number", value: "1" },
      { type: "punctuation", value: ";" },
      { type: "plain", value: " " },
      { type: "comment", value: "// set 'x' to 1" },
    ]);
  });

  it("does not mistake a division for a comment", () => {
    expect(types("a / b")).toEqual([
      "plain",
      "plain",
      "punctuation",
      "plain",
      "plain",
    ]);
  });

  it("reads integers and decimals as numbers", () => {
    expect(tokenize("42 3.14")).toEqual([
      { type: "number", value: "42" },
      { type: "plain", value: " " },
      { type: "number", value: "3.14" },
    ]);
  });

  it("marks the arrow as a keyword and other symbols as punctuation", () => {
    expect(tokenize("() => {}")).toEqual([
      { type: "punctuation", value: "(" },
      { type: "punctuation", value: ")" },
      { type: "plain", value: " " },
      { type: "keyword", value: "=>" },
      { type: "plain", value: " " },
      { type: "punctuation", value: "{" },
      { type: "punctuation", value: "}" },
    ]);
    expect(tokenize("a>=b")).toEqual([
      { type: "plain", value: "a" },
      { type: "punctuation", value: ">" },
      { type: "punctuation", value: "=" },
      { type: "plain", value: "b" },
    ]);
  });

  it("returns the cached token array for repeated lines", () => {
    const first = tokenize("const cached = true;");
    const second = tokenize("const cached = true;");
    expect(second).toBe(first);
  });

  it("evicts the oldest entry once the cache is full", () => {
    const line = "let evictMe = 1;";
    const original = tokenize(line);
    for (let i = 0; i < 2000; i += 1) tokenize(`let filler${i} = ${i};`);
    const again = tokenize(line);
    expect(again).toEqual(original);
    expect(again).not.toBe(original);
  });
});

describe("TOKEN_CLASS_MAP", () => {
  it("gives every visible token type a class and plain text none", () => {
    expect(TOKEN_CLASS_MAP.plain).toBe("");
    for (const [type, className] of Object.entries(TOKEN_CLASS_MAP)) {
      if (type === "plain") continue;
      expect(className).toMatch(/^tok-[a-z]+$/);
    }
  });
});
