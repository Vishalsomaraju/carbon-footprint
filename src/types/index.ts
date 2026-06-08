/**
 * @module types/index
 */

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  createdAt: number;
}

export interface ActivityRecord {
  id: string;
  userId: string;
  category: 'transport' | 'energy' | 'food' | 'shopping' | string;
  subCategory?: string; // Maps to keys in EMISSION_FACTORS[category]
  value: number; // e.g., km driven, kWh used
  description?: string;
  date: string;
  carbonImpact: number; // calculated CO2 equivalent
}

export interface Insight {
  id: string;
  text: string;
  category: string;
}
