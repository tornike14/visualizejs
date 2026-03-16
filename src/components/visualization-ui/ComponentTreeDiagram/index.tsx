"use client";

import { useRef, useState, useCallback, useLayoutEffect } from "react";
import type { TreeNodeData } from "@/types/visualization";
import { TreeNode } from "./TreeNode";

interface ComponentTreeDiagramProps {
  tree: TreeNodeData;
  activeNodeId?: string;
}

export function ComponentTreeDiagram({
  tree,
  activeNodeId,
}: ComponentTreeDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
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
