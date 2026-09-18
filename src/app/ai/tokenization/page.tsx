import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("tokenization");

const TokenizationVisualization = dynamic(
  () =>
    import("@/components/visualizations/tokenization").then(
      (module) => module.Tokenization,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function TokenizationPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <TokenizationVisualization />
    </VisualizationPageShell>
  );
}
