"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronRight, Pause, Play, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Phase =
  | "idle"
  | "trigger"
  | "new-vdom"
  | "diffing"
  | "changes"
  | "patch"
  | "complete";

interface VisualizationStep {
  title: string;
  description: string;
  phase: Phase;
}

type TreeKind = "old" | "new" | "real";

interface TreeNodeProps {
  label: string;
  changed?: boolean;
  highlighted?: boolean;
  dimmed?: boolean;
  fresh?: boolean;
}

interface TreeColumnProps {
  title: string;
  kind: TreeKind;
  phase: Phase;
}

const STEPS: VisualizationStep[] = [
  {
    title: "Initial State",
    description:
      "Real DOM and Virtual DOM are in sync. The screen reflects the current app state.",
    phase: "idle",
  },
  {
    title: "State Change Triggered",
    description:
      "A user action calls setState. React schedules work and prepares a new render pass.",
    phase: "trigger",
  },
  {
    title: "New Virtual DOM Created",
    description:
      "React generates a new Virtual DOM tree that represents the updated state.",
    phase: "new-vdom",
  },
  {
    title: "Diffing Algorithm Runs",
    description:
      "React compares old and new Virtual DOM trees to find the minimal set of required changes.",
    phase: "diffing",
  },
  {
    title: "Changes Identified",
    description:
      "Only changed nodes are marked for patching. Unchanged branches are skipped entirely.",
    phase: "changes",
  },
  {
    title: "Batch Patch to Real DOM",
    description:
      "React applies the computed patch set to the Real DOM in a single coordinated update.",
    phase: "patch",
  },
  {
    title: "Cycle Complete",
    description:
      "The Real DOM is now in sync with the latest Virtual DOM. Rendering cycle is complete.",
    phase: "complete",
  },
];

const PROGRESS_CLASSES = [
  "w-0",
  "w-[16.6667%]",
  "w-[33.3334%]",
  "w-1/2",
  "w-[66.6667%]",
  "w-[83.3334%]",
  "w-full",
] as const;

function TreeNode({
  label,
  changed = false,
  highlighted = false,
  dimmed = false,
  fresh = false,
}: TreeNodeProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg border px-3 py-2 font-mono text-xs font-medium transition-all duration-500 lg:text-sm",
        dimmed && "opacity-35",
        !dimmed && "opacity-100",
        changed
          ? "border-amber-400/60 bg-amber-400/85 text-amber-950 shadow-[0_0_20px_rgba(251,191,36,0.35)]"
          : highlighted
            ? "border-emerald-400/60 bg-emerald-400/80 text-emerald-950 shadow-[0_0_14px_rgba(16,185,129,0.35)]"
            : fresh
              ? "border-cyan-400/50 bg-cyan-400/75 text-cyan-950"
              : "border-slate-700 bg-slate-700/80 text-slate-100"
      )}
    >
      {label}
      {changed && (
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]" />
      )}
    </div>
  );
}

function TreeColumn({ title, kind, phase }: TreeColumnProps) {
  const isDiffing = phase === "diffing" || phase === "changes";
  const isChanging = phase === "changes" || phase === "patch";
  const isPatched = phase === "patch" || phase === "complete";

  const counterChanged = kind === "new" || (kind === "real" && isPatched);
  const counterHighlighted = isDiffing && kind !== "real";
  const counterLabel = counterChanged ? "Counter: 1" : "Counter: 0";

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border p-4 transition-all duration-500",
        kind === "new" && "border-cyan-500/40 bg-cyan-500/10",
        kind === "real" && "border-emerald-500/35 bg-emerald-500/10",
        kind === "old" && "border-slate-700 bg-slate-800/60"
      )}
    >
      <h3
        className={cn(
          "mb-4 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em]",
          kind === "new" && "bg-cyan-500/30 text-cyan-200",
          kind === "real" && "bg-emerald-500/30 text-emerald-200",
          kind === "old" && "bg-slate-700 text-slate-200"
        )}
      >
        {title}
      </h3>

      <div className="flex flex-col items-center gap-2">
        <TreeNode label="App" />
        <div className="h-4 w-px bg-slate-500/70" />

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center gap-2">
            <TreeNode label="Header" />
            <div className="h-3 w-px bg-slate-500/70" />
            <TreeNode label="Nav" dimmed={isDiffing && kind !== "real"} />
          </div>

          <div className="flex flex-col items-center gap-2">
            <TreeNode label="Main" />
            <div className="h-3 w-px bg-slate-500/70" />
            <TreeNode
              label={counterLabel}
              changed={isChanging && (kind === "new" || (kind === "real" && phase === "patch"))}
              highlighted={counterHighlighted}
              fresh={kind === "new" && phase === "new-vdom"}
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <TreeNode label="Footer" />
            <div className="h-3 w-px bg-slate-500/70" />
            <TreeNode label="Links" dimmed={isDiffing && kind !== "real"} />
          </div>
        </div>
      </div>
    </div>
  );
}

function PhaseOverlay({ phase }: { phase: Phase }) {
  if (phase === "trigger") {
    return (
      <div className="pointer-events-none absolute left-1/2 top-8 z-10 -translate-x-1/2 rounded-lg border border-amber-400/40 bg-amber-400/20 px-3 py-2 text-xs font-semibold text-amber-200 shadow-lg shadow-amber-500/25 animate-pulse">
        onClick {"->"} setState()
      </div>
    );
  }

  if (phase === "diffing" || phase === "changes") {
    return (
      <div className="pointer-events-none absolute left-1/2 top-8 z-10 -translate-x-1/2">
        <div className="flex items-center gap-2 rounded-lg border border-violet-400/40 bg-violet-500/20 px-3 py-2 text-xs font-semibold text-violet-200 shadow-lg shadow-violet-500/25">
          Diffing in progress
          <ChevronRight className="h-3.5 w-3.5 animate-pulse" />
        </div>
      </div>
    );
  }

  if (phase === "patch") {
    return (
      <div className="pointer-events-none absolute bottom-8 right-8 z-10 rounded-lg border border-emerald-400/40 bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-200 shadow-lg shadow-emerald-500/25 animate-pulse">
        Patching Real DOM
      </div>
    );
  }

  return null;
}

export function VirtualDOM() {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const currentStep = STEPS[step];
  const isLastStep = step >= STEPS.length - 1;

  useEffect(() => {
    if (!isPlaying || isLastStep) {
      return;
    }

    const timer = setTimeout(() => {
      setStep((value) => {
        const nextStep = Math.min(value + 1, STEPS.length - 1);
        if (nextStep === STEPS.length - 1) {
          setIsPlaying(false);
        }
        return nextStep;
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [isPlaying, isLastStep, step]);

  const handleReset = useCallback(() => {
    setStep(0);
    setIsPlaying(false);
  }, []);

  const handlePlayPause = useCallback(() => {
    if (isLastStep) {
      setStep(0);
    }
    setIsPlaying((value) => !value);
  }, [isLastStep]);

  const handleNext = useCallback(() => {
    setIsPlaying(false);
    setStep((value) => Math.min(value + 1, STEPS.length - 1));
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-5">
        <div className="mb-4 flex flex-col gap-2 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-transparent bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-300 bg-clip-text">
            Virtual DOM Visualizer
          </h2>
          <p className="text-sm text-slate-300">
            See how React diffing updates only what changed.
          </p>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <Badge
            variant="outline"
            className="border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
          >
            Step {step + 1} / {STEPS.length}
          </Badge>
          <span className="text-xs text-slate-400">{currentStep.title}</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-700">
          <div
            className={cn(
              "h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500",
              PROGRESS_CLASSES[step]
            )}
          />
        </div>
      </div>

      <div className="rounded-xl border border-slate-700/70 bg-slate-900/70 p-4">
        <p className="text-sm text-slate-200">{currentStep.description}</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 p-4 lg:p-6">
        <PhaseOverlay phase={currentStep.phase} />

        <div className="overflow-x-auto">
          <div className="grid min-w-[900px] grid-cols-3 gap-4">
            <TreeColumn title="Old Virtual DOM" kind="old" phase={currentStep.phase} />

            <div
              className={cn(
                "transition-all duration-500",
                step >= 2 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
            >
              <TreeColumn title="New Virtual DOM" kind="new" phase={currentStep.phase} />
            </div>

            <TreeColumn title="Real DOM" kind="real" phase={currentStep.phase} />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-end">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        <Button variant="outline" onClick={handlePlayPause}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>

        <Button onClick={handleNext} disabled={isLastStep}>
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/75 p-4 md:grid-cols-3">
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-300">
            Batching
          </p>
          <p className="mt-1 text-xs text-slate-300">
            Multiple updates are grouped before DOM patching.
          </p>
        </div>
        <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-cyan-300">
            Minimal Diff
          </p>
          <p className="mt-1 text-xs text-slate-300">
            React touches only changed nodes, not the full tree.
          </p>
        </div>
        <div className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-violet-300">
            Predictable UI
          </p>
          <p className="mt-1 text-xs text-slate-300">
            You declare state and React computes the update path.
          </p>
        </div>
      </div>
    </section>
  );
}

export default VirtualDOM;
