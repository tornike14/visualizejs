import { cn } from "@/lib/utils";
import type { TreeNodeData } from "@/types/visualization";
import {
  NODE_HIGHLIGHT_STYLES,
  NODE_LABEL_STYLES,
  CONNECTOR_STYLES,
} from "./styles";

interface TreeNodeProps {
  node: TreeNodeData;
  activeNodeId?: string;
}

export function TreeNode({ node, activeNodeId }: TreeNodeProps) {
  const highlight = node.highlight ?? "unchanged";
  const isActive = activeNodeId === node.id;
  const children = node.children ?? [];

  return (
    <div className="flex flex-col items-center">
      {/* Node card */}
      <div
        className={cn(
          "viz-slide-in rounded-lg border px-3 py-1.5 text-center transition-all duration-300",
          NODE_HIGHLIGHT_STYLES[highlight],
          isActive && "ring-1 ring-cyan-400/40",
        )}
      >
        <span
          className={cn(
            "font-mono text-xs font-semibold",
            NODE_LABEL_STYLES[highlight],
          )}
        >
          {highlight === "removed" ? (
            <s>{node.label}</s>
          ) : (
            node.label
          )}
        </span>

        {node.props && node.props.length > 0 && (
          <div className="mt-1 space-y-0.5">
            {node.props.map((prop) => (
              <div
                key={prop.key}
                className="font-mono text-[10px] text-slate-400"
              >
                <span className="text-slate-500">{prop.key}=</span>
                <span className="text-slate-300">{prop.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Children with connectors */}
      {children.length > 0 && (
        <>
          {/* Vertical stem from parent down to the horizontal rail */}
          <div
            className={cn(
              "h-4 w-px transition-colors",
              CONNECTOR_STYLES[highlight],
            )}
          />

          {/* Child columns laid out edge-to-edge so the rail segments connect */}
          <div className="flex">
            {children.map((child, i) => {
              const childHighlight = child.highlight ?? "unchanged";
              const isFirst = i === 0;
              const isLast = i === children.length - 1;
              const isOnly = children.length === 1;

              return (
                <div
                  key={child.id}
                  className="flex flex-col items-center"
                >
                  {/* Horizontal rail: left half + right half */}
                  <div className="flex self-stretch">
                    <div
                      className={cn(
                        "h-px flex-1 transition-colors",
                        !isFirst && !isOnly && CONNECTOR_STYLES[highlight],
                      )}
                    />
                    <div
                      className={cn(
                        "h-px flex-1 transition-colors",
                        !isLast && !isOnly && CONNECTOR_STYLES[highlight],
                      )}
                    />
                  </div>

                  {/* Vertical drop from rail to child node */}
                  <div
                    className={cn(
                      "h-3 w-px transition-colors",
                      CONNECTOR_STYLES[childHighlight],
                    )}
                  />

                  {/* Child node with horizontal spacing */}
                  <div className="px-2">
                    <TreeNode
                      node={child}
                      activeNodeId={activeNodeId}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
