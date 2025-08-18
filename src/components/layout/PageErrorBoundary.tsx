'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class PageErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Page error boundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-md w-full text-center">
            
            {/* Error icon with animation */}
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto relative animate-bounce" />
            </div>

            {/* Error message */}
            <h2 className="text-xl font-semibold text-white mb-4">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-400 mb-6">
              This page encountered an error and couldn't load properly. 
              Try refreshing the page or return to the dashboard.
            </p>

            {/* Error details (in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 mb-6 text-left">
                <p className="text-red-400 text-sm font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh Page
              </Button>
              
              <Button
                asChild
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 flex items-center gap-2"
              >
                <Link href="/dashboard">
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}