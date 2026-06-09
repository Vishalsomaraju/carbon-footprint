/**
 * @module ActivityForm.test
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import { ActivityForm } from '../../components/log/ActivityForm';

describe('ActivityForm', (): void => {
  it('renders correctly', (): void => {
    render(<ActivityForm category="transport" onNext={vi.fn()} onBack={vi.fn()} />);
    expect(screen.getByText(/Activity Type/i)).toBeInTheDocument();
  });

  it('shows error if submitted empty', async (): Promise<void> => {
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(<ActivityForm category="transport" onNext={vi.fn()} onBack={vi.fn()} />);
    await user.click(screen.getByRole('button', { name: /Continue/i }));
    const alerts = await screen.findAllByRole('alert');
    expect(alerts[0]).toHaveTextContent(/type is required/i);
  });

  it('calls onNext with correct values', async (): Promise<void> => {
    const mockNext = vi.fn();
    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(<ActivityForm category="transport" onNext={mockNext} onBack={vi.fn()} />);

    await user.selectOptions(screen.getByLabelText(/Activity Type/i), 'car_petrol');
    const valueInput = screen.getByLabelText(/Value/i);
    await user.clear(valueInput);
    await user.type(valueInput, '15');

    await user.click(screen.getByRole('button', { name: /Continue/i }));
    
    // We must wait for React Hook Form's async validation to resolve before mockNext is called
    const { waitFor } = await import('@testing-library/react');
    await waitFor(() => {
      expect(mockNext).toHaveBeenCalledWith(
        { subCategory: 'car_petrol', value: 15 },
        expect.anything()
      );
    });
  });

  it('calls onBack when Back is clicked', (): void => {
    const mockBack = vi.fn();
    render(<ActivityForm category="transport" onNext={vi.fn()} onBack={mockBack} />);
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(mockBack).toHaveBeenCalled();
  });
});
