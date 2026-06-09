
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { ProfilePage } from '../../pages/ProfilePage';
import { useAuth, useActivities } from '../../hooks';

vi.mock('../../hooks', () => ({
  useAuth: vi.fn(),
  useActivities: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  getDoc: vi.fn().mockResolvedValue({ exists: () => true, data: () => ({ targetKgPerDay: 50 }) }),
  doc: vi.fn(),
  setDoc: vi.fn(),
  updateDoc: vi.fn(),
  getFirestore: vi.fn(),
}));

import { getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { trackEvent } from '../../utils/errorTracker';

vi.mock('../../utils/errorTracker', () => ({
  trackError: vi.fn(),
  trackEvent: vi.fn(),
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders profile stats', () => {
    (useAuth as unknown as import("vitest").Mock).mockReturnValue({ user: { displayName: 'John Doe', email: 'john@example.com', uid: 'user1' } });
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [{ co2Kg: 10, timestamp: new Date() }] });

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('signs out', async () => {
    const mockLogout = vi.fn();
    (useAuth as unknown as import("vitest").Mock).mockReturnValue({ user: { displayName: 'John Doe', uid: 'user1' }, logout: mockLogout });
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [] });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    await user.click(screen.getByText(/Sign Out/i));
    expect(mockLogout).toHaveBeenCalled();
  });

  it('handles delete account', async () => {
    (useAuth as unknown as import("vitest").Mock).mockReturnValue({ user: { displayName: 'John Doe', uid: 'user1' }, logout: vi.fn() });
    (useActivities as unknown as import("vitest").Mock).mockReturnValue({ activities: [] });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>
    );

    const deleteBtn = screen.getByText(/Delete Account/i);
    // Needs to stub window.confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    // Stub alert to prevent any blocking
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    await user.click(deleteBtn);
    expect(window.confirm).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalledWith('account_deleted_requested');
  });
});

describe('GoalSlider', () => {
  it('loads goal from firestore', async () => {
    (getDoc as import("vitest").Mock).mockResolvedValueOnce({
      exists: () => true,
      data: () => ({ weeklyGoalKg: 80 })
    });
    
    // We import here just for this test, but CommutePage test style is easier
    const { GoalSlider } = await import('../../components/profile/GoalSlider');
    render(<GoalSlider userId="user1" />);
    
    expect(await screen.findByText('80 kg')).toBeInTheDocument();
  });

  it('updates existing doc on save', async () => {
    (getDoc as import("vitest").Mock).mockResolvedValue({
      exists: () => true,
      data: () => ({ weeklyGoalKg: 80 })
    });
    
    const { GoalSlider } = await import('../../components/profile/GoalSlider');
    const { fireEvent } = await import('@testing-library/react');
    render(<GoalSlider userId="user1" />);
    
    await screen.findByText('80 kg');
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '100' } });
    fireEvent.mouseUp(slider);
    
    await import('@testing-library/react').then(({ waitFor }) => waitFor(() => {
      expect(updateDoc).toHaveBeenCalledWith(undefined, { weeklyGoalKg: 100 });
    }));
  });

  it('creates new doc if it does not exist', async () => {
    (getDoc as import("vitest").Mock).mockResolvedValue({
      exists: () => false,
      data: () => ({})
    });
    
    const { GoalSlider } = await import('../../components/profile/GoalSlider');
    const { fireEvent } = await import('@testing-library/react');
    render(<GoalSlider userId="user1" />);
    
    await screen.findByText('50 kg');
    
    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '40' } });
    fireEvent.touchEnd(slider); // Test touch end too
    
    await import('@testing-library/react').then(({ waitFor }) => waitFor(() => {
      expect(setDoc).toHaveBeenCalledWith(undefined, expect.objectContaining({ weeklyGoalKg: 40 }));
    }));
  });
});
