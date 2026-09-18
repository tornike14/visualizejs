import { cn } from "@/lib/utils";
import { DOM_STATE_LABELS, DOM_STATE_STYLES } from "../helpers";
import type { DomNode } from "../types";

const fingerprint = (node: DomNode) => `${node.state}|${node.text ?? ""}`;

export const DomPanel = ({ nodes }: { nodes: DomNode[] }) => {
  if (nodes.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        nothing mounted
      </p>
    );
  }

  return (
    <ul className="space-y-1.5">
      {nodes.map((node) => {
        const label = DOM_STATE_LABELS[node.state];
        return (
          <li
            key={`${node.id}-${fingerprint(node)}`}
            className={cn(
              "viz-slide-in flex flex-wrap items-center gap-2 rounded-lg border px-3 py-2 font-mono text-xs transition-all duration-300",
              DOM_STATE_STYLES[node.state],
            )}
            style={{ marginLeft: `${(node.depth ?? 0) * 1.25}rem` }}
          >
            <span className="font-semibold">{node.label}</span>
            {node.text !== undefined && (
              <span className="break-all text-slate-300">{node.text}</span>
            )}
            {label && (
              <span className="ml-auto shrink-0 rounded bg-black/25 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]">
                {label}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
};
