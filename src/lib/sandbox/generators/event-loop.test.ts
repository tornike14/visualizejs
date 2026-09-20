import { describe, expect, it } from "vitest";
import { SANDBOX_CONFIGS } from "@/lib/sandbox/configs";
import {
  generateEventLoopSteps,
  type EventLoopStep,
} from "@/lib/sandbox/generators/event-loop";
import { parseUserCode } from "@/lib/sandbox/parser";

const run = (source: string) => {
  const parsed = parseUserCode(source);
  if (!parsed.success) throw new Error(parsed.error.message);
  return generateEventLoopSteps(parsed.ast, source);
};

const steps = (source: string): EventLoopStep[] => {
  const result = run(source);
  if (!result.success) throw new Error(result.error.message);
  return result.steps;
};

const output = (source: string) => steps(source).at(-1)?.consoleOutput ?? [];

const failure = (source: string) => {
  const result = run(source);
  if (result.success) throw new Error("expected generation to fail");
  return result.error;
};

/** Every step is a snapshot: shape checks that hold for any program. */
const expectWellFormed = (source: string) => {
  const result = run(source);
  expect(result.success).toBe(true);
  if (!result.success) return;
  const lineCount = source.split("\n").length;
  expect(result.codeLines).toHaveLength(lineCount);
  result.codeLines.forEach((line, index) => {
    expect(line.num).toBe(index + 1);
  });

  const list = result.steps;
  expect(list.length).toBeGreaterThan(0);
  for (let i = 0; i < list.length; i += 1) {
    const step = list[i];
    expect(step.descriptionHtml.trim().length).toBeGreaterThan(0);
    expect([...step.doneLines]).toEqual(
      [...step.doneLines].sort((a, b) => a - b),
    );
    expect(new Set(step.doneLines).size).toBe(step.doneLines.length);
    for (const line of step.doneLines) {
      expect(line).toBeGreaterThanOrEqual(1);
      expect(line).toBeLessThanOrEqual(lineCount);
    }
    if (step.activeLine !== null) {
      expect(step.activeLine).toBeGreaterThanOrEqual(1);
      expect(step.activeLine).toBeLessThanOrEqual(lineCount);
    }
    expect(["idle", "checking", "running"]).toContain(step.loopLabel);
    if (step.loopLabel === "idle") expect(step.loopActive).toBe(false);
    if (step.loopLabel !== "idle") expect(step.loopActive).toBe(true);

    const next = list[i + 1];
    if (next) {
      // Console output only grows, one line at a time.
      expect(next.consoleOutput.slice(0, step.consoleOutput.length)).toEqual(
        step.consoleOutput,
      );
      expect(
        next.consoleOutput.length - step.consoleOutput.length,
      ).toBeLessThanOrEqual(1);
      // Snapshots never share arrays, so playback can move in both directions.
      expect(next.stack).not.toBe(step.stack);
      expect(next.consoleOutput).not.toBe(step.consoleOutput);
      expect(next.doneLines).not.toBe(step.doneLines);
    }
  }

  const last = list[list.length - 1];
  expect(last.stack).toEqual([]);
  expect(last.webApis).toEqual([]);
  expect(last.taskQueue).toEqual([]);
  expect(last.microtaskQueue).toEqual([]);
  expect(last.loopLabel).toBe("idle");
  expect(last.descriptionHtml).toContain("<strong>Done!</strong>");
  expect(last.doneLines).toEqual(
    Array.from({ length: lineCount }, (_, index) => index + 1),
  );
};

describe("generateEventLoopSteps", () => {
  describe("default sandbox program", () => {
    const source = SANDBOX_CONFIGS["event-loop"].defaultCode;

    it("logs synchronous code, then microtasks, then the timer", () => {
      expect(output(source)).toEqual([
        "Start",
        "End",
        "Promise 1",
        "Promise 2",
        "Timeout",
      ]);
    });

    it("summarises the output order in the final step", () => {
      const last = steps(source).at(-1)!;
      expect(last.descriptionHtml).toContain(
        "Start → End → Promise 1 → Promise 2 → Timeout",
      );
    });

    it("produces well formed snapshots", () => {
      expectWellFormed(source);
    });

    it("shows the timer in Web APIs while it is pending", () => {
      const withTimer = steps(source).filter((step) =>
        step.webApis.includes("Timer (0ms)"),
      );
      expect(withTimer.length).toBe(1);
      expect(withTimer[0].descriptionHtml).toContain("Web APIs");
    });

    it("moves the timer callback into the task queue before any microtask runs", () => {
      const list = steps(source);
      const queued = list.findIndex((step) => step.taskQueue.length === 1);
      const firstMicroRun = list.findIndex((step) =>
        step.consoleOutput.includes("Promise 1"),
      );
      expect(queued).toBeGreaterThan(-1);
      expect(queued).toBeLessThan(firstMicroRun);
      expect(list[queued].taskQueue[0]).toBe("() => console.log('Timeout');");
    });

    it("keeps the loop idle during synchronous execution and active while draining", () => {
      const list = steps(source);
      const endIndex = list.findIndex((step) =>
        step.consoleOutput.includes("End"),
      );
      for (const step of list.slice(0, endIndex + 1)) {
        expect(step.loopLabel).toBe("idle");
      }
      const checking = list.find((step) => step.loopLabel === "checking");
      expect(checking?.descriptionHtml).toContain("Event Loop");
    });
  });

  describe("ordering semantics", () => {
    it("runs microtasks before tasks even when the timer was scheduled first", () => {
      expect(
        output(
          "setTimeout(() => console.log('T'), 0);\nPromise.resolve().then(() => console.log('M'));",
        ),
      ).toEqual(["M", "T"]);
    });

    it("treats queueMicrotask and promise callbacks as one FIFO queue", () => {
      expect(
        output(
          "Promise.resolve().then(() => console.log('P'));\nqueueMicrotask(() => console.log('Q'));",
        ),
      ).toEqual(["P", "Q"]);
      expect(
        output(
          "queueMicrotask(() => console.log('Q'));\nPromise.resolve().then(() => console.log('P'));",
        ),
      ).toEqual(["Q", "P"]);
    });

    it("interleaves promise chains the way the real microtask queue does", () => {
      const source = [
        "Promise.resolve().then(() => console.log('A1')).then(() => console.log('A2'));",
        "Promise.resolve().then(() => console.log('B1'));",
      ].join("\n");
      expect(output(source)).toEqual(["A1", "B1", "A2"]);
    });

    it("queues the next link of a chain only after the previous one ran", () => {
      const source =
        "Promise.resolve()\n  .then(() => console.log('one'))\n  .then(() => console.log('two'));";
      const list = steps(source);
      const chained = list.find((step) =>
        step.descriptionHtml.includes(
          "Promise chaining queues another callback",
        ),
      );
      expect(chained).toBeDefined();
      expect(chained?.consoleOutput).toEqual(["one"]);
      expect(chained?.microtaskQueue).toEqual(["() => console.log('two')"]);
      expect(output(source)).toEqual(["one", "two"]);
    });

    it("runs timers in FIFO order", () => {
      expect(
        output(
          "setTimeout(() => console.log('T1'), 100);\nsetTimeout(() => console.log('T2'), 0);",
        ),
      ).toEqual(["T1", "T2"]);
    });

    it("drains microtasks scheduled from inside a task before the next task", () => {
      const source = [
        "setTimeout(() => {",
        "  Promise.resolve().then(() => console.log('inner'));",
        "  console.log('timeout 1');",
        "}, 0);",
        "setTimeout(() => console.log('timeout 2'), 0);",
      ].join("\n");
      expect(output(source)).toEqual(["timeout 1", "inner", "timeout 2"]);
      expectWellFormed(source);
    });

    it("runs a microtask scheduled from a microtask before any task", () => {
      const source = [
        "setTimeout(() => console.log('task'), 0);",
        "queueMicrotask(() => {",
        "  queueMicrotask(() => console.log('nested'));",
        "  console.log('outer');",
        "});",
      ].join("\n");
      expect(output(source)).toEqual(["outer", "nested", "task"]);
    });
  });

  describe("statement handling", () => {
    it("hoists function declarations and shows calls on the stack", () => {
      const source = [
        "function greet() {",
        "  console.log('hi');",
        "}",
        "greet();",
      ].join("\n");
      const list = steps(source);
      expect(list[0].descriptionHtml).toContain("hoisted");
      expect(list[0].stack).toEqual(["function greet()"]);
      const call = list.find((step) => step.stack[0] === "greet()");
      expect(call?.activeLine).toBe(4);
      const inner = list.find((step) => step.stack.length === 2);
      expect(inner?.stack).toEqual(["greet()", "console.log('hi')"]);
      expect(output(source)).toEqual(["hi"]);
    });

    it("resolves parameters through template literals", () => {
      const source = [
        "function greet(name) {",
        "  console.log(`Hi ${name}`);",
        "}",
        "greet('Bob');",
        "greet('Ann');",
      ].join("\n");
      expect(output(source)).toEqual(["Hi Bob", "Hi Ann"]);
    });

    it("hints when a function is declared but never called", () => {
      const last = steps("function unused() {}\nconsole.log('x');").at(-1)!;
      expect(last.descriptionHtml).toContain("declared but never called");
      expect(last.descriptionHtml).toContain("<code>unused()</code>");
    });

    it("does not hint when every function was called", () => {
      const last = steps("function f() {}\nf();").at(-1)!;
      expect(last.descriptionHtml).not.toContain("Hint");
    });

    it("handles arrow callbacks with expression bodies", () => {
      expect(output("setTimeout(() => console.log('x'), 0);")).toEqual(["x"]);
    });

    it("treats variable declarations as synchronous work with a short label", () => {
      const list = steps("const total = 1 + 2;");
      expect(list[0].stack).toEqual(["const total = 1 + 2"]);
      expect(list[0].activeLine).toBe(1);
    });

    it("truncates long variable declaration labels", () => {
      const list = steps(
        "const aVeryLongVariableName = 'some fairly long string value';",
      );
      expect(list[0].stack[0].endsWith("...")).toBe(true);
      expect(list[0].stack[0].length).toBe(40);
    });

    it("treats unknown expressions as synchronous work", () => {
      const list = steps("1 + 1;");
      expect(list[0].descriptionHtml).toContain("<code>1 + 1</code>");
      expect(list[0].stack).toEqual(["1 + 1"]);
    });

    it("skips empty statements without emitting steps", () => {
      expect(steps("console.log('a');;").length).toBe(
        steps("console.log('a');").length,
      );
    });

    it("copes with setTimeout and queueMicrotask without a callback", () => {
      const list = steps("setTimeout();\nqueueMicrotask();");
      expect(list.some((step) => step.taskQueue[0] === "() => { ... }")).toBe(
        true,
      );
      expect(
        list.some((step) => step.microtaskQueue[0] === "() => { ... }"),
      ).toBe(true);
      expect(list.at(-1)?.consoleOutput).toEqual([]);
    });

    it("reports no output when nothing was logged", () => {
      expect(steps("const a = 1;").at(-1)?.descriptionHtml).toContain(
        "(no output)",
      );
    });

    it("prints an empty string for console.log()", () => {
      expect(output("console.log();")).toEqual([""]);
    });
  });

  describe("line tracking", () => {
    it("marks a callback body pending while it runs and done afterwards", () => {
      const source = [
        "setTimeout(() => {",
        "  console.log('a');",
        "}, 0);",
      ].join("\n");
      const list = steps(source);
      const executing = list.find(
        (step) => step.activeLine === 2 && step.consoleOutput.includes("a"),
      );
      expect(executing).toBeDefined();
      expect(executing?.doneLines).not.toContain(2);
      expect(list.at(-1)?.doneLines).toEqual([1, 2, 3]);
    });

    it("marks the whole promise chain done once it is scheduled", () => {
      const source =
        "Promise.resolve()\n  .then(() => console.log('a'));\nconsole.log('b');";
      const list = steps(source);
      const sync = list.find((step) => step.consoleOutput.includes("b"));
      expect(sync?.doneLines).toEqual([1, 2]);
    });
  });

  describe("errors", () => {
    it("rejects an empty program", () => {
      const error = failure("");
      expect(error.type).toBe("generation-error");
      expect(error.message).toContain("No statements found");
    });

    it("rejects a program that only has comments", () => {
      expect(failure("// nothing here").type).toBe("generation-error");
    });

    it("rejects unsupported statements with their line", () => {
      const error = failure("console.log('a');\nif (true) {}");
      expect(error.type).toBe("unsupported-pattern");
      expect(error.line).toBe(2);
      expect(error.message).toContain("Unsupported statement: IfStatement");
    });

    it("suggests Promise.resolve for a misspelled promise method", () => {
      const error = failure("Promise.resolv().then(() => {});");
      expect(error.type).toBe("unsupported-pattern");
      expect(error.message).toBe(
        "Promise.resolv() is not a function. Did you mean Promise.resolve()?",
      );
    });

    it("rejects .then() on anything but Promise.resolve()", () => {
      const error = failure("fetch('/api').then(() => {});");
      expect(error.type).toBe("unsupported-pattern");
      expect(error.message).toContain(
        ".then() is only supported on Promise.resolve() chains",
      );
    });

    it("surfaces unsupported statements found inside a callback", () => {
      const error = failure("setTimeout(() => {\n  while (true) {}\n}, 0);");
      expect(error.type).toBe("unsupported-pattern");
      expect(error.line).toBe(2);
      expect(error.message).toContain("WhileStatement");
    });
  });

  describe("html safety", () => {
    const payload = "<img src=x onerror=alert(1)>";
    const source = `console.log('${payload}');`;

    it("escapes user text in every description while keeping console output raw", () => {
      const list = steps(source);
      for (const step of list) {
        expect(step.descriptionHtml).not.toContain("<img");
      }
      expect(list[0].descriptionHtml).toContain(
        "&lt;img src=x onerror=alert(1)&gt;",
      );
      expect(output(source)).toEqual([payload]);
    });

    it("escapes quotes and ampersands in labels", () => {
      const list = steps(`const s = "a & b";`);
      expect(list[0].descriptionHtml).toContain("&quot;a &amp; b&quot;");
    });
  });

  it("produces well formed snapshots for a mixed program", () => {
    expectWellFormed(
      [
        "function work(label) {",
        "  console.log(`start ${label}`);",
        "  queueMicrotask(() => console.log(`micro ${label}`));",
        "}",
        "work('one');",
        "setTimeout(() => {",
        "  work('two');",
        "}, 10);",
        "Promise.resolve().then(() => console.log('then'));",
        "console.log('sync end');",
      ].join("\n"),
    );
  });
});
