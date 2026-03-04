import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("destructuring");

const DestructuringVisualization = dynamic(
  () =>
    import("@/components/visualizations/destructuring").then(
      (module) => module.Destructuring,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function DestructuringPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ErrorBoundary>
        <DestructuringVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
