import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("caching-strategies");

const CachingStrategiesVisualization = dynamic(
  () =>
    import("@/components/visualizations/caching-strategies").then(
      (module) => module.CachingStrategies,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function CachingStrategiesPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <CachingStrategiesVisualization />
    </VisualizationPageShell>
  );
}
