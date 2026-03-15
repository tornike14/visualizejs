import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("fiber-tree");

const FiberTreeVisualization = dynamic(
  () =>
    import("@/components/visualizations/fiber-tree").then(
      (module) => module.FiberTree,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function FiberTreePage() {
  return (
    <VisualizationPageShell topic={topic}>
      <FiberTreeVisualization />
    </VisualizationPageShell>
  );
}
