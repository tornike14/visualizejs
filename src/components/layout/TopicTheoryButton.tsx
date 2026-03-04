import Link from "next/link";
import { BookOpenText } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicTheoryButtonProps {
  href: string;
  size?: "default" | "large";
  isPreview?: boolean;
  className?: string;
}

export const TopicTheoryButton = ({
  href,
  size = "default",
  isPreview = false,
  className,
}: TopicTheoryButtonProps) => {
  const buttonClassName = cn(
    "inline-flex items-center rounded-lg border border-cyan-300/30 bg-cyan-400/10 font-medium text-cyan-200 transition-colors hover:border-cyan-300/55 hover:bg-cyan-300/14",
    size === "large"
      ? "gap-2.5 px-4 py-2 text-sm"
      : "gap-2 px-3 py-1.5 text-xs",
    isPreview && "cursor-default",
    className,
  );

  if (isPreview) {
    return (
      <span className={buttonClassName} aria-label="Theory button preview">
        <BookOpenText className={cn(size === "large" ? "h-4 w-4" : "h-3.5 w-3.5")} />
        Theory
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={buttonClassName}
    >
      <BookOpenText className={cn(size === "large" ? "h-4 w-4" : "h-3.5 w-3.5")} />
      Theory
    </Link>
  );
};
