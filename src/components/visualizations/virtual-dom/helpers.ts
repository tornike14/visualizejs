import {
  createKindBadgeClass,
  createKindLabel,
} from "@/lib/visualization-helpers";
import type { VirtualDomKind } from "./types";

export const kindBadgeClass = createKindBadgeClass<VirtualDomKind>({
  element: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  component: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  dynamic: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<VirtualDomKind>({
  element: "element",
  component: "component",
  dynamic: "dynamic",
});
