/// <reference types="@types/google.maps" />
/**
 * @module services/mapsService
 * @description Google Maps Distance Matrix API integration for commute emissions.
 */
import { Loader } from '@googlemaps/js-api-loader';

import { env } from '../lib/env';
import { trackError, trackEvent } from '../utils';
import { EMISSION_FACTORS, MAPS_LIBRARIES } from '../constants';

let loaderInstance: Loader | null = null;

function getMapsLoader(): Loader {
  if (!loaderInstance) {
    loaderInstance = new Loader({
      apiKey: env.MAPS_API_KEY,
      version: 'weekly',
      libraries: [...MAPS_LIBRARIES] as Array<'places' | 'geometry'>,
    });
  }
  return loaderInstance;
}

export interface CommuteResult {
  readonly distanceKm: number;
  readonly durationMinutes: number;
  readonly origin: string;
  readonly destination: string;
  readonly dailyCo2Kg: number;
  readonly annualCo2Kg: number;
  readonly transportMode: string;
}

/**
 * Calculates commute emissions using the Google Maps Distance Matrix API.
 *
 * @param params Object containing the commute details.
 * @param params.origin The starting address.
 * @param params.destination The destination address.
 * @param params.transportMode The mode of transport matching an emission factor key.
 * @param params.workDaysPerWeek Number of days per week the commute occurs.
 * @returns {Promise<CommuteResult>} The estimated distance, duration, and carbon emissions.
 */
export async function calculateCommuteEmissions(params: {
  origin: string;
  destination: string;
  transportMode: keyof typeof EMISSION_FACTORS.transport;
  workDaysPerWeek: number;
}): Promise<CommuteResult> {
  const { origin, destination, transportMode, workDaysPerWeek } = params;
  try {
    const loader = getMapsLoader();
    await loader.load();

    const service = new window.google.maps.DistanceMatrixService();
    const gmMode =
      transportMode.includes('car') || transportMode.includes('motorcycle')
        ? window.google.maps.TravelMode.DRIVING
        : transportMode.includes('train') || transportMode.includes('bus')
          ? window.google.maps.TravelMode.TRANSIT
          : transportMode.includes('cycling')
            ? window.google.maps.TravelMode.BICYCLING
            : window.google.maps.TravelMode.WALKING;

    const result = await service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: gmMode,
      unitSystem: window.google.maps.UnitSystem.METRIC,
    });

    const element = result.rows[0]?.elements[0];
    if (!element || element.status !== 'OK') {
      throw new Error('Could not calculate route distance');
    }

    const distanceKm = (element.distance?.value ?? 0) / 1000;
    const durationMinutes = Math.round((element.duration?.value ?? 0) / 60);
    const factor = EMISSION_FACTORS.transport[
      transportMode as keyof typeof EMISSION_FACTORS.transport
    ] as number;
    const dailyCo2Kg = parseFloat((factor * distanceKm * 2).toFixed(3)); // round trip
    const annualCo2Kg = parseFloat((dailyCo2Kg * workDaysPerWeek * 52).toFixed(2));

    trackEvent('commute_calculated', { transport_mode: transportMode, distance_km: distanceKm });

    return {
      distanceKm,
      durationMinutes,
      origin,
      destination,
      dailyCo2Kg,
      annualCo2Kg,
      transportMode,
    };
  } catch (error) {
    trackError(error as Error, 'calculateCommuteEmissions');
    throw error;
  }
}
