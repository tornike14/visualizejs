"use client";

import { Check } from "lucide-react";
import { useIsTopicCompleted } from "@/hooks/useTopicProgress";
import { cn } from "@/lib/utils";

interface TopicProgressMarkProps {
  topicId: string;
  className?: string;
}

/** Small check badge shown next to topics the reader has finished. */
export const TopicProgressMark = ({
  topicId,
  className,
}: TopicProgressMarkProps) => {
  const completed = useIsTopicCompleted(topicId);
  if (!completed) return null;

  return (
    <span
      className={cn(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-400/15 text-emerald-300",
        className,
      )}
      title="Completed"
      aria-label="Completed"
    >
      <Check className="h-2.5 w-2.5" strokeWidth={3} />
    </span>
  );
};
