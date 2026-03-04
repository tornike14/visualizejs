import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const generatorsTopic = getTopicOrThrow("generators");

const GeneratorsVisualization = dynamic(
  () =>
    import("@/components/visualizations/generators").then(
      (module) => module.Generators
    ),
  {
    loading: () => <VisualizationLoading />,
  }
);

export const metadata: Metadata = createTopicMetadata(generatorsTopic);

export default function GeneratorsPage() {
  return (
    <VisualizationPageShell topic={generatorsTopic}>
      <GeneratorsVisualization />
    </VisualizationPageShell>
  );
}
