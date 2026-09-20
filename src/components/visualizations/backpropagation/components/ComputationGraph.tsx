import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GraphNode, GraphPhase } from "../types";
import {
  GRAPH_NODE_STYLES,
  PHASE_LABELS,
  PHASE_STYLES,
  signedValueClass,
} from "../helpers";

interface ComputationGraphProps {
  nodes: GraphNode[];
  phase: GraphPhase;
}

const nodeFingerprint = (node: GraphNode) =>
  `${node.id}|${node.value}|${node.grad}|${node.status}`;

/**
 * Left to right chain of graph nodes. Each node shows its forward value on
 * top and its gradient dL/d(node) underneath once the backward pass fills it.
 * Connectors point right during the forward pass and left during backward.
 */
export const ComputationGraph = ({ nodes, phase }: ComputationGraphProps) => {
  if (nodes.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        waiting
      </p>
    );
  }

  const backward = phase === "backward";

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em]",
            PHASE_STYLES[phase],
          )}
        >
          {PHASE_LABELS[phase]}
        </span>
        <span className="font-mono text-[10px] text-slate-500">
          value above, dL/d(node) below
        </span>
      </div>

      <ol
        className="flex flex-wrap items-stretch gap-y-3"
        aria-label="Computation graph"
      >
        {nodes.map((node, index) => {
          const isLast = index === nodes.length - 1;
          return (
            <li
              key={nodeFingerprint(node)}
              className="flex min-w-0 items-center"
            >
              <div
                className={cn(
                  "viz-slide-in flex min-w-[5.75rem] flex-col items-center rounded-xl border px-3 py-2 text-center transition-all duration-300",
                  GRAPH_NODE_STYLES[node.status],
                )}
                aria-current={node.status === "active" ? "step" : undefined}
              >
                <span className="font-mono text-[11px] font-semibold tracking-[0.08em]">
                  {node.label}
                </span>
                <span className="mt-0.5 font-mono text-sm tabular-nums">
                  {node.value ?? "?"}
                </span>
                <span
                  className={cn(
                    "mt-1 rounded border border-white/5 bg-black/20 px-1.5 py-0.5 font-mono text-[10px] tabular-nums",
                    node.grad ? signedValueClass(node.grad) : "text-slate-600",
                  )}
                >
                  {node.grad ? `grad ${node.grad}` : "grad ?"}
                </span>
              </div>
              {!isLast && (
                <span
                  aria-hidden
                  className={cn(
                    "mx-1 flex shrink-0 items-center transition-colors",
                    backward ? "text-violet-300/70" : "text-cyan-300/60",
                  )}
                >
                  {backward ? (
                    <ArrowLeft className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5" />
                  )}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};
