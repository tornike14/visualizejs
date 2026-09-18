import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("state-batching");

const StateBatchingVisualization = dynamic(
  () =>
    import("@/components/visualizations/state-batching").then(
      (module) => module.StateBatching,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function StateBatchingPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <StateBatchingVisualization />
    </VisualizationPageShell>
  );
}
