import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { FiberTreeKind, WorkLoopPhase } from "./types";

export const kindBadgeClass = createKindBadgeClass<FiberTreeKind>({
  "work-loop": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "unit-of-work": "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<FiberTreeKind>({
  "work-loop": "work loop",
  "unit-of-work": "unit of work",
});

const PHASE_STYLES: Record<WorkLoopPhase, string> = {
  idle: "border-slate-500/30 bg-slate-500/8 text-slate-400",
  beginWork: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  completeWork: "border-green-500/30 bg-green-500/8 text-green-300",
};

const PHASE_LABELS: Record<WorkLoopPhase, string> = {
  idle: "IDLE",
  beginWork: "BEGIN WORK",
  completeWork: "COMPLETE WORK",
};

export function phaseStyle(phase: WorkLoopPhase) {
  return PHASE_STYLES[phase];
}

export function phaseLabel(phase: WorkLoopPhase) {
  return PHASE_LABELS[phase];
}
