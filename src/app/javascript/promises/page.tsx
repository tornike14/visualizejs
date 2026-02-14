import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const promisesTopic = getTopicOrThrow("promises");

const PromisesVisualization = dynamic(
  () =>
    import("@/components/visualizations/Promises").then(
      (module) => module.Promises
    ),
  {
    loading: () => <VisualizationLoading />,
  }
);

export const metadata: Metadata = createTopicMetadata(promisesTopic);

export default function PromisesPage() {
  return (
    <VisualizationPageShell topic={promisesTopic}>
      <ErrorBoundary>
        <PromisesVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
