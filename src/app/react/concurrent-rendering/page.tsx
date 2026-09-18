import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("concurrent-rendering");

const ConcurrentRenderingVisualization = dynamic(
  () =>
    import("@/components/visualizations/concurrent-rendering").then(
      (module) => module.ConcurrentRendering,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function ConcurrentRenderingPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ConcurrentRenderingVisualization />
    </VisualizationPageShell>
  );
}
