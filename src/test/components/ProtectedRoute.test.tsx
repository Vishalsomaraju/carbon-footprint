/**
 * @module ProtectedRoute.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useAuthContext } from '../../contexts/AuthContext';

vi.mock('../../contexts/AuthContext', (): Record<string, unknown> => ({
  useAuthContext: vi.fn()
}));

describe('ProtectedRoute', (): void => {
  it('shows loading state initially', (): void => {
    (useAuthContext as import('vitest').Mock).mockReturnValue({ user: null, loading: true });
    render(<MemoryRouter><ProtectedRoute><div>Content</div></ProtectedRoute></MemoryRouter>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('redirects to HOME when user is null', (): void => {
    (useAuthContext as import('vitest').Mock).mockReturnValue({ user: null, loading: false });
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/" element={<div data-testid="home">Home</div>} />
          <Route path="/protected" element={<ProtectedRoute><div data-testid="protected">Protected</div></ProtectedRoute>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  it('renders children when user is authenticated', (): void => {
    (useAuthContext as import('vitest').Mock).mockReturnValue({ user: { uid: '123' }, loading: false });
    render(
      <MemoryRouter>
        <ProtectedRoute><div data-testid="protected">Protected</div></ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });
});
