/**
 * @module LandingPage.test
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import { LandingPage } from '../../pages/LandingPage';
import { useAuth } from '../../hooks';
import { trackError } from '../../utils/errorTracker';

vi.mock(
  '../../hooks',
  (): Record<string, unknown> => ({
    useAuth: vi.fn(),
  }),
);

vi.mock(
  '../../utils/errorTracker',
  (): Record<string, unknown> => ({
    trackError: vi.fn(),
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
    (useAuth as import('vitest').Mock).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      error: null,
    });
    render(<LandingPage />);
    expect(screen.getByText(/Understand your impact/i)).toBeInTheDocument();
  });

  it('handles login error', async (): Promise<void> => {
    const error = new Error('Test error');
    const mockLogin = vi.fn().mockRejectedValue(error);
    (useAuth as import('vitest').Mock).mockReturnValue({
      user: null,
      loading: false,
      login: mockLogin,
      error: error,
    });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(<LandingPage />);

    const loginButton = screen.getByRole('button', { name: /Sign in with Google/i });
    await user.click(loginButton);

    expect(trackError).toHaveBeenCalledWith(error);
  });
});
