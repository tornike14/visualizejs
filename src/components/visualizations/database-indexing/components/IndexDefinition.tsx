import { cn } from "@/lib/utils";
import { COLUMN_LABELS, COLUMN_STYLES } from "../helpers";
import type { IndexColumn } from "../types";

export const IndexDefinition = ({
  indexName,
  columns,
}: {
  indexName: string;
  columns: IndexColumn[];
}) => {
  if (columns.length === 0) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        no index yet
      </p>
    );
  }

  return (
    <div className="space-y-2 font-mono text-xs">
      <p className="text-[11px] text-slate-400">
        <span className="text-slate-200">{indexName}</span> (
        {columns.map((column) => column.name).join(", ")})
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {columns.map((column) => (
          <li
            key={`${column.name}-${column.state}`}
            className={cn(
              "viz-slide-in flex flex-col gap-0.5 rounded-lg border px-2.5 py-1.5 transition-all duration-300",
              COLUMN_STYLES[column.state],
            )}
          >
            <span className="text-[9px] uppercase tracking-[0.18em] opacity-60">
              column {column.position}
            </span>
            <span className="font-semibold">{column.name}</span>
            <span className="text-[10px] opacity-80">
              {COLUMN_LABELS[column.state]}
            </span>
          </li>
        ))}
      </ul>
      <p className="text-[10px] leading-relaxed text-slate-500">
        Keys are sorted by column 1, then by column 2 within equal column 1
        values. A query can use the index only through a leftmost prefix.
      </p>
    </div>
  );
};
