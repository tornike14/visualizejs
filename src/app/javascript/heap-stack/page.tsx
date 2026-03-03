import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("heap-stack");

const HeapStackVisualization = dynamic(
  () =>
    import("@/components/visualizations/heap-stack").then(
      (module) => module.HeapStack
    ),
  { loading: () => <VisualizationLoading /> }
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function HeapStackPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <HeapStackVisualization />
    </VisualizationPageShell>
  );
}
