export function VisualizationLoading() {
  return (
    <div className="flex min-h-[460px] flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card/60">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
      <p className="text-sm text-muted-foreground">Loading visualization...</p>
    </div>
  );
}
