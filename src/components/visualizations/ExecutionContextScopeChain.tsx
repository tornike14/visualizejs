"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import {
  TransportControls,
  type PlaybackSpeedLevel,
} from "@/components/visualization-ui/TransportControls";
import { cn } from "@/lib/utils";
import { getChangedItemKeys } from "@/lib/visualization/stepAnimation";

interface CodeLine {
  num: number;
  text: string;
}

type BindingKind = "var" | "let" | "const" | "function";
type BindingState = "value" | "undefined" | "tdz";
type LookupStatus = "miss" | "hit";

interface Binding {
  name: string;
  kind: BindingKind;
  state: BindingState;
  value: string;
}

interface EnvironmentSnapshot {
  name: string;
  outer: string | null;
  isActive: boolean;
  bindings: Binding[];
}

interface LookupHop {
  scope: string;
  status: LookupStatus;
  value?: string;
}

interface LookupTrace {
  variable: string;
  hops: LookupHop[];
}

interface ExecutionContextStep {
  descriptionHtml: string;
  activeLine: number | null;
  doneLines: number[];
  callStack: string[];
  environments: EnvironmentSnapshot[];
  lookupTraces: LookupTrace[];
  consoleOutput: string[];
  tdzActive: boolean;
}

const CODE_LINES: CodeLine[] = [
  { num: 1, text: "let x = 1;" },
  { num: 2, text: "" },
  { num: 3, text: "function outer() {" },
  { num: 4, text: "  let y = 2;" },
  { num: 5, text: "" },
  { num: 6, text: "  function inner() {" },
  { num: 7, text: "    console.log(x);" },
  { num: 8, text: "    console.log(y);" },
  { num: 9, text: "  }" },
  { num: 10, text: "" },
  { num: 11, text: "  inner();" },
  { num: 12, text: "}" },
  { num: 13, text: "" },
  { num: 14, text: "outer();" },
];

const STEPS: ExecutionContextStep[] = [
  {
    descriptionHtml:
      `<span class="ecs-hl-stack">Global Execution Context</span> is created. <code>outer</code> is hoisted as a function binding, and <code>x</code> exists in the <span class="ecs-hl-tdz">TDZ</span>.`,
    activeLine: null,
    doneLines: [],
    callStack: ["Global EC (creation)"],
    environments: [
      {
        name: "Global LE",
        outer: null,
        isActive: true,
        bindings: [
          { name: "outer", kind: "function", state: "value", value: "<function>" },
          { name: "x", kind: "let", state: "tdz", value: "TDZ" },
        ],
      },
    ],
    lookupTraces: [],
    consoleOutput: [],
    tdzActive: true,
  },
  {
    descriptionHtml:
      `<code>let x = 1</code> executes in the global context. <code>x</code> leaves TDZ and is initialized.`,
    activeLine: 1,
    doneLines: [1],
    callStack: ["Global EC (execution)"],
    environments: [
      {
        name: "Global LE",
        outer: null,
        isActive: true,
        bindings: [
          { name: "outer", kind: "function", state: "value", value: "<function>" },
          { name: "x", kind: "let", state: "value", value: "1" },
        ],
      },
    ],
    lookupTraces: [],
    consoleOutput: [],
    tdzActive: false,
  },
  {
    descriptionHtml:
      `<code>outer()</code> is invoked. A new <span class="ecs-hl-stack">Function Execution Context</span> is pushed, with its own lexical environment.`,
    activeLine: 14,
    doneLines: [1, 14],
    callStack: ["outer() EC (creation)", "Global EC"],
    environments: [
      {
        name: "Outer LE",
        outer: "Global LE",
        isActive: true,
        bindings: [
          { name: "inner", kind: "function", state: "value", value: "<function>" },
          { name: "y", kind: "let", state: "tdz", value: "TDZ" },
        ],
      },
      {
        name: "Global LE",
        outer: null,
        isActive: false,
        bindings: [
          { name: "outer", kind: "function", state: "value", value: "<function>" },
          { name: "x", kind: "let", state: "value", value: "1" },
        ],
      },
    ],
    lookupTraces: [],
    consoleOutput: [],
    tdzActive: true,
  },
  {
    descriptionHtml:
      `<code>let y = 2</code> runs inside <code>outer</code>. The binding is initialized in the outer lexical environment.`,
    activeLine: 4,
    doneLines: [1, 4, 14],
    callStack: ["outer() EC (execution)", "Global EC"],
    environments: [
      {
        name: "Outer LE",
        outer: "Global LE",
        isActive: true,
        bindings: [
          { name: "inner", kind: "function", state: "value", value: "<function>" },
          { name: "y", kind: "let", state: "value", value: "2" },
        ],
      },
      {
        name: "Global LE",
        outer: null,
        isActive: false,
        bindings: [
          { name: "outer", kind: "function", state: "value", value: "<function>" },
          { name: "x", kind: "let", state: "value", value: "1" },
        ],
      },
    ],
    lookupTraces: [],
    consoleOutput: [],
    tdzActive: false,
  },
  {
    descriptionHtml:
      `<code>inner()</code> is called. Another function context is pushed onto the <span class="ecs-hl-stack">call stack</span>.`,
    activeLine: 11,
    doneLines: [1, 4, 11, 14],
    callStack: ["inner() EC (creation)", "outer() EC", "Global EC"],
    environments: [
      {
        name: "Inner LE",
        outer: "Outer LE",
        isActive: true,
        bindings: [],
      },
      {
        name: "Outer LE",
        outer: "Global LE",
        isActive: false,
        bindings: [
          { name: "inner", kind: "function", state: "value", value: "<function>" },
          { name: "y", kind: "let", state: "value", value: "2" },
        ],
      },
      {
        name: "Global LE",
        outer: null,
        isActive: false,
        bindings: [
          { name: "outer", kind: "function", state: "value", value: "<function>" },
          { name: "x", kind: "let", state: "value", value: "1" },
        ],
      },
    ],
    lookupTraces: [],
    consoleOutput: [],
    tdzActive: false,
  },
  {
    descriptionHtml:
      `Resolving <code>x</code>: JS checks <code>inner</code> local bindings, then follows the <span class="ecs-hl-scope">scope chain</span> to <code>outer</code>, then <code>global</code>.`,
    activeLine: 7,
    doneLines: [1, 4, 7, 11, 14],
    callStack: ["inner() EC (execution)", "outer() EC", "Global EC"],
    environments: [
      {
        name: "Inner LE",
        outer: "Outer LE",
        isActive: true,
        bindings: [],
      },
      {
        name: "Outer LE",
        outer: "Global LE",
        isActive: false,
        bindings: [
          { name: "inner", kind: "function", state: "value", value: "<function>" },
          { name: "y", kind: "let", state: "value", value: "2" },
        ],
      },
      {
        name: "Global LE",
        outer: null,
        isActive: false,
        bindings: [
          { name: "outer", kind: "function", state: "value", value: "<function>" },
          { name: "x", kind: "let", state: "value", value: "1" },
        ],
      },
    ],
    lookupTraces: [
      {
        variable: "x",
        hops: [
          { scope: "Inner LE", status: "miss" },
          { scope: "Outer LE", status: "miss" },
          { scope: "Global LE", status: "hit", value: "1" },
        ],
      },
    ],
    consoleOutput: ["1"],
    tdzActive: false,
  },
  {
    descriptionHtml:
      `Resolving <code>y</code>: local <code>inner</code> misses, then <code>outer</code> lexical environment provides the value.`,
    activeLine: 8,
    doneLines: [1, 4, 7, 8, 11, 14],
    callStack: ["inner() EC (execution)", "outer() EC", "Global EC"],
    environments: [
      {
        name: "Inner LE",
        outer: "Outer LE",
        isActive: true,
        bindings: [],
      },
      {
        name: "Outer LE",
        outer: "Global LE",
        isActive: false,
        bindings: [
          { name: "inner", kind: "function", state: "value", value: "<function>" },
          { name: "y", kind: "let", state: "value", value: "2" },
        ],
      },
      {
        name: "Global LE",
        outer: null,
        isActive: false,
        bindings: [
          { name: "outer", kind: "function", state: "value", value: "<function>" },
          { name: "x", kind: "let", state: "value", value: "1" },
        ],
      },
    ],
    lookupTraces: [
      {
        variable: "y",
        hops: [
          { scope: "Inner LE", status: "miss" },
          { scope: "Outer LE", status: "hit", value: "2" },
        ],
      },
    ],
    consoleOutput: ["1", "2"],
    tdzActive: false,
  },
  {
    descriptionHtml:
      `<code>inner</code> finishes, so its execution context pops from the stack. The outer context resumes.`,
    activeLine: 9,
    doneLines: [1, 4, 7, 8, 9, 11, 14],
    callStack: ["outer() EC", "Global EC"],
    environments: [
      {
        name: "Outer LE",
        outer: "Global LE",
        isActive: true,
        bindings: [
          { name: "inner", kind: "function", state: "value", value: "<function>" },
          { name: "y", kind: "let", state: "value", value: "2" },
        ],
      },
      {
        name: "Global LE",
        outer: null,
        isActive: false,
        bindings: [
          { name: "outer", kind: "function", state: "value", value: "<function>" },
          { name: "x", kind: "let", state: "value", value: "1" },
        ],
      },
    ],
    lookupTraces: [],
    consoleOutput: ["1", "2"],
    tdzActive: false,
  },
  {
    descriptionHtml:
      `<code>outer</code> returns and pops. Control is back in global execution context.`,
    activeLine: 12,
    doneLines: [1, 4, 7, 8, 9, 11, 12, 14],
    callStack: ["Global EC"],
    environments: [
      {
        name: "Global LE",
        outer: null,
        isActive: true,
        bindings: [
          { name: "outer", kind: "function", state: "value", value: "<function>" },
          { name: "x", kind: "let", state: "value", value: "1" },
        ],
      },
    ],
    lookupTraces: [],
    consoleOutput: ["1", "2"],
    tdzActive: false,
  },
  {
    descriptionHtml:
      `✅ Done. Scope chain lookups produced output <strong>1</strong> then <strong>2</strong>, and contexts were pushed/popped predictably.`,
    activeLine: null,
    doneLines: [1, 3, 4, 6, 7, 8, 9, 11, 12, 14],
    callStack: [],
    environments: [
      {
        name: "Global LE",
        outer: null,
        isActive: false,
        bindings: [
          { name: "outer", kind: "function", state: "value", value: "<function>" },
          { name: "x", kind: "let", state: "value", value: "1" },
        ],
      },
    ],
    lookupTraces: [],
    consoleOutput: ["1", "2"],
    tdzActive: false,
  },
];

const LAST_STEP_INDEX = STEPS.length - 1;

const SPEED_TO_DELAY_MS: Record<PlaybackSpeedLevel, number> = {
  1: 2400,
  2: 1800,
  3: 1300,
  4: 850,
  5: 520,
};

const SPEED_LABELS: Record<PlaybackSpeedLevel, string> = {
  1: "0.5x",
  2: "0.75x",
  3: "1x",
  4: "1.5x",
  5: "2x",
};

const KIND_BADGE_STYLES: Record<BindingKind, string> = {
  var: "border-amber-300/35 bg-amber-400/12 text-amber-200",
  let: "border-cyan-300/35 bg-cyan-400/12 text-cyan-200",
  const: "border-violet-300/35 bg-violet-400/12 text-violet-200",
  function: "border-emerald-300/35 bg-emerald-400/12 text-emerald-200",
};

function bindingValueClass(state: BindingState): string {
  if (state === "tdz") {
    return "text-red-300";
  }
  if (state === "undefined") {
    return "text-amber-200";
  }
  return "text-slate-200";
}

function StackItems({
  items,
  animatedKeys,
}: {
  items: string[];
  animatedKeys: Set<string>;
}) {
  if (items.length === 0) {
    return (
      <p className="pt-7 text-center font-mono text-xs tracking-[0.22em] text-slate-500/65">
        empty
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item, index) => {
        const itemKey = `stack:${index}`;
        const shouldAnimate = animatedKeys.has(itemKey);

        return (
          <div
            key={itemKey}
            className={cn(
              "ecs-stack-item rounded-xl border border-rose-300/30 bg-rose-400/10 px-3 py-2 font-mono text-xs text-rose-100 shadow-[0_0_12px_rgba(244,114,182,0.1)]",
              shouldAnimate && "ecs-enter"
            )}
            style={shouldAnimate ? { animationDelay: `${index * 55}ms` } : undefined}
          >
            {index === 0 ? "top → " : ""}
            {item}
          </div>
        );
      })}
    </div>
  );
}

function EnvironmentCards({
  environments,
  environmentAnimatedKeys,
  bindingAnimatedKeys,
}: {
  environments: EnvironmentSnapshot[];
  environmentAnimatedKeys: Set<string>;
  bindingAnimatedKeys: Set<string>;
}) {
  return (
    <div className="space-y-3">
      {environments.map((environment, index) => {
        const environmentKey = `environment:${environment.name}:${index}`;
        const shouldAnimateEnvironment = environmentAnimatedKeys.has(environmentKey);

        return (
          <div
            key={environmentKey}
            className={cn(
              "ecs-environment-card rounded-2xl border px-3 py-3 transition-all",
              shouldAnimateEnvironment && "ecs-enter",
              environment.isActive
                ? "border-cyan-300/45 bg-cyan-400/8 shadow-[0_0_16px_rgba(34,211,238,0.16)]"
                : "border-slate-600/70 bg-slate-900/45"
            )}
            style={shouldAnimateEnvironment ? { animationDelay: `${index * 60}ms` } : undefined}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-200">
                {environment.name}
              </p>
              {environment.isActive ? (
                <span className="rounded-full border border-pink-300/35 bg-pink-400/12 px-2 py-0.5 text-[10px] text-pink-200">
                  active
                </span>
              ) : null}
            </div>

            <p className="mb-3 font-mono text-[11px] text-slate-400">
              outer → {environment.outer ?? "null"}
            </p>

            {environment.bindings.length === 0 ? (
              <p className="font-mono text-xs text-slate-500/80">no local bindings</p>
            ) : (
              <div className="space-y-2">
                {environment.bindings.map((binding) => {
                  const bindingKey = `binding:${environment.name}:${binding.name}`;
                  const shouldAnimateBinding = bindingAnimatedKeys.has(bindingKey);

                  return (
                    <div
                      key={bindingKey}
                      className={cn(
                        "ecs-binding-row flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-700/70 bg-slate-950/35 px-2.5 py-2",
                        shouldAnimateBinding && "ecs-enter"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-200">{binding.name}</span>
                        <span
                          className={cn(
                            "rounded-full border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]",
                            KIND_BADGE_STYLES[binding.kind]
                          )}
                        >
                          {binding.kind}
                        </span>
                      </div>
                      <span className={cn("font-mono text-xs", bindingValueClass(binding.state))}>
                        {binding.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function LookupTracePanel({
  traces,
  traceAnimatedKeys,
  hopAnimatedKeys,
}: {
  traces: LookupTrace[];
  traceAnimatedKeys: Set<string>;
  hopAnimatedKeys: Set<string>;
}) {
  if (traces.length === 0) {
    return <p className="text-sm text-slate-500/80">No identifier lookup at this step.</p>;
  }

  return (
    <div className="space-y-3">
      {traces.map((trace) => {
        const traceKey = `trace:${trace.variable}`;
        const shouldAnimateTrace = traceAnimatedKeys.has(traceKey);

        return (
          <div
            key={traceKey}
            className={cn(
              "ecs-lookup-card rounded-xl border border-cyan-300/30 bg-cyan-400/8 px-3 py-2.5",
              shouldAnimateTrace && "ecs-enter"
            )}
          >
            <p className="mb-2 font-mono text-xs text-cyan-200">
              resolving <code>{trace.variable}</code>
            </p>
            <div className="space-y-1.5">
              {trace.hops.map((hop, index) => {
                const hopKey = `hop:${trace.variable}:${index}:${hop.scope}`;
                const shouldAnimateHop = hopAnimatedKeys.has(hopKey);

                return (
                  <div
                    key={hopKey}
                    className={cn("ecs-hop-row flex items-center gap-2", shouldAnimateHop && "ecs-enter")}
                    style={shouldAnimateHop ? { animationDelay: `${index * 65}ms` } : undefined}
                  >
                    <span className="font-mono text-xs text-slate-300">{hop.scope}</span>
                    <span className="text-slate-500">→</span>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]",
                        hop.status === "hit"
                          ? "border-emerald-300/35 bg-emerald-400/12 text-emerald-200"
                          : "border-slate-500/45 bg-slate-500/10 text-slate-300"
                      )}
                    >
                      {hop.status}
                    </span>
                    {hop.value ? (
                      <span className="font-mono text-xs text-emerald-200">{hop.value}</span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HoistingComparison({
  tdzActive,
  animatedKeys,
}: {
  tdzActive: boolean;
  animatedKeys: Set<string>;
}) {
  const shouldAnimateVar = animatedKeys.has("hoist:var");
  const shouldAnimateLet = animatedKeys.has("hoist:let");
  const shouldAnimateConst = animatedKeys.has("hoist:const");

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <div
        className={cn(
          "ecs-hoist-card rounded-xl border border-amber-300/30 bg-amber-400/10 px-3 py-2.5",
          shouldAnimateVar && "ecs-enter"
        )}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber-200">var</p>
        <p className="mt-1 text-xs text-amber-100/90">Hoisted and initialized as undefined.</p>
      </div>
      <div
        className={cn(
          "ecs-hoist-card rounded-xl border px-3 py-2.5",
          shouldAnimateLet && "ecs-enter",
          tdzActive
            ? "border-red-300/40 bg-red-400/10"
            : "border-cyan-300/30 bg-cyan-400/10"
        )}
        style={shouldAnimateLet ? { animationDelay: "55ms" } : undefined}
      >
        <p
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.16em]",
            tdzActive ? "text-red-200" : "text-cyan-200"
          )}
        >
          let
        </p>
        <p className={cn("mt-1 text-xs", tdzActive ? "text-red-200" : "text-cyan-100/90")}>
          Hoisted without value; TDZ until declaration executes.
        </p>
      </div>
      <div
        className={cn(
          "ecs-hoist-card rounded-xl border px-3 py-2.5",
          shouldAnimateConst && "ecs-enter",
          tdzActive
            ? "border-red-300/40 bg-red-400/10"
            : "border-violet-300/30 bg-violet-400/10"
        )}
        style={shouldAnimateConst ? { animationDelay: "110ms" } : undefined}
      >
        <p
          className={cn(
            "font-mono text-[11px] uppercase tracking-[0.16em]",
            tdzActive ? "text-red-200" : "text-violet-200"
          )}
        >
          const
        </p>
        <p className={cn("mt-1 text-xs", tdzActive ? "text-red-200" : "text-violet-100/90")}>
          Same TDZ rule as let, plus required initializer.
        </p>
      </div>
    </div>
  );
}

export function ExecutionContextScopeChain() {
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedLevel, setSpeedLevel] = useState<PlaybackSpeedLevel>(3);
  const stepVersion = Math.max(currentStepIndex, 0);

  const currentStep = currentStepIndex >= 0 ? STEPS[currentStepIndex] : null;
  const previousStep =
    currentStepIndex > 0 ? STEPS[currentStepIndex - 1] : null;
  const canStep = currentStepIndex < LAST_STEP_INDEX;

  const stackCurrentItems = useMemo(
    () =>
      (currentStep?.callStack ?? []).map((item, index) => ({
        key: `stack:${index}`,
        signature: item,
      })),
    [currentStep?.callStack]
  );
  const stackPreviousItems = useMemo(
    () =>
      (previousStep?.callStack ?? []).map((item, index) => ({
        key: `stack:${index}`,
        signature: item,
      })),
    [previousStep?.callStack]
  );
  const stackAnimatedKeys = useMemo(
    () => getChangedItemKeys(stackCurrentItems, stackPreviousItems),
    [stackCurrentItems, stackPreviousItems]
  );

  const environmentCurrentItems = useMemo(
    () =>
      (currentStep?.environments ?? []).map((environment, index) => ({
        key: `environment:${environment.name}:${index}`,
        signature: `${environment.outer ?? "null"}|${environment.isActive ? "1" : "0"}|${environment.bindings.length}`,
      })),
    [currentStep?.environments]
  );
  const environmentPreviousItems = useMemo(
    () =>
      (previousStep?.environments ?? []).map((environment, index) => ({
        key: `environment:${environment.name}:${index}`,
        signature: `${environment.outer ?? "null"}|${environment.isActive ? "1" : "0"}|${environment.bindings.length}`,
      })),
    [previousStep?.environments]
  );
  const environmentAnimatedKeys = useMemo(
    () => getChangedItemKeys(environmentCurrentItems, environmentPreviousItems),
    [environmentCurrentItems, environmentPreviousItems]
  );

  const bindingCurrentItems = useMemo(
    () =>
      (currentStep?.environments ?? []).flatMap((environment) =>
        environment.bindings.map((binding) => ({
          key: `binding:${environment.name}:${binding.name}`,
          signature: `${binding.kind}|${binding.state}|${binding.value}`,
        }))
      ),
    [currentStep?.environments]
  );
  const bindingPreviousItems = useMemo(
    () =>
      (previousStep?.environments ?? []).flatMap((environment) =>
        environment.bindings.map((binding) => ({
          key: `binding:${environment.name}:${binding.name}`,
          signature: `${binding.kind}|${binding.state}|${binding.value}`,
        }))
      ),
    [previousStep?.environments]
  );
  const bindingAnimatedKeys = useMemo(
    () => getChangedItemKeys(bindingCurrentItems, bindingPreviousItems),
    [bindingCurrentItems, bindingPreviousItems]
  );

  const traceCurrentItems = useMemo(
    () =>
      (currentStep?.lookupTraces ?? []).map((trace) => ({
        key: `trace:${trace.variable}`,
        signature: trace.hops
          .map((hop) => `${hop.scope}:${hop.status}:${hop.value ?? ""}`)
          .join("|"),
      })),
    [currentStep?.lookupTraces]
  );
  const tracePreviousItems = useMemo(
    () =>
      (previousStep?.lookupTraces ?? []).map((trace) => ({
        key: `trace:${trace.variable}`,
        signature: trace.hops
          .map((hop) => `${hop.scope}:${hop.status}:${hop.value ?? ""}`)
          .join("|"),
      })),
    [previousStep?.lookupTraces]
  );
  const traceAnimatedKeys = useMemo(
    () => getChangedItemKeys(traceCurrentItems, tracePreviousItems),
    [traceCurrentItems, tracePreviousItems]
  );

  const hopCurrentItems = useMemo(
    () =>
      (currentStep?.lookupTraces ?? []).flatMap((trace) =>
        trace.hops.map((hop, index) => ({
          key: `hop:${trace.variable}:${index}:${hop.scope}`,
          signature: `${hop.status}:${hop.value ?? ""}`,
        }))
      ),
    [currentStep?.lookupTraces]
  );
  const hopPreviousItems = useMemo(
    () =>
      (previousStep?.lookupTraces ?? []).flatMap((trace) =>
        trace.hops.map((hop, index) => ({
          key: `hop:${trace.variable}:${index}:${hop.scope}`,
          signature: `${hop.status}:${hop.value ?? ""}`,
        }))
      ),
    [previousStep?.lookupTraces]
  );
  const hopAnimatedKeys = useMemo(
    () => getChangedItemKeys(hopCurrentItems, hopPreviousItems),
    [hopCurrentItems, hopPreviousItems]
  );

  const consoleCurrentItems = useMemo(
    () =>
      (currentStep?.consoleOutput ?? []).map((line, index) => ({
        key: `console:${index}`,
        signature: line,
      })),
    [currentStep?.consoleOutput]
  );
  const consolePreviousItems = useMemo(
    () =>
      (previousStep?.consoleOutput ?? []).map((line, index) => ({
        key: `console:${index}`,
        signature: line,
      })),
    [previousStep?.consoleOutput]
  );
  const consoleAnimatedKeys = useMemo(
    () => getChangedItemKeys(consoleCurrentItems, consolePreviousItems),
    [consoleCurrentItems, consolePreviousItems]
  );

  const hoistingCurrentItems = useMemo(
    () => [
      { key: "hoist:var", signature: "static" },
      { key: "hoist:let", signature: currentStep?.tdzActive ? "tdz" : "ready" },
      { key: "hoist:const", signature: currentStep?.tdzActive ? "tdz" : "ready" },
    ],
    [currentStep?.tdzActive]
  );
  const hoistingPreviousItems = useMemo(
    () => [
      { key: "hoist:var", signature: "static" },
      { key: "hoist:let", signature: previousStep?.tdzActive ? "tdz" : "ready" },
      { key: "hoist:const", signature: previousStep?.tdzActive ? "tdz" : "ready" },
    ],
    [previousStep?.tdzActive]
  );
  const hoistingAnimatedKeys = useMemo(
    () => getChangedItemKeys(hoistingCurrentItems, hoistingPreviousItems),
    [hoistingCurrentItems, hoistingPreviousItems]
  );

  const handleTogglePlay = useCallback(() => {
    setIsPlaying((previousPlaying) => {
      if (previousPlaying) {
        return false;
      }

      setCurrentStepIndex((previousStep) => {
        if (previousStep < 0 || previousStep >= LAST_STEP_INDEX) {
          return 0;
        }
        return previousStep;
      });

      return true;
    });
  }, []);

  const handleStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((previousStep) => {
      if (previousStep >= LAST_STEP_INDEX) {
        return previousStep;
      }
      return previousStep + 1;
    });
  }, []);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(-1);
  }, []);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCurrentStepIndex((previousStep) => {
        if (previousStep >= LAST_STEP_INDEX) {
          setIsPlaying(false);
          return previousStep;
        }

        const nextStep = previousStep + 1;
        if (nextStep >= LAST_STEP_INDEX) {
          setIsPlaying(false);
        }

        return nextStep;
      });
    }, SPEED_TO_DELAY_MS[speedLevel]);

    return () => window.clearTimeout(timeoutId);
  }, [currentStepIndex, isPlaying, speedLevel]);

  return (
    <section className="relative flex flex-col gap-6 px-1 py-2 text-slate-100 sm:px-2 sm:py-3 lg:px-3 lg:py-4">
      <style>{`
        .ecs-code-line {
          display: flex;
          gap: 0.75rem;
          border-radius: 0.5rem;
          padding: 2px 10px;
          transition: all 0.25s ease;
          white-space: nowrap;
        }

        .ecs-code-line.is-active {
          background: rgba(251, 191, 36, 0.12);
          box-shadow: inset 3px 0 0 #fbbf24;
        }

        .ecs-code-line.is-done {
          opacity: 0.42;
        }

        .ecs-line-num {
          min-width: 22px;
          color: #94a3b8;
          opacity: 0.45;
          user-select: none;
          text-align: right;
        }

        .ecs-step code {
          border: 1px solid rgba(71, 85, 105, 0.7);
          background: rgba(15, 23, 42, 0.5);
          border-radius: 6px;
          padding: 2px 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.78rem;
        }

        .ecs-hl-stack { color: #f472b6; font-weight: 600; }
        .ecs-hl-scope { color: #22d3ee; font-weight: 600; }
        .ecs-hl-tdz { color: #fca5a5; font-weight: 600; }

        .ecs-step-pill {
          animation: ecs-pill-pop 0.36s ease;
        }

        .ecs-enter {
          opacity: 0;
          animation: ecs-enter-up 0.42s ease forwards;
        }

        .ecs-binding-row.ecs-enter {
          animation-duration: 0.34s;
        }

        .ecs-hop-row.ecs-enter {
          animation-duration: 0.32s;
        }

        @keyframes ecs-enter-up {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes ecs-pill-pop {
          from {
            transform: scale(0.97);
            box-shadow: 0 0 0 rgba(244, 114, 182, 0);
          }
          to {
            transform: scale(1);
            box-shadow: 0 0 16px rgba(244, 114, 182, 0.18);
          }
        }
      `}</style>

      <div className="flex flex-col items-center gap-3">
        <TransportControls
          isPlaying={isPlaying}
          canStep={canStep}
          speedLevel={speedLevel}
          speedLabel={SPEED_LABELS[speedLevel]}
          onTogglePlay={handleTogglePlay}
          onStep={handleStep}
          onReset={handleReset}
          onSpeedLevelChange={setSpeedLevel}
        />

        <p
          key={`step-pill-${stepVersion}`}
          className="ecs-step-pill app-surface-subtle inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-mono text-xs text-slate-300"
        >
          Step {Math.max(currentStepIndex + 1, 0)} / {STEPS.length}
        </p>
      </div>

      {currentStep ? (
        <div
          key={`step-desc-${stepVersion}`}
          className="ecs-step-pill app-surface-subtle mx-auto w-full max-w-4xl rounded-full px-4 py-3"
        >
          <p
            className="ecs-step text-center text-sm text-slate-300"
            dangerouslySetInnerHTML={{
              __html: currentStep.descriptionHtml,
            }}
          />
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[350px_minmax(0,1fr)]">
        <NeonPanel
          title="Source Code"
          tone="amber"
          bodyClassName="min-h-[32rem] space-y-0.5 font-mono text-[13px] leading-[1.9] text-slate-200"
        >
          {CODE_LINES.map((line) => {
            const isActive = currentStep?.activeLine === line.num;
            const isDone = currentStep?.doneLines.includes(line.num) ?? false;

            return (
              <div
                key={line.num}
                className={cn("ecs-code-line", isActive && "is-active", isDone && "is-done")}
              >
                <span className="ecs-line-num">{line.num}</span>
                <span className={line.text === "" ? "opacity-0" : ""}>{line.text || "."}</span>
              </div>
            );
          })}
        </NeonPanel>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <NeonPanel title="Call Stack" tone="pink" bodyClassName="min-h-[12rem]">
              <StackItems items={currentStep?.callStack ?? []} animatedKeys={stackAnimatedKeys} />
            </NeonPanel>
            <NeonPanel title="Lookup Trace" tone="cyan" bodyClassName="min-h-[12rem]">
              <LookupTracePanel
                traces={currentStep?.lookupTraces ?? []}
                traceAnimatedKeys={traceAnimatedKeys}
                hopAnimatedKeys={hopAnimatedKeys}
              />
            </NeonPanel>
          </div>

          <NeonPanel
            title="Lexical Environments"
            tone="violet"
            bodyClassName="min-h-[16rem]"
          >
            <EnvironmentCards
              environments={currentStep?.environments ?? []}
              environmentAnimatedKeys={environmentAnimatedKeys}
              bindingAnimatedKeys={bindingAnimatedKeys}
            />
          </NeonPanel>

          <NeonPanel
            title="Hoisting (var / let / const)"
            tone="green"
            bodyClassName="min-h-[9rem]"
          >
            <HoistingComparison
              tdzActive={currentStep?.tdzActive ?? false}
              animatedKeys={hoistingAnimatedKeys}
            />
          </NeonPanel>

          <NeonPanel
            title="Console Output"
            tone="slate"
            bodyClassName="min-h-[6.2rem] space-y-1.5 font-mono text-xs text-slate-300"
          >
            {(currentStep?.consoleOutput ?? []).length === 0 ? (
              <p className="pt-1 text-slate-500/70">No output yet.</p>
            ) : (
              (currentStep?.consoleOutput ?? []).map((line, index) => {
                const consoleKey = `console:${index}`;
                const shouldAnimate = consoleAnimatedKeys.has(consoleKey);

                return (
                  <div
                    key={consoleKey}
                    className={cn("ecs-console-line", shouldAnimate && "ecs-enter")}
                    style={shouldAnimate ? { animationDelay: `${index * 60}ms` } : undefined}
                  >
                    <span className="mr-2 text-emerald-300">›</span>
                    {line}
                  </div>
                );
              })
            )}
          </NeonPanel>
        </div>
      </div>
    </section>
  );
}
