/**
 * @module App.test
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { App } from '../../App';
import { useAuthContext } from '../../contexts/AuthContext';

vi.mock(
  '../../contexts/AuthContext',
  (): Record<string, unknown> => ({
    AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useAuthContext: vi.fn(),
  }),
);

vi.mock(
  '../../lib/firebase',
  (): Record<string, unknown> => ({ auth: {}, db: {}, app: {}, googleProvider: {} }),
);

vi.mock(
  '../../pages/LandingPage',
  (): Record<string, unknown> => ({
    LandingPage: () => <div data-testid="landing-page">Landing Page</div>,
  }),
);

vi.mock(
  '../../pages/DashboardPage',
  (): Record<string, unknown> => ({
    DashboardPage: () => <div data-testid="dashboard-page">Dashboard Page</div>,
  }),
);

describe('App router', (): void => {
  beforeEach((): void => {
    window.history.pushState({}, 'Test page', '/');
  });

  it('redirects to login when unauthenticated', (): void => {
    (useAuthContext as import('vitest').Mock).mockReturnValue({ user: null, loading: false });
    render(<App />);
    expect(screen.getByTestId('landing-page')).toBeInTheDocument();
  });

  it('renders dashboard when authenticated', async (): Promise<void> => {
    (useAuthContext as import('vitest').Mock).mockReturnValue({
      user: { uid: '123' },
      loading: false,
    });
    window.history.pushState({}, 'Test', '/dashboard');
    render(<App />);
    expect(await screen.findByTestId('dashboard-page')).toBeInTheDocument();
  });
});
