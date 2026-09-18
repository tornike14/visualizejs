import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("debounce-throttle");

const DebounceThrottleVisualization = dynamic(
  () =>
    import("@/components/visualizations/debounce-throttle").then(
      (module) => module.DebounceThrottle,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function DebounceThrottlePage() {
  return (
    <VisualizationPageShell topic={topic}>
      <DebounceThrottleVisualization />
    </VisualizationPageShell>
  );
}
