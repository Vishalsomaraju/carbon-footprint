/**
 * @module CommutePage.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import { CommutePage } from '../../pages/CommutePage';
import { useCommute } from '../../hooks';

// Default mock return values for useCommute
const mockSetOrigin = vi.fn();
const mockSetDestination = vi.fn();
const mockSetMode = vi.fn();
const mockSetDays = vi.fn();
const mockSetToast = vi.fn();
const mockHandleCalculate = vi.fn();
const mockHandleLog = vi.fn();

const defaultCommuteState = {
  origin: '',
  setOrigin: mockSetOrigin,
  destination: '',
  setDestination: mockSetDestination,
  mode: 'car_petrol_per_km' as const,
  setMode: mockSetMode,
  days: 5,
  setDays: mockSetDays,
  loading: false,
  result: null,
  error: '',
  toast: null,
  setToast: mockSetToast,
  logLoading: false,
  handleCalculate: mockHandleCalculate,
  handleLog: mockHandleLog,
};


vi.mock('../../hooks', () => ({
  useCommute: vi.fn(),
  useActivities: vi.fn(),
}));

describe('CommutePage', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks();
    vi.mocked(useCommute).mockReturnValue(defaultCommuteState);
  });

  it('renders correctly', (): void => {
    render(
      <BrowserRouter>
        <CommutePage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Commute Calculator/i)).toBeInTheDocument();
  });

  it('shows error if calculating without origin/destination', async (): Promise<void> => {
    vi.mocked(useCommute).mockReturnValue({ ...defaultCommuteState, error: 'Please enter origin and destination' });
    render(
      <BrowserRouter>
        <CommutePage />
      </BrowserRouter>
    );
    expect(screen.getByText('Please enter origin and destination')).toBeInTheDocument();
  });

  it('calculates and displays results', async (): Promise<void> => {
    const mockResult = { distanceKm: 15, durationMinutes: 30, dailyCo2Kg: 5, annualCo2Kg: 1000, origin: 'Home', destination: 'Work', transportMode: 'car_petrol_per_km' };
    vi.mocked(useCommute).mockReturnValue({ ...defaultCommuteState, result: mockResult });
    render(
      <BrowserRouter>
        <CommutePage />
      </BrowserRouter>
    );
    expect(screen.getByText('Annual Emissions by Mode')).toBeInTheDocument();
  });

  it('handles calculate error', async (): Promise<void> => {
    vi.mocked(useCommute).mockReturnValue({ ...defaultCommuteState, error: 'Could not calculate commute. Please check the locations.' });
    render(
      <BrowserRouter>
        <CommutePage />
      </BrowserRouter>
    );
    expect(screen.getByText('Could not calculate commute. Please check the locations.')).toBeInTheDocument();
  });

  it('logs commute activity', async (): Promise<void> => {
    const mockResult = { distanceKm: 15, durationMinutes: 30, dailyCo2Kg: 5, annualCo2Kg: 1000, origin: 'Home', destination: 'Work', transportMode: 'car_petrol_per_km' };
    vi.mocked(useCommute).mockReturnValue({ ...defaultCommuteState, result: mockResult, toast: { msg: 'Commute logged successfully!', type: 'success' } });
    render(
      <BrowserRouter>
        <CommutePage />
      </BrowserRouter>
    );
    expect(screen.getByText('Commute logged successfully!')).toBeInTheDocument();
  });
});
