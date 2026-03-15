import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { HoistingKind } from "./types";

export const kindBadgeClass = createKindBadgeClass<HoistingKind>({
  var: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  function: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  let: "bg-rose-500/15 text-rose-400 border-rose-500/25",
  const: "bg-rose-500/15 text-rose-400 border-rose-500/25",
  "function-expr": "bg-purple-500/15 text-purple-400 border-purple-500/25",
});

export const kindLabel = createKindLabel<HoistingKind>({
  var: "var",
  function: "function",
  let: "let/const",
  const: "const",
  "function-expr": "func expr",
});
