import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { RenderCycleKind, CyclePhase, EffectStatus } from "./types";

export const kindBadgeClass = createKindBadgeClass<RenderCycleKind>({
  "two-phases": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  "batched-updates": "bg-amber-500/15 text-amber-400 border-amber-500/25",
});

export const kindLabel = createKindLabel<RenderCycleKind>({
  "two-phases": "two phases",
  "batched-updates": "batched updates",
});

const PHASE_STYLES: Record<CyclePhase, string> = {
  idle: "border-slate-500/30 bg-slate-500/8 text-slate-400",
  render: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
  commit: "border-green-500/30 bg-green-500/8 text-green-300",
};

const PHASE_LABELS: Record<CyclePhase, string> = {
  idle: "IDLE",
  render: "RENDER",
  commit: "COMMIT",
};

export function phaseStyle(phase: CyclePhase) {
  return PHASE_STYLES[phase];
}

export function phaseLabel(phase: CyclePhase) {
  return PHASE_LABELS[phase];
}

const EFFECT_STATUS_STYLES: Record<EffectStatus, string> = {
  pending: "border-slate-500/30 bg-slate-500/8 text-slate-400",
  cleanup: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  running: "border-green-500/30 bg-green-500/8 text-green-300",
  done: "border-slate-500/30 bg-slate-500/8 text-slate-500",
};

export function effectStatusStyle(status: EffectStatus) {
  return EFFECT_STATUS_STYLES[status];
}
