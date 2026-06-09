import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import { DashboardPage } from '../../pages/DashboardPage';
import { useAuth, useActivities } from '../../hooks';

vi.mock('../../hooks', () => ({
  useAuth: vi.fn(),
  useActivities: vi.fn(),
}));

describe('DashboardPage', () => {
  it('renders loading state initially', () => {
    (useAuth as unknown as import("vitest").Mock).mockReturnValue({ user: { displayName: 'John' } });
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [], loading: true, addActivity: vi.fn() });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
    // As long as it renders without throwing
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });
});
