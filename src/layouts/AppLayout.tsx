/**
 * @module layouts/AppLayout
 */

import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks';
import { ErrorBoundary } from '../components/ui';
import { ROUTES } from '../constants';

export const AppLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async (): Promise<void> => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex shrink-0 items-center gap-2">
                <span className="text-2xl">🌍</span>
                <span className="font-bold text-xl text-green-700">EcoTrack</span>
              </Link>
            </div>
            {user && (
              <div className="flex items-center gap-4">
                <nav className="hidden md:flex space-x-4">
                  <Link 
                    to={ROUTES.DASHBOARD} 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(ROUTES.DASHBOARD) ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to={ROUTES.INSIGHTS} 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(ROUTES.INSIGHTS) ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    AI Insights
                  </Link>
                  <Link 
                    to={ROUTES.COMMUTE} 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive(ROUTES.COMMUTE) ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Commute
                  </Link>
                  <Link 
                    to="/settings" 
                    className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/settings') ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    Settings
                  </Link>
                </nav>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 hidden sm:block">{user.displayName || user.email}</span>
                  <button 
                    onClick={handleLogout}
                    className="text-sm font-medium text-gray-600 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
};
