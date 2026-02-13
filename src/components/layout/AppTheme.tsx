import type { ReactNode } from "react";

interface AppThemeProps {
  children: ReactNode;
}

export function AppTheme({ children }: AppThemeProps) {
  return (
    <div className="app-theme">
      <div className="app-theme-content flex min-h-screen">
        {children}
      </div>
    </div>
  );
}
