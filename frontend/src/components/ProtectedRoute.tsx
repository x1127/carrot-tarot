import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useAdminConfigStore } from '../store/adminConfig';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  const applyTheme = useAdminConfigStore((state) => state.applyTheme);

  useEffect(() => {
    if (isAuthenticated) {
      applyTheme();
    }
  }, [isAuthenticated, applyTheme]);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
