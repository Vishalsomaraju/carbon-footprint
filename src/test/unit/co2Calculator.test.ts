/**
 * @module co2Calculator.test
 */

import { describe, it, expect } from 'vitest';

import {
  calculateTransportCo2,
  calculateFoodCo2,
  calculateEnergyCo2,
  calculateShoppingCo2,
  calculateCo2,
} from '../../utils/co2Calculator';
import { formatCo2, getFootprintLevel } from '../../utils/co2';

describe('co2Calculator', (): void => {
  it('calculateTransportCo2 works', (): void => {
    expect(calculateTransportCo2('car_petrol', 10)).toBeCloseTo(2.1);
    expect(calculateTransportCo2('car_electric', 10)).toBeCloseTo(0.5);
    expect(calculateTransportCo2('walking', 10)).toBe(0);
  });
  it('calculateFoodCo2 works', (): void => {
    expect(calculateFoodCo2('beef', 2)).toBeCloseTo(7.0);
    expect(calculateFoodCo2('vegan', 2)).toBeCloseTo(0.36);
    expect(calculateFoodCo2('invalid_food', 2)).toBe(0);
  });
  it('calculateEnergyCo2 works', (): void => {
    expect(calculateEnergyCo2('electricity', 100)).toBeCloseTo(23.3);
    expect(calculateEnergyCo2('invalid_energy', 100)).toBe(0);
  });
  it('calculateShoppingCo2 works', (): void => {
    expect(calculateShoppingCo2('clothing_item', 2)).toBeCloseTo(14);
    expect(calculateShoppingCo2('invalid_shopping', 2)).toBe(0);
  });
  it('calculateCo2 dispatches properly', (): void => {
    expect(calculateCo2('transport', 'car_petrol', 10)).toBeCloseTo(2.1);
    expect(calculateCo2('food', 'beef', 2)).toBeCloseTo(7.0);
    expect(calculateCo2('energy', 'electricity', 100)).toBeCloseTo(23.3);
    expect(calculateCo2('shopping', 'clothing_item', 2)).toBeCloseTo(14);
    expect(calculateCo2('unknown', 'item', 1)).toBe(0);
  });
  it('formatCo2 formatting', (): void => {
    expect(formatCo2(0.5)).toBe('500 g');
    expect(formatCo2(10.5)).toBe('10.5 kg');
  });
  it('getFootprintLevel works', (): void => {
    expect(getFootprintLevel(5)).toBe('excellent');
    expect(getFootprintLevel(8)).toBe('good');
    expect(getFootprintLevel(12)).toBe('average');
    expect(getFootprintLevel(20)).toBe('poor');
  });
});
