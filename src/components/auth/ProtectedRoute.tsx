/**
 * @module ProtectedRoute
 */

import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthContext } from '../../contexts/AuthContext';
import { ROUTES } from '../../constants';
import { LoadingSpinner } from '../ui';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
};
