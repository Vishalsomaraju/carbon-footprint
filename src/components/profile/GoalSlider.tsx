/**
 * @module components/profile/GoalSlider
 */
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';

import { db } from '../../lib/firebase';
import { trackError, trackEvent } from '../../utils/errorTracker';
import { WEEKLY_GOAL_MIN, WEEKLY_GOAL_MAX } from '../../constants';

interface GoalSliderProps {
  userId: string;
}

export const GoalSlider: React.FC<GoalSliderProps> = ({ userId }): React.ReactElement => {
  const [goal, setGoal] = useState<number>(50);
  const [loading, setLoading] = useState(true);

  useEffect((): void => {
    const fetchGoal = async (): Promise<void> => {
      try {
        const d = await getDoc(doc(db, 'users', userId));
        if (d.exists() && d.data().weeklyGoalKg) setGoal(d.data().weeklyGoalKg);
      } catch (err: unknown) {
        trackError(err, 'GoalSlider.fetchGoal');
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [userId]);

  const handleSave = async (newGoal: number): Promise<void> => {
    try {
      const ref = doc(db, 'users', userId);
      const d = await getDoc(ref);
      if (d.exists()) await updateDoc(ref, { weeklyGoalKg: newGoal });
      else await setDoc(ref, { id: userId, weeklyGoalKg: newGoal, createdAt: Date.now() });
      trackEvent('goal_updated', { newGoal });
    } catch (err: unknown) {
      trackError(err, 'GoalSlider.handleSave');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="font-bold text-gray-900 mb-2">Weekly Target (kg CO2)</h3>
      {loading ? (
        <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded" />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">{WEEKLY_GOAL_MIN} kg</span>
            <span className="font-bold text-2xl text-carbon-600">{goal} kg</span>
            <span className="text-gray-500 text-sm">{WEEKLY_GOAL_MAX} kg</span>
          </div>
          <input
            type="range"
            min={WEEKLY_GOAL_MIN}
            max={WEEKLY_GOAL_MAX}
            value={goal}
            onChange={(e): void => setGoal(Number(e.target.value))}
            onMouseUp={(): Promise<void> => handleSave(goal)}
            onTouchEnd={(): Promise<void> => handleSave(goal)}
            className="w-full accent-carbon-600 cursor-pointer"
          />
        </>
      )}
    </div>
  );
};
