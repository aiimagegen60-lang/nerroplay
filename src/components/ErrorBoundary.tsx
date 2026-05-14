import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // You could send this to a logging service here
  }

  private handleReset = () => {
    this.setState({ hasError: false });
    // If a reset handler is provided by parent (e.g. to increment a key), call it
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      // Default fallback if no specialized reset logic
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      } else {
        window.location.reload();
      }
    }
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="text-red-500" size={32} />
          </div>
          <h1 className="text-2xl font-black text-text-primary uppercase tracking-tighter mb-2">System Anomaly Detected</h1>
          <p className="text-xs text-text-secondary font-mono uppercase tracking-[0.2em] max-w-md mb-8">
            A critical synchronization error occurred in the neural interface. The simulation has been paused for safety.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={this.handleReset}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-accent text-background rounded-xl font-black uppercase text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-accent/20"
            >
              <RefreshCcw size={16} /> Re-Synchronize Interface
            </button>
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center justify-center gap-2 px-8 py-4 glass text-text-primary rounded-xl font-black uppercase text-xs hover:bg-white/5 active:scale-95 transition-all"
            >
              Emergency Extraction
            </button>
          </div>
          <p className="mt-12 text-[10px] text-text-muted font-mono uppercase opacity-50 tracking-[0.3em]">Code: INTERFACE_COLLISION_0xAF</p>
        </div>
      );
    }

    return this.props.children;
  }
}
