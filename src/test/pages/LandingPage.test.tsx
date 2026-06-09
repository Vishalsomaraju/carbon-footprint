/**
 * @module LandingPage.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { LandingPage } from '../../pages/LandingPage';
import { useAuthContext } from '../../contexts/AuthContext';

vi.mock(
  '../../contexts/AuthContext',
  (): Record<string, unknown> => ({
    useAuthContext: vi.fn(),
  }),
);
vi.mock(
  'react-router-dom',
  (): Record<string, unknown> => ({
    useNavigate: () => vi.fn(),
  }),
);

describe('LandingPage', (): void => {
  it('renders correctly', (): void => {
    (useAuthContext as import('vitest').Mock).mockReturnValue({
      user: null,
      loading: false,
      signIn: vi.fn(),
    });
    render(<LandingPage />);
    expect(screen.getByText(/Understand your impact/i)).toBeInTheDocument();
  });
});
