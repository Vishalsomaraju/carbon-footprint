/**
 * @module CommuteResults.test
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { CommuteResults } from '../../components/commute/CommuteResults';

// Mock Recharts to avoid layout issues in virtual DOM
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }): import('react').ReactElement => <div>{children}</div>,
  BarChart: ({ children }: { children: React.ReactNode }): import('react').ReactElement => <div>{children}</div>,
  Bar: (): null => null,
  XAxis: (): null => null,
  YAxis: (): null => null,
  Tooltip: (): null => null,
  Cell: (): null => null,
}));

describe('CommuteResults', (): void => {
  const mockResult = {
    distanceKm: 15,
    durationMinutes: 30,
    dailyCo2Kg: 5,
    annualCo2Kg: 1000,
    origin: 'New York',
    destination: 'Boston',
    transportMode: 'car_petrol_per_km',
  };

  it('renders stats correctly', (): void => {
    render(
      <CommuteResults
        result={mockResult}
        mode="car_petrol_per_km"
        days={5}
        logLoading={false}
        onLog={vi.fn()}
      />
    );
    expect(screen.getByText('Daily Co2')).toBeInTheDocument();
    expect(screen.getByText('5.0')).toBeInTheDocument();
    expect(screen.getByText('Annual Co2')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText(/15.0 km/i)).toBeInTheDocument();
    expect(screen.getByText(/30 mins/i)).toBeInTheDocument();
  });

  it('renders alternative tips when savings exist', (): void => {
    render(
      <CommuteResults
        result={mockResult}
        mode="car_petrol_per_km"
        days={5}
        logLoading={false}
        onLog={vi.fn()}
      />
    );
    expect(screen.getByText(/Tip:/i)).toBeInTheDocument();
  });

  it('calls onLog when log button is clicked', (): void => {
    const mockLog = vi.fn();
    render(
      <CommuteResults
        result={mockResult}
        mode="car_petrol_per_km"
        days={5}
        logLoading={false}
        onLog={mockLog}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Log This Commute/i }));
    expect(mockLog).toHaveBeenCalled();
  });

  it('shows loading state during logging', (): void => {
    render(
      <CommuteResults
        result={mockResult}
        mode="car_petrol_per_km"
        days={5}
        logLoading={true}
        onLog={vi.fn()}
      />
    );
    const button = screen.getByRole('button', { name: /Log This Commute/i });
    expect(button).toBeDisabled();
  });
});
