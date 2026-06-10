/**
 * @module CommuteForm.test
 */

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import { CommuteForm } from '../../components/commute/CommuteForm';

describe('CommuteForm', (): void => {
  const defaultValues = {
    origin: '',
    destination: '',
    mode: 'car_petrol_per_km' as const,
    days: 5,
  };

  it('renders correctly', (): void => {
    render(
      <CommuteForm
        loading={false}
        error=""
        onCalculate={vi.fn()}
        defaultValues={defaultValues}
      />
    );
    expect(screen.getByLabelText(/Origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Transport Mode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Work Days/i)).toBeInTheDocument();
  });

  it('shows error if submitted empty', async (): Promise<void> => {
    const user = userEvent.setup();
    render(
      <CommuteForm
        loading={false}
        error=""
        onCalculate={vi.fn()}
        defaultValues={defaultValues}
      />
    );
    await user.click(screen.getByRole('button', { name: /Calculate/i }));
    const alerts = await screen.findAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
  });

  it('calls onCalculate with correct values', async (): Promise<void> => {
    const mockCalculate = vi.fn();
    const user = userEvent.setup();
    render(
      <CommuteForm
        loading={false}
        error=""
        onCalculate={mockCalculate}
        defaultValues={defaultValues}
      />
    );

    await user.type(screen.getByLabelText(/Origin/i), 'New York');
    await user.type(screen.getByLabelText(/Destination/i), 'Boston');
    await user.selectOptions(screen.getByLabelText(/Transport Mode/i), 'car_diesel_per_km');
    
    const daysInput = screen.getByLabelText(/Work Days/i);
    await user.clear(daysInput);
    await user.type(daysInput, '4');

    await user.click(screen.getByRole('button', { name: /Calculate/i }));

    await waitFor((): void => {
      expect(mockCalculate).toHaveBeenCalledWith({
        origin: 'New York',
        destination: 'Boston',
        mode: 'car_diesel_per_km',
        days: 4,
      }, expect.anything());
    });
  });

  it('shows passed error message', (): void => {
    render(
      <CommuteForm
        loading={false}
        error="Invalid locations"
        onCalculate={vi.fn()}
        defaultValues={defaultValues}
      />
    );
    expect(screen.getByText('Invalid locations')).toBeInTheDocument();
  });
});
