import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("modules-imports");

const ModulesImportsVisualization = dynamic(
  () =>
    import("@/components/visualizations/modules-imports").then(
      (module) => module.ModulesImports,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function ModulesImportsPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ErrorBoundary>
        <ModulesImportsVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
