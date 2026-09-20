import { cn } from "@/lib/utils";
import { DEP_STATUS_STYLES } from "../helpers";
import type { DepEntry } from "../types";

export const DepMap = ({ deps }: { deps: DepEntry[] }) => {
  if (deps.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        targetMap is empty
      </p>
    );
  }

  const targets = Array.from(new Set(deps.map((dep) => dep.target)));

  return (
    <div className="space-y-3 font-mono text-xs">
      {targets.map((target) => (
        <div key={target} className="space-y-1.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="rounded border border-slate-600/50 bg-slate-800/50 px-1.5 py-0.5 text-slate-200">
              targetMap
            </span>
            <span>-&gt;</span>
            <span className="text-cyan-300">toRaw({target})</span>
            <span>-&gt; depsMap</span>
          </div>
          <ul className="space-y-1.5 pl-3">
            {deps
              .filter((dep) => dep.target === target)
              .map((dep) => (
                <li
                  key={`${dep.target}.${dep.key}`}
                  className={cn(
                    "viz-slide-in flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border px-3 py-2 transition-all duration-300",
                    DEP_STATUS_STYLES[dep.status],
                  )}
                >
                  <span className="text-slate-400">&quot;{dep.key}&quot;</span>
                  <span className="text-slate-500">-&gt; Dep</span>
                  {dep.effects.length === 0 ? (
                    <span className="text-slate-500">{"{ }"}</span>
                  ) : (
                    dep.effects.map((effect) => (
                      <span
                        key={effect}
                        className={cn(
                          "rounded border px-1.5 py-0.5 text-[11px]",
                          dep.status === "triggering"
                            ? "border-amber-300/40 bg-amber-400/10 text-amber-200"
                            : "border-emerald-300/40 bg-emerald-400/10 text-emerald-200",
                        )}
                      >
                        {effect}
                      </span>
                    ))
                  )}
                  {dep.status !== "idle" && (
                    <span className="ml-auto text-[10px] uppercase tracking-[0.14em] opacity-80">
                      {dep.status}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
};
