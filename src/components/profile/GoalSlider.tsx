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
    <div className="bg-charcoal-core p-6 rounded-2xl border border-whisper-border shadow-sm">
      <h3 className="font-bold text-on-surface mb-2">Weekly Target (kg CO2)</h3>
      {loading ? (
        <div className="h-6 w-1/2 bg-surface-container-high animate-pulse rounded" />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="font-label-sm text-label-sm text-muted-steel">{WEEKLY_GOAL_MIN} kg</span>
            <span className="font-headline-md text-headline-md font-bold text-bio-emerald">{goal} kg</span>
            <span className="font-label-sm text-label-sm text-muted-steel">{WEEKLY_GOAL_MAX} kg</span>
          </div>
          <input
            type="range"
            min={WEEKLY_GOAL_MIN}
            max={WEEKLY_GOAL_MAX}
            value={goal}
            aria-label="Weekly CO2 reduction target"
            onChange={(e): void => setGoal(Number(e.target.value))}
            onMouseUp={(): Promise<void> => handleSave(goal)}
            onTouchEnd={(): Promise<void> => handleSave(goal)}
            className="w-full accent-bio-emerald cursor-pointer"
          />
        </>
      )}
    </div>
  );
};
