import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const hoistingTopic = getTopicOrThrow("hoisting");

const HoistingVisualization = dynamic(
  () =>
    import("@/components/visualizations/Hoisting").then(
      (module) => module.Hoisting
    ),
  {
    loading: () => <VisualizationLoading />,
  }
);

export const metadata: Metadata = createTopicMetadata(hoistingTopic);

export default function HoistingPage() {
  return (
    <VisualizationPageShell topic={hoistingTopic}>
      <ErrorBoundary>
        <HoistingVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
