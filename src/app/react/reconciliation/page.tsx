import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("reconciliation");

const ReconciliationVisualization = dynamic(
  () =>
    import("@/components/visualizations/reconciliation").then(
      (module) => module.Reconciliation,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function ReconciliationPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ReconciliationVisualization />
    </VisualizationPageShell>
  );
}
