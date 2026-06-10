/**
 * @module co2Calculator
 */

import { EMISSION_FACTORS } from '../constants';

export const calculateTransportCo2 = (subCategory: string, value: number): number => {
  const factors = EMISSION_FACTORS.transport as Record<string, number>;
  const factor = factors[subCategory] || factors[subCategory + '_per_km'] || 0;
  return value * factor;
};

export const calculateFoodCo2 = (subCategory: string, value: number): number => {
  const factors = EMISSION_FACTORS.food as Record<string, number>;
  const factor = factors[subCategory] || factors[subCategory + '_per_meal'] || 0;
  return value * factor;
};

export const calculateEnergyCo2 = (subCategory: string, value: number): number => {
  const factors = EMISSION_FACTORS.energy as Record<string, number>;
  const factor =
    factors[subCategory] ||
    factors[subCategory + '_per_kwh'] ||
    factors[subCategory + '_per_litre'] ||
    0;
  return value * factor;
};

export const calculateShoppingCo2 = (subCategory: string, value: number): number => {
  const factor = (EMISSION_FACTORS.shopping as Record<string, number>)[subCategory] || 0;
  return value * factor;
};

/**
 * Central router for calculating CO2 emissions based on category, sub-category, and logged value.
 * Uses the static EMISSION_FACTORS defined in constants.
 *
 * @param {string} category The primary category (e.g., 'transport', 'food').
 * @param {string} subCategory The specific activity type.
 * @param {number} value The numerical value associated with the activity (e.g., km driven, meals eaten).
 * @returns {number} The calculated CO2 impact in kg.
 */
export const calculateCo2 = (category: string, subCategory: string, value: number): number => {
  if (category === 'transport') return calculateTransportCo2(subCategory, value);
  if (category === 'food') return calculateFoodCo2(subCategory, value);
  if (category === 'energy') return calculateEnergyCo2(subCategory, value);
  if (category === 'shopping') return calculateShoppingCo2(subCategory, value);
  return 0;
};
