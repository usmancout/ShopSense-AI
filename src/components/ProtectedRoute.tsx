import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from './ui';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to sign-in page with the current location as state
        // so we can redirect back after successful login
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;