import type { FiberNodeState } from "../types";

interface FiberNodeDetailProps {
  detail: FiberNodeState | null;
}

export function FiberNodeDetail({ detail }: FiberNodeDetailProps) {
  if (!detail) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        select a fiber
      </p>
    );
  }

  const entries: { label: string; value: string | null }[] = [
    { label: "tag", value: detail.tag },
    { label: "stateNode", value: detail.stateNode },
    { label: "child", value: detail.child },
    { label: "sibling", value: detail.sibling },
    { label: "return", value: detail.return },
  ];

  return (
    <div className="space-y-1.5">
      {entries.map((entry) => (
        <div
          key={entry.label}
          className="flex items-center gap-2 font-mono text-xs"
        >
          <span className="w-20 shrink-0 text-slate-400">{entry.label}</span>
          <span className="text-slate-200">{entry.value ?? "null"}</span>
        </div>
      ))}
    </div>
  );
}
