/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @module hooks/useActivities.test
 */

import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useAuthContext } from '../../contexts/AuthContext';
import { useActivities } from '../../hooks/useActivities';
import { activityService } from '../../services';

// Mock contexts and services
const mockUser = { uid: 'user123' };

vi.mock('../../contexts/AuthContext', (): any => ({
  useAuthContext: vi.fn((): any => ({ user: mockUser }))
}));

vi.mock('../../services', (): any => ({
  activityService: {
    getUserActivities: vi.fn(),
    logActivity: vi.fn()
  }
}));

vi.mock('../utils/errorTracker', (): any => ({
  trackError: vi.fn()
}));

describe('useActivities', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  it('should fetch activities on mount if user is authenticated', async (): Promise<void> => {
    const mockActivities = [{ id: '1', category: 'transport', value: 10, carbonImpact: 2, date: '2023-01-01', userId: 'user123' }];
    (activityService.getUserActivities as any).mockResolvedValue(mockActivities);

    const { result } = renderHook(() => useActivities());

    // Wait for the initial effect to complete
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(activityService.getUserActivities).toHaveBeenCalledWith('user123');
    expect(result.current.activities).toEqual(mockActivities);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should not fetch activities if user is not authenticated', async (): Promise<void> => {
    (useAuthContext as any).mockReturnValue({ user: null });
    
    const { result } = renderHook(() => useActivities());

    expect(activityService.getUserActivities).not.toHaveBeenCalled();
    expect(result.current.activities).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should add an activity and update state', async (): Promise<void> => {
    (useAuthContext as any).mockReturnValue({ user: mockUser });
    (activityService.getUserActivities as any).mockResolvedValue([]);
    (activityService.logActivity as any).mockResolvedValue('new-id');

    const { result } = renderHook(() => useActivities());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      const id = await result.current.addActivity({ category: 'transport', subCategory: 'car_petrol_per_km',
        value: 10,
        description: 'Test drive',
        date: '2023-01-02'
      });
      expect(id).toBe('new-id');
    });

    expect(activityService.logActivity).toHaveBeenCalledWith(expect.objectContaining({
      category: 'transport',
      subCategory: 'car_petrol_per_km',
      value: 10,
      description: 'Test drive',
      date: '2023-01-02',
      carbonImpact: 2.1, // 10 * 0.21
      userId: 'user123'
    }));

    expect(result.current.activities).toHaveLength(1);
    expect(result.current.activities[0].id).toBe('new-id');
  });

  it('should handle add activity error', async (): Promise<void> => {
    (useAuthContext as any).mockReturnValue({ user: mockUser });
    (activityService.getUserActivities as any).mockResolvedValue([]);
    const error = new Error('Failed to add');
    (activityService.logActivity as any).mockRejectedValue(error);

    const { result } = renderHook(() => useActivities());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    await act(async () => {
      await expect(result.current.addActivity({ category: 'transport', value: 10,
        date: '2023-01-02'
      })).rejects.toThrow('Failed to add');
    });

    expect(result.current.error).toEqual(error);
  });

  it('should calculate correct carbon impact for all categories', async (): Promise<void> => {
    (useAuthContext as any).mockReturnValue({ user: mockUser });
    (activityService.getUserActivities as any).mockResolvedValue([]);
    (activityService.logActivity as any).mockResolvedValue('new-id');

    const { result } = renderHook(() => useActivities());

    await act(async () => {
      await result.current.addActivity({ category: 'energy', subCategory: 'electricity_per_kwh', value: 10, date: '2023-01-02' });
      await result.current.addActivity({ category: 'food', subCategory: 'beef_per_meal', value: 10, date: '2023-01-02' });
      await result.current.addActivity({ category: 'shopping', subCategory: 'clothing_item', value: 10, date: '2023-01-02' });
      await result.current.addActivity({ category: 'other', value: 10, date: '2023-01-02' });
    });

    expect(activityService.logActivity).toHaveBeenCalledWith(expect.objectContaining({ category: 'energy', carbonImpact: 2.33 }));
    expect(activityService.logActivity).toHaveBeenCalledWith(expect.objectContaining({ category: 'food', carbonImpact: 35 }));
    expect(activityService.logActivity).toHaveBeenCalledWith(expect.objectContaining({ category: 'shopping', carbonImpact: 70 }));
    expect(activityService.logActivity).toHaveBeenCalledWith(expect.objectContaining({ category: 'other', carbonImpact: 2 }));
  });

  it('should throw error if adding activity without user', async (): Promise<void> => {
    (useAuthContext as any).mockReturnValue({ user: null });
    const { result } = renderHook(() => useActivities());

    await act(async () => {
      await expect(result.current.addActivity({ category: 'transport', value: 10,
        date: '2023-01-02'
      })).rejects.toThrow('User not authenticated');
    });
  });
});
