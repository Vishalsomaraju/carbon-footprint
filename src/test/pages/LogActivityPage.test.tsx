import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { LogActivityPage } from '../../pages/LogActivityPage';
import { useAuth, useActivities } from '../../hooks';

vi.mock('../../hooks', () => ({
  useAuth: vi.fn(),
  useActivities: vi.fn(),
}));

describe('LogActivityPage', () => {
  it('renders and interacts with form steps', async () => {
    (useAuth as unknown as import("vitest").Mock).mockReturnValue({ user: { displayName: 'John' } });
    const mockAddActivity = vi.fn().mockResolvedValue(true);
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [], loading: false, addActivity: mockAddActivity });

    render(
      <BrowserRouter>
        <LogActivityPage />
      </BrowserRouter>
    );

    // Step 1: Category Selection
    expect(screen.getByText('Log Activity')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Transport'));

    // Step 2: Activity Form (Subtype & Value)
    expect(screen.getByText('Activity Type')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/Activity Type/i), { target: { value: 'car_petrol' } });
    fireEvent.change(screen.getByLabelText(/Value/i), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Step 3: Confirmation Step
    expect(screen.getByText(/Estimated Impact/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Save Activity/i }));

    // Verify it called addActivity
    expect(mockAddActivity).toHaveBeenCalledWith(expect.objectContaining({
      category: 'transport',
      subCategory: 'car_petrol',
      value: 15
    }));
  });

  it('handles submission errors', async () => {
    (useAuth as unknown as import("vitest").Mock).mockReturnValue({ user: { displayName: 'John' } });
    const mockAddActivity = vi.fn().mockRejectedValue(new Error('Firebase error'));
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [], loading: false, addActivity: mockAddActivity });

    render(
      <BrowserRouter>
        <LogActivityPage />
      </BrowserRouter>
    );

    fireEvent.click(screen.getByText('Transport'));
    fireEvent.change(screen.getByLabelText(/Activity Type/i), { target: { value: 'car_petrol' } });
    fireEvent.change(screen.getByLabelText(/Value/i), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    fireEvent.click(screen.getByRole('button', { name: /Save Activity/i }));

    expect(await screen.findByText('Failed to save activity.')).toBeInTheDocument();
  });
});
