import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("execution-context");

const ExecutionContextVisualization = dynamic(
  () =>
    import("@/components/visualizations/execution-context").then(
      (module) => module.ExecutionContext
    ),
  {
    loading: () => <VisualizationLoading />,
  }
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function ExecutionContextPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ExecutionContextVisualization />
    </VisualizationPageShell>
  );
}
