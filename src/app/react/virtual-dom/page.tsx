import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const virtualDomTopic = getTopicOrThrow("virtual-dom");

const VirtualDomVisualization = dynamic(
  () =>
    import("@/components/visualizations/VirtualDOM").then(
      (module) => module.VirtualDOM
    ),
  {
    loading: () => <VisualizationLoading />,
  }
);

export const metadata: Metadata = createTopicMetadata(virtualDomTopic);

export default function VirtualDomPage() {
  return (
    <VisualizationPageShell topic={virtualDomTopic}>
      <ErrorBoundary>
        <VirtualDomVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
