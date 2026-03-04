import { cn } from "@/lib/utils";
import type { VariableBinding } from "../types";
import { BINDING_TONE_MAP } from "../helpers";

export const BindingsPanel = ({ bindings }: { bindings: VariableBinding[] }) => {
  if (bindings.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {bindings.map((b) => (
        <div
          key={`${b.name}-${b.value}`}
          className={cn(
            "viz-slide-in flex items-center justify-between rounded-lg border px-3 py-2 font-mono text-xs",
            BINDING_TONE_MAP[b.tone],
            b.isNew && "ring-1 ring-pink-400/30",
          )}
        >
          <span className="font-semibold">{b.name}</span>
          <span className="text-slate-300">{b.value}</span>
        </div>
      ))}
    </div>
  );
};
