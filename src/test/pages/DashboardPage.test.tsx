/**
 * @module pages/DashboardPage.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import { DashboardPage } from '../../pages/DashboardPage';
import { useAuth, useActivities, useGeminiInsights } from '../../hooks';

vi.mock('../../hooks', (): Record<string, unknown> => ({
  useAuth: vi.fn(),
  useActivities: vi.fn(),
  useGeminiInsights: vi.fn()
}));

vi.mock('../../components/features', (): Record<string, unknown> => ({
  ActivityForm: (): import("react").ReactElement => <div data-testid="activity-form">ActivityForm</div>,
  FootprintChart: (): import("react").ReactElement => <div data-testid="footprint-chart">FootprintChart</div>,
  InsightCard: ({ insight }: { insight: { body: string } }) => <div data-testid="insight-card">{insight.body}</div>
}));

vi.mock('../../components/ui', (): Record<string, unknown> => ({
  LoadingSpinner: (): import("react").ReactElement => <div data-testid="loading-spinner">Loading...</div>
}));

describe('DashboardPage', (): void => {
  it('renders loading state initially', (): void => {
    (useAuth as import('vitest').Mock).mockReturnValue({ user: { displayName: 'John' } });
    (useActivities as import('vitest').Mock).mockReturnValue({ activities: [], loading: true, addActivity: vi.fn() });
    (useGeminiInsights as import('vitest').Mock).mockReturnValue({ insights: [], loading: false, generateInsights: vi.fn() });

    render(<DashboardPage />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders insights when they are available', (): void => {
    (useAuth as import('vitest').Mock).mockReturnValue({ user: { displayName: 'John' } });
    (useActivities as import('vitest').Mock).mockReturnValue({
      activities: [],
      loading: false,
      error: null,
      addActivity: vi.fn(),
      deleteActivity: vi.fn(),
    });

    (useGeminiInsights as import('vitest').Mock).mockReturnValue({ 
      insights: [{ id: '1', type: 'tip', title: 'Good', body: 'Great job!', category: 'general' }], 
      loading: false, 
      generateInsights: vi.fn() 
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('insight-card')).toHaveTextContent('Great job!');
  });

  it('renders dashboard content', (): void => {
    (useAuth as import('vitest').Mock).mockReturnValue({ user: { displayName: 'John' } });
    (useActivities as import('vitest').Mock).mockReturnValue({ 
      activities: [{ id: '1', category: 'transport', value: 10, carbonImpact: 2, date: '2023-01-01', userId: 'user1' }], 
      loading: false, 
      addActivity: vi.fn() 
    });
    (useGeminiInsights as import('vitest').Mock).mockReturnValue({ 
      insights: [{ id: '1', type: 'tip', title: 'Good', body: 'Great job!', category: 'general' }], 
      loading: false, 
      generateInsights: vi.fn() 
    });

    render(<DashboardPage />);
    
    expect(screen.getByText('Welcome, John!')).toBeInTheDocument();
    expect(screen.getByTestId('activity-form')).toBeInTheDocument();
    expect(screen.getByTestId('footprint-chart')).toBeInTheDocument();
    expect(screen.getByTestId('insight-card')).toHaveTextContent('Great job!');
  });
});
