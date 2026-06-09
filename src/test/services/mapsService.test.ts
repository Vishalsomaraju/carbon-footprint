/**
 * @module mapsService.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { calculateCommuteEmissions } from '../../services/mapsService';

vi.mock('@googlemaps/js-api-loader', (): Record<string, unknown> => ({
  Loader: class {
    load(): Promise<boolean> { return Promise.resolve(true); }
  }
}));

class MockDistanceMatrixService {
  getDistanceMatrix(): Promise<unknown> {
    return Promise.resolve({
      rows: [{ elements: [{ status: 'OK', distance: { value: 15000 }, duration: { value: 1800 } }] }]
    });
  }
}

describe('mapsService', (): void => {
  beforeEach((): void => {
    Object.assign(global, {
      window: {
        google: {
          maps: {
            DistanceMatrixService: MockDistanceMatrixService,
            TravelMode: { DRIVING: 'DRIVING', TRANSIT: 'TRANSIT', BICYCLING: 'BICYCLING', WALKING: 'WALKING' },
            UnitSystem: { METRIC: 'METRIC' }
          }
        }
      }
    });
  });

  it('calculateCommuteEmissions returns correct values', async (): Promise<void> => {
    const result = await calculateCommuteEmissions('A', 'B', 'car_petrol_per_km', 5);
    expect(result.distanceKm).toBe(15);
    // 15000 meters = 15km. duration 1800 sec = 30 min.
    // Daily CO2 round trip for petrol car = 15 * 0.21 * 2 = 6.30
    expect(result.dailyCo2Kg).toBe(6.3);
  });
});
