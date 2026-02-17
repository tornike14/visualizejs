import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("garbage-collection");

const GarbageCollectionVisualization = dynamic(
  () =>
    import("@/components/visualizations/GarbageCollection").then(
      (module) => module.GarbageCollection
    ),
  { loading: () => <VisualizationLoading /> }
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function GarbageCollectionPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <GarbageCollectionVisualization />
    </VisualizationPageShell>
  );
}
