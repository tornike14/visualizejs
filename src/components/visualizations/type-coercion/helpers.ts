import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { CoercionKind } from "./types";

export const kindBadgeClass = createKindBadgeClass<CoercionKind>({
  equality: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  truthy: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  null: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  nan: "bg-rose-500/15 text-rose-400 border-rose-500/25",
});

export const kindLabel = createKindLabel<CoercionKind>({
  equality: "== vs ===",
  truthy: "truthy/falsy",
  null: "null/undefined",
  nan: "NaN",
});

export const OP_COLOR_MAP = {
  amber: "border-amber-500/30 bg-amber-500/8 text-amber-300",
  emerald: "border-emerald-500/30 bg-emerald-500/8 text-emerald-300",
  red: "border-rose-500/30 bg-rose-500/8 text-rose-300",
  cyan: "border-cyan-500/30 bg-cyan-500/8 text-cyan-300",
} as const;
