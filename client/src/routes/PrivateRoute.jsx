import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * PrivateRoute — blocks unauthenticated users.
 * Optional adminOnly prop redirects non-admins to /dashboard.
 * skipOnboardingCheck prop bypasses the onboarding redirect.
 */
function PrivateRoute({ children, adminOnly = false, skipOnboardingCheck = false }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: '#0f172a' }}>
                <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!currentUser) return <Navigate to="/sign-in" replace />;

    if (adminOnly && !currentUser.isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}

export default PrivateRoute;