import { createKindBadgeClass, createKindLabel } from "@/lib/visualization-helpers";
import type { BindingKind, BindingRule } from "./types";

export const kindBadgeClass = createKindBadgeClass<BindingKind>({
  implicit: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  explicit: "bg-cyan-500/15 text-cyan-400 border-cyan-500/25",
  new: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  arrow: "bg-violet-500/15 text-violet-400 border-violet-500/25",
});

export const kindLabel = createKindLabel<BindingKind>({
  implicit: "implicit",
  explicit: "call/apply/bind",
  new: "new",
  arrow: "arrow fn",
});

export function ruleColorClass(rule: BindingRule): string {
  switch (rule) {
    case "default":
    case "lost":
      return "bg-rose-500/20 text-rose-300 border-rose-500/25";
    case "implicit":
      return "bg-emerald-500/20 text-emerald-300 border-emerald-500/25";
    case "explicit-call":
    case "explicit-apply":
    case "explicit-bind":
      return "bg-cyan-500/20 text-cyan-300 border-cyan-500/25";
    case "new":
      return "bg-amber-500/20 text-amber-300 border-amber-500/25";
    case "arrow":
      return "bg-violet-500/20 text-violet-300 border-violet-500/25";
  }
}
