import { cn } from "@/lib/utils";
import type { VectorTable as VectorTableData } from "../types";
import { cellBackground } from "../helpers";

interface VectorTableProps {
  table: VectorTableData | null;
  emptyLabel?: string;
}

/**
 * Signed matrix with one coloured cell per value. Positive values tint cyan,
 * negative values tint rose, and intensity follows the magnitude.
 */
export const VectorTable = ({
  table,
  emptyLabel = "waiting",
}: VectorTableProps) => {
  if (!table) {
    return (
      <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
        {emptyLabel}
      </p>
    );
  }

  const doneRows = table.doneRows ?? [];

  return (
    <div className="overflow-x-auto">
      <table className="border-separate border-spacing-1 font-mono text-[11px]">
        <thead>
          <tr>
            <th />
            {table.colLabels.map((label, col) => (
              <th
                key={`${label}-${col}`}
                scope="col"
                className="px-1 pb-1 text-center font-semibold text-slate-400"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rowLabels.map((rowLabel, row) => {
            const isActive = table.activeRow === row;
            const isDone = doneRows.includes(row);
            return (
              <tr key={`${rowLabel}-${row}`}>
                <th
                  scope="row"
                  className={cn(
                    "pr-2 text-right font-semibold text-slate-400",
                    isDone && "text-emerald-300",
                    isActive && "text-cyan-200",
                  )}
                >
                  {rowLabel}
                </th>
                {table.colLabels.map((_, col) => {
                  const value = table.values[row]?.[col] ?? null;
                  return (
                    <td
                      key={col}
                      className={cn(
                        "h-9 min-w-[3.25rem] rounded-md border px-1.5 text-center tabular-nums transition-all duration-300",
                        value === null
                          ? "border-slate-800/60 text-slate-600"
                          : "border-slate-700/40 text-slate-100",
                        isActive && "ring-2 ring-pink-300/70",
                      )}
                      style={
                        value === null
                          ? undefined
                          : { background: cellBackground(value) }
                      }
                    >
                      {value === null ? "." : value.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
