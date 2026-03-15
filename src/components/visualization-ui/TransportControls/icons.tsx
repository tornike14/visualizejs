import { cn } from "@/lib/utils";

export function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
      <path d="M4 2.5v11l8.5-5.5z" />
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-4">
      <path d="M3.5 2h3v12h-3zM9.5 2h3v12h-3z" />
    </svg>
  );
}

export function StepIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
      <path d="M2.5 2.5v11L9.5 8zM11 2h2.5v12H11z" />
    </svg>
  );
}

export function StepBackIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
      <path d="M13.5 2.5v11L6.5 8zM5 2H2.5v12H5z" />
    </svg>
  );
}

export function ResetIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className="size-3.5">
      <path d="M8 1.5A6.5 6.5 0 1014.5 8 6.5 6.5 0 008 1.5zm0 1.5A5 5 0 113 8 5 5 0 018 3zm-.75 1.5h1.5v3.25H11v1.5H7.25z" />
    </svg>
  );
}

export function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={cn("size-3 text-slate-400 transition-transform duration-200", open && "rotate-180")}
    >
      <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
