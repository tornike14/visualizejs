import { cn } from "@/lib/utils";
import {
  SIGNAL_ROW_STYLES,
  SIGNAL_STATUS_STYLES,
  SIGNAL_TYPE_LABELS,
  SIGNAL_TYPE_STYLES,
} from "../helpers";
import type { SignalNode } from "../types";

const fingerprint = (node: SignalNode) =>
  `${node.status}|${node.value ?? ""}|${node.deps.join(",")}|${node.note ?? ""}`;

const SignalRow = ({ node }: { node: SignalNode }) => (
  <li
    className={cn(
      "viz-slide-in rounded-lg border px-3 py-2 font-mono text-xs transition-all duration-300",
      SIGNAL_ROW_STYLES[node.status],
    )}
  >
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={cn(
          "shrink-0 rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]",
          SIGNAL_TYPE_STYLES[node.type],
        )}
      >
        {SIGNAL_TYPE_LABELS[node.type]}
      </span>
      <span className="font-semibold text-slate-100">{node.name}</span>
      {node.value !== undefined && (
        <span className="text-slate-400">= {node.value}</span>
      )}
      <span
        className={cn(
          "ml-auto shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]",
          SIGNAL_STATUS_STYLES[node.status],
        )}
      >
        {node.status}
      </span>
    </div>
    {(node.deps.length > 0 || node.note) && (
      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
        {node.deps.length > 0 && (
          <span>
            reads{" "}
            <span className="text-cyan-300/80">{node.deps.join(", ")}</span>
          </span>
        )}
        {node.note && <span className="text-amber-300/80">{node.note}</span>}
      </div>
    )}
  </li>
);

export const SignalGraphPanel = ({ nodes }: { nodes: SignalNode[] }) => {
  if (nodes.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no signals yet
      </p>
    );
  }

  const sources = nodes.filter((node) => node.type === "source");
  const reactions = nodes.filter((node) => node.type !== "source");

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
          sources
        </p>
        <ul className="space-y-1.5">
          {sources.map((node) => (
            <SignalRow key={`${node.id}-${fingerprint(node)}`} node={node} />
          ))}
        </ul>
      </div>
      {reactions.length > 0 && (
        <div>
          <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-slate-500">
            reactions
          </p>
          <ul className="space-y-1.5">
            {reactions.map((node) => (
              <SignalRow key={`${node.id}-${fingerprint(node)}`} node={node} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
