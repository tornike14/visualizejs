"use client";

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { useIsHoverDevice } from "@/hooks/useIsHoverDevice";
import { cn } from "@/lib/utils";

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom";
  forceVisible?: boolean;
}

export function Tooltip({
  label,
  children,
  side = "top",
  forceVisible = false,
}: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const isHoverDevice = useIsHoverDevice();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const show = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setVisible(true), 400);
  }, []);

  const hide = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setVisible(false);
  }, []);

  if (!isHoverDevice && !forceVisible) {
    return <span className="inline-flex">{children}</span>;
  }

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {(visible || forceVisible) && (
        <span
          role="tooltip"
          className={cn(
            "pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-600/70 bg-slate-900/95 px-2.5 py-1 text-[11px] font-medium text-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.4)]",
            side === "top" && "bottom-full mb-2",
            side === "bottom" && "top-full mt-2",
          )}
        >
          {label}
        </span>
      )}
    </span>
  );
}
