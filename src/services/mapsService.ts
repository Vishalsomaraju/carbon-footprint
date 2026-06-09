/**
 * @module services/mapsService
 */

import { Loader } from '@googlemaps/js-api-loader';

import { env } from '../lib/env';
import { CommuteRoute } from '../types';
import { EMISSION_FACTORS } from '../constants';

let googleMapsPromise: Promise<typeof google> | null = null;

export const initGoogleMaps = (): Promise<typeof google> => {
  if (!googleMapsPromise) {
    const loader = new Loader({
      apiKey: env.MAPS_API_KEY,
      version: 'weekly',
      libraries: ['places', 'routes']
    });
    googleMapsPromise = loader.load();
  }
  return googleMapsPromise;
};

export const mapsService = {
  calculateRoute: async (origin: string, destination: string, mode: string): Promise<CommuteRoute> => {
    const google = await initGoogleMaps();
    const directionsService = new google.maps.DirectionsService();

    let travelMode = google.maps.TravelMode.DRIVING;
    let factor: number = EMISSION_FACTORS.transport.car_petrol_per_km;

    switch (mode) {
      case 'transit':
        travelMode = google.maps.TravelMode.TRANSIT;
        factor = EMISSION_FACTORS.transport.bus_per_km;
        break;
      case 'bicycling':
        travelMode = google.maps.TravelMode.BICYCLING;
        factor = EMISSION_FACTORS.transport.cycling_per_km;
        break;
      case 'walking':
        travelMode = google.maps.TravelMode.WALKING;
        factor = EMISSION_FACTORS.transport.walking_per_km;
        break;
      default:
        travelMode = google.maps.TravelMode.DRIVING;
    }

    const response = await directionsService.route({
      origin,
      destination,
      travelMode
    });

    const route = response.routes[0];
    if (!route || !route.legs[0]) {
      throw new Error('No route found');
    }

    const distanceMeters = route.legs[0].distance?.value || 0;
    const distanceKm = distanceMeters / 1000;

    const dailyCo2Kg = distanceKm * factor;

    return {
      origin,
      destination,
      distanceKm,
      transportMode: mode,
      dailyCo2Kg
    };
  }
};
