import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("hooks");

const HooksVisualization = dynamic(
  () =>
    import("@/components/visualizations/hooks").then(
      (module) => module.Hooks,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function HooksPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <HooksVisualization />
    </VisualizationPageShell>
  );
}
