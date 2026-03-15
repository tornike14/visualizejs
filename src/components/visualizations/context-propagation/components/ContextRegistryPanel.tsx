import { cn } from "@/lib/utils";
import type { ContextEntry } from "../types";

export function ContextRegistryPanel({
  entries,
}: {
  entries: ContextEntry[];
}) {
  if (entries.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no context registered
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {entries.map((entry) => (
        <div
          key={`${entry.name}-${entry.providerId}`}
          className={cn(
            "viz-slide-in flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs",
            "border-violet-500/30 bg-violet-500/8 text-violet-300",
          )}
        >
          <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
            {entry.name}
          </span>
          <span className="font-semibold">{entry.value}</span>
          <span className="ml-auto text-slate-500">
            {entry.providerId}
          </span>
        </div>
      ))}
    </div>
  );
}
