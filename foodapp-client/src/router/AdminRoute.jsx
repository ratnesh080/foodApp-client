/* eslint-disable react/prop-types */
import React from 'react';
import useAuth from '../hooks/useAuth';
import useAdmin from '../hooks/useAdmin';
import { Navigate, useLocation } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const [isAdmin, isAdminLoading] = useAdmin();
    const location = useLocation();

    // We wait for both Auth and Admin status to load
    if (loading || isAdminLoading) {
        return <div className="h-screen flex items-center justify-center">Loading...</div>;
    }

    if (user && isAdmin) {
        return <>{children}</>;
    }

    return <Navigate to="/" state={{ from: location }} replace />;
};

export default AdminRoute;