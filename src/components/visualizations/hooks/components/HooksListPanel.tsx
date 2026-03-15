import { cn } from "@/lib/utils";
import type { HookNode } from "../types";
import { statusStyle } from "../helpers";

interface HooksListPanelProps {
  hookNodes: HookNode[];
  errorMessage?: string;
}

export function HooksListPanel({ hookNodes, errorMessage }: HooksListPanelProps) {
  if (hookNodes.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no hooks yet
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {hookNodes.map((node, idx) => (
        <div key={node.index}>
          <div
            className={cn(
              "viz-slide-in flex items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs",
              statusStyle(node.status),
            )}
          >
            <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold">
              #{node.index}
            </span>
            <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] font-bold uppercase">
              {node.hookType}
            </span>
            <span className="text-slate-200">{node.memoizedState}</span>
          </div>
          {idx < hookNodes.length - 1 && (
            <div className="flex justify-center py-0.5">
              <span className="text-[10px] text-slate-500">next ↓</span>
            </div>
          )}
        </div>
      ))}
      {hookNodes.length > 0 && hookNodes.every((n) => n.status === "mounted") && (
        <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/8 px-3 py-2 text-center text-xs font-semibold text-emerald-300">
          Linked list complete
        </div>
      )}
      {errorMessage && (
        <div className="mt-2 rounded-lg border border-rose-500/30 bg-rose-500/8 px-3 py-2 text-xs text-rose-300">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
