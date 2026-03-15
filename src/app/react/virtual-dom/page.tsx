import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("virtual-dom");

const VirtualDomVisualization = dynamic(
  () =>
    import("@/components/visualizations/virtual-dom").then(
      (module) => module.VirtualDom,
    ),
  { loading: () => <VisualizationLoading /> },
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function VirtualDomPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <VirtualDomVisualization />
    </VisualizationPageShell>
  );
}
