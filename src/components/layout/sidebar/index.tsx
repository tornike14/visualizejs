"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";
import { SidebarContent } from "./SidebarContent";
import { CollapsedSidebar } from "./CollapsedSidebar";
import { categoryRoute, categoryFromPathname } from "./utils";

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
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
      {collapsed ? (
        <CollapsedSidebar onExpand={() => setCollapsed(false)} />
      ) : (
        <aside className="app-surface hidden h-screen bg-[color:var(--app-surface-strong)] lg:sticky lg:top-0 lg:flex lg:w-72 lg:flex-col lg:rounded-none lg:border-r lg:border-t-0 lg:border-b-0 lg:border-l-0">
          <SidebarContent
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            onCollapse={() => setCollapsed(true)}
          />
        </aside>
      )}

      {/* Mobile hamburger + sheet */}
      <div className="absolute top-4 left-4 z-[60] lg:hidden">
        <Link
          href={categoryRoute(activeCategory)}
          className="group inline-flex px-1 py-1 transition-all"
        >
          <span className="bg-gradient-to-r from-cyan-300 via-sky-300 via-violet-300 to-amber-300 bg-clip-text text-[1.55rem] font-black tracking-[0.02em] text-transparent drop-shadow-[0_0_14px_rgba(34,211,238,0.24)] transition-all group-hover:drop-shadow-[0_0_20px_rgba(244,114,182,0.3)]">
            VisualizeJS
          </span>
        </Link>
      </div>

      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-[rgba(71,85,105,0.65)] bg-[rgba(13,21,40,0.95)] text-slate-100 shadow-[0_10px_24px_rgba(2,6,23,0.45)]"
            >
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
          <SheetContent
            side="left"
            className="app-surface w-72 border-r-[rgba(71,85,105,0.65)] bg-[color:var(--app-surface-strong)] p-0"
          >
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
