import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const executionContextTopic = getTopicOrThrow("execution-context-scope-chain");

const ExecutionContextScopeChainVisualization = dynamic(
  () =>
    import("@/components/visualizations/ExecutionContextScopeChain").then(
      (module) => module.ExecutionContextScopeChain
    ),
  {
    loading: () => <VisualizationLoading />,
  }
);

export const metadata: Metadata = createTopicMetadata(executionContextTopic);

export default function ExecutionContextScopeChainPage() {
  return (
    <VisualizationPageShell topic={executionContextTopic}>
      <ErrorBoundary>
        <ExecutionContextScopeChainVisualization />
      </ErrorBoundary>
    </VisualizationPageShell>
  );
}
