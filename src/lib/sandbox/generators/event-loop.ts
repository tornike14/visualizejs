import type {
  Program,
  Node,
  CallExpression,
  ExpressionStatement,
  VariableDeclaration,
  FunctionDeclaration,
  Literal,
  Identifier,
  MemberExpression,
} from "acorn";
import {
  createError,
  escapeHtml,
  expressionToLabel,
  extractCallbackFromArg,
  extractConsoleLogArg,
  getLineRange,
  resolveNodeToString,
} from "@/lib/sandbox/generatorUtils";
import type { SandboxError } from "@/types/sandbox";

/* ------------------------------------------------------------------ */
/*  Types matching EventLoop.tsx                                       */
/* ------------------------------------------------------------------ */

export interface SourceLine {
  num: number;
  text: string;
}

export interface EventLoopStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  stack: string[];
  webApis: string[];
  taskQueue: string[];
  microtaskQueue: string[];
  consoleOutput: string[];
  loopActive: boolean;
  loopLabel: "idle" | "checking" | "running";
}

export type GeneratorResult =
  | { success: true; codeLines: SourceLine[]; steps: EventLoopStep[] }
  | { success: false; error: SandboxError };

/* ------------------------------------------------------------------ */
/*  Internal scheduling model                                          */
/* ------------------------------------------------------------------ */

interface ScheduledCallback {
  label: string;
  bodyStatements: Node[];
  sourceLine: number;
  /** Lines this callback's body spans */
  bodyLines: number[];
  /** Lexical scope captured when callback was scheduled */
  scope: RuntimeScope;
  /** Remaining .then() entries in a chain */
  chainTail?: ThenChainEntry[];
}

interface SimState {
  stack: string[];
  webApis: string[];
  taskQueue: ScheduledCallback[];
  microtaskQueue: ScheduledCallback[];
  consoleOutput: string[];
  doneLines: number[];
  steps: EventLoopStep[];
  /** User-defined functions (name → declaration node) */
  functions: Map<string, FunctionDeclaration>;
}

type RuntimeScope = Record<string, string>;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function isSetTimeout(node: CallExpression): boolean {
  return node.callee.type === "Identifier" && (node.callee as Identifier).name === "setTimeout";
}

function isQueueMicrotask(node: CallExpression): boolean {
  return node.callee.type === "Identifier" && (node.callee as Identifier).name === "queueMicrotask";
}

function isPromiseResolveThen(node: CallExpression): boolean {
  if (node.callee.type !== "MemberExpression") return false;
  const me = node.callee as MemberExpression;
  if ((me.property as Identifier).name !== "then") return false;

  const obj = me.object;
  if (obj.type === "CallExpression") {
    if (isPromiseResolveCall(obj as CallExpression)) return true;
    if (isPromiseResolveThen(obj as CallExpression)) return true;
  }
  return false;
}

function isPromiseResolveCall(node: CallExpression): boolean {
  if (node.callee.type !== "MemberExpression") return false;
  const me = node.callee as MemberExpression;
  return (
    (me.object as Identifier).type === "Identifier" &&
    (me.object as Identifier).name === "Promise" &&
    (me.property as Identifier).name === "resolve"
  );
}

function detectPromiseMethodTypo(node: CallExpression): string | null {
  let current: CallExpression = node;
  while (
    current.callee.type === "MemberExpression" &&
    (current.callee as MemberExpression).property.type === "Identifier" &&
    ((current.callee as MemberExpression).property as Identifier).name === "then"
  ) {
    const obj = (current.callee as MemberExpression).object;
    if (obj.type !== "CallExpression") break;
    current = obj as CallExpression;
  }
  if (current.callee.type === "MemberExpression") {
    const me = current.callee as MemberExpression;
    if (
      me.object.type === "Identifier" &&
      (me.object as Identifier).name === "Promise" &&
      me.property.type === "Identifier" &&
      (me.property as Identifier).name !== "resolve"
    ) {
      return (me.property as Identifier).name;
    }
  }
  return null;
}

function hasThenCall(node: CallExpression): boolean {
  if (node.callee.type !== "MemberExpression") return false;
  const prop = (node.callee as MemberExpression).property;
  return prop.type === "Identifier" && (prop as Identifier).name === "then";
}

function isUserFunctionCall(node: CallExpression, state: SimState): boolean {
  return (
    node.callee.type === "Identifier" &&
    state.functions.has((node.callee as Identifier).name)
  );
}

/* ------------------------------------------------------------------ */
/*  Step emitters                                                      */
/* ------------------------------------------------------------------ */

function pushStep(state: SimState, partial: Partial<EventLoopStep> & { descriptionHtml: string }) {
  state.steps.push({
    descriptionHtml: partial.descriptionHtml,
    activeLine: partial.activeLine ?? null,
    doneLines: [...state.doneLines],
    stack: [...state.stack],
    webApis: [...state.webApis],
    taskQueue: state.taskQueue.map((c) => c.label),
    microtaskQueue: state.microtaskQueue.map((c) => c.label),
    consoleOutput: [...state.consoleOutput],
    loopActive: partial.loopActive ?? false,
    loopLabel: partial.loopLabel ?? "idle",
  });
}

function markDone(state: SimState, lines: number[]) {
  for (const l of lines) {
    if (!state.doneLines.includes(l)) state.doneLines.push(l);
  }
}

/* ------------------------------------------------------------------ */
/*  Collect .then() chains                                             */
/* ------------------------------------------------------------------ */

interface ThenChainEntry {
  callback: { label: string; body: Node[]; bodyLines: number[] };
  callNode: CallExpression;
}

function collectThenChain(
  node: CallExpression,
  source: string,
): ThenChainEntry[] {
  const entries: ThenChainEntry[] = [];

  function walk(n: CallExpression) {
    if (n.callee.type === "MemberExpression") {
      const obj = (n.callee as MemberExpression).object;
      if (obj.type === "CallExpression" && isPromiseResolveThen(obj as CallExpression)) {
        walk(obj as CallExpression);
      }
    }
    if ((((n.callee as MemberExpression).property) as Identifier).name === "then" && n.arguments.length > 0) {
      const cb = extractCallbackFromArg(n.arguments[0], source);
      if (cb) {
        entries.push({ callback: cb, callNode: n });
      }
    }
  }

  walk(node);
  return entries;
}

/* ------------------------------------------------------------------ */
/*  Process a call expression                                          */
/*  Extracted so both ExpressionStatement and bare CallExpression       */
/*  (from arrow expression bodies) use the same logic.                 */
/* ------------------------------------------------------------------ */

function processCallExpression(
  expr: CallExpression,
  node: Node,
  source: string,
  state: SimState,
  isInsideCallback: boolean,
  scope: RuntimeScope,
): SandboxError | null | "unhandled" {
  const lines = getLineRange(node);
  const line = node.loc?.start.line ?? null;

  // console.log(...)
  const logArg = extractConsoleLogArg(expr, source, scope);
  if (logArg !== null) {
    const label = `console.log('${logArg}')`;
    const safeLabel = escapeHtml(label);
    const safeLogArg = escapeHtml(logArg);
    state.stack.push(label);
    state.consoleOutput.push(logArg);
    pushStep(state, {
      descriptionHtml: `<span class="hl-stack">Call Stack</span> executes <code>${safeLabel}</code>. Output: <strong>${safeLogArg}</strong>.`,
      activeLine: line,
      loopActive: isInsideCallback,
      loopLabel: isInsideCallback ? "running" : "idle",
    });
    state.stack.pop();
    markDone(state, lines);
    return null;
  }

  // setTimeout(cb, delay)
  if (isSetTimeout(expr)) {
    const delay =
      expr.arguments[1]?.type === "Literal"
        ? String((expr.arguments[1] as Literal).value)
        : "0";
    const cb = expr.arguments[0] ? extractCallbackFromArg(expr.arguments[0], source) : null;

    const stLabel = `setTimeout(cb, ${delay})`;
    const safeStLabel = escapeHtml(stLabel);
    state.stack.push(stLabel);
    pushStep(state, {
      descriptionHtml: `<code>${safeStLabel}</code> is pushed to the <span class="hl-stack">Call Stack</span>.`,
      activeLine: line,
      loopActive: isInsideCallback,
      loopLabel: isInsideCallback ? "running" : "idle",
    });

    state.stack.pop();
    state.webApis.push(`Timer (${delay}ms)`);
    pushStep(state, {
      descriptionHtml: `<code>setTimeout</code> delegates to <span class="hl-api">Web APIs</span>, and a timer starts.`,
      activeLine: line,
      loopActive: isInsideCallback,
      loopLabel: isInsideCallback ? "running" : "idle",
    });

    state.webApis.pop();
    const scheduled: ScheduledCallback = {
      label: cb?.label ?? `() => { ... }`,
      bodyStatements: cb?.body ?? [],
      sourceLine: line ?? 0,
      bodyLines: cb?.bodyLines ?? [],
      scope: { ...scope },
    };
    state.taskQueue.push(scheduled);
    pushStep(state, {
      descriptionHtml: `Timer completes, so callback moves into the <span class="hl-task">Task Queue</span>.`,
      activeLine: null,
      loopActive: isInsideCallback,
      loopLabel: isInsideCallback ? "running" : "idle",
    });

    markDone(state, lines);
    if (cb) markDone(state, cb.bodyLines);
    return null;
  }

  // queueMicrotask(cb)
  if (isQueueMicrotask(expr)) {
    const cb = expr.arguments[0] ? extractCallbackFromArg(expr.arguments[0], source) : null;

    const qmLabel = "queueMicrotask(cb)";
    const safeQmLabel = escapeHtml(qmLabel);
    state.stack.push(qmLabel);
    pushStep(state, {
      descriptionHtml: `<code>${safeQmLabel}</code> is pushed to the <span class="hl-stack">Call Stack</span>.`,
      activeLine: line,
      loopActive: isInsideCallback,
      loopLabel: isInsideCallback ? "running" : "idle",
    });

    state.stack.pop();
    const scheduled: ScheduledCallback = {
      label: cb?.label ?? `() => { ... }`,
      bodyStatements: cb?.body ?? [],
      sourceLine: line ?? 0,
      bodyLines: cb?.bodyLines ?? [],
      scope: { ...scope },
    };
    state.microtaskQueue.push(scheduled);
    pushStep(state, {
      descriptionHtml: `Callback is queued in the <span class="hl-micro">Microtask Queue</span> (same priority as Promise callbacks).`,
      activeLine: line,
      loopActive: isInsideCallback,
      loopLabel: isInsideCallback ? "running" : "idle",
    });

    markDone(state, lines);
    if (cb) markDone(state, cb.bodyLines);
    return null;
  }

  // Promise.resolve().then(cb).then(cb)...
  if (isPromiseResolveThen(expr)) {
    const chain = collectThenChain(expr, source);
    const allLines = getLineRange(node);

    const promiseLabel = "Promise.resolve().then(cb)";
    const safePromiseLabel = escapeHtml(promiseLabel);
    state.stack.push(promiseLabel);
    pushStep(state, {
      descriptionHtml: `<code>${safePromiseLabel}</code> is pushed to the <span class="hl-stack">Call Stack</span>.`,
      activeLine: line,
      loopActive: isInsideCallback,
      loopLabel: isInsideCallback ? "running" : "idle",
    });

    state.stack.pop();
    if (chain.length > 0) {
      const first = chain[0];
      const scheduled: ScheduledCallback = {
        label: first.callback.label,
        bodyStatements: first.callback.body,
        sourceLine: first.callNode.loc?.start.line ?? 0,
        bodyLines: first.callback.bodyLines,
        scope: { ...scope },
        chainTail: chain.slice(1),
      };
      state.microtaskQueue.push(scheduled);
    }

    pushStep(state, {
      descriptionHtml: `Promise resolves and the first callback enters the <span class="hl-micro">Microtask Queue</span> (higher priority than tasks).`,
      activeLine: line,
      loopActive: isInsideCallback,
      loopLabel: isInsideCallback ? "running" : "idle",
    });

    markDone(state, allLines);
    return null;
  }

  // User-defined function call: foo()
  if (isUserFunctionCall(expr, state)) {
    const fnName = (expr.callee as Identifier).name;
    const fnDecl = state.functions.get(fnName)!;
    const fnLabel = `${fnName}()`;
    const safeFnLabel = escapeHtml(fnLabel);
    const functionScope: RuntimeScope = { ...scope };

    for (const [index, param] of fnDecl.params.entries()) {
      if (param.type !== "Identifier") continue;
      const arg = expr.arguments[index];
      if (!arg) continue;
      functionScope[param.name] = resolveNodeToString(arg, source, scope);
    }

    state.stack.push(fnLabel);
    pushStep(state, {
      descriptionHtml: `<code>${safeFnLabel}</code> is called and pushed to the <span class="hl-stack">Call Stack</span>.`,
      activeLine: line,
      loopActive: isInsideCallback,
      loopLabel: isInsideCallback ? "running" : "idle",
    });

    // Un-mark function body lines so they show as active when executing
    const fnBodyLines = fnDecl.body.body.flatMap(getLineRange);
    state.doneLines = state.doneLines.filter((l) => !fnBodyLines.includes(l));

    for (const stmt of fnDecl.body.body) {
      const err = processStatement(
        stmt,
        source,
        state,
        isInsideCallback,
        functionScope,
      );
      if (err) return err;
    }

    state.stack.pop();
    markDone(state, lines);
    markDone(state, getLineRange(fnDecl));
    return null;
  }

  // Detect .then() on a misspelled Promise method
  if (hasThenCall(expr)) {
    const typo = detectPromiseMethodTypo(expr);
    if (typo) {
      return createError(
        "unsupported-pattern",
        `Promise.${typo}() is not a function. Did you mean Promise.resolve()?`,
        line ?? undefined,
      );
    }
    return createError(
      "unsupported-pattern",
      ".then() is only supported on Promise.resolve() chains. Example: Promise.resolve().then(() => { ... })",
      line ?? undefined,
    );
  }

  // Not a recognized call pattern
  return "unhandled";
}

/* ------------------------------------------------------------------ */
/*  Process a single statement (top-level or inside a callback)        */
/* ------------------------------------------------------------------ */

function processStatement(
  node: Node,
  source: string,
  state: SimState,
  isInsideCallback: boolean,
  scope: RuntimeScope,
): SandboxError | null {
  const lines = getLineRange(node);
  const line = node.loc?.start.line ?? null;

  // --- FunctionDeclaration: register and mark done (hoisted) ---
  if (node.type === "FunctionDeclaration") {
    const decl = node as FunctionDeclaration;
    if (decl.id) {
      state.functions.set(decl.id.name, decl);
      const fnLabel = `function ${decl.id.name}()`;
      const safeFnLabel = escapeHtml(fnLabel);
      state.stack.push(fnLabel);
      pushStep(state, {
        descriptionHtml: `<code>${safeFnLabel}</code> declaration is hoisted and registered.`,
        activeLine: line,
        loopActive: isInsideCallback,
        loopLabel: isInsideCallback ? "running" : "idle",
      });
      state.stack.pop();
      markDone(state, lines);
    }
    return null;
  }

  // --- ExpressionStatement wrapping a call ---
  if (node.type === "ExpressionStatement") {
    const expr = (node as ExpressionStatement).expression;

    if (expr.type === "CallExpression") {
      const result = processCallExpression(
        expr as CallExpression,
        node,
        source,
        state,
        isInsideCallback,
        scope,
      );
      if (result !== "unhandled") return result;
    }

    // Generic expression statement - treat as sync
    const label = expressionToLabel(expr, source);
    const safeLabel = escapeHtml(label);
    state.stack.push(label);
    pushStep(state, {
      descriptionHtml: `<span class="hl-stack">Call Stack</span> executes <code>${safeLabel}</code>.`,
      activeLine: line,
      loopActive: isInsideCallback,
      loopLabel: isInsideCallback ? "running" : "idle",
    });
    state.stack.pop();
    markDone(state, lines);
    return null;
  }

  // --- Bare CallExpression (from arrow expression bodies like: () => console.log('x')) ---
  if (node.type === "CallExpression") {
    const result = processCallExpression(
      node as CallExpression,
      node,
      source,
      state,
      isInsideCallback,
      scope,
    );
    if (result !== "unhandled") return result;

    // Generic call - treat as sync
    const label = expressionToLabel(node, source);
    const safeLabel = escapeHtml(label);
    state.stack.push(label);
    pushStep(state, {
      descriptionHtml: `<span class="hl-stack">Call Stack</span> executes <code>${safeLabel}</code>.`,
      activeLine: line,
      loopActive: isInsideCallback,
      loopLabel: isInsideCallback ? "running" : "idle",
    });
    state.stack.pop();
    markDone(state, lines);
    return null;
  }

  if (node.type === "VariableDeclaration") {
    const decl = node as VariableDeclaration;
    const label = source.slice(decl.start, decl.end).replace(/;$/, "");
    const shortLabel = label.length <= 40 ? label : label.slice(0, 37) + "...";
    const safeShortLabel = escapeHtml(shortLabel);
    state.stack.push(shortLabel);
    pushStep(state, {
      descriptionHtml: `<span class="hl-stack">Call Stack</span> executes <code>${safeShortLabel}</code>.`,
      activeLine: line,
      loopActive: isInsideCallback,
      loopLabel: isInsideCallback ? "running" : "idle",
    });
    state.stack.pop();
    markDone(state, lines);
    return null;
  }

  // Empty statement - silently skip
  if (node.type === "EmptyStatement") {
    markDone(state, lines);
    return null;
  }

  // Unsupported node type
  return createError(
    "unsupported-pattern",
    `Unsupported statement: ${node.type}. The sandbox supports console.log(), setTimeout(), Promise.resolve().then(), queueMicrotask(), function declarations, and variable declarations.`,
    line ?? undefined,
  );
}

/* ------------------------------------------------------------------ */
/*  Drain queues (Event Loop simulation)                               */
/* ------------------------------------------------------------------ */

function drainQueues(state: SimState, source: string): SandboxError | null {
  if (state.microtaskQueue.length > 0 || state.taskQueue.length > 0) {
    pushStep(state, {
      descriptionHtml: `All synchronous code is done. <span class="hl-loop">Event Loop</span> checks the queues.`,
      activeLine: null,
      loopActive: true,
      loopLabel: "checking",
    });
  }

  let safety = 0;
  while (
    (state.microtaskQueue.length > 0 || state.taskQueue.length > 0) &&
    safety < 80
  ) {
    safety++;

    // Drain ALL microtasks
    while (state.microtaskQueue.length > 0 && safety < 80) {
      safety++;
      const micro = state.microtaskQueue.shift()!;

      state.stack.push(micro.label);
      pushStep(state, {
        descriptionHtml: `<span class="hl-loop">Event Loop</span> moves microtask to the <span class="hl-stack">Call Stack</span>.`,
        activeLine: micro.sourceLine || null,
        loopActive: true,
        loopLabel: "running",
      });

      state.stack.pop();
      state.doneLines = state.doneLines.filter((l) => !micro.bodyLines.includes(l));

      for (const stmt of micro.bodyStatements) {
        const err = processStatement(stmt, source, state, true, micro.scope);
        if (err) return err;
      }

      if (micro.chainTail && micro.chainTail.length > 0) {
        const next = micro.chainTail[0];
        const scheduled: ScheduledCallback = {
          label: next.callback.label,
          bodyStatements: next.callback.body,
          sourceLine: next.callNode.loc?.start.line ?? 0,
          bodyLines: next.callback.bodyLines,
          scope: { ...micro.scope },
          chainTail: micro.chainTail.slice(1),
        };
        state.microtaskQueue.push(scheduled);

        pushStep(state, {
          descriptionHtml: `Promise chaining queues another callback in the <span class="hl-micro">Microtask Queue</span>.`,
          activeLine: next.callNode.loc?.start.line ?? null,
          loopActive: true,
          loopLabel: "checking",
        });
      }
    }

    // Process one task from the task queue
    if (state.taskQueue.length > 0) {
      if (state.microtaskQueue.length === 0) {
        pushStep(state, {
          descriptionHtml: `All microtasks are done, so the <span class="hl-loop">Event Loop</span> checks the <span class="hl-task">Task Queue</span>.`,
          activeLine: null,
          loopActive: true,
          loopLabel: "checking",
        });
      }

      const task = state.taskQueue.shift()!;
      state.stack.push(task.label);
      pushStep(state, {
        descriptionHtml: `<span class="hl-loop">Event Loop</span> moves the task callback to the <span class="hl-stack">Call Stack</span>.`,
        activeLine: task.sourceLine || null,
        loopActive: true,
        loopLabel: "running",
      });

      state.stack.pop();
      state.doneLines = state.doneLines.filter((l) => !task.bodyLines.includes(l));

      for (const stmt of task.bodyStatements) {
        const err = processStatement(stmt, source, state, true, task.scope);
        if (err) return err;
      }
    }
  }

  return null;
}

/* ------------------------------------------------------------------ */
/*  Main generator                                                     */
/* ------------------------------------------------------------------ */

export function generateEventLoopSteps(
  ast: Program,
  source: string,
): GeneratorResult {
  const codeLines: SourceLine[] = source.split("\n").map((text, i) => ({
    num: i + 1,
    text,
  }));

  if (ast.body.length === 0) {
    return {
      success: false,
      error: createError(
        "generation-error",
        "No statements found. Write some code to visualize!",
      ),
    };
  }

  const state: SimState = {
    stack: [],
    webApis: [],
    taskQueue: [],
    microtaskQueue: [],
    consoleOutput: [],
    doneLines: [],
    steps: [],
    functions: new Map(),
  };

  // Phase 1: Process all top-level statements (synchronous execution phase)
  for (const node of ast.body) {
    const err = processStatement(node, source, state, false, {});
    if (err) return { success: false, error: err };
  }

  // Phase 2: Event loop drains queues
  const drainErr = drainQueues(state, source);
  if (drainErr) return { success: false, error: drainErr };

  // Final "done" step - also hint if functions were declared but never called
  const uncalledFunctions: string[] = [];
  for (const [name] of state.functions) {
    // Check if the function was actually called (appears in any step's stack)
    const wasCalled = state.steps.some((s) => s.stack.some((item) => item === `${name}()`));
    if (!wasCalled) uncalledFunctions.push(name);
  }

  const allLines = codeLines.map((l) => l.num);
  state.doneLines = allLines;
  const outputList = state.consoleOutput.join(" → ");
  const safeOutputList = escapeHtml(outputList || "(no output)");

  let doneHtml = `<strong>Done!</strong> Output order: ${safeOutputList}.`;
  if (uncalledFunctions.length > 0) {
    const names = uncalledFunctions
      .map((n) => `<code>${escapeHtml(`${n}()`)}</code>`)
      .join(", ");
    doneHtml += ` <span class="text-amber-300/80">Hint: ${names} was declared but never called - add a call to see it execute.</span>`;
  }

  pushStep(state, {
    descriptionHtml: doneHtml,
    activeLine: null,
    loopActive: false,
    loopLabel: "idle",
  });

  return { success: true, codeLines, steps: state.steps };
}
