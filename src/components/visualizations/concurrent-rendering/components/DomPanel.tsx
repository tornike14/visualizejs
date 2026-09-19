import { cn } from "@/lib/utils";
import type { DomState } from "../types";

interface DomPanelProps {
  dom: DomState | null;
}

const SAMPLE_ROWS: Record<string, string[]> = {
  "": ["aardvark", "badger", "capybara"],
  a: ["aardvark", "capybara", "llama"],
  ab: ["abalone", "abyssinian", "sable"],
};

export const DomPanel = ({ dom }: DomPanelProps) => {
  if (!dom) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  const rows = SAMPLE_ROWS[dom.listQuery] ?? [];
  const showFallback = dom.suspense?.status === "fallback";

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-14 shrink-0 text-xs text-slate-400">input</span>
        <span
          key={dom.inputValue}
          className="viz-slide-in flex h-8 min-w-0 flex-1 items-center rounded-md border border-slate-600/60 bg-slate-900/60 px-2 font-mono text-xs text-slate-100"
        >
          {dom.inputValue}
          <span className="ml-px inline-block h-4 w-px animate-pulse bg-slate-300" />
        </span>
      </div>

      <div className="flex items-start gap-2">
        <span className="w-14 shrink-0 pt-1 text-xs text-slate-400">list</span>
        <div
          className={cn(
            "min-w-0 flex-1 rounded-md border border-slate-700/60 bg-slate-900/40 px-2 py-1.5 font-mono text-[11px] transition-opacity duration-300",
            dom.listDimmed ? "opacity-45" : "opacity-100",
          )}
        >
          {showFallback ? (
            <p className="py-2 text-center text-amber-300">
              <span className="mr-1.5 inline-block h-2.5 w-2.5 animate-spin rounded-full border border-amber-300 border-t-transparent align-middle" />
              Spinner (fallback)
            </p>
          ) : (
            <>
              <p className="mb-1 text-slate-500">
                query &quot;{dom.listQuery}&quot;,{" "}
                {dom.listCount.toLocaleString()} rows
              </p>
              {rows.map((row) => (
                <p
                  key={`${dom.listQuery}-${row}`}
                  className="viz-slide-in truncate text-slate-300"
                >
                  {row}
                </p>
              ))}
              <p className="text-slate-600">...</p>
            </>
          )}
        </div>
      </div>

      {(dom.isPending !== null || dom.suspense) && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px]">
          {dom.isPending !== null && (
            <span className="text-slate-400">
              isPending{" "}
              <span
                className={
                  dom.isPending ? "text-amber-300" : "text-emerald-300"
                }
              >
                {String(dom.isPending)}
              </span>
            </span>
          )}
          {dom.suspense && (
            <span className="text-slate-400">
              Suspense{" "}
              <span
                className={
                  dom.suspense.status === "fallback"
                    ? "text-amber-300"
                    : "text-emerald-300"
                }
              >
                {dom.suspense.status}
              </span>
              <span className="text-slate-500"> ({dom.suspense.note})</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
