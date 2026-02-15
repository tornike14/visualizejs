import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("scope-chain");

const ScopeChainVisualization = dynamic(
  () =>
    import("@/components/visualizations/ScopeChain").then(
      (module) => module.ScopeChain
    ),
  {
    loading: () => <VisualizationLoading />,
  }
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function ScopeChainPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <ErrorBoundary>
        <ScopeChainVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
