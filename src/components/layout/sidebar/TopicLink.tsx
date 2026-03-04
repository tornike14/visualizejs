import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DIFFICULTY_COLORS } from "@/lib/constants";
import type { Topic } from "@/types";

export function TopicLink({ topic, isActive }: { topic: Topic; isActive: boolean }) {
  return (
    <Link
      href={topic.route}
      className={`group flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition-all ${
        isActive
          ? "border-pink-400/35 bg-[rgba(31,45,74,0.7)] text-[color:var(--app-text-primary)] shadow-[0_0_18px_rgba(244,114,182,0.14)]"
          : "border-[rgba(71,85,105,0.45)] bg-[rgba(13,21,40,0.62)] text-[color:var(--app-text-secondary)] shadow-[inset_0_1px_0_rgba(148,163,184,0.05)] hover:border-[rgba(71,85,105,0.75)] hover:bg-[rgba(22,33,59,0.72)] hover:text-[color:var(--app-text-primary)]"
      }`}
    >
      <span className="flex-1 font-semibold tracking-[0.01em]">{topic.title}</span>
      <Badge
        variant="outline"
        className={`text-[10px] ${DIFFICULTY_COLORS[topic.difficulty]}`}
      >
        {topic.difficulty}
      </Badge>
    </Link>
  );
}
