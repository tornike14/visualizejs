import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { VisualizationPageShell } from "@/components/layout/VisualizationPageShell";
import { VisualizationLoading } from "@/components/visualizations/VisualizationLoading";
import { createTopicMetadata } from "@/lib/metadata";
import { getTopicOrThrow } from "@/lib/topics";

const topic = getTopicOrThrow("type-coercion");

const TypeCoercionVisualization = dynamic(
  () =>
    import("@/components/visualizations/TypeCoercion").then(
      (module) => module.TypeCoercion
    ),
  { loading: () => <VisualizationLoading /> }
);

export const metadata: Metadata = createTopicMetadata(topic);

export default function TypeCoercionPage() {
  return (
    <VisualizationPageShell topic={topic}>
      <TypeCoercionVisualization />
    </VisualizationPageShell>
  );
}
