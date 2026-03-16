import { ComponentTreeDiagram } from "@/components/visualization-ui/ComponentTreeDiagram";
import { NeonPanel } from "@/components/visualization-ui/NeonPanel";
import type { TreeNodeData } from "@/types/visualization";

interface DualTreePanelProps {
  currentTree: TreeNodeData;
  wipTree: TreeNodeData | null;
}

export function DualTreePanel({ currentTree, wipTree }: DualTreePanelProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <NeonPanel title="Current Tree" tone="cyan" bodyClassName="min-h-[8rem]">
        <ComponentTreeDiagram tree={currentTree} />
      </NeonPanel>

      <NeonPanel title="WIP Tree" tone="green" bodyClassName="min-h-[8rem]">
        {wipTree ? (
          <ComponentTreeDiagram tree={wipTree} />
        ) : (
          <p className="pt-5 text-center font-mono text-xs tracking-[0.22em] text-slate-500/60">
            not started
          </p>
        )}
      </NeonPanel>
    </div>
  );
}
