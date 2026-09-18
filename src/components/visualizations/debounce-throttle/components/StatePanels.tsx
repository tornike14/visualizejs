import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { cn } from "@/lib/utils";
import { ENTRY_VALUE_STYLES } from "../helpers";
import type { ComparisonRow, StateEntry, StatePanelDef } from "../types";

const Empty = ({ label }: { label: string }) => (
  <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
    {label}
  </p>
);

export const StateEntries = ({ entries }: { entries: StateEntry[] }) => {
  if (entries.length === 0) return <Empty label="waiting" />;
  return (
    <div className="space-y-1.5">
      {entries.map((entry) => (
        <div
          key={`${entry.key}-${entry.value}-${entry.tone ?? ""}`}
          className="viz-slide-in flex items-center justify-between gap-3 font-mono text-xs"
        >
          <span className="text-slate-400">{entry.key}</span>
          <span
            className={cn(
              "max-w-[60%] truncate rounded-md border px-2 py-0.5 text-right",
              ENTRY_VALUE_STYLES[entry.tone ?? "muted"],
            )}
            title={entry.value}
          >
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export const StatePanelGrid = ({
  defs,
  state,
  flashes,
}: {
  defs: StatePanelDef[];
  state: Record<string, StateEntry[]> | undefined;
  flashes: Record<string, boolean>;
}) => {
  if (defs.length === 0) return null;
  return (
    <div className={cn("grid gap-4", defs.length > 1 && "sm:grid-cols-2")}>
      {defs.map((def) => (
        <NeonPanel
          key={def.id}
          title={def.title}
          tone={def.tone}
          bodyClassName="min-h-[7rem]"
          className={flashes[def.id] ? "viz-change-flash" : undefined}
        >
          <StateEntries entries={state?.[def.id] ?? []} />
        </NeonPanel>
      ))}
    </div>
  );
};

export const ComparisonTable = ({ rows }: { rows: ComparisonRow[] }) => {
  if (rows.length === 0) return <Empty label="waiting" />;
  return (
    <div className="overflow-hidden rounded-lg border border-slate-700/60 font-mono text-[11px]">
      <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] bg-slate-800/50 text-[10px] uppercase tracking-[0.18em]">
        <span className="px-2 py-1.5 text-slate-400">aspect</span>
        <span className="px-2 py-1.5 text-cyan-300">debounce</span>
        <span className="px-2 py-1.5 text-emerald-300">throttle</span>
      </div>
      {rows.map((row) => (
        <div
          key={`${row.aspect}-${row.debounce}-${row.throttle}`}
          className="viz-slide-in grid grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] border-t border-slate-700/50"
        >
          <span className="px-2 py-1.5 text-slate-400">{row.aspect}</span>
          <span className="px-2 py-1.5 text-slate-200">{row.debounce}</span>
          <span className="px-2 py-1.5 text-slate-200">{row.throttle}</span>
        </div>
      ))}
    </div>
  );
};
