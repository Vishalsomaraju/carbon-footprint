import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../../components/auth/ProtectedRoute';
import { useAuthContext } from '../../contexts/AuthContext';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../../contexts/AuthContext', () => ({
  useAuthContext: vi.fn()
}));

describe('ProtectedRoute', () => {
  it('shows loading state initially', () => {
    (useAuthContext as any).mockReturnValue({ user: null, loading: true });
    render(<MemoryRouter><ProtectedRoute><div>Content</div></ProtectedRoute></MemoryRouter>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('redirects to HOME when user is null', () => {
    (useAuthContext as any).mockReturnValue({ user: null, loading: false });
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

  it('renders children when user is authenticated', () => {
    (useAuthContext as any).mockReturnValue({ user: { uid: '123' }, loading: false });
    render(
      <MemoryRouter>
        <ProtectedRoute><div data-testid="protected">Protected</div></ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });
});
