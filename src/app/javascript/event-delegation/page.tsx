import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("event-delegation");

const EventDelegationVisualization = dynamic(
  () =>
    import("@/components/visualizations/event-delegation").then(
      (module) => module.EventDelegation,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function EventDelegationPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ErrorBoundary>
        <EventDelegationVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
