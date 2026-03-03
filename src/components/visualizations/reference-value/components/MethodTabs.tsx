import { cn } from "@/lib/utils";
import type { DeepCopyVariant } from "../types";

export function MethodTabs({
  variants,
  activeMethodId,
  onSelect,
}: {
  variants: DeepCopyVariant[];
  activeMethodId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-1.5">
      <span className="mr-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Method
      </span>
      {variants.map((v) => (
        <button
          key={v.methodId}
          type="button"
          onClick={() => onSelect(v.methodId)}
          className={cn(
            "cursor-pointer rounded-lg border px-3 py-1.5 font-mono text-xs transition-all",
            v.methodId === activeMethodId
              ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-300"
              : "border-slate-600/60 bg-slate-800/40 text-slate-400 hover:border-slate-500 hover:text-slate-200"
          )}
        >
          {v.methodLabel}
        </button>
      ))}
    </div>
  );
}
