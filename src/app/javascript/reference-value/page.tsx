import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("reference-value");

const ReferenceValueVisualization = dynamic(
  () =>
    import("@/components/visualizations/reference-value").then(
      (module) => module.ReferenceValue
    ),
  { loading: () => <VisualizationLoading /> }
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function ReferenceValuePage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ReferenceValueVisualization />
    </VisualizationPageShell>
  );
}
