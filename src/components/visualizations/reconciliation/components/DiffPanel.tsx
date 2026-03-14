import { cn } from "@/lib/utils";
import type { DiffOperation } from "../types";
import { operationStyle, operationLabel } from "../helpers";

export function DiffPanel({ operations }: { operations: DiffOperation[] }) {
  if (operations.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no operations yet
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      {operations.map((op, index) => (
        <div
          key={`${op.type}-${op.target}-${index}`}
          className={cn(
            "viz-slide-in flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs",
            operationStyle(op.type),
          )}
        >
          <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
            {operationLabel(op.type)}
          </span>
          <span className="font-semibold">{op.target}</span>
          <span className="text-slate-400">{op.detail}</span>
        </div>
      ))}
    </div>
  );
}
