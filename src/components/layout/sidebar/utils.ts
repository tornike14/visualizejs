import type { Category } from "@/types";

export function categoryRoute(category: Category): string {
  return category === "javascript" ? "/javascript" : "/react";
}

export function categoryFromPathname(pathname: string): Category {
  return pathname.startsWith("/react") ? "react" : "javascript";
}
