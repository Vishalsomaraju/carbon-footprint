/**
 * @module features/FootprintChart.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { FootprintChart } from '../../components/features/FootprintChart';

// Mock recharts to avoid rendering issues in JSDOM
vi.mock('recharts', (): Record<string, unknown> => ({
  ResponsiveContainer: ({ children }: unknown) => <div>{children}</div>,
  BarChart: ({ children }: unknown) => <div data-testid="bar-chart">{children}</div>,
  Bar: (): import("react").ReactElement => <div data-testid="bar" />,
  XAxis: (): import("react").ReactElement => <div />,
  YAxis: (): import("react").ReactElement => <div />,
  CartesianGrid: (): import("react").ReactElement => <div />,
  Tooltip: (): import("react").ReactElement => <div />,
  Legend: (): import("react").ReactElement => <div />
}));

describe('FootprintChart', (): void => {
  it('renders empty state when no activities', (): void => {
    render(<FootprintChart activities={[]} />);
    expect(screen.getByText(/No data available yet/i)).toBeInTheDocument();
  });

  it('renders chart when activities are provided', (): void => {
    const activities = [
      { id: '1', category: 'transport', value: 10, carbonImpact: 2, date: '2023-01-01T12:00:00Z', userId: 'user1' }
    ];
    
    render(<FootprintChart activities={activities} />);
    
    expect(screen.getByText(/Carbon Footprint Trend/i)).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
