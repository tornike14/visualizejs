"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { BrandLogo } from "@/components/layout/BrandLogo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CATEGORIES, categoryFromPathname } from "@/lib/categories";
import type { Category } from "@/types";
import { SidebarContent } from "./SidebarContent";
import { CollapsedSidebar } from "./CollapsedSidebar";

export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const activeCategory = categoryFromPathname(pathname);

  const handleCategoryChange = useCallback(
    (category: Category) => {
      if (category === activeCategory) {
        return;
      }
      router.push(CATEGORIES[category].route);
      setMobileOpen(false);
    },
    [activeCategory, router],
  );

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
        <BrandLogo href={CATEGORIES[activeCategory].route} />
      </div>

      <div className="fixed top-4 right-4 z-50 lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-[rgba(71,85,105,0.65)] bg-[rgba(13,21,40,0.95)] text-slate-100 shadow-[0_10px_24px_rgba(2,6,23,0.45)]"
            >
              <Menu className="h-[18px] w-[18px]" />
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
};
