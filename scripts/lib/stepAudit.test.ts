import { describe, expect, it } from "vitest";
import {
  auditExample,
  flattenExamples,
  isBraceOnly,
  isComment,
  isTrivial,
  type AuditExample,
} from "./stepAudit";

const lines = (...texts: string[]) =>
  texts.map((text, index) => ({ num: index + 1, text }));

const example = (overrides: Partial<AuditExample> = {}): AuditExample => ({
  id: "sample",
  codeLines: lines(
    "function add(a, b) {",
    "  const sum = a + b;",
    "  return sum;",
    "}",
    "add(1, 2);",
  ),
  steps: [
    { descriptionHtml: "Declare", activeLine: 1, doneLines: [] },
    { descriptionHtml: "Call", activeLine: 5, doneLines: [1] },
    { descriptionHtml: "Sum", activeLine: 2, doneLines: [1, 5] },
    { descriptionHtml: "Return", activeLine: 3, doneLines: [1, 2, 5] },
  ],
  ...overrides,
});

describe("line classifiers", () => {
  it("recognises brace-only and punctuation-only lines", () => {
    expect(isBraceOnly("}")).toBe(true);
    expect(isBraceOnly("  });")).toBe(true);
    expect(isBraceOnly("")).toBe(true);
    expect(isBraceOnly("return;")).toBe(false);
  });

  it("recognises comments in JS, SQL, and shell style", () => {
    expect(isComment("// note")).toBe(true);
    expect(isComment("  -- sql")).toBe(true);
    expect(isComment("# shell")).toBe(true);
    expect(isComment("const x = 1; // trailing")).toBe(false);
  });

  it("treats braces and comments as trivial", () => {
    expect(isTrivial("}")).toBe(true);
    expect(isTrivial("// c")).toBe(true);
    expect(isTrivial("let a;")).toBe(false);
  });
});

describe("auditExample", () => {
  it("passes a clean example without errors or warnings", () => {
    expect(auditExample(example())).toEqual({ errors: [], warnings: [] });
  });

  it("flags active lines outside the code", () => {
    const { errors } = auditExample(
      example({
        steps: [{ descriptionHtml: "x", activeLine: 9, doneLines: [] }],
      }),
    );
    expect(errors).toContain("sample #1: activeLine 9 is outside 1..5");
  });

  it("flags done lines outside the code", () => {
    const { errors } = auditExample(
      example({
        steps: [{ descriptionHtml: "x", activeLine: 1, doneLines: [0, 6] }],
      }),
    );
    expect(errors).toEqual([
      "sample #1: doneLine 0 is outside 1..5",
      "sample #1: doneLine 6 is outside 1..5",
    ]);
  });

  it("flags an active line that is blank", () => {
    const { errors } = auditExample(
      example({
        codeLines: lines("a();", "", "b();"),
        steps: [{ descriptionHtml: "x", activeLine: 2, doneLines: [] }],
      }),
    );
    expect(errors).toContain("sample #1: activeLine 2 is a blank line");
  });

  it("flags an active line that also appears in doneLines", () => {
    const { errors } = auditExample(
      example({
        steps: [{ descriptionHtml: "x", activeLine: 2, doneLines: [1, 2] }],
      }),
    );
    expect(errors).toContain("sample #1: activeLine 2 is also in doneLines");
  });

  it("warns, rather than errors, for brace-only and comment lines", () => {
    const { errors, warnings } = auditExample(
      example({
        codeLines: lines("// setup", "run();", "}"),
        steps: [
          { descriptionHtml: "x", activeLine: 1, doneLines: [] },
          { descriptionHtml: "x", activeLine: 3, doneLines: [1, 2] },
        ],
      }),
    );
    expect(errors).toEqual([]);
    expect(warnings).toContain(
      'sample #1: activeLine 1 is a comment: "// setup"',
    );
    expect(warnings).toContain(
      'sample #2: activeLine 3 is only a brace: "}" (fine for a return step)',
    );
  });

  it("warns after three consecutive steps without an active line", () => {
    const blank = {
      descriptionHtml: "x",
      activeLine: null,
      doneLines: [1, 2, 3, 4, 5],
    };
    const { warnings } = auditExample(
      example({ steps: [blank, blank, blank, blank] }),
    );
    expect(warnings.filter((w) => w.includes("three steps in a row"))).toEqual([
      "sample #3: three steps in a row with no active line",
    ]);
  });

  it("warns when more than two done lines disappear between steps", () => {
    const { warnings } = auditExample(
      example({
        steps: [
          { descriptionHtml: "x", activeLine: 5, doneLines: [1, 2, 3, 4] },
          { descriptionHtml: "x", activeLine: 5, doneLines: [] },
        ],
      }),
    );
    expect(warnings).toContain("sample #2: doneLines dropped 1,2,3,4");
  });

  it("tolerates up to two done lines disappearing", () => {
    const { warnings } = auditExample(
      example({
        steps: [
          { descriptionHtml: "x", activeLine: 5, doneLines: [1, 2] },
          { descriptionHtml: "x", activeLine: 5, doneLines: [] },
        ],
      }),
    );
    expect(warnings.some((w) => w.includes("dropped"))).toBe(false);
  });

  it("warns about non-trivial lines that never light up", () => {
    const { warnings } = auditExample(
      example({
        steps: [{ descriptionHtml: "x", activeLine: 1, doneLines: [] }],
      }),
    );
    expect(warnings).toContain("sample: lines never active or done: 2,3,5");
  });

  it("only checks identifier mentions in strict mode", () => {
    const strictExample = example({
      steps: [
        {
          descriptionHtml: "Calls <code>add</code> now",
          activeLine: 3,
          doneLines: [1, 2],
        },
      ],
    });
    expect(
      auditExample(strictExample).warnings.some((w) => w.includes("mentions")),
    ).toBe(false);
    const strict = auditExample(strictExample, { strict: true });
    expect(strict.warnings).toContain(
      "sample #1: mentions <code>add</code> (line 1) but active line is 3",
    );
  });

  it("accepts strict mentions of identifiers on neighbouring lines", () => {
    const { warnings } = auditExample(
      example({
        steps: [
          {
            descriptionHtml: "Adds <code>sum</code>",
            activeLine: 3,
            doneLines: [1, 2],
          },
        ],
      }),
      { strict: true },
    );
    expect(warnings.some((w) => w.includes("mentions"))).toBe(false);
  });
});

describe("flattenExamples", () => {
  const codeLines = lines("a();");
  const steps = [{ descriptionHtml: "x", activeLine: 1, doneLines: [] }];

  it("wraps single-example topics as a default example", () => {
    expect(flattenExamples({ STEPS: steps, CODE_LINES: codeLines })).toEqual([
      { id: "default", codeLines, steps },
    ]);
  });

  it("passes selector examples through", () => {
    expect(
      flattenExamples({ EXAMPLES: [{ id: "one", codeLines, steps }] }),
    ).toEqual([{ id: "one", codeLines, steps }]);
  });

  it("flattens variants into method-suffixed examples", () => {
    expect(
      flattenExamples({
        EXAMPLES: [
          {
            id: "deep",
            variants: [
              { methodId: "clone", codeLines, steps },
              { methodId: "json", codeLines, steps },
            ],
          },
        ],
      }),
    ).toEqual([
      { id: "deep/clone", codeLines, steps },
      { id: "deep/json", codeLines, steps },
    ]);
  });

  it("skips examples without code and returns nothing for other modules", () => {
    expect(flattenExamples({ EXAMPLES: [{ id: "empty" }] })).toEqual([]);
    expect(flattenExamples({})).toEqual([]);
  });
});
