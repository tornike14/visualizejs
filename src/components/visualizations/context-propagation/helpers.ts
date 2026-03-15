import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { ContextPropagationKind } from "./types";

export const kindBadgeClass = createKindBadgeClass<ContextPropagationKind>({
  basic: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  nested: "bg-violet-500/15 text-violet-400 border-violet-500/25",
  rerender: "bg-rose-500/15 text-rose-400 border-rose-500/25",
});

export const kindLabel = createKindLabel<ContextPropagationKind>({
  basic: "basic",
  nested: "nested",
  rerender: "re-render",
});
