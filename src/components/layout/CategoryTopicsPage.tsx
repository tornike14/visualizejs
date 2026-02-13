import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DIFFICULTY_COLORS } from "@/lib/constants";
import { getTopicsByCategory } from "@/lib/topics";
import type { Category } from "@/types";

interface CategoryTopicsPageProps {
  category: Category;
}

const CATEGORY_CONFIG: Record<
  Category,
  {
    icon: string;
    title: string;
    highlightedWord: string;
    titleTail: string;
    description: string;
    accentText: string;
    accentGradient: string;
  }
> = {
  javascript: {
    icon: "JS",
    title: "JavaScript Concepts",
    highlightedWord: "JavaScript",
    titleTail: "Concepts",
    description:
      "Core JavaScript internals and runtime behavior, visualized step by step.",
    accentText: "text-yellow-400",
    accentGradient: "from-yellow-400 to-orange-400",
  },
  react: {
    icon: "R",
    title: "React Concepts",
    highlightedWord: "React",
    titleTail: "Concepts",
    description:
      "React rendering, reconciliation, and auth flows with interactive diagrams.",
    accentText: "text-cyan-400",
    accentGradient: "from-cyan-400 to-blue-400",
  },
};

export function CategoryTopicsPage({ category }: CategoryTopicsPageProps) {
  const topics = getTopicsByCategory(category);
  const config = CATEGORY_CONFIG[category];

  return (
    <div className="flex flex-col gap-10 p-6 lg:p-12">
      <section className="flex flex-col items-center gap-5 pt-8 text-center lg:pt-16">
        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${config.accentGradient}`}
        >
          <span className="text-2xl font-bold text-black">{config.icon}</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
          <span className={config.accentText}>{config.highlightedWord}</span>{" "}
          {config.titleTail}
        </h1>
        <p className="max-w-xl text-base text-muted-foreground lg:text-lg">
          {config.description}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold tracking-tight">{config.title}</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
            <Link key={topic.id} href={topic.route}>
              <Card className="group h-full cursor-pointer transition-all hover:border-foreground/20 hover:shadow-lg">
                <CardHeader className="flex flex-row items-center gap-3 pb-2">
                  <span className="text-2xl">{topic.icon}</span>
                  <div className="flex flex-1 items-center justify-between gap-2">
                    <CardTitle className="text-base">{topic.title}</CardTitle>
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${DIFFICULTY_COLORS[topic.difficulty]}`}
                    >
                      {topic.difficulty}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {topic.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
