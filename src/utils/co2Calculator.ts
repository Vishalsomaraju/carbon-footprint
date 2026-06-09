/**
 * @module co2Calculator
 */

import { EMISSION_FACTORS } from '../constants';

export const calculateTransportCo2 = (subCategory: string, value: number): number => {
  const factor = (EMISSION_FACTORS.transport as Record<string, number>)[subCategory + '_per_km'] || 0;
  return value * factor;
};

export const calculateFoodCo2 = (subCategory: string, value: number): number => {
  const factor = (EMISSION_FACTORS.food as Record<string, number>)[subCategory + '_per_meal'] || 0;
  return value * factor;
};

export const calculateEnergyCo2 = (subCategory: string, value: number): number => {
  const factor = (EMISSION_FACTORS.energy as Record<string, number>)[subCategory + '_per_kwh'] || (EMISSION_FACTORS.energy as Record<string, number>)[subCategory + '_per_litre'] || 0;
  return value * factor;
};

export const calculateShoppingCo2 = (subCategory: string, value: number): number => {
  const factor = (EMISSION_FACTORS.shopping as Record<string, number>)[subCategory] || 0;
  return value * factor;
};

export const calculateCo2 = (category: string, subCategory: string, value: number): number => {
  if (category === 'transport') return calculateTransportCo2(subCategory, value);
  if (category === 'food') return calculateFoodCo2(subCategory, value);
  if (category === 'energy') return calculateEnergyCo2(subCategory, value);
  if (category === 'shopping') return calculateShoppingCo2(subCategory, value);
  return 0;
};
