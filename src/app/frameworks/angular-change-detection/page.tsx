import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("angular-change-detection");

const AngularChangeDetectionVisualization = dynamic(
  () =>
    import("@/components/visualizations/angular-change-detection").then(
      (module) => module.AngularChangeDetection,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function AngularChangeDetectionPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <AngularChangeDetectionVisualization />
    </VisualizationPageShell>
  );
}
