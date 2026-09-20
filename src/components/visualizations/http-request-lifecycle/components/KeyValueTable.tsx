import { cn } from "@/lib/utils";
import type { TableRow } from "../types";
import { rowStyle } from "../helpers";

interface KeyValueTableProps {
  rows: TableRow[];
  emptyLabel?: string;
}

export const KeyValueTable = ({
  rows,
  emptyLabel = "waiting",
}: KeyValueTableProps) => {
  if (rows.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        {emptyLabel}
      </p>
    );
  }

  return (
    <dl className="space-y-1.5">
      {rows.map((row) => (
        <div
          key={row.key}
          className={cn(
            "viz-slide-in grid grid-cols-[minmax(5.5rem,auto)_minmax(0,1fr)] items-baseline gap-x-3 rounded-lg border px-3 py-1.5 font-mono text-xs transition-all duration-300",
            rowStyle(row.tone),
          )}
        >
          <dt className="truncate text-[10px] uppercase tracking-[0.1em] opacity-70">
            {row.key}
          </dt>
          <dd className="min-w-0 break-words font-semibold">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
};
