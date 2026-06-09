/**
 * @module features/InsightCard
 */

import React from 'react';

import { Card } from '../ui';
import { InsightMessage } from '../../types';

interface InsightCardProps {
  insight: InsightMessage;
}

export const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const getIcon = (): string => {
    switch (insight.category) {
      case 'transport':
        return '🚗';
      case 'home_energy':
      case 'energy':
        return '⚡';
      case 'food':
        return '🍽️';
      case 'shopping':
        return '🛍️';
      default:
        return '💡';
    }
  };

  return (
    <Card className="flex items-start gap-4 p-4 hover:shadow-md transition-shadow">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-xl">
        {getIcon()}
      </div>
      <div>
        <h4 className="text-sm font-semibold capitalize text-gray-900 mb-1">
          {insight.title || `${insight.category?.replace('_', ' ')} Tip`}
        </h4>
        <p className="text-sm text-gray-600 leading-relaxed">
          {insight.body}
        </p>
      </div>
    </Card>
  );
};
