import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { TokenChips } from "@/components/visualization-ui/TokenChips";
import { MetricBars } from "@/components/visualization-ui/MetricBars";
import { panelTitles } from "../helpers";
import type { TokenizationKind, TokenizationStep } from "../types";
import { SegmentGroups } from "./SegmentGroups";
import { StatsGrid } from "./StatsGrid";

interface StatePanelsProps {
  kind: TokenizationKind;
  step: TokenizationStep | null;
  flashes: {
    segments: boolean;
    rules: boolean;
    aux: boolean;
    stats: boolean;
  };
}

const Waiting = () => (
  <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
    waiting
  </p>
);

export const StatePanels = ({ kind, step, flashes }: StatePanelsProps) => {
  const titles = panelTitles(kind);
  const isTraining = kind === "bpe";

  return (
    <div className="space-y-4">
      <NeonPanel
        title={titles.segments}
        tone="cyan"
        bodyClassName="min-h-[8rem]"
        className={flashes.segments ? "viz-change-flash" : undefined}
      >
        <SegmentGroups groups={step?.segments ?? []} />
      </NeonPanel>

      <div className="grid gap-4 sm:grid-cols-2">
        <NeonPanel
          title={titles.rules}
          tone="green"
          bodyClassName="min-h-[8rem]"
          className={flashes.rules ? "viz-change-flash" : undefined}
        >
          {step ? (
            <TokenChips
              chips={step.rules}
              emptyLabel={isTraining ? "empty" : "no merges yet"}
            />
          ) : (
            <Waiting />
          )}
        </NeonPanel>

        <NeonPanel
          title={titles.aux}
          tone="violet"
          bodyClassName="min-h-[8rem]"
          className={flashes.aux ? "viz-change-flash" : undefined}
        >
          {!step ? (
            <Waiting />
          ) : isTraining ? (
            <MetricBars bars={step.bars} emptyLabel="not counted yet" />
          ) : (
            <TokenChips chips={step.bytes} emptyLabel="no piece selected" />
          )}
        </NeonPanel>
      </div>

      <NeonPanel
        title={titles.stats}
        tone="slate"
        className={flashes.stats ? "viz-change-flash" : undefined}
      >
        <StatsGrid stats={step?.stats ?? []} />
      </NeonPanel>
    </div>
  );
};
