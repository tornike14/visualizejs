import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("next-token-prediction");

const NextTokenPredictionVisualization = dynamic(
  () =>
    import("@/components/visualizations/next-token-prediction").then(
      (module) => module.NextTokenPrediction,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function NextTokenPredictionPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <NextTokenPredictionVisualization />
    </VisualizationPageShell>
  );
}
