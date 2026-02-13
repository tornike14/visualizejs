import type { ReactNode } from "react";

export default function ReactLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.2),transparent_58%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
