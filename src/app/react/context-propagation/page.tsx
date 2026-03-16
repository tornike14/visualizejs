import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("context-propagation");

const ContextPropagationVisualization = dynamic(
  () =>
    import("@/components/visualizations/context-propagation").then(
      (module) => module.ContextPropagation,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function ContextPropagationPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ContextPropagationVisualization />
    </VisualizationPageShell>
  );
}
