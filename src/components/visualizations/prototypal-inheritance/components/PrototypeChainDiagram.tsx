import { cn } from "@/lib/utils";
import type { ProtoObject } from "../types";
import { CHAIN_OBJ_BASE, chainObjectClass, chainLabelClass } from "../helpers";

export function PrototypeChainDiagram({
  chain,
  activeLink,
}: {
  chain: ProtoObject[];
  activeLink?: number;
}) {
  if (chain.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        empty
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-0">
      {chain.map((obj, index) => {
        const isNull = obj.label === "null";

        return (
          <div key={`${obj.label}-${index}`}>
            {/* Object card */}
            <div
              className={cn(
                CHAIN_OBJ_BASE,
                "viz-slide-in",
                chainObjectClass(obj.highlight),
              )}
            >
              <div className="mb-1.5 flex items-center gap-2">
                <span
                  className={cn(
                    "font-mono text-xs font-semibold",
                    chainLabelClass(obj.highlight),
                  )}
                >
                  {obj.label}
                </span>
                {obj.highlight === "searching" && (
                  <span className="rounded-full bg-violet-500/20 px-1.5 py-0.5 font-mono text-[9px] text-violet-300">
                    looking...
                  </span>
                )}
                {obj.highlight === "found" && (
                  <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[9px] text-emerald-300">
                    found
                  </span>
                )}
              </div>

              {!isNull && obj.properties.length > 0 && (
                <div className="space-y-1">
                  {obj.properties.map((prop) => (
                    <div
                      key={prop.name}
                      className={cn(
                        "flex items-center justify-between rounded px-2 py-0.5 font-mono text-xs transition-colors",
                        obj.activeProperty === prop.name
                          ? "bg-white/8 text-slate-100"
                          : "text-slate-400",
                      )}
                    >
                      <span>{prop.name}</span>
                      <span className="text-slate-300">{prop.value}</span>
                    </div>
                  ))}
                </div>
              )}

              {!isNull && obj.properties.length === 0 && (
                <p className="font-mono text-[10px] text-slate-500/60">
                  (no own properties)
                </p>
              )}
            </div>

            {/* Arrow between objects */}
            {index < chain.length - 1 && (
              <div className="flex items-center justify-center py-1">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "h-4 w-px transition-colors",
                      activeLink === index
                        ? "bg-pink-400/70"
                        : "bg-slate-600/50",
                    )}
                  />
                  <span
                    className={cn(
                      "font-mono text-[9px] transition-colors",
                      activeLink === index
                        ? "text-pink-300"
                        : "text-slate-500/70",
                    )}
                  >
                    __proto__
                  </span>
                  <svg
                    viewBox="0 0 10 6"
                    className={cn(
                      "h-1.5 w-2.5 transition-colors",
                      activeLink === index
                        ? "text-pink-400/70"
                        : "text-slate-600/50",
                    )}
                  >
                    <path
                      d="M0 0L5 6L10 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
