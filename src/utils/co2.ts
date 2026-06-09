/**
 * @module utils/co2
 * @description CO2 formatting and calculation helpers.
 */

import { TARGET_KG_PER_DAY } from '../constants';

export const formatCo2 = (kg: number): string => {
  if (kg < 1) return `${(kg * 1000).toFixed(0)} g`;
  return `${kg.toFixed(1)} kg`;
};

export type FootprintLevel = 'excellent' | 'good' | 'average' | 'poor';

export const getFootprintLevel = (kg: number): FootprintLevel => {
  if (kg <= TARGET_KG_PER_DAY) return 'excellent';
  if (kg <= TARGET_KG_PER_DAY * 1.5) return 'good';
  if (kg <= TARGET_KG_PER_DAY * 2.5) return 'average';
  return 'poor';
};
