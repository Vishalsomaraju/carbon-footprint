/**
 * @module services/activityService
 */

import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

import { db } from '../lib/firebase';
import { ActivityRecord } from '../types';
import { trackError } from '../utils/errorTracker';

const COLLECTION_NAME = 'activities';

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
      console.error('Error logging activity: ', error);
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
      console.log('Fetching activities for user:', userId);

      const result = await getDocs(q);

      console.log('Fetched activities successfully, count:', result.docs.length);
      return result.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as ActivityRecord);
    } catch (error: unknown) {
      trackError(error);
      console.error('Error getting user activities: ', error);
      // Return empty array on error so the UI can still render
      return [];
    }
  },
};
