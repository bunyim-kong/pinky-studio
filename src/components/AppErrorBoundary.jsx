import { Component } from 'react';

export default class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="empty-state empty-state--page">
          <h1>Something went wrong</h1>
          <p>Please refresh the page and try again.</p>
          <button className="button button--primary" type="button" onClick={() => window.location.reload()}>
            Refresh page
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}
