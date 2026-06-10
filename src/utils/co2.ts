/**
 * @module utils/co2
 * @description CO2 formatting and calculation helpers.
 */

import { TARGET_KG_PER_DAY } from '../constants';

const GRAMS_PER_KG = 1000;
const FORMAT_THRESHOLD_KG = 1;
const GOOD_THRESHOLD_MULTIPLIER = 1.5;
const AVERAGE_THRESHOLD_MULTIPLIER = 2.5;

export const formatCo2 = (kg: number): string => {
  if (kg < FORMAT_THRESHOLD_KG) return `${(kg * GRAMS_PER_KG).toFixed(0)} g`;
  return `${kg.toFixed(1)} kg`;
};

export type FootprintLevel = 'excellent' | 'good' | 'average' | 'poor';

export const getFootprintLevel = (kg: number): FootprintLevel => {
  if (kg <= TARGET_KG_PER_DAY) return 'excellent';
  if (kg <= TARGET_KG_PER_DAY * GOOD_THRESHOLD_MULTIPLIER) return 'good';
  if (kg <= TARGET_KG_PER_DAY * AVERAGE_THRESHOLD_MULTIPLIER) return 'average';
  return 'poor';
};
