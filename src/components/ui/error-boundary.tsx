'use client'

import React, { ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo })
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    console.error('Error caught by boundary:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-black/40 border border-red-500/20 rounded-xl">
          <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Something went wrong</h2>
          <p className="text-red-200/70 text-center mb-6 max-w-md">
            An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
          </p>
          <Button 
            onClick={this.handleReset}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-6 max-w-2xl">
              <summary className="text-sm text-red-300 cursor-pointer mb-2">Error Details (Development)</summary>
              <pre className="text-xs bg-black/60 p-4 rounded border border-red-500/30 text-red-200 overflow-auto">
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}