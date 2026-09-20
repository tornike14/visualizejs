import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { TokenChips } from "@/components/visualization-ui/TokenChips";
import {
  MetricBars,
  type MetricBar,
} from "@/components/visualization-ui/MetricBars";
import type { EmbeddingsKind, EmbeddingsStep } from "../types";
import { PANEL_LAYOUT, formatSigned } from "../helpers";
import { VectorTable } from "./VectorTable";

interface EmbeddingsPanelsProps {
  kind: EmbeddingsKind;
  step: EmbeddingsStep | null;
  flashes: {
    primaryTable?: boolean;
    secondaryTable?: boolean;
    chips?: boolean;
    bars?: boolean;
    computation?: boolean;
  };
}

const EMPTY = (
  <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
    waiting
  </p>
);

export const EmbeddingsPanels = ({
  kind,
  step,
  flashes,
}: EmbeddingsPanelsProps) => {
  const layout = PANEL_LAYOUT[kind];

  const bars: MetricBar[] = (step?.bars ?? []).map((bar) => ({
    id: bar.id,
    label: bar.label,
    value: Math.abs(bar.value),
    display: formatSigned(bar.value),
    tone: bar.value < 0 ? "rose" : "cyan",
  }));

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-4">
        <NeonPanel
          title={layout.primaryTable}
          tone="cyan"
          bodyClassName="min-h-[8rem]"
          className={flashes.primaryTable ? "viz-change-flash" : undefined}
        >
          <VectorTable table={step?.primaryTable ?? null} />
        </NeonPanel>

        {layout.secondaryTable && (
          <NeonPanel
            title={layout.secondaryTable}
            tone="violet"
            bodyClassName="min-h-[8rem]"
            className={flashes.secondaryTable ? "viz-change-flash" : undefined}
          >
            <VectorTable table={step?.secondaryTable ?? null} />
          </NeonPanel>
        )}
      </div>

      <div className="space-y-4">
        <NeonPanel
          title={layout.chips}
          tone="green"
          bodyClassName="min-h-[5rem]"
          className={flashes.chips ? "viz-change-flash" : undefined}
        >
          {step ? (
            <TokenChips
              chips={step.chips}
              showIndex={layout.chipsShowIndex}
              emptyLabel="no tokens yet"
            />
          ) : (
            EMPTY
          )}
        </NeonPanel>

        {layout.bars && (
          <NeonPanel
            title={layout.bars}
            tone="pink"
            bodyClassName="min-h-[6rem]"
            className={flashes.bars ? "viz-change-flash" : undefined}
          >
            {step ? (
              <MetricBars bars={bars} emptyLabel="no vector selected" />
            ) : (
              EMPTY
            )}
          </NeonPanel>
        )}

        {layout.computation && (
          <NeonPanel
            title={layout.computation}
            tone="slate"
            bodyClassName="min-h-[6rem]"
            className={flashes.computation ? "viz-change-flash" : undefined}
          >
            {step && step.computation.length > 0 ? (
              <ul className="space-y-1.5">
                {step.computation.map((line, index) => (
                  <li
                    key={`${index}-${line}`}
                    className="viz-slide-in overflow-hidden break-words rounded-lg border border-slate-600/40 bg-slate-800/40 px-3 py-2 font-mono text-xs text-slate-200"
                  >
                    {line}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
                {step ? "nothing computed yet" : "waiting"}
              </p>
            )}
          </NeonPanel>
        )}
      </div>
    </div>
  );
};
