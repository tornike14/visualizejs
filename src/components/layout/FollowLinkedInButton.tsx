"use client";

import Image from "next/image";
import { track } from "@vercel/analytics";
import { Linkedin } from "lucide-react";
import {
  CREATOR_AVATAR_SRC,
  CREATOR_LINKEDIN_URL,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FollowLinkedInButtonProps {
  compact?: boolean;
  size?: "default" | "large";
  onClick?: () => void;
  className?: string;
  trackLocation?: string;
}

export const FollowLinkedInButton = ({
  compact = false,
  size = "default",
  onClick,
  className,
  trackLocation,
}: FollowLinkedInButtonProps) => {
  const isLarge = size === "large" && !compact;
  const buttonClassName = cn(
    "group inline-flex items-center rounded-full border transition-all",
    compact
      ? "gap-1.5 border-cyan-300/35 bg-[rgba(12,25,48,0.9)] p-1.5 text-cyan-100 hover:border-cyan-200/55 hover:shadow-[0_0_16px_rgba(34,211,238,0.22)]"
      : isLarge
        ? "gap-3 border-cyan-300/25 bg-[linear-gradient(130deg,rgba(14,30,56,0.96),rgba(18,44,74,0.9))] px-4 py-2 text-slate-100 hover:border-cyan-200/50 hover:shadow-[0_0_22px_rgba(34,211,238,0.2)]"
        : "gap-2 border-cyan-300/25 bg-[linear-gradient(130deg,rgba(14,30,56,0.96),rgba(18,44,74,0.9))] px-2.5 py-1.5 text-slate-100 hover:border-cyan-200/50 hover:shadow-[0_0_22px_rgba(34,211,238,0.2)]",
    className,
  );

  const handleClick = () => {
    track("linkedin_follow_click", {
      location: trackLocation ?? (compact ? "collapsed" : "sidebar"),
    });
    onClick?.();
  };

  const content = (
    <>
      <span
        className={cn(
          "inline-flex items-center justify-center overflow-hidden rounded-full border border-cyan-200/35 bg-slate-900/80 font-semibold text-cyan-200",
          compact
            ? "h-7 w-7 text-[10px]"
            : isLarge
              ? "h-9 w-9 text-xs"
              : "h-7 w-7 text-[10px]",
        )}
      >
        <Image
          src={CREATOR_AVATAR_SRC}
          alt="Tornike Nizharadze LinkedIn profile photo"
          width={isLarge ? 36 : 28}
          height={isLarge ? 36 : 28}
          className="h-full w-full object-cover"
        />
      </span>

      {!compact && (
        <span
          className={cn(
            "font-semibold tracking-[0.08em] text-cyan-100/95",
            isLarge ? "text-sm" : "text-xs",
          )}
        >
          Follow
        </span>
      )}

      <span
        className={cn(
          "inline-flex items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-400/10 text-cyan-200",
          isLarge ? "h-7 w-7" : "h-6 w-6",
        )}
      >
        <Linkedin className={cn(isLarge ? "h-4 w-4" : "h-3.5 w-3.5")} />
      </span>
    </>
  );

  return (
    <a
      href={CREATOR_LINKEDIN_URL}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label="Follow on LinkedIn"
      className={buttonClassName}
    >
      {content}
    </a>
  );
};
