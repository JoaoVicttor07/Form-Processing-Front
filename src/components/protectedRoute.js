import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken');
  const location = useLocation();

  if (!token && location.pathname !== '/signin') {
    return <Navigate to="/signin" />;
  }

  return children;
};

export default ProtectedRoute;