import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Topic } from "@/types";

interface TopicPagerNavProps {
  previous: Topic | null;
  next: Topic | null;
  placement?: "top" | "bottom";
}

/** Previous and next topic links so readers can move through a category in order. */
export const TopicPagerNav = ({
  previous,
  next,
  placement = "top",
}: TopicPagerNavProps) => {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label={placement === "top" ? "Adjacent topics" : "Continue learning"}
      className={cn(
        "grid gap-2 sm:grid-cols-2",
        placement === "top" ? "text-xs" : "text-sm",
      )}
    >
      {previous ? (
        <Link
          href={previous.route}
          prefetch={false}
          className="group app-surface-subtle flex items-center gap-3 rounded-2xl px-4 py-2.5 transition-all hover:border-pink-300/35"
        >
          <ArrowLeft className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:-translate-x-0.5" />
          <span className="flex min-w-0 flex-col">
            <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Previous
            </span>
            <span className="truncate font-semibold text-slate-200">
              {previous.title}
            </span>
          </span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link
          href={next.route}
          prefetch={false}
          className="group app-surface-subtle flex items-center justify-end gap-3 rounded-2xl px-4 py-2.5 text-right transition-all hover:border-pink-300/35"
        >
          <span className="flex min-w-0 flex-col">
            <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">
              Next
            </span>
            <span className="truncate font-semibold text-slate-200">
              {next.title}
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </nav>
  );
};
