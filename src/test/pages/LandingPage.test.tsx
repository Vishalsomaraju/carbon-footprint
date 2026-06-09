import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LandingPage } from '../../pages/LandingPage';
import { useAuthContext } from '../../contexts/AuthContext';

vi.mock('../../contexts/AuthContext', () => ({
  useAuthContext: vi.fn()
}));
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

describe('LandingPage', () => {
  it('renders correctly', () => {
    (useAuthContext as any).mockReturnValue({ user: null, loading: false, signIn: vi.fn() });
    render(<LandingPage />);
    expect(screen.getByText(/Understand your impact/i)).toBeInTheDocument();
  });
});
