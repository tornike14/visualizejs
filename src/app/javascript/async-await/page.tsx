import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("async-await");

const AsyncAwaitVisualization = dynamic(
  () =>
    import("@/components/visualizations/async-await").then(
      (module) => module.AsyncAwait,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function AsyncAwaitPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <AsyncAwaitVisualization />
    </VisualizationPageShell>
  );
}
