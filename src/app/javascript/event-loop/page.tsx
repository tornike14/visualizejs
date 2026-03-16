import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const eventLoopTopic = getTopicOrThrow("event-loop");

const EventLoopVisualization = dynamic(
  () =>
    import("@/components/visualizations/event-loop").then(
      (module) => module.EventLoop
    ),
  {
    loading: () => <VisualizationLoading />,
  }
);

export const metadata: Metadata = createTopicMetadata(eventLoopTopic);

export default function EventLoopPage() {
  return (
    <VisualizationPageShell topic={eventLoopTopic}>
      <EventLoopVisualization />
    </VisualizationPageShell>
  );
}
