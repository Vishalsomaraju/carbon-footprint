import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, addDoc, getDocs, Timestamp } from 'firebase/firestore';
import { activityService } from '../services/activityService';

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: 'test-id' }),
  getDocs: vi.fn().mockResolvedValue({ 
    docs: [{ id: 'test-doc-1', data: () => ({ category: 'food', value: 10, date: '2023-01-01' }) }] 
  }),
  getDoc: vi.fn().mockResolvedValue({ exists: () => false }),
  setDoc: vi.fn().mockResolvedValue(undefined),
  updateDoc: vi.fn().mockResolvedValue(undefined),
  doc: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  limit: vi.fn(),
  Timestamp: { now: vi.fn(() => ({ toDate: () => new Date() })), fromDate: vi.fn((d: Date) => ({ toDate: () => d })) },
  serverTimestamp: vi.fn().mockReturnValue('SERVER_TIMESTAMP'),
}));

vi.mock('../config', () => ({ db: {} }));

describe('firestoreService (activityService)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('addActivity calls addDoc with correct data', async () => {
    const id = await activityService.logActivity({ category: 'food', value: 10, userId: 'user1', carbonImpact: 1.5, date: '2023-01-01' });
    expect(id).toBe('test-id');
    expect(addDoc).toHaveBeenCalled();
  });

  it('getUserActivities calls getDocs and maps results', async () => {
    const activities = await activityService.getUserActivities('user1');
    expect(getDocs).toHaveBeenCalled();
    expect(activities).toHaveLength(1);
    expect(activities[0].id).toBe('test-doc-1');
  });
});
