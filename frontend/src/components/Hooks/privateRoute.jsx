import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({children }) => {
    const isAuthenticated = !(!localStorage.getItem('token')); // Example: Check if user is authenticated

    return isAuthenticated ? (
        children
    ) : (
        <Navigate to="/login" replace />
    );
};

export default PrivateRoute;