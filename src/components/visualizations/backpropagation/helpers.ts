import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { BackpropKind, GraphNodeStatus, GraphPhase } from "./types";

export const kindBadgeClass = createKindBadgeClass<BackpropKind>({
  neuron: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  chain: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  loop: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
});

export const kindLabel = createKindLabel<BackpropKind>({
  neuron: "single neuron",
  chain: "chain rule",
  loop: "training loop",
});

export const GRAPH_NODE_STYLES: Record<GraphNodeStatus, string> = {
  pending: "border-slate-600/50 bg-slate-800/40 text-slate-400",
  active:
    "border-cyan-300/50 bg-cyan-400/12 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.18)]",
  done: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
};

export const PHASE_LABELS: Record<GraphPhase, string> = {
  idle: "idle",
  forward: "forward pass",
  backward: "backward pass",
  update: "gradient descent",
};

export const PHASE_STYLES: Record<GraphPhase, string> = {
  idle: "border-slate-600/50 text-slate-500",
  forward: "border-cyan-300/40 bg-cyan-400/10 text-cyan-200",
  backward: "border-violet-300/40 bg-violet-400/10 text-violet-200",
  update: "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
};

/** Colour a signed number: negative rose, positive emerald, zero slate. */
export function signedValueClass(display: string): string {
  if (display.startsWith("-")) return "text-rose-300";
  if (Number(display) === 0) return "text-slate-300";
  return "text-emerald-300";
}
