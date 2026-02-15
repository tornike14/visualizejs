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


type SetContainer = Dispatch<SetStateAction<HTMLDivElement | null>>;

const ToolbarContext = createContext<SetContainer | null>(null);
const ToolbarNodeContext = createContext<HTMLDivElement | null>(null);

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


export function ToolbarPortal({ children }: { children: ReactNode }) {
  const container = useContext(ToolbarNodeContext);

  if (!container) return null;

  return createPortal(children, container);
}
