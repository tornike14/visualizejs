"use client";

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "bottom";
}

export function Tooltip({ label, children, side = "top" }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setIsHoverDevice(media.matches);
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
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

  if (!isHoverDevice) {
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
      {visible && (
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
