/**
 * @module components/profile/GoalSlider
 */
import React, { useState, useEffect, useCallback } from 'react';

import { useAsync } from '../../hooks/useAsync';
import { getUserWeeklyGoal, updateUserWeeklyGoal } from '../../services/userService';
import { trackEvent, trackError } from '../../utils/errorTracker';
import { WEEKLY_GOAL_MIN, WEEKLY_GOAL_MAX } from '../../constants';

interface GoalSliderProps {
  userId: string;
}

export const GoalSlider: React.FC<GoalSliderProps> = ({ userId }): React.ReactElement => {
  const [goal, setGoal] = useState<number>(50);

  const { loading, execute: fetchGoal } = useAsync(
    useCallback(async () => {
      const fetchedGoal = await getUserWeeklyGoal(userId);
      if (fetchedGoal !== null) setGoal(fetchedGoal);
    }, [userId]),
  );

  const { execute: saveGoal } = useAsync(
    useCallback(
      async (newGoal: number) => {
        await updateUserWeeklyGoal(userId, newGoal);
        trackEvent('goal_updated', { newGoal });
      },
      [userId],
    ),
  );

  useEffect((): void => {
    fetchGoal().catch((err: unknown) => {
      trackError(err instanceof Error ? err : new Error(String(err)));
    });
  }, [userId, fetchGoal]);

  const handleSave = (newGoal: number): void => {
    saveGoal(newGoal).catch((err: unknown) => {
      trackError(err instanceof Error ? err : new Error(String(err)));
    });
  };

  return (
    <div className="bg-charcoal-core p-6 rounded-2xl border border-whisper-border shadow-sm">
      <h3 className="font-bold text-on-surface mb-2">Weekly Target (kg CO2)</h3>
      {loading ? (
        <div className="h-6 w-1/2 bg-surface-container-high animate-pulse rounded" />
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="font-label-sm text-label-sm text-muted-steel">
              {WEEKLY_GOAL_MIN} kg
            </span>
            <span className="font-headline-md text-headline-md font-bold text-bio-emerald">
              {goal} kg
            </span>
            <span className="font-label-sm text-label-sm text-muted-steel">
              {WEEKLY_GOAL_MAX} kg
            </span>
          </div>
          <input
            id="goal-slider"
            name="goal"
            type="range"
            min={WEEKLY_GOAL_MIN}
            max={WEEKLY_GOAL_MAX}
            value={goal}
            aria-label="Weekly CO2 reduction target"
            onChange={(e): void => setGoal(Number(e.target.value))}
            onMouseUp={(): void => handleSave(goal)}
            onTouchEnd={(): void => handleSave(goal)}
            className="w-full accent-bio-emerald cursor-pointer"
          />
        </>
      )}
    </div>
  );
};
