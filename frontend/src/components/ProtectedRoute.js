import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, role }) => {
    const { user, token } = useSelector((state) => state.auth);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!user?.isEmailVerified) {
        return <Navigate to="/verify-email" replace />;
    }

    if (role && user?.role !== role) {
        // Redirect to appropriate dashboard based on user role
        if (user?.role === 'employee') {
            return <Navigate to="/employee/dashboard" replace />;
        } else if (user?.role === 'manager') {
            return <Navigate to="/manager/dashboard" replace />;
        }
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
