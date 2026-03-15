import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("render-cycle");

const RenderCycleVisualization = dynamic(
  () =>
    import("@/components/visualizations/render-cycle").then(
      (module) => module.RenderCycle,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function RenderCyclePage() {
  return (
    <VisualizationPageShell topic={topic}>
      <RenderCycleVisualization />
    </VisualizationPageShell>
  );
}
