import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("spread-rest");

const SpreadRestVisualization = dynamic(
  () =>
    import("@/components/visualizations/spread-rest").then(
      (module) => module.SpreadRest,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function SpreadRestPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ErrorBoundary>
        <SpreadRestVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
