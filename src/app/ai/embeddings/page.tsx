import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("embeddings");

const EmbeddingsVisualization = dynamic(
  () =>
    import("@/components/visualizations/embeddings").then(
      (module) => module.Embeddings,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function EmbeddingsPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <EmbeddingsVisualization />
    </VisualizationPageShell>
  );
}
