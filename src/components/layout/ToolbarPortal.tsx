"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";
import { createPortal } from "react-dom";


type SetContainer = Dispatch<SetStateAction<HTMLDivElement | null>>;
type SetHasPortalContent = Dispatch<SetStateAction<boolean>>;
export type ToolbarSkeletonVariant = "simple" | "selector";

const ToolbarContext = createContext<SetContainer | null>(null);
const ToolbarNodeContext = createContext<HTMLDivElement | null>(null);
const ToolbarReadyContext = createContext<boolean>(false);
const ToolbarReadySetterContext = createContext<SetHasPortalContent | null>(null);

export function ToolbarProvider({ children }: { children: ReactNode }) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [hasPortalContent, setHasPortalContent] = useState(false);

  return (
    <ToolbarContext value={setContainer}>
      <ToolbarReadySetterContext value={setHasPortalContent}>
        <ToolbarReadyContext value={hasPortalContent}>
          <ToolbarNodeContext value={container}>
            {children}
          </ToolbarNodeContext>
        </ToolbarReadyContext>
      </ToolbarReadySetterContext>
    </ToolbarContext>
  );
}

export function ToolbarSlot({
  variant = "simple",
}: {
  variant?: ToolbarSkeletonVariant;
}) {
  const setContainer = useContext(ToolbarContext);
  const hasPortalContent = useContext(ToolbarReadyContext);

  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      setContainer?.(node);
    },
    [setContainer]
  );

  return (
    <div>
      {!hasPortalContent ? <ToolbarSkeleton variant={variant} /> : null}
      <div ref={callbackRef} className={hasPortalContent ? "" : "hidden"} />
    </div>
  );
}


export function ToolbarPortal({ children }: { children: ReactNode }) {
  const container = useContext(ToolbarNodeContext);
  const setHasPortalContent = useContext(ToolbarReadySetterContext);

  useEffect(() => {
    setHasPortalContent?.(true);
    return () => setHasPortalContent?.(false);
  }, [setHasPortalContent]);

  if (!container) return null;

  return createPortal(children, container);
}

function ToolbarSkeleton({ variant }: { variant: ToolbarSkeletonVariant }) {
  if (variant === "selector") {
    return (
      <div className="flex animate-pulse flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <div className="app-surface-subtle h-10 w-[16rem] rounded-xl" />
            <div className="app-surface-subtle h-5 w-16 rounded-full" />
          </div>
          <div className="app-surface-subtle h-10 w-[22rem] max-w-full rounded-2xl" />
        </div>
        <div className="app-surface-subtle mx-auto h-10 w-full max-w-4xl rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex animate-pulse flex-col gap-3">
      <div className="app-surface-subtle mx-auto h-10 w-[22rem] max-w-full rounded-2xl" />
      <div className="app-surface-subtle mx-auto h-10 w-full max-w-4xl rounded-full" />
    </div>
  );
}
