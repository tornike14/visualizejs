export function VisualizationLoading() {
  return (
    <div className="app-surface flex min-h-[460px] flex-col items-center justify-center gap-4 rounded-3xl">
      <div className="h-9 w-9 animate-spin rounded-full border-2 border-muted-foreground border-t-foreground" />
      <p className="text-sm text-muted-foreground">Loading visualization...</p>
    </div>
  );
}
