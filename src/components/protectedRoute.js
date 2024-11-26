import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('authToken');
  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
    }
  }

  if (!token || userRole !== role) {
    return <Navigate to="*" replace />;
  }

  return children;
};

export default ProtectedRoute;