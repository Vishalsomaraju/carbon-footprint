import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCommute } from '../../hooks/useCommute';
import { calculateCommuteEmissions } from '../../services/mapsService';
import { useActivities } from '../../hooks/useActivities';
import { trackError } from '../../utils/errorTracker';

vi.mock('../../services/mapsService', () => ({
  calculateCommuteEmissions: vi.fn(),
}));

vi.mock('../../hooks/useActivities', () => ({
  useActivities: vi.fn(),
}));

vi.mock('../../utils/errorTracker', () => ({
  trackError: vi.fn(),
}));

describe('useCommute', () => {
  const mockAddActivity = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useActivities as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      addActivity: mockAddActivity,
    });
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useCommute());
    expect(result.current.origin).toBe('');
    expect(result.current.destination).toBe('');
    expect(result.current.mode).toBe('car_petrol_per_km');
    expect(result.current.days).toBe(5);
    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBe('');
  });

  it('should calculate emissions successfully', async () => {
    const mockResult = { distanceKm: 10, totalEmissions: 2.5, weeklyEmissions: 12.5, mode: 'car_petrol_per_km' };
    (calculateCommuteEmissions as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useCommute());

    await act(async () => {
      await result.current.handleCalculate({
        origin: 'A',
        destination: 'B',
        mode: 'car_petrol_per_km',
        days: 5,
      });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toEqual(mockResult);
    expect(result.current.error).toBe('');
    expect(result.current.origin).toBe('A');
    expect(result.current.destination).toBe('B');
  });

  it('should handle calculation error', async () => {
    (calculateCommuteEmissions as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useCommute());

    await act(async () => {
      await result.current.handleCalculate({
        origin: 'A',
        destination: 'B',
        mode: 'car_petrol_per_km',
        days: 5,
      });
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toBeNull();
    expect(result.current.error).toBe('Could not calculate commute. Please check the locations.');
    expect(trackError).toHaveBeenCalledWith(expect.any(Error), 'handleCalculate');
  });

  it('should log commute successfully', async () => {
    const mockResult = { distanceKm: 10, totalEmissions: 2.5, weeklyEmissions: 12.5, mode: 'car_petrol_per_km' };
    (calculateCommuteEmissions as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useCommute());

    await act(async () => {
      await result.current.handleCalculate({
        origin: 'A',
        destination: 'B',
        mode: 'car_petrol_per_km',
        days: 5,
      });
    });

    mockAddActivity.mockResolvedValueOnce(true);

    await act(async () => {
      await result.current.handleLog();
    });

    expect(result.current.logLoading).toBe(false);
    expect(result.current.toast).toEqual({ msg: 'Commute logged successfully!', type: 'success' });
    expect(mockAddActivity).toHaveBeenCalled();
  });

  it('should not log if no result', async () => {
    const { result } = renderHook(() => useCommute());

    await act(async () => {
      await result.current.handleLog();
    });

    expect(mockAddActivity).not.toHaveBeenCalled();
  });

  it('should handle log error', async () => {
    const mockResult = { distanceKm: 10, totalEmissions: 2.5, weeklyEmissions: 12.5, mode: 'car_petrol_per_km' };
    (calculateCommuteEmissions as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(mockResult);

    const { result } = renderHook(() => useCommute());

    await act(async () => {
      await result.current.handleCalculate({
        origin: 'A',
        destination: 'B',
        mode: 'car_petrol_per_km',
        days: 5,
      });
    });

    mockAddActivity.mockRejectedValueOnce(new Error('DB error'));

    await act(async () => {
      await result.current.handleLog();
    });

    expect(result.current.logLoading).toBe(false);
    expect(result.current.toast).toEqual({ msg: 'Failed to log commute.', type: 'error' });
    expect(trackError).toHaveBeenCalledWith(expect.any(Error), 'handleLog');
  });
});
