import { Component } from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, isOffline: !navigator.onLine };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => this.setState({ isOffline: false });
  handleOffline = () => this.setState({ isOffline: true });

  render() {
    if (this.state.isOffline) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <WifiOff className="w-16 h-16 text-text-muted mb-4" />
          <h2 className="text-2xl font-bold mb-2">You are offline</h2>
          <p className="text-text-muted">Please check your internet connection and try again.</p>
        </div>
      );
    }

    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <AlertTriangle className="w-16 h-16 text-error mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-text-muted mb-6">We encountered an unexpected error.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-primary text-background font-bold rounded-full hover:bg-primary-hover transition-colors"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
