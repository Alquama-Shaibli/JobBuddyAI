import { Component } from 'react';

/**
 * ErrorBoundary — catches render-phase and lifecycle errors anywhere
 * in the component tree. Shows a readable UI instead of a blank screen.
 *
 * Usage: wrap <App /> in <ErrorBoundary> in main.jsx
 */
class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
        // Log to console for Render logs
        console.error('[ErrorBoundary] Caught:', error);
        console.error('[ErrorBoundary] Component stack:', errorInfo?.componentStack);
    }

    handleReset = () => {
        // Clear any corrupted localStorage before retrying
        try { localStorage.removeItem('jobbuddy_user'); } catch {}
        this.setState({ hasError: false, error: null, errorInfo: null });
        window.location.href = '/';
    };

    render() {
        if (!this.state.hasError) return this.props.children;

        const { error, errorInfo } = this.state;

        return (
            <div style={{
                minHeight: '100vh',
                background: '#0f172a',
                color: '#f8fafc',
                fontFamily: 'Inter, system-ui, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
            }}>
                <div style={{ maxWidth: 600, width: '100%' }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                        <div style={{
                            width: 48, height: 48, borderRadius: 12,
                            background: '#ef4444', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            fontSize: 24,
                        }}>⚠</div>
                        <div>
                            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
                                JobBuddy AI — Something went wrong
                            </h1>
                            <p style={{ margin: 0, fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
                                A runtime error prevented the application from loading.
                            </p>
                        </div>
                    </div>

                    {/* Error message */}
                    <div style={{
                        background: '#1e293b', borderRadius: 12, padding: 20,
                        border: '1px solid #334155', marginBottom: 16,
                    }}>
                        <p style={{ margin: 0, color: '#fca5a5', fontFamily: 'monospace', fontSize: 14, wordBreak: 'break-word' }}>
                            {error?.message || 'Unknown error'}
                        </p>
                    </div>

                    {/* Component stack (collapsed) */}
                    {errorInfo?.componentStack && (
                        <details style={{ marginBottom: 24 }}>
                            <summary style={{
                                cursor: 'pointer', color: '#64748b', fontSize: 13,
                                padding: '8px 0', userSelect: 'none',
                            }}>
                                Show component stack
                            </summary>
                            <pre style={{
                                background: '#1e293b', borderRadius: 12, padding: 16,
                                fontSize: 11, color: '#94a3b8', overflowX: 'auto',
                                marginTop: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-all',
                            }}>
                                {errorInfo.componentStack}
                            </pre>
                        </details>
                    )}

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                        <button
                            onClick={this.handleReset}
                            style={{
                                padding: '10px 24px', background: '#3b82f6',
                                color: '#fff', border: 'none', borderRadius: 8,
                                cursor: 'pointer', fontWeight: 600, fontSize: 14,
                            }}
                        >
                            Clear & Reload
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                padding: '10px 24px', background: '#1e293b',
                                color: '#94a3b8', border: '1px solid #334155',
                                borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14,
                            }}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
