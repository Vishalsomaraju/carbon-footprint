/**
 * @module components/dashboard/ComparisonCard
 * @description Card showing regional footprint comparison and 1.5C targets.
 */

import React from 'react';

import { REGIONAL_AVERAGES_KG_PER_DAY, TARGET_KG_PER_DAY } from '../../constants';
import { Card, CardBody } from '../ui/Card';

interface Props {
  readonly dailyAverageKg: number;
  readonly userRegion?: keyof typeof REGIONAL_AVERAGES_KG_PER_DAY;
}

export const ComparisonCard: React.FC<Props> = ({ dailyAverageKg, userRegion = 'Global' }) => {
  const regionalAverage = REGIONAL_AVERAGES_KG_PER_DAY[userRegion];
  const percentOfRegion = (dailyAverageKg / regionalAverage) * 100;
  const percentOfTarget = (dailyAverageKg / TARGET_KG_PER_DAY) * 100;

  return (
    <Card className="h-full bg-charcoal-core border-whisper-border border rounded-2xl">
      <CardBody className="flex flex-col justify-center space-y-6">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">Regional Benchmark</h3>
        
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-steel">Your Average</span>
            <span className="text-on-surface font-bold">{dailyAverageKg.toFixed(1)} kg</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${Math.min(100, percentOfRegion)}%` }} 
            />
          </div>
          <p className="text-xs text-muted-steel mt-2">
            {percentOfRegion < 100 
              ? `${(100 - percentOfRegion).toFixed(0)}% below the ${userRegion} average (${regionalAverage} kg/day)` 
              : `${(percentOfRegion - 100).toFixed(0)}% above the ${userRegion} average (${regionalAverage} kg/day)`}
          </p>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-steel">1.5°C Target</span>
            <span className="text-on-surface font-bold">{TARGET_KG_PER_DAY.toFixed(1)} kg</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2">
            <div 
              className="bg-bio-emerald h-2 rounded-full" 
              style={{ width: `${Math.min(100, percentOfTarget)}%` }} 
            />
          </div>
          <p className="text-xs text-muted-steel mt-2">
            {percentOfTarget <= 100 
              ? `On track for Paris Agreement goals!` 
              : `Needs ${(dailyAverageKg - TARGET_KG_PER_DAY).toFixed(1)} kg/day reduction to hit target.`}
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
