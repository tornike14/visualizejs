import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("svelte-runes");

const SvelteRunesVisualization = dynamic(
  () =>
    import("@/components/visualizations/svelte-runes").then(
      (module) => module.SvelteRunes,
    ),
  {
    loading: () => <VisualizationLoading />,
  },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function SvelteRunesPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <SvelteRunesVisualization />
    </VisualizationPageShell>
  );
}
