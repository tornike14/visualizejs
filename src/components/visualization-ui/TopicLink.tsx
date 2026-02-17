import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TopicLinkProps {
  href: string;
  label: string;
  className?: string;
}

export function TopicLink({ href, label, className }: TopicLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 rounded-lg border border-pink-500/20 bg-pink-500/8 px-3.5 py-2 text-xs font-medium text-pink-300 transition-all hover:border-pink-400/40 hover:bg-pink-500/15 hover:text-pink-200",
        className
      )}
    >
      {label}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
