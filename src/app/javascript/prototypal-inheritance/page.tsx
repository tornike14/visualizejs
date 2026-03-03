import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("prototypal-inheritance");

const PrototypalInheritanceVisualization = dynamic(
  () =>
    import("@/components/visualizations/prototypal-inheritance").then(
      (module) => module.PrototypalInheritance
    ),
  {
    loading: () => <VisualizationLoading />,
  }
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function PrototypalInheritancePage() {
  return (
    <VisualizationPageShell topic={topic}>
      <PrototypalInheritanceVisualization />
    </VisualizationPageShell>
  );
}
