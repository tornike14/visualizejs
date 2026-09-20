import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SignalNode } from "../types";
import {
  SIGNAL_KIND_LABELS,
  SIGNAL_STATE_LABELS,
  SIGNAL_STATE_STYLES,
} from "../helpers";

const nodeFingerprint = (node: SignalNode) =>
  `${node.id}|${node.value}|${node.state}`;

/**
 * Producer to consumer chain: a writable signal at the top, computed signals
 * in the middle, and the template view that reads them at the bottom. Each
 * arrow is a dependency edge recorded the first time the consumer read the
 * producer.
 */
export const SignalGraph = ({ nodes }: { nodes: SignalNode[] }) => {
  if (nodes.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no graph yet
      </p>
    );
  }

  return (
    <ol className="flex flex-col items-stretch">
      {nodes.map((node, index) => {
        const isLast = index === nodes.length - 1;
        return (
          <li key={node.id} className="flex flex-col items-stretch">
            <div
              key={nodeFingerprint(node)}
              className={cn(
                "viz-slide-in flex items-center gap-3 rounded-lg border px-3 py-2 font-mono text-xs transition-all duration-300",
                SIGNAL_STATE_STYLES[node.state],
              )}
            >
              <span className="w-16 shrink-0 text-[10px] uppercase tracking-[0.12em] opacity-70">
                {SIGNAL_KIND_LABELS[node.kind]}
              </span>
              <span className="font-semibold">{node.label}</span>
              <span className="ml-auto tabular-nums">{node.value}</span>
              <span className="shrink-0 rounded bg-black/20 px-1.5 py-0.5 text-[10px] uppercase">
                {SIGNAL_STATE_LABELS[node.state]}
              </span>
            </div>
            {!isLast && (
              <span
                aria-hidden
                className="flex justify-center py-0.5 text-slate-600"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
};
