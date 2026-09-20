import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { HeatmapGrid } from "@/components/visualization-ui/HeatmapGrid";
import { MetricBars } from "@/components/visualization-ui/MetricBars";
import type { AttentionStep } from "../types";
import { VectorTable } from "./VectorTable";
import { ScoreTable } from "./ScoreTable";
import { WorkLines } from "./WorkLines";

interface StatePanelsProps {
  step: AttentionStep | null;
  flashes: {
    vectors: boolean;
    grids: boolean;
    work: boolean;
    output: boolean;
  };
}

const Waiting = () => (
  <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
    waiting
  </p>
);

export const StatePanels = ({ step, flashes }: StatePanelsProps) => {
  const hasGrids =
    (step?.scores.length ?? 0) > 0 || (step?.weights.length ?? 0) > 0;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <NeonPanel
          title="Q, K, V Vectors"
          tone="cyan"
          bodyClassName="min-h-[10rem]"
          className={flashes.vectors ? "viz-change-flash" : undefined}
        >
          <VectorTable rows={step?.vectors ?? []} />
        </NeonPanel>

        <NeonPanel
          title="Scores and Weights"
          tone="violet"
          bodyClassName="min-h-[10rem]"
          className={flashes.grids ? "viz-change-flash" : undefined}
        >
          {hasGrids ? (
            <div className="flex flex-wrap gap-4">
              {step?.scores.map((grid) => (
                <ScoreTable key={grid.id} grid={grid} />
              ))}
              {step?.weights.map((grid) => (
                <div key={grid.id}>
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    {grid.label}
                  </p>
                  <HeatmapGrid
                    rowLabels={grid.rowLabels}
                    colLabels={grid.colLabels}
                    values={grid.values}
                    mask={grid.mask}
                    activeRow={grid.activeRow}
                    activeCol={grid.activeCol}
                    colorRgb={grid.colorRgb}
                  />
                </div>
              ))}
            </div>
          ) : (
            <Waiting />
          )}
        </NeonPanel>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NeonPanel
          title="Arithmetic"
          tone="slate"
          bodyClassName="min-h-[8rem]"
          className={flashes.work ? "viz-change-flash" : undefined}
        >
          <WorkLines lines={step?.work ?? []} />
        </NeonPanel>

        <NeonPanel
          title="Output"
          tone="green"
          bodyClassName="min-h-[8rem]"
          className={flashes.output ? "viz-change-flash" : undefined}
        >
          <MetricBars
            bars={step?.output ?? []}
            emptyLabel="no output vector yet"
          />
        </NeonPanel>
      </div>
    </div>
  );
};
