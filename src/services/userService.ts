/**
 * @module services/userService
 * @description Centralized data access for User configurations
 */
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

import { db } from '../lib/firebase';

const USERS_COLLECTION = 'users';

export const getUserWeeklyGoal = async (userId: string): Promise<number | null> => {
  const d = await getDoc(doc(db, USERS_COLLECTION, userId));
  if (d.exists() && d.data().weeklyGoalKg) {
    return d.data().weeklyGoalKg as number;
  }
  return null;
};

export const updateUserWeeklyGoal = async (userId: string, newGoal: number): Promise<void> => {
  const ref = doc(db, USERS_COLLECTION, userId);
  const d = await getDoc(ref);
  if (d.exists()) {
    await updateDoc(ref, { weeklyGoalKg: newGoal });
  } else {
    await setDoc(ref, { id: userId, weeklyGoalKg: newGoal, createdAt: Date.now() });
  }
};
