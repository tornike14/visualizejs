"use client";

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------------
// Context: shares the toolbar mount-point ref across the tree
// ---------------------------------------------------------------------------

const ToolbarContext = createContext<RefObject<HTMLDivElement | null> | null>(null);

/**
 * Wraps a section of the tree and provides a toolbar mount-point via context.
 * Place `<ToolbarSlot />` somewhere inside to mark where the toolbar renders.
 * Place `<ToolbarPortal>` inside a descendant visualization to hoist content.
 */
export function ToolbarProvider({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <ToolbarContext value={ref}>
      {children}
    </ToolbarContext>
  );
}

/**
 * Empty mount-point. Place where the toolbar should visually appear.
 */
export function ToolbarSlot() {
  const ref = useContext(ToolbarContext);

  return <div ref={ref} />;
}

// ---------------------------------------------------------------------------
// Portal: renders children into the ToolbarSlot mount-point
// ---------------------------------------------------------------------------

/**
 * Renders its children into the nearest `<ToolbarSlot>` via React portal.
 * Use inside a visualization component to hoist controls above the
 * surface card without coupling to the shell's render tree.
 */
export function ToolbarPortal({ children }: { children: ReactNode }) {
  const ref = useContext(ToolbarContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !ref?.current) return null;

  return createPortal(children, ref.current);
}
