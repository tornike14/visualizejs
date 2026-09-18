import { cn } from "@/lib/utils";
import type { ComputedState } from "../types";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1 rounded-lg border border-slate-600/40 bg-slate-800/30 px-3 py-2">
    <span className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</span>
    <span className="font-semibold">{children}</span>
  </div>
);

export const ComputedPanel = ({ computed }: { computed: ComputedState | null }) => {
  if (!computed) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no computed yet
      </p>
    );
  }

  return (
    <div className="space-y-2 font-mono text-xs">
      <div className="text-[11px] text-slate-400">
        ComputedRefImpl <span className="text-emerald-300">{computed.name}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Field label="dirty">
          <span
            className={cn(
              "viz-slide-in rounded px-1.5 py-0.5",
              computed.dirty
                ? "bg-amber-400/15 text-amber-200"
                : "bg-emerald-400/15 text-emerald-200",
            )}
          >
            {computed.dirty ? "true" : "false"}
          </span>
        </Field>
        <Field label="cached value">
          <span className={computed.dirty ? "text-slate-500 line-through" : "text-slate-100"}>
            {computed.cached}
          </span>
        </Field>
        <Field label="getter runs">
          <span className="text-slate-100">{computed.evaluations}</span>
        </Field>
        <Field label="subscribers">
          {computed.subscribers.length === 0 ? (
            <span className="text-slate-500">none</span>
          ) : (
            <span className="text-cyan-200">{computed.subscribers.join(", ")}</span>
          )}
        </Field>
      </div>
    </div>
  );
};
