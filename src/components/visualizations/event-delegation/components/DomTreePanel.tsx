import { cn } from "@/lib/utils";
import type { DOMNodeData } from "../types";
import { nodeHighlightClass } from "../helpers";

/* ── Recursive DOM tree display ── */

const DomNode = ({ node, depth = 0 }: { node: DOMNodeData; depth?: number }) => (
  <div className={cn("ml-4 first:ml-0", depth > 0 && "border-l border-slate-600/30 pl-3")}>
    <div
      className={cn(
        "viz-slide-in mb-1.5 flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors",
        nodeHighlightClass(node.highlight),
      )}
    >
      <span className="font-semibold text-slate-200">{node.label}</span>
      {node.hasHandler && (
        <span
          className={cn(
            "rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase",
            node.handlerPhase === "capture"
              ? "bg-cyan-500/20 text-cyan-400"
              : "bg-emerald-500/20 text-emerald-400",
          )}
        >
          {node.handlerPhase ?? "bubble"}
        </span>
      )}
    </div>
    {node.children.map((child) => (
      <DomNode key={child.id} node={child} depth={depth + 1} />
    ))}
  </div>
);

export const DomTreePanel = ({ tree }: { tree: DOMNodeData | null }) => {
  if (!tree) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no tree
      </p>
    );
  }

  return <DomNode node={tree} />;
};
