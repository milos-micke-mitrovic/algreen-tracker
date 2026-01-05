import { Component, type ReactNode } from 'react';

interface ComponentErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ComponentErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React class component error boundary
 * Wraps components to catch JavaScript errors during rendering
 * Use this to prevent the entire app from crashing when a component fails
 *
 * @example
 * <ComponentErrorBoundary>
 *   <SomeComponentThatMightFail />
 * </ComponentErrorBoundary>
 *
 * @example with custom fallback
 * <ComponentErrorBoundary fallback={<div>Something went wrong</div>}>
 *   <SomeComponentThatMightFail />
 * </ComponentErrorBoundary>
 */
export class ComponentErrorBoundary extends Component<
  ComponentErrorBoundaryProps,
  ComponentErrorBoundaryState
> {
  constructor(props: ComponentErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ComponentErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to your error tracking service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
          <div className="w-full max-w-md rounded-lg border bg-card p-6 text-center shadow-lg">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <span className="text-2xl">⚠️</span>
            </div>
            <h1 className="mb-2 text-xl font-semibold">Došlo je do greške</h1>
            <p className="mb-4 text-sm text-muted-foreground">
              Došlo je do neočekivane greške. Molimo pokušajte ponovo.
            </p>
            {this.state.error && (
              <pre className="mb-4 overflow-auto rounded bg-muted p-2 text-left text-xs">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-2 justify-center">
              <button
                onClick={this.handleReset}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Pokušaj ponovo
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Početna stranica
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Keep ErrorBoundary as alias for backward compatibility
export { ComponentErrorBoundary as ErrorBoundary };
