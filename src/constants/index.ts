/**
 * @module constants
 * @description Application-wide constants. No magic values elsewhere.
 */

/** CO2 emission factors in kg per unit */
export const EMISSION_FACTORS = {
  transport: {
    car_petrol_per_km: 0.21,
    car_diesel_per_km: 0.17,
    car_electric_per_km: 0.05,
    bus_per_km: 0.089,
    train_per_km: 0.041,
    flight_domestic_per_km: 0.255,
    flight_international_per_km: 0.195,
    motorcycle_per_km: 0.114,
    walking_per_km: 0,
    cycling_per_km: 0,
  },
  food: {
    beef_per_meal: 3.5,
    lamb_per_meal: 2.4,
    pork_per_meal: 1.2,
    chicken_per_meal: 0.69,
    fish_per_meal: 0.55,
    vegetarian_per_meal: 0.39,
    vegan_per_meal: 0.18,
  },
  energy: {
    electricity_per_kwh: 0.233,
    natural_gas_per_kwh: 0.203,
    heating_oil_per_litre: 2.68,
  },
  shopping: {
    clothing_item: 7.0,
    electronics_small: 25.0,
    electronics_large: 150.0,
    household_item: 15.0,
  },
} as const;

export const CATEGORY_LABELS = {
  transport: 'Transport',
  food: 'Food & Diet',
  energy: 'Home Energy',
  shopping: 'Shopping',
} as const;

export const CATEGORY_COLORS = {
  transport: '#3b82f6',
  food: '#f97316',
  energy: '#eab308',
  shopping: '#a855f7',
} as const;

export const REGIONAL_AVERAGES_KG_PER_DAY = {
  US: 38.3, // ~14.0 tonnes/year
  UK: 13.7, // ~5.0 tonnes/year
  EU: 17.8, // ~6.5 tonnes/year
  IN: 5.2, // ~1.9 tonnes/year
  Global: 13.0, // ~4.7 tonnes/year
} as const;

export type Region = keyof typeof REGIONAL_AVERAGES_KG_PER_DAY;

export const GLOBAL_AVERAGE_KG_PER_DAY = REGIONAL_AVERAGES_KG_PER_DAY.Global;
export const TARGET_KG_PER_DAY = 6.3; // ~2.3 tonnes/year, 1.5C aligned
export const STREAK_MILESTONE_DAYS = [3, 7, 14, 30, 60, 90];
export const WEEKLY_GOAL_MIN = 20;
export const WEEKLY_GOAL_MAX = 150;

export const GEMINI_MODEL = 'gemini-1.5-flash';
export const MAPS_LIBRARIES = ['places', 'geometry'] as const;
export const INSIGHT_GENERATION_COOLDOWN_MS = 60000;
export const TRANSIT_SHIFT_PERCENTAGE = 0.25;

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  LOG: '/log',
  INSIGHTS: '/insights',
  COMMUTE: '/commute',
  PROFILE: '/profile',
} as const;
