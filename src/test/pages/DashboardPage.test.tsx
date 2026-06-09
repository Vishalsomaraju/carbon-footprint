/**
 * @module DashboardPage.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import { DashboardPage } from '../../pages/DashboardPage';
import { useAuth, useActivities } from '../../hooks';

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: (): import('vitest').Mock => mockNavigate,
  };
});

vi.mock(
  '../../hooks',
  (): Record<string, unknown> => ({
    useAuth: vi.fn(),
    useActivities: vi.fn(),
  }),
);

describe('DashboardPage', (): void => {
  it('renders loading state initially', (): void => {
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John' },
    });
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({
      activities: [],
      loading: true,
      addActivity: vi.fn(),
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders empty state when no activities', (): void => {
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John' },
    });
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({
      activities: [],
      loading: false,
      addActivity: vi.fn(),
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );
    expect(screen.getByText('No activities logged yet')).toBeInTheDocument();
  });

  it('renders with activities and shows charts', (): void => {
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John' },
    });
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({
      activities: [
        { id: '1', date: new Date().toISOString(), carbonImpact: 10, category: 'transport' },
        {
          id: '2',
          date: new Date(Date.now() - 86400000).toISOString(),
          carbonImpact: 5,
          category: 'food',
        },
      ],
      loading: false,
      addActivity: vi.fn(),
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );
    expect(screen.queryByText('No activities logged yet')).not.toBeInTheDocument();
  });

  it('navigates to log activity from empty state', async (): Promise<void> => {
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({
      activities: [],
      loading: false,
    });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    const link = screen.getByText(/Log your first activity/i);
    await user.click(link);
    expect(mockNavigate).toHaveBeenCalledWith('/log');
  });

  it('navigates to log activity from header button', async (): Promise<void> => {
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({
      activities: [{ carbonImpact: 10, date: new Date().toISOString(), category: 'transport' }],
      loading: false,
    });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    const button = screen.getByRole('button', { name: 'Log Activity' });
    await user.click(button);
    expect(mockNavigate).toHaveBeenCalledWith('/log');
  });

  it('dismisses error banner', async (): Promise<void> => {
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John' },
    });
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({
      activities: [],
      loading: false,
      error: new Error('Failed to load'),
    });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>,
    );

    expect(screen.getByText('Could not load activity data')).toBeInTheDocument();

    const dismissButton = screen.getByRole('button', { name: 'Dismiss error' });
    await user.click(dismissButton);

    expect(screen.queryByText('Could not load activity data')).not.toBeInTheDocument();
  });
});
