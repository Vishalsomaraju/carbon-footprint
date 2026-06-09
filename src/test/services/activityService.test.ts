/**
 * @module __tests__/activityService.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDoc, getDocs } from 'firebase/firestore';

import { activityService } from '../../services/activityService';

vi.mock('firebase/firestore', async (importOriginal) => {
  const actual = await importOriginal<typeof import('firebase/firestore')>();
  return {
    ...actual,
    collection: vi.fn(),
    addDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
    getDocs: vi.fn(),
    orderBy: vi.fn(),
    Timestamp: {
      now: vi.fn((): import("react").ReactElement => ({ toMillis: () => 123456789 }))
    }
  };
});

vi.mock('../../config', (): Record<string, unknown> => ({
  db: {}
}));

describe('activityService', (): void => {
  beforeEach((): void => {
    vi.clearAllMocks();
  });

  describe('logActivity', (): void => {
    it('should add a document to the activities collection', async (): Promise<void> => {
      const mockDocRef = { id: 'test-doc-id' };
      vi.mocked(addDoc).mockResolvedValueOnce(mockDocRef as import('vitest').Mock);

      const activityData = {
        userId: 'user-123',
        category: 'transport',
        value: 10,
        carbonImpact: 2,
        date: '2023-10-01'
      };

      const id = await activityService.logActivity(activityData as import('vitest').Mock);

      expect(addDoc).toHaveBeenCalledTimes(1);
      expect(id).toBe('test-doc-id');
    });

    it('should throw an error if addDoc fails', async (): Promise<void> => {
      const mockError = new Error('Firestore error');
      vi.mocked(addDoc).mockRejectedValueOnce(mockError);

      const activityData = {
        userId: 'user-123',
        category: 'transport',
        value: 10,
        carbonImpact: 2,
        date: '2023-10-01'
      };

      await expect(activityService.logActivity(activityData as import('vitest').Mock)).rejects.toThrow('Firestore error');
    });
  });

  describe('getUserActivities', (): void => {
    it('should return a list of activities for a user', async (): Promise<void> => {
      const mockDocs = {
        docs: [
          { id: 'doc-1', data: (): import("react").ReactElement => ({ userId: 'user-123', value: 10 }) },
          { id: 'doc-2', data: (): import("react").ReactElement => ({ userId: 'user-123', value: 20 }) }
        ]
      };
      vi.mocked(getDocs).mockResolvedValueOnce(mockDocs as import('vitest').Mock);

      const activities = await activityService.getUserActivities('user-123');

      expect(getDocs).toHaveBeenCalledTimes(1);
      expect(activities).toHaveLength(2);
      expect(activities[0]).toEqual({ id: 'doc-1', userId: 'user-123', value: 10 });
    });
  });
});
