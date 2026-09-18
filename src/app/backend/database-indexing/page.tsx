import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("database-indexing");

const DatabaseIndexingVisualization = dynamic(
  () =>
    import("@/components/visualizations/database-indexing").then(
      (module) => module.DatabaseIndexing,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function DatabaseIndexingPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <DatabaseIndexingVisualization />
    </VisualizationPageShell>
  );
}
