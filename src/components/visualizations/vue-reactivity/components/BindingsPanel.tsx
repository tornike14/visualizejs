import { cn } from "@/lib/utils";
import { BINDING_LABELS, BINDING_STYLES } from "../helpers";
import type { BindingEntry } from "../types";

export const BindingsPanel = ({ bindings }: { bindings: BindingEntry[] | null }) => {
  if (!bindings || bindings.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no bindings yet
      </p>
    );
  }

  return (
    <ul className="space-y-1.5 font-mono text-xs">
      {bindings.map((binding) => (
        <li
          key={binding.name}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2 transition-all duration-300",
            BINDING_STYLES[binding.kind],
          )}
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-slate-100">{binding.name}</span>
            <span className="text-slate-400">= {binding.value}</span>
            <span className="ml-auto shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
              {BINDING_LABELS[binding.kind]}
            </span>
          </div>
          <p className="mt-1 text-[11px] leading-snug text-slate-400">{binding.note}</p>
        </li>
      ))}
    </ul>
  );
};
