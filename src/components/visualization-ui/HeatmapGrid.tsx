import { cn } from "@/lib/utils";

export interface HeatmapGridProps {
  rowLabels: string[];
  colLabels: string[];
  /** Values in the 0 to 1 range, rows first. */
  values: number[][];
  /** Row index to highlight, for example the query token. */
  activeRow?: number;
  /** Column index to highlight, for example the key being scored. */
  activeCol?: number;
  /** Cells outside this mask render dimmed, useful for causal attention. */
  mask?: boolean[][];
  /** Show numeric value inside each cell. */
  showValues?: boolean;
  /** RGB triplet for the cell colour, defaults to cyan. */
  colorRgb?: string;
  className?: string;
}

/**
 * Small matrix with colour intensity per cell. Used for attention weights,
 * similarity scores, and anything else that is naturally a table of numbers.
 */
export const HeatmapGrid = ({
  rowLabels,
  colLabels,
  values,
  activeRow,
  activeCol,
  mask,
  showValues = true,
  colorRgb = "34 211 238",
  className,
}: HeatmapGridProps) => {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="border-separate border-spacing-1 font-mono text-[11px]">
        <thead>
          <tr>
            <th />
            {colLabels.map((label, col) => (
              <th
                key={`${label}-${col}`}
                scope="col"
                className={cn(
                  "px-1 pb-1 text-center font-semibold text-slate-400",
                  activeCol === col && "text-cyan-200",
                )}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rowLabels.map((rowLabel, row) => (
            <tr key={`${rowLabel}-${row}`}>
              <th
                scope="row"
                className={cn(
                  "pr-2 text-right font-semibold text-slate-400",
                  activeRow === row && "text-cyan-200",
                )}
              >
                {rowLabel}
              </th>
              {colLabels.map((_, col) => {
                const raw = values[row]?.[col] ?? 0;
                const value = Math.max(0, Math.min(1, raw));
                const masked = mask ? !mask[row]?.[col] : false;
                const isActive = activeRow === row && activeCol === col;
                const inActiveLine = activeRow === row || activeCol === col;
                return (
                  <td
                    key={col}
                    className={cn(
                      "h-9 w-11 rounded-md border text-center transition-all duration-300",
                      masked
                        ? "border-slate-800/60 text-slate-700"
                        : "border-slate-700/40 text-slate-100",
                      isActive && "ring-2 ring-pink-300/70",
                      !masked && inActiveLine && !isActive && "border-slate-500/60",
                    )}
                    style={
                      masked
                        ? undefined
                        : {
                            background: `rgba(${colorRgb.replace(/ /g, ",")}, ${0.08 + value * 0.72})`,
                          }
                    }
                    title={masked ? "masked" : value.toFixed(2)}
                  >
                    {masked ? "–" : showValues ? value.toFixed(2) : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
