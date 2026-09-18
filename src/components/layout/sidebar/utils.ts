import { CATEGORIES, categoryFromPathname } from "@/lib/categories";
import type { Category } from "@/types";

export function categoryRoute(category: Category): string {
  return CATEGORIES[category].route;
}

export { categoryFromPathname };
