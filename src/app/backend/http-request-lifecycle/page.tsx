import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("http-request-lifecycle");

const HttpRequestLifecycleVisualization = dynamic(
  () =>
    import("@/components/visualizations/http-request-lifecycle").then(
      (module) => module.HttpRequestLifecycle,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function HttpRequestLifecyclePage() {
  return (
    <VisualizationPageShell topic={topic}>
      <HttpRequestLifecycleVisualization />
    </VisualizationPageShell>
  );
}
