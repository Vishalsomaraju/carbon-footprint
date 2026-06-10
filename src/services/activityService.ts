/**
 * @module services/activityService
 */

import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

import { db } from '../lib/firebase';
import { ActivityRecord } from '../types';
import { trackError } from '../utils';

const COLLECTION_NAME = 'activities';

/**
 * Service to handle logging and retrieving user activities from Firestore.
 */
export const activityService = {
  logActivity: async (activity: Omit<ActivityRecord, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...activity,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error: unknown) {
      trackError(error);
      throw error;
    }
  },

  getUserActivities: async (userId: string): Promise<ActivityRecord[]> => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('date', 'desc'),
      );
      const result = await getDocs(q);

      return result.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ActivityRecord);
    } catch (error: unknown) {
      trackError(error);
      // Return empty array on error so the UI can still render
      return [];
    }
  },
};
