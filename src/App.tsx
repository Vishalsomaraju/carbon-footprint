/**
 * @module src/App
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AuthProvider } from './contexts/AuthContext';
import { AppLayout } from './layouts/AppLayout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { LogActivityPage } from './pages/LogActivityPage';
import { ProfilePage } from './pages/ProfilePage';
import { InsightsPage } from './pages/InsightsPage';
import { CommutePage } from './pages/CommutePage';
import { ROUTES } from './constants';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

export const App = (): React.ReactElement => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTES.LOG} element={<LogActivityPage />} />
            <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            <Route path={ROUTES.INSIGHTS} element={<InsightsPage />} />
            <Route path={ROUTES.COMMUTE} element={<CommutePage />} />
          </Route>
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};
