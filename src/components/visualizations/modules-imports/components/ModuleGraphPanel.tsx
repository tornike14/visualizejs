import { cn } from "@/lib/utils";
import type { ModuleEdge, ModuleNode } from "../types";
import { phaseLabel, phaseColorClass } from "../helpers";

/* ── Module graph display ── */

const ModuleCard = ({ module }: { module: ModuleNode }) => (
  <div
    className={cn(
      "viz-slide-in rounded-lg border px-3 py-2 font-mono text-xs",
      module.highlight === "active"
        ? "border-amber-400/50 bg-amber-400/10"
        : "border-slate-500/30 bg-slate-800/30",
    )}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="font-semibold text-slate-200">{module.filename}</span>
      <span
        className={cn(
          "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
          phaseColorClass(module.phase),
        )}
      >
        {phaseLabel(module.phase)}
      </span>
    </div>
    {module.exports.length > 0 && (
      <div className="mt-1 text-[10px] text-slate-400">
        exports: {module.exports.join(", ")}
      </div>
    )}
  </div>
);

const EdgeLine = ({ edge }: { edge: ModuleEdge }) => (
  <div
    className={cn(
      "flex items-center gap-2 rounded border px-2 py-1 text-[10px]",
      edge.highlight === "active"
        ? "border-amber-500/30 bg-amber-500/8 text-amber-300"
        : edge.highlight === "resolved"
          ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-300"
          : "border-slate-600/30 bg-slate-800/20 text-slate-400",
    )}
  >
    <span className="font-semibold">{edge.from}</span>
    <span className="text-slate-500">&rarr;</span>
    <span className="font-semibold">{edge.to}</span>
    <span className="ml-auto text-slate-400">{edge.imports.join(", ")}</span>
  </div>
);

export const ModuleGraphPanel = ({
  modules,
  edges,
}: {
  modules: ModuleNode[];
  edges: ModuleEdge[];
}) => {
  if (modules.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no modules
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1.5">
        {modules.map((m) => (
          <ModuleCard key={m.id} module={m} />
        ))}
      </div>
      {edges.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Imports
          </p>
          {edges.map((e, i) => (
            <EdgeLine key={`${e.from}-${e.to}-${i}`} edge={e} />
          ))}
        </div>
      )}
    </div>
  );
};
