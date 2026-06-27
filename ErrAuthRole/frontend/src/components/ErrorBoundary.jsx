import React from 'react';

/**
 * Purpose: Application-wide Error Boundary.
 * Catches JavaScript errors anywhere in their child component tree,
 * logs those errors, and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In a production app, you might log this to an error reporting service like Sentry
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
          <div className="card" style={{ maxWidth: '500px', textAlign: 'center' }}>
            <h1 className="auth-title" style={{ color: 'var(--error)' }}>Oops! Something went wrong.</h1>
            <p className="text-secondary" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
              An unexpected error occurred in the application. We've logged the issue and are looking into it.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => window.location.href = '/'}
            >
              Return to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
