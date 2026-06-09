/**
 * @module src/App.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { App } from '../../App';
import { useAuthContext } from '../../contexts/AuthContext';

vi.mock('../../contexts/AuthContext', (): Record<string, unknown> => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useAuthContext: vi.fn()
}));

vi.mock('../../config', (): Record<string, unknown> => ({
  auth: {},
  db: {},
  app: {},
  googleProvider: {}
}));

vi.mock('../../pages/AuthPage', (): Record<string, unknown> => ({
  AuthPage: (): import("react").ReactElement => <div data-testid="auth-page">Auth Page</div>
}));

vi.mock('../../pages/DashboardPage', (): Record<string, unknown> => ({
  DashboardPage: (): import("react").ReactElement => <div data-testid="dashboard-page">Dashboard Page</div>
}));

vi.mock('../../pages/SettingsPage', (): Record<string, unknown> => ({
  SettingsPage: (): import("react").ReactElement => <div data-testid="settings-page">Settings Page</div>
}));

describe('App', (): void => {
  beforeEach((): void => {
    window.history.pushState({}, 'Test page', '/');
  });

  it('renders loading state for protected route', (): void => {
    (useAuthContext as import('vitest').Mock).mockReturnValue({ user: null, loading: true });
    render(<App />);
    expect(screen.getByRole('status')).toBeInTheDocument(); // LoadingSpinner
  });

  it('redirects to login when unauthenticated', (): void => {
    (useAuthContext as import('vitest').Mock).mockReturnValue({ user: null, loading: false });
    render(<App />);
    expect(screen.getByTestId('auth-page')).toBeInTheDocument();
  });

  it('renders dashboard when authenticated', (): void => {
    (useAuthContext as import('vitest').Mock).mockReturnValue({ user: { uid: '123' }, loading: false });
    render(<App />);
    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
  });
});
