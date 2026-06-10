/**
 * @module ProfilePage.test
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import { ProfilePage } from '../../pages/ProfilePage';
import { useAuth, useActivities } from '../../hooks';
import { trackEvent, trackError } from '../../utils/errorTracker';
import { getUserWeeklyGoal, updateUserWeeklyGoal } from '../../services/userService';

vi.mock(
  '../../hooks',
  (): Record<string, unknown> => ({
    useAuth: vi.fn(),
    useActivities: vi.fn(),
  }),
);

vi.mock(
  '../../services/userService',
  (): Record<string, unknown> => ({
    getUserWeeklyGoal: vi.fn().mockResolvedValue(50),
    updateUserWeeklyGoal: vi.fn(),
  }),
);

vi.mock(
  '../../utils/errorTracker',
  (): Record<string, unknown> => ({
    trackError: vi.fn(),
    trackEvent: vi.fn(),
  }),
);

describe('ProfilePage', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  it('renders profile stats', async (): Promise<void> => {
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John Doe', email: 'john@example.com', uid: 'user1' },
    });
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({
      activities: [{ co2Kg: 10, timestamp: new Date() }],
    });

    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>,
    );
    expect(screen.getByText('John Doe')).toBeInTheDocument();

    // Wait for GoalSlider to finish loading
    await screen.findByText('50 kg');
  });

  it('signs out', async (): Promise<void> => {
    const mockLogout = vi.fn();
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John Doe', uid: 'user1' },
      logout: mockLogout,
    });
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({ activities: [] });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>,
    );

    await user.click(screen.getByText(/Sign Out/i));
    expect(mockLogout).toHaveBeenCalled();

    // Wait for GoalSlider to finish loading
    await screen.findByText('50 kg');
  });

  it('handles delete account', async (): Promise<void> => {
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John Doe', uid: 'user1' },
      logout: vi.fn(),
    });
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({ activities: [] });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>,
    );

    const deleteBtn = screen.getByText(/Delete Account/i);
    // Needs to stub window.confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    // Stub alert to prevent any blocking
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    await user.click(deleteBtn);
    expect(window.confirm).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalledWith('account_deleted_requested');

    // Wait for GoalSlider to finish loading
    await screen.findByText('50 kg');
  });

  it('handles signout error', async (): Promise<void> => {
    const error = new Error('Logout failed');
    const mockLogout = vi.fn().mockRejectedValue(error);
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John Doe', uid: 'user1' },
      logout: mockLogout,
    });
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({ activities: [] });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>,
    );

    await user.click(screen.getByText(/Sign Out/i));
    expect(trackError).toHaveBeenCalledWith(error);
  });

  it('handles export data', async (): Promise<void> => {
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John Doe', uid: 'user1' },
      logout: vi.fn(),
    });
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({ activities: [] });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>,
    );

    const originalCreateElement = document.createElement.bind(document);
    let mockAnchor: HTMLAnchorElement | null = null;
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName) => {
      const element = originalCreateElement(tagName);
      if (tagName === 'a') {
        mockAnchor = element as HTMLAnchorElement;
        vi.spyOn(mockAnchor, 'click').mockImplementation(() => {});
        vi.spyOn(mockAnchor, 'remove').mockImplementation(() => {});
      }
      return element;
    });

    await user.click(screen.getByText(/Export My Data/i));

    expect(trackEvent).toHaveBeenCalledWith('data_export_requested');
    expect(mockAnchor).not.toBeNull();
    expect(mockAnchor!.getAttribute('download')).toBe('carbonwise_data.json');
    expect(mockAnchor!.click).toHaveBeenCalled();
    expect(mockAnchor!.remove).toHaveBeenCalled();

    createElementSpy.mockRestore();
  });

  it('handles clear data', async (): Promise<void> => {
    (useAuth as unknown as import('vitest').Mock).mockReturnValue({
      user: { displayName: 'John Doe', uid: 'user1' },
      logout: vi.fn(),
    });
    (useActivities as unknown as import('vitest').Mock).mockReturnValue({ activities: [] });

    const { userEvent } = await import('@testing-library/user-event');
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <ProfilePage />
      </BrowserRouter>,
    );

    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await user.click(screen.getByText(/Clear All Data/i));

    expect(window.confirm).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalledWith('data_clear_requested');
    expect(alertSpy).toHaveBeenCalledWith(
      'All your data has been permanently deleted from our servers.',
    );
  });
});

describe('GoalSlider', (): void => {
  it('loads goal from firestore', async (): Promise<void> => {
    (getUserWeeklyGoal as import('vitest').Mock).mockResolvedValueOnce(80);

    // We import here just for this test, but CommutePage test style is easier
    const { GoalSlider } = await import('../../components/profile/GoalSlider');
    render(<GoalSlider userId="user1" />);

    expect(await screen.findByText('80 kg')).toBeInTheDocument();
  });

  it('updates existing doc on save', async (): Promise<void> => {
    (getUserWeeklyGoal as import('vitest').Mock).mockResolvedValue(80);

    const { GoalSlider } = await import('../../components/profile/GoalSlider');
    const { fireEvent } = await import('@testing-library/react');
    render(<GoalSlider userId="user1" />);

    await screen.findByText('80 kg');

    const slider = screen.getByRole('slider');
    const { act } = await import('@testing-library/react');
    act(() => {
      fireEvent.change(slider, { target: { value: '100' } });
      fireEvent.mouseUp(slider);
    });

    await import('@testing-library/react').then(({ waitFor }) =>
      waitFor(() => {
        expect(updateUserWeeklyGoal).toHaveBeenCalledWith('user1', 100);
      }),
    );
  });

  it('creates new doc if it does not exist', async (): Promise<void> => {
    (getUserWeeklyGoal as import('vitest').Mock).mockResolvedValue(null);

    const { GoalSlider } = await import('../../components/profile/GoalSlider');
    const { fireEvent } = await import('@testing-library/react');
    render(<GoalSlider userId="user1" />);

    await screen.findByText('50 kg');

    const slider = screen.getByRole('slider');
    const { act } = await import('@testing-library/react');
    act(() => {
      fireEvent.change(slider, { target: { value: '40' } });
      fireEvent.touchEnd(slider); // Test touch end too
    });

    await import('@testing-library/react').then(({ waitFor }) =>
      waitFor(() => {
        expect(updateUserWeeklyGoal).toHaveBeenCalledWith('user1', 40);
      }),
    );
  });
});
