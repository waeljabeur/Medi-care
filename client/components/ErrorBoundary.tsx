import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.error("🚨 ErrorBoundary caught error:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("🚨 ErrorBoundary componentDidCatch:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-destructive mb-4">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              The application encountered an error. This might be due to a
              temporary issue.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => {
                  console.log("🚨 ErrorBoundary: Emergency reset");
                  localStorage.clear();
                  window.location.href = "/login";
                }}
                className="w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90"
              >
                Reset Application
              </button>
              <button
                onClick={() => {
                  console.log("🚨 ErrorBoundary: Force dashboard");
                  localStorage.setItem(
                    "demo-session",
                    JSON.stringify({
                      id: "error-recovery-user",
                      email: "recovery@test.com",
                      user_metadata: { name: "Recovery User" },
                    }),
                  );
                  window.location.href = "/dashboard";
                }}
                className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false });
                }}
                className="w-full px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
