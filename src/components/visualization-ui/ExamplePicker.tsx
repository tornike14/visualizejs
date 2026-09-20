"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { ExampleSelector } from "@/components/visualization-ui/ExampleSelector";
import { cn } from "@/lib/utils";
import type { ExampleOption } from "@/types/visualization";

interface KindBadgeProps {
  className: string;
  children: ReactNode;
}

/** Small outline badge naming an example's kind, used in and next to the picker. */
export const KindBadge = ({ className, children }: KindBadgeProps) => (
  <Badge variant="outline" className={cn("text-[10px]", className)}>
    {children}
  </Badge>
);

interface ExamplePickerProps<T extends ExampleOption> {
  examples: readonly T[];
  activeId: string;
  onSelect: (id: string) => void;
  /** Rendered inside each option and once more beside the picker for the active example. */
  renderBadge?: (example: T) => ReactNode;
}

/** Example dropdown plus the active example's kind badge. */
export const ExamplePicker = <T extends ExampleOption>({
  examples,
  activeId,
  onSelect,
  renderBadge,
}: ExamplePickerProps<T>) => {
  const active = examples.find((example) => example.id === activeId);

  return (
    <>
      <ExampleSelector
        examples={examples}
        activeId={activeId}
        onSelect={onSelect}
        renderBadge={renderBadge}
      />
      {active && renderBadge?.(active)}
    </>
  );
};
