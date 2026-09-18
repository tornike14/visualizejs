import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { MessageFlow } from "@/components/visualization-ui/MessageFlow";
import { MetricBars } from "@/components/visualization-ui/MetricBars";
import { TokenChips } from "@/components/visualization-ui/TokenChips";
import { ACTORS } from "../data";
import type { CachingKind, CachingStep } from "../types";
import { CacheStorePanel } from "./CacheStorePanel";
import { WriteQueue } from "./WriteQueue";

interface StatePanelsProps {
  kind: CachingKind;
  step: CachingStep | null;
  flashes: Record<"cache" | "messages" | "stats" | "queue" | "recency", boolean>;
}

const Waiting = () => (
  <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
    waiting
  </p>
);

/** The topic-specific panels to the right of the source code. */
export const StatePanels = ({ kind, step, flashes }: StatePanelsProps) => (
  <div className="space-y-4">
    {kind === "lru" && (
      <NeonPanel
        title="Recency List"
        tone="pink"
        bodyClassName="min-h-[5rem]"
        className={flashes.recency ? "viz-change-flash" : undefined}
      >
        {step ? (
          <TokenChips chips={step.recency} emptyLabel="empty" showIndex />
        ) : (
          <Waiting />
        )}
      </NeonPanel>
    )}

    <div className="grid gap-4 sm:grid-cols-2">
      <NeonPanel
        title="Cache Store"
        tone="cyan"
        bodyClassName="min-h-[10rem]"
        className={flashes.cache ? "viz-change-flash" : undefined}
      >
        <CacheStorePanel
          entries={step?.cache ?? []}
          database={step?.database ?? []}
          started={step !== null}
        />
      </NeonPanel>

      <NeonPanel
        title="Stats"
        tone="green"
        bodyClassName="min-h-[10rem]"
        className={flashes.stats ? "viz-change-flash" : undefined}
      >
        {step ? <MetricBars bars={step.stats} /> : <Waiting />}
      </NeonPanel>
    </div>

    {kind === "write" && (
      <NeonPanel
        title="Write Queue"
        tone="pink"
        bodyClassName="min-h-[6rem]"
        className={flashes.queue ? "viz-change-flash" : undefined}
      >
        {step ? <WriteQueue items={step.queue} /> : <Waiting />}
      </NeonPanel>
    )}

    {kind !== "lru" && (
      <NeonPanel
        title="Messages"
        tone="violet"
        bodyClassName="min-h-[8rem]"
        className={flashes.messages ? "viz-change-flash" : undefined}
      >
        {step ? (
          <MessageFlow
            actors={ACTORS}
            messages={step.messages}
            activeActorId={step.activeActorId}
            emptyLabel="no traffic yet"
          />
        ) : (
          <Waiting />
        )}
      </NeonPanel>
    )}
  </div>
);
