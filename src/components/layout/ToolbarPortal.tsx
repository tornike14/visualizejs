"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";

// ---------------------------------------------------------------------------
// Context: shares the toolbar mount-point DOM node across the tree
// ---------------------------------------------------------------------------

type SetContainer = Dispatch<SetStateAction<HTMLDivElement | null>>;

const ToolbarContext = createContext<SetContainer | null>(null);
const ToolbarNodeContext = createContext<HTMLDivElement | null>(null);

/**
 * Wraps a section of the tree and provides a toolbar mount-point via context.
 * Place `<ToolbarSlot />` somewhere inside to mark where the toolbar renders.
 * Place `<ToolbarPortal>` inside a descendant visualization to hoist content.
 */
export function ToolbarProvider({ children }: { children: ReactNode }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  return (
    <ToolbarContext value={setContainer}>
      <ToolbarNodeContext value={container}>
        {children}
      </ToolbarNodeContext>
    </ToolbarContext>
  );
}

/**
 * Empty mount-point. Place where the toolbar should visually appear.
 */
export function ToolbarSlot() {
  const setContainer = useContext(ToolbarContext);

  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      setContainer?.(node);
    },
    [setContainer]
  );

  return <div ref={callbackRef} />;
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
  const container = useContext(ToolbarNodeContext);

  if (!container) return null;

  return createPortal(children, container);
}
