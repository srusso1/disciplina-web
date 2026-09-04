import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './useAuthStore';
import { UserRole } from '../types/auth.types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.rol)) {
    // Redirige al panel correspondiente a su rol si intenta acceder a una ruta ajena
    const fallbackPath = user.rol === 'ROLE_RECTOR' ? '/rectoria/dashboard' : '/orientador/incidentes';
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};
