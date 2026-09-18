import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("backpropagation");

const BackpropagationVisualization = dynamic(
  () =>
    import("@/components/visualizations/backpropagation").then(
      (module) => module.Backpropagation,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function BackpropagationPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <BackpropagationVisualization />
    </VisualizationPageShell>
  );
}
