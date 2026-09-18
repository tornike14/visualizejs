import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("attention");

const AttentionVisualization = dynamic(
  () =>
    import("@/components/visualizations/attention").then(
      (module) => module.Attention,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function AttentionPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <AttentionVisualization />
    </VisualizationPageShell>
  );
}
