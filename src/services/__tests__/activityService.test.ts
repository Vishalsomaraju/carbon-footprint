/**
 * @module __tests__/activityService.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDoc, getDocs } from 'firebase/firestore';

import { activityService } from '../activityService';

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
      now: vi.fn(() => ({ toMillis: () => 123456789 }))
    }
  };
});

vi.mock('../../config', () => ({
  db: {}
}));

describe('activityService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('logActivity', () => {
    it('should add a document to the activities collection', async () => {
      const mockDocRef = { id: 'test-doc-id' };
      vi.mocked(addDoc).mockResolvedValueOnce(mockDocRef as any);

      const activityData = {
        userId: 'user-123',
        category: 'transport',
        value: 10,
        carbonImpact: 2,
        date: '2023-10-01'
      };

      const id = await activityService.logActivity(activityData as any);

      expect(addDoc).toHaveBeenCalledTimes(1);
      expect(id).toBe('test-doc-id');
    });

    it('should throw an error if addDoc fails', async () => {
      const mockError = new Error('Firestore error');
      vi.mocked(addDoc).mockRejectedValueOnce(mockError);

      const activityData = {
        userId: 'user-123',
        category: 'transport',
        value: 10,
        carbonImpact: 2,
        date: '2023-10-01'
      };

      await expect(activityService.logActivity(activityData as any)).rejects.toThrow('Firestore error');
    });
  });

  describe('getUserActivities', () => {
    it('should return a list of activities for a user', async () => {
      const mockDocs = {
        docs: [
          { id: 'doc-1', data: () => ({ userId: 'user-123', value: 10 }) },
          { id: 'doc-2', data: () => ({ userId: 'user-123', value: 20 }) }
        ]
      };
      vi.mocked(getDocs).mockResolvedValueOnce(mockDocs as any);

      const activities = await activityService.getUserActivities('user-123');

      expect(getDocs).toHaveBeenCalledTimes(1);
      expect(activities).toHaveLength(2);
      expect(activities[0]).toEqual({ id: 'doc-1', userId: 'user-123', value: 10 });
    });
  });
});
