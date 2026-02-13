"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TopicToggle } from "./TopicToggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getTopicsByCategory } from "@/lib/topics";
import { DIFFICULTY_COLORS } from "@/lib/constants";
import type { Category, Topic } from "@/types";

function categoryRoute(category: Category): string {
  return category === "javascript" ? "/javascript" : "/react";
}

function categoryFromPathname(pathname: string): Category {
  return pathname.startsWith("/react") ? "react" : "javascript";
}

function TopicLink({ topic, isActive }: { topic: Topic; isActive: boolean }) {
  return (
    <Link
      href={topic.route}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
        isActive
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      }`}
    >
      <span className="text-base">{topic.icon}</span>
      <div className="flex flex-1 flex-col gap-1">
        <span className="font-medium">{topic.title}</span>
        <span className="text-xs text-muted-foreground line-clamp-1">
          {topic.description}
        </span>
      </div>
      <Badge
        variant="outline"
        className={`text-[10px] ${DIFFICULTY_COLORS[topic.difficulty]}`}
      >
        {topic.difficulty}
      </Badge>
    </Link>
  );
}

function SidebarContent({
  activeCategory,
  onCategoryChange,
  onLinkClick,
}: {
  activeCategory: Category;
  onCategoryChange: (category: Category) => void;
  onLinkClick?: () => void;
}) {
  const pathname = usePathname();
  const filteredTopics = getTopicsByCategory(activeCategory);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-4 py-5">
        <Link
          href={categoryRoute(activeCategory)}
          className="flex items-center gap-2"
          onClick={onLinkClick}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-400 to-cyan-400">
            <span className="text-sm font-bold text-black">V</span>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Visualize<span className="text-yellow-400">JS</span>
          </span>
        </Link>
      </div>

      <div className="px-4 pb-3">
        <TopicToggle
          activeCategory={activeCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>

      <Separator />

      <ScrollArea className="flex-1 px-3 py-3">
        <nav className="flex flex-col gap-1" aria-label="Topics">
          {filteredTopics.map((topic) => (
            <div key={topic.id} onClick={onLinkClick}>
              <TopicLink topic={topic} isActive={pathname === topic.route} />
            </div>
          ))}
        </nav>
      </ScrollArea>

      <Separator />

      <div className="px-4 py-3">
        <p className="text-xs text-muted-foreground">
          {filteredTopics.length} topic{filteredTopics.length !== 1 && "s"} in{" "}
          {activeCategory === "javascript" ? "JavaScript" : "React"}
        </p>
      </div>
    </div>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const activeCategory = categoryFromPathname(pathname);

  const handleCategoryChange = useCallback((category: Category) => {
    if (category === activeCategory) {
      return;
    }
    router.push(categoryRoute(category));
    setMobileOpen(false);
  }, [activeCategory, router]);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-border bg-card h-screen sticky top-0">
        <SidebarContent
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
      </aside>

      {/* Mobile hamburger + sheet */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <svg
                width="18"
                height="18"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <SidebarContent
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
              onLinkClick={() => setMobileOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
