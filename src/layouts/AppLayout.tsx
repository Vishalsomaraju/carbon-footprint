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
    <div className="flex h-screen w-full">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-canvas-white focus:text-deep-void focus:z-50"
      >
        Skip to main content
      </a>

      {/* Sidebar - Desktop */}
      <Sidebar />

      {/* Main Content */}
      <main
        id="main-content"
        role="main"
        className="flex-1 flex flex-col h-full overflow-hidden relative bg-deep-void"
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
