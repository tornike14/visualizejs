import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const closuresTopic = getTopicOrThrow("closures");

const ClosuresVisualization = dynamic(
  () =>
    import("@/components/visualizations/Closures").then(
      (module) => module.Closures
    ),
  {
    loading: () => <VisualizationLoading />,
  }
);

export const metadata: Metadata = createTopicMetadata(closuresTopic);

export default function ClosuresPage() {
  return (
    <VisualizationPageShell topic={closuresTopic}>
      <ErrorBoundary>
        <ClosuresVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
