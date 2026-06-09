/**
 * @module ConfirmationStep.test
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ConfirmationStep } from '../../components/log/ConfirmationStep';

describe('ConfirmationStep', (): void => {
  it('renders and handles input', (): void => {
    const mockSubmit = vi.fn();
    render(
      <ConfirmationStep
        data={{ category: 'transport', subCategory: 'car_petrol_per_km', value: 10 }}
        onSubmit={mockSubmit}
        onBack={vi.fn()}
        isLoading={false}
      />,
    );

    expect(screen.getByText(/Estimated Impact/i)).toBeInTheDocument();

    const notes = screen.getByLabelText(/Optional Notes/i);
    fireEvent.change(notes, { target: { value: 'Great trip' } });
    expect(notes).toHaveValue('Great trip');

    fireEvent.click(screen.getByRole('button', { name: /Save Activity/i }));
    expect(mockSubmit).toHaveBeenCalledWith('Great trip');
  });

  it('handles errors in factor calculation gracefully', (): void => {
    render(
      <ConfirmationStep
        data={{ category: 'unknown_cat', subCategory: 'unknown_sub', value: 10 }}
        onSubmit={vi.fn()}
        onBack={vi.fn()}
        isLoading={false}
      />,
    );
    expect(screen.getByText(/Estimated Impact/i)).toBeInTheDocument();
  });
});
