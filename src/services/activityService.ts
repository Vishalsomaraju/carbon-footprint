/**
 * @module services/activityService
 */

import { collection, addDoc, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

import { db } from '../config';
import { ActivityRecord } from '../types';

const COLLECTION_NAME = 'activities';

export const activityService = {
  logActivity: async (activity: Omit<ActivityRecord, 'id'>): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...activity,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error logging activity: ", error);
      throw error;
    }
  },

  getUserActivities: async (userId: string): Promise<ActivityRecord[]> => {
    try {
      const q = query(
        collection(db, COLLECTION_NAME), 
        where("userId", "==", userId),
        orderBy("date", "desc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as ActivityRecord));
    } catch (error) {
      console.error("Error getting user activities: ", error);
      throw error;
    }
  }
};
