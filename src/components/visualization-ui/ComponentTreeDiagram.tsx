"use client";

import { useRef, useState, useCallback, useLayoutEffect } from "react";
import { cn } from "@/lib/utils";
import type { TreeNodeData, TreeNodeHighlight } from "@/types/visualization";

interface ComponentTreeDiagramProps {
  tree: TreeNodeData;
  activeNodeId?: string;
}

const NODE_HIGHLIGHT_STYLES: Record<TreeNodeHighlight, string> = {
  unchanged:
    "border-slate-500/30 bg-slate-800/40",
  updated:
    "border-amber-300/40 bg-amber-400/10 shadow-[0_0_14px_rgba(251,191,36,0.1)]",
  added:
    "border-emerald-300/40 bg-emerald-400/10 shadow-[0_0_14px_rgba(52,211,153,0.1)]",
  removed:
    "border-rose-400/40 bg-rose-400/10 shadow-[0_0_14px_rgba(244,63,94,0.1)] line-through",
  active:
    "border-cyan-300/40 bg-cyan-400/10 shadow-[0_0_14px_rgba(34,211,238,0.12)]",
};

const NODE_LABEL_STYLES: Record<TreeNodeHighlight, string> = {
  unchanged: "text-slate-400",
  updated: "text-amber-300",
  added: "text-emerald-300",
  removed: "text-rose-400",
  active: "text-cyan-300",
};

const CONNECTOR_STYLES: Record<TreeNodeHighlight, string> = {
  unchanged: "bg-slate-600/40",
  updated: "bg-amber-400/40",
  added: "bg-emerald-400/40",
  removed: "bg-rose-400/40",
  active: "bg-cyan-400/40",
};

function TreeNode({
  node,
  activeNodeId,
}: {
  node: TreeNodeData;
  activeNodeId?: string;
}) {
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

export function ComponentTreeDiagram({
  tree,
  activeNodeId,
}: ComponentTreeDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number | undefined>(undefined);

  const measure = useCallback(() => {
    const container = containerRef.current;
    const inner = innerRef.current;
    if (!container || !inner) return;

    // Reset transform to measure natural size
    inner.style.transform = "none";
    const naturalWidth = inner.scrollWidth;
    const naturalHeight = inner.scrollHeight;
    const available = container.clientWidth;

    const s =
      naturalWidth > available && available > 0
        ? available / naturalWidth
        : 1;

    inner.style.transform = s < 1 ? `scale(${s})` : "none";
    setScale(s);
    setHeight(s < 1 ? Math.ceil(naturalHeight * s) : undefined);
  }, []);

  useLayoutEffect(() => {
    measure();
  }, [tree, activeNodeId, measure]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => measure());
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <div ref={containerRef} className="py-2">
      <div className="overflow-hidden" style={{ height }}>
        <div
          ref={innerRef}
          className="flex justify-center"
          style={{ transformOrigin: "top center" }}
        >
          <TreeNode node={tree} activeNodeId={activeNodeId} />
        </div>
      </div>
    </div>
  );
}
