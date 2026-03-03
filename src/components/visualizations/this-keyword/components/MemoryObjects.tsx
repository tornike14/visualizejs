import { cn } from "@/lib/utils";
import type { MemoryObject } from "../types";

export function MemoryObjects({ objects }: { objects: MemoryObject[] }) {
  if (objects.length === 0) {
    return (
      <p className="py-6 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60 uppercase">
        no objects yet
      </p>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {objects.map((obj, index) => (
        <div
          key={`${obj.label}-${index}`}
          className={cn(
            "viz-slide-in rounded-lg border px-3 py-2.5 transition-all duration-300",
            obj.highlight === "target"
              ? "border-emerald-300/40 bg-emerald-400/8 shadow-[0_0_18px_rgba(52,211,153,0.1)]"
              : obj.highlight === "active"
                ? "border-amber-300/40 bg-amber-400/8 shadow-[0_0_18px_rgba(251,191,36,0.1)]"
                : "border-slate-500/30 bg-slate-800/30"
          )}
        >
          <div className="mb-1.5 flex items-center gap-2">
            <span
              className={cn(
                "font-mono text-xs font-semibold",
                obj.highlight === "target"
                  ? "text-emerald-300"
                  : obj.highlight === "active"
                    ? "text-amber-300"
                    : "text-slate-400"
              )}
            >
              {obj.label}
            </span>
            {obj.highlight === "target" && (
              <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] text-emerald-300">
                this
              </span>
            )}
          </div>
          {obj.properties.length > 0 ? (
            <div className="space-y-0.5">
              {obj.properties.map((prop) => (
                <div
                  key={prop.name}
                  className="flex items-center justify-between rounded px-2 py-0.5 font-mono text-xs"
                >
                  <span className="text-slate-400">{prop.name}</span>
                  <span className="text-slate-300">{prop.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="px-2 font-mono text-[11px] text-slate-500">
              (empty object)
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
