import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import { cn } from "@/lib/utils";
import type { VueReactivityKind, VueReactivityStep } from "../types";
import { ComputedPanel } from "./ComputedPanel";
import { BindingsPanel } from "./BindingsPanel";
import { SchedulerPanel } from "./SchedulerPanel";

interface StatePanelsProps {
  kind: VueReactivityKind;
  step: VueReactivityStep | null;
  flashes: { computed?: boolean; bindings?: boolean; scheduler?: boolean };
}

export const StatePanels = ({ kind, step, flashes }: StatePanelsProps) => {
  const showComputed = kind === "computed";
  const showBindings = kind === "pitfalls";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {showComputed && (
        <NeonPanel
          title="Computed State"
          tone="green"
          bodyClassName="min-h-[6rem]"
          className={flashes.computed ? "viz-change-flash" : undefined}
        >
          <ComputedPanel computed={step?.computed ?? null} />
        </NeonPanel>
      )}
      {showBindings && (
        <NeonPanel
          title="Bindings"
          tone="green"
          bodyClassName="min-h-[6rem]"
          className={flashes.bindings ? "viz-change-flash" : undefined}
        >
          <BindingsPanel bindings={step?.bindings ?? null} />
        </NeonPanel>
      )}
      <NeonPanel
        title="Effect Scheduler"
        tone="pink"
        bodyClassName="min-h-[6rem]"
        className={cn(
          flashes.scheduler && "viz-change-flash",
          !showComputed && !showBindings && "sm:col-span-2",
        )}
      >
        <SchedulerPanel scheduler={step?.scheduler ?? null} />
      </NeonPanel>
    </div>
  );
};
