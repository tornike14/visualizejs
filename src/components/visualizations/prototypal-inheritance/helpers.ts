import type { ExampleKind } from "./types";
import {
  createKindBadgeClass,
  createKindLabel,
  chainHighlightClass,
  chainLabelClass,
} from "@/lib/visualization-helpers";

export const kindBadgeClass = createKindBadgeClass<ExampleKind>({
  "object-create": "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  constructor: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  lookup: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
});

export const kindLabel = createKindLabel<ExampleKind>({
  "object-create": "Object.create",
  constructor: "constructor",
  lookup: "shadowing",
});

export const CHAIN_OBJ_BASE =
  "rounded-lg border px-3 py-2.5 transition-all duration-300";

export const chainObjectClass = chainHighlightClass;

export { chainLabelClass };
