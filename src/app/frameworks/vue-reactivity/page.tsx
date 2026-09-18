import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("vue-reactivity");

const VueReactivityVisualization = dynamic(
  () =>
    import("@/components/visualizations/vue-reactivity").then(
      (module) => module.VueReactivity,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function VueReactivityPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <VueReactivityVisualization />
    </VisualizationPageShell>
  );
}
