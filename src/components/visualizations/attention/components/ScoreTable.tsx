import { cn } from "@/lib/utils";
import { formatValue } from "../helpers";
import type { ScoreGrid } from "../types";

/**
 * Pre-softmax scores. Unlike HeatmapGrid the values are unbounded, so cells
 * print the number as-is and use borders instead of colour intensity.
 */
export const ScoreTable = ({ grid }: { grid: ScoreGrid }) => (
  <div className="overflow-x-auto">
    <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
      {grid.label}
    </p>
    <table className="border-separate border-spacing-1 font-mono text-[11px]">
      <thead>
        <tr>
          <th />
          {grid.colLabels.map((label, col) => (
            <th
              key={`${label}-${col}`}
              scope="col"
              className={cn(
                "px-1 pb-1 text-center font-semibold text-slate-400",
                grid.activeCol === col && "text-cyan-200",
              )}
            >
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {grid.rowLabels.map((rowLabel, row) => (
          <tr key={`${rowLabel}-${row}`}>
            <th
              scope="row"
              className={cn(
                "pr-2 text-right font-semibold text-slate-400",
                grid.activeRow === row && "text-cyan-200",
              )}
            >
              {rowLabel}
            </th>
            {grid.colLabels.map((_, col) => {
              const value = grid.values[row]?.[col] ?? null;
              const masked = grid.masked?.[row]?.[col] ?? false;
              const isActive = grid.activeRow === row && grid.activeCol === col;
              const inActiveRow = grid.activeRow === row;
              return (
                <td
                  key={col}
                  className={cn(
                    "h-9 w-11 rounded-md border text-center tabular-nums transition-all duration-300",
                    masked
                      ? "border-rose-400/40 bg-rose-400/10 text-rose-300"
                      : value === null
                        ? "border-slate-800/60 text-slate-700"
                        : inActiveRow
                          ? "border-violet-300/50 bg-violet-400/12 text-violet-100"
                          : "border-slate-700/40 bg-slate-800/40 text-slate-200",
                    isActive && "ring-2 ring-pink-300/70",
                  )}
                >
                  {masked ? "-inf" : value === null ? "" : formatValue(value)}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
