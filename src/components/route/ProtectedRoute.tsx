import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { selectIsAuthenticated } from '@/store/auth/auth.selector';

type Props = {
  children: React.ReactElement;
  redirectIfAuthenticated?: string;
};

const ProtectedRoute: React.FC<Props> = ({ children, redirectIfAuthenticated }) => {
  const isAuth = useSelector(selectIsAuthenticated);
  const loc = useLocation();

  // If this route is intended for public/auth pages and we should redirect
  if (redirectIfAuthenticated) {
    if (isAuth) return <Navigate to={redirectIfAuthenticated} replace />;
    return children; // allow unauthenticated users to access auth pages
  }

  // Otherwise this is a protected route: block unauthenticated users
  if (!isAuth) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;

  return children;
};

export default ProtectedRoute;
