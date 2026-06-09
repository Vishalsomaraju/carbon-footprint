
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { CommutePage } from '../../pages/CommutePage';
import { useActivities } from '../../hooks';
import * as mapsService from '../../services/mapsService';

vi.mock('../../hooks', () => ({
  useActivities: vi.fn(),
}));
vi.mock('../../services/mapsService', () => ({
  calculateCommuteEmissions: vi.fn(),
}));

describe('CommutePage', () => {
  beforeEach(() => {
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ addActivity: vi.fn() });
    (mapsService.calculateCommuteEmissions as import("vitest").Mock).mockResolvedValue({ distanceKm: 15, durationMinutes: 30, dailyCo2Kg: 5, annualCo2Kg: 1000 });
  });

  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <CommutePage />
      </BrowserRouter>
    );
    expect(screen.getByText(/Commute Calculator/i)).toBeInTheDocument();
  });

  it('shows error if calculating without origin/destination', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <CommutePage />
      </BrowserRouter>
    );
    await user.click(screen.getByRole('button', { name: /Calculate/i }));
    expect(await screen.findByText('Please enter origin and destination')).toBeInTheDocument();
  });

  it('calculates and displays results', async () => {
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <CommutePage />
      </BrowserRouter>
    );
    await user.type(screen.getByLabelText(/Origin/i), 'Home');
    await user.type(screen.getByLabelText(/Destination/i), 'Work');
    await user.click(screen.getByRole('button', { name: /Calculate/i }));

    expect(await screen.findByText('Annual Emissions by Mode')).toBeInTheDocument();
  });

  it('handles calculate error', async () => {
    (mapsService.calculateCommuteEmissions as import("vitest").Mock).mockRejectedValue(new Error('Map error'));
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <CommutePage />
      </BrowserRouter>
    );
    await user.type(screen.getByLabelText(/Origin/i), 'Home');
    await user.type(screen.getByLabelText(/Destination/i), 'Work');
    await user.click(screen.getByRole('button', { name: /Calculate/i }));

    expect(await screen.findByText('Could not calculate commute. Please check the locations.')).toBeInTheDocument();
  });

  it('logs commute activity', async () => {
    const mockAddActivity = vi.fn().mockResolvedValue(true);
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ addActivity: mockAddActivity });
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <CommutePage />
      </BrowserRouter>
    );
    await user.type(screen.getByLabelText(/Origin/i), 'Home');
    await user.type(screen.getByLabelText(/Destination/i), 'Work');
    await user.click(screen.getByRole('button', { name: /Calculate/i }));

    const logButton = await screen.findByRole('button', { name: /Log This Commute/i });
    await user.click(logButton);

    expect(mockAddActivity).toHaveBeenCalledWith(expect.objectContaining({
      category: 'transport',
      subCategory: 'car_petrol_per_km',
      value: 30
    }));
    expect(await screen.findByText('Commute logged successfully!')).toBeInTheDocument();
  });
});
