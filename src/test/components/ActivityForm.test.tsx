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

  it('shows error if submitted empty', (): void => {
    render(<ActivityForm category="transport" onNext={vi.fn()} onBack={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(screen.getByRole('alert')).toHaveTextContent('Please select a subtype.');
  });

  it('calls onNext with correct values', (): void => {
    const mockNext = vi.fn();
    render(<ActivityForm category="transport" onNext={mockNext} onBack={vi.fn()} />);
    
    fireEvent.change(screen.getByLabelText(/Activity Type/i), { target: { value: 'car_petrol' } });
    fireEvent.change(screen.getByLabelText(/Value/i), { target: { value: '15' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    expect(mockNext).toHaveBeenCalledWith({ subCategory: 'car_petrol', value: 15 });
  });

  it('calls onBack when Back is clicked', (): void => {
    const mockBack = vi.fn();
    render(<ActivityForm category="transport" onNext={vi.fn()} onBack={mockBack} />);
    fireEvent.click(screen.getByRole('button', { name: /Back/i }));
    expect(mockBack).toHaveBeenCalled();
  });
});
