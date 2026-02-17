import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("this-keyword");

const ThisKeywordVisualization = dynamic(
  () =>
    import("@/components/visualizations/ThisKeyword").then(
      (module) => module.ThisKeyword
    ),
  {
    loading: () => <VisualizationLoading />,
  }
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function ThisKeywordPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ThisKeywordVisualization />
    </VisualizationPageShell>
  );
}
