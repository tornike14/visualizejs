import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { GeneratorKind, GeneratorStatus } from "./types";

export const kindBadgeClass = createKindBadgeClass<GeneratorKind>({
  basic: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  "data-flow": "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  iterator: "bg-amber-500/15 text-amber-400 border-amber-500/25",
});

export const kindLabel = createKindLabel<GeneratorKind>({
  basic: "basic",
  "data-flow": "data flow",
  iterator: "iterator",
});

export const STATUS_STYLES: Record<GeneratorStatus, string> = {
  created: "border-slate-400/35 bg-slate-400/10 text-slate-300",
  suspended: "border-amber-300/35 bg-amber-400/10 text-amber-200",
  executing: "border-cyan-300/35 bg-cyan-400/10 text-cyan-200",
  completed: "border-emerald-300/35 bg-emerald-400/10 text-emerald-200",
};

export const FLOW_DIRECTION_STYLES: Record<"call" | "yield" | "return", string> = {
  call: "border-l-cyan-400/60",
  yield: "border-l-emerald-400/60",
  return: "border-l-rose-400/60",
};
