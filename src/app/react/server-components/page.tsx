import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("server-components");

const ServerComponentsVisualization = dynamic(
  () =>
    import("@/components/visualizations/server-components").then(
      (module) => module.ServerComponents,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function ServerComponentsPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ServerComponentsVisualization />
    </VisualizationPageShell>
  );
}
