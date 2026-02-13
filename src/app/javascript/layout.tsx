import type { ReactNode } from "react";

export default function JavaScriptLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.18),transparent_58%)]" />
      <div className="relative">{children}</div>
    </div>
  );
}
