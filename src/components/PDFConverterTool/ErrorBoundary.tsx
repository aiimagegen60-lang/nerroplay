import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ConverterErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[PDFConverter] Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-6 bg-red-950/20 border border-red-500/30 rounded-xl text-center">
          <h2 className="text-red-500 font-bold mb-2">Converter Error</h2>
          <p className="text-sm text-red-300">The tool encountered an unrecoverable error. Please refresh.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
