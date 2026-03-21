import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("memoization");

const MemoizationVisualization = dynamic(
  () =>
    import("@/components/visualizations/memoization").then(
      (module) => module.Memoization,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function MemoizationPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <MemoizationVisualization />
    </VisualizationPageShell>
  );
}
