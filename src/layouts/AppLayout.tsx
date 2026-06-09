/**
 * @module layouts/AppLayout
 * @description Main application layout with responsive sidebar/bottom nav
 */

import React from 'react';
import { Outlet } from 'react-router-dom';

import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { Sidebar } from '../components/layout/Sidebar';
import { BottomNav } from '../components/layout/BottomNav';

export const AppLayout: React.FC = (): import('react').ReactElement => {
  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-white focus:z-50"
      >
        Skip to main content
      </a>

      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content */}
      <main
        id="main-content"
        role="main"
        className="flex-1 overflow-auto bg-gray-50 w-full mb-16 md:mb-0"
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Bottom Nav - Mobile */}
      <BottomNav />
    </div>
  );
};
