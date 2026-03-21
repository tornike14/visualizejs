import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("suspense");

const SuspenseVisualization = dynamic(
  () =>
    import("@/components/visualizations/suspense").then(
      (module) => module.Suspense,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function SuspensePage() {
  return (
    <VisualizationPageShell topic={topic}>
      <SuspenseVisualization />
    </VisualizationPageShell>
  );
}
