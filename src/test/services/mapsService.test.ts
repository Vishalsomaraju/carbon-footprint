/**
 * @module mapsService.test
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { calculateCommuteEmissions } from '../../services/mapsService';

vi.mock(
  '@googlemaps/js-api-loader',
  (): Record<string, unknown> => ({
    Loader: class {
      load(): Promise<boolean> {
        return Promise.resolve(true);
      }
    },
  }),
);

class MockDistanceMatrixService {
  getDistanceMatrix(): Promise<unknown> {
    return Promise.resolve({
      rows: [
        { elements: [{ status: 'OK', distance: { value: 15000 }, duration: { value: 1800 } }] },
      ],
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
            TravelMode: {
              DRIVING: 'DRIVING',
              TRANSIT: 'TRANSIT',
              BICYCLING: 'BICYCLING',
              WALKING: 'WALKING',
            },
            UnitSystem: { METRIC: 'METRIC' },
          },
        },
      },
    });
  });

  it('calculateCommuteEmissions returns correct values', async (): Promise<void> => {
    const result = await calculateCommuteEmissions('A', 'B', 'car_petrol_per_km', 5);
    expect(result.distanceKm).toBe(15);
    // 15000 meters = 15km. duration 1800 sec = 30 min.
    // Daily CO2 round trip for petrol car = 15 * 0.21 * 2 = 6.30
    expect(result.dailyCo2Kg).toBe(6.3);
  });

  it('calculateCommuteEmissions throws error on bad status', async (): Promise<void> => {
    class BadStatusDistanceMatrixService {
      getDistanceMatrix(): Promise<unknown> {
        return Promise.resolve({
          rows: [{ elements: [{ status: 'NOT_FOUND' }] }],
        });
      }
    }
    window.google.maps.DistanceMatrixService =
      BadStatusDistanceMatrixService as unknown as typeof window.google.maps.DistanceMatrixService;

    await expect(calculateCommuteEmissions('A', 'B', 'car_petrol_per_km', 5)).rejects.toThrow(
      'Could not calculate route distance',
    );
  });

  it('calculateCommuteEmissions catches generic error', async (): Promise<void> => {
    class ErrorDistanceMatrixService {
      getDistanceMatrix(): Promise<unknown> {
        return Promise.reject(new Error('Network error'));
      }
    }
    window.google.maps.DistanceMatrixService =
      ErrorDistanceMatrixService as unknown as typeof window.google.maps.DistanceMatrixService;

    await expect(calculateCommuteEmissions('A', 'B', 'car_petrol_per_km', 5)).rejects.toThrow(
      'Network error',
    );
  });

  it('calculateCommuteEmissions uses correct travel mode for transit', async (): Promise<void> => {
    let usedTravelMode = '';
    class TransitDistanceMatrixService {
      getDistanceMatrix(request: { travelMode: string }): Promise<unknown> {
        usedTravelMode = request.travelMode;
        return Promise.resolve({
          rows: [
            { elements: [{ status: 'OK', distance: { value: 1000 }, duration: { value: 600 } }] },
          ],
        });
      }
    }
    window.google.maps.DistanceMatrixService =
      TransitDistanceMatrixService as unknown as typeof window.google.maps.DistanceMatrixService;

    await calculateCommuteEmissions('A', 'B', 'train_per_km', 5);
    expect(usedTravelMode).toBe('TRANSIT');
  });

  it('calculateCommuteEmissions uses correct travel mode for bicycling', async (): Promise<void> => {
    let usedTravelMode = '';
    class BicyclingDistanceMatrixService {
      getDistanceMatrix(request: { travelMode: string }): Promise<unknown> {
        usedTravelMode = request.travelMode;
        return Promise.resolve({
          rows: [
            { elements: [{ status: 'OK', distance: { value: 1000 }, duration: { value: 600 } }] },
          ],
        });
      }
    }
    window.google.maps.DistanceMatrixService =
      BicyclingDistanceMatrixService as unknown as typeof window.google.maps.DistanceMatrixService;

    await calculateCommuteEmissions('A', 'B', 'cycling_per_km', 5);
    expect(usedTravelMode).toBe('BICYCLING');
  });

  it('calculateCommuteEmissions uses correct travel mode for walking', async (): Promise<void> => {
    let usedTravelMode = '';
    class WalkingDistanceMatrixService {
      getDistanceMatrix(request: { travelMode: string }): Promise<unknown> {
        usedTravelMode = request.travelMode;
        return Promise.resolve({
          rows: [
            { elements: [{ status: 'OK', distance: { value: 1000 }, duration: { value: 600 } }] },
          ],
        });
      }
    }
    window.google.maps.DistanceMatrixService =
      WalkingDistanceMatrixService as unknown as typeof window.google.maps.DistanceMatrixService;

    await calculateCommuteEmissions('A', 'B', 'walking_per_km', 5);
    expect(usedTravelMode).toBe('WALKING');
  });

  it('calculateCommuteEmissions handles undefined distance and duration', async (): Promise<void> => {
    class EmptyDistanceMatrixService {
      getDistanceMatrix(): Promise<unknown> {
        return Promise.resolve({
          rows: [{ elements: [{ status: 'OK' }] }], // no distance or duration
        });
      }
    }
    window.google.maps.DistanceMatrixService =
      EmptyDistanceMatrixService as unknown as typeof window.google.maps.DistanceMatrixService;

    const result = await calculateCommuteEmissions('A', 'B', 'car_petrol_per_km', 5);
    expect(result.distanceKm).toBe(0);
    expect(result.durationMinutes).toBe(0);
  });
});
