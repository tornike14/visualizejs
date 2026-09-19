"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Visualization crashed", error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="app-surface flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-2xl p-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-400/30 bg-rose-500/10 text-2xl text-rose-300">
          !
        </div>
        <h2 className="text-lg font-semibold">Something went wrong</h2>
        <p className="max-w-md text-center text-sm text-[color:var(--app-text-secondary)]">
          This visualization encountered an error. Try again or refresh the
          page.
        </p>
        <Button variant="outline" onClick={this.handleRetry}>
          Try again
        </Button>
      </div>
    );
  }
}
