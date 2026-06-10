import { describe, it, expect, vi, beforeEach } from 'vitest';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { getUserWeeklyGoal, updateUserWeeklyGoal } from '../../services/userService';
import { db } from '../../lib/firebase';

vi.mock('firebase/firestore', async () => {
  const actual = await vi.importActual('firebase/firestore');
  return {
    ...actual,
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn(),
    updateDoc: vi.fn(),
  };
});

vi.mock('../../lib/firebase', () => ({
  db: {},
}));

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserWeeklyGoal', () => {
    it('returns the weekly goal if document exists', async () => {
      const mockDocRef = {};
      (doc as unknown as import('vitest').Mock).mockReturnValue(mockDocRef);
      (getDoc as unknown as import('vitest').Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ weeklyGoalKg: 42 }),
      });

      const result = await getUserWeeklyGoal('user123');

      expect(doc).toHaveBeenCalledWith(db, 'users', 'user123');
      expect(getDoc).toHaveBeenCalledWith(mockDocRef);
      expect(result).toBe(42);
    });

    it('returns null if document exists but has no weekly goal', async () => {
      const mockDocRef = {};
      (doc as unknown as import('vitest').Mock).mockReturnValue(mockDocRef);
      (getDoc as unknown as import('vitest').Mock).mockResolvedValue({
        exists: () => true,
        data: () => ({ someOtherData: true }),
      });

      const result = await getUserWeeklyGoal('user123');

      expect(result).toBeNull();
    });

    it('returns null if document does not exist', async () => {
      const mockDocRef = {};
      (doc as unknown as import('vitest').Mock).mockReturnValue(mockDocRef);
      (getDoc as unknown as import('vitest').Mock).mockResolvedValue({
        exists: () => false,
      });

      const result = await getUserWeeklyGoal('user123');

      expect(result).toBeNull();
    });
  });

  describe('updateUserWeeklyGoal', () => {
    it('updates existing document if it exists', async () => {
      const mockDocRef = {};
      (doc as unknown as import('vitest').Mock).mockReturnValue(mockDocRef);
      (getDoc as unknown as import('vitest').Mock).mockResolvedValue({
        exists: () => true,
      });

      await updateUserWeeklyGoal('user123', 50);

      expect(updateDoc).toHaveBeenCalledWith(mockDocRef, { weeklyGoalKg: 50 });
      expect(setDoc).not.toHaveBeenCalled();
    });

    it('creates new document if it does not exist', async () => {
      const mockDocRef = {};
      (doc as unknown as import('vitest').Mock).mockReturnValue(mockDocRef);
      (getDoc as unknown as import('vitest').Mock).mockResolvedValue({
        exists: () => false,
      });
      vi.spyOn(Date, 'now').mockReturnValue(1000);

      await updateUserWeeklyGoal('user123', 60);

      expect(setDoc).toHaveBeenCalledWith(mockDocRef, { id: 'user123', weeklyGoalKg: 60, createdAt: 1000 });
      expect(updateDoc).not.toHaveBeenCalled();
    });
  });
});
