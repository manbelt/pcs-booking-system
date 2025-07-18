import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('PCS Booking Error Boundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>🚨 Something went wrong</h2>
            <p>The PCS Booking System encountered an unexpected error.</p>
            
            <details className="error-details">
              <summary>Technical Details</summary>
              <div className="error-stack">
                <h4>Error:</h4>
                <pre>{this.state.error?.toString()}</pre>
                
                {this.state.errorInfo && (
                  <>
                    <h4>Component Stack:</h4>
                    <pre>{this.state.errorInfo.componentStack}</pre>
                  </>
                )}
              </div>
            </details>
            
            <div className="error-actions">
              <button 
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
