import { describe, it, expect } from 'vitest';

import { activitySchema, commuteSchema } from '../../utils/validation';

describe('Validation Schemas', () => {
  describe('activitySchema', () => {
    it('should validate a correct activity', () => {
      const validActivity = {
        category: 'transport',
        subCategory: 'car_petrol',
        value: 15.5,
        description: 'Drove to work',
        date: new Date().toISOString(),
      };
      const result = activitySchema.safeParse(validActivity);
      expect(result.success).toBe(true);
    });

    it('should fail on invalid category', () => {
      const invalidActivity = {
        category: 'invalid_category',
        subCategory: 'car_petrol',
        value: 15.5,
        date: new Date().toISOString(),
      };
      const result = activitySchema.safeParse(invalidActivity);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid category selected.');
      }
    });

    it('should fail on negative value', () => {
      const invalidActivity = {
        category: 'transport',
        subCategory: 'car_petrol',
        value: -5,
        date: new Date().toISOString(),
      };
      const result = activitySchema.safeParse(invalidActivity);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Value must be greater than 0.');
      }
    });
  });

  describe('commuteSchema', () => {
    it('should validate a correct commute', () => {
      const validCommute = {
        origin: '123 Main St',
        destination: '456 Work Ave',
        mode: 'bus_per_km',
        days: 5,
      };
      const result = commuteSchema.safeParse(validCommute);
      expect(result.success).toBe(true);
    });

    it('should fail if days > 7', () => {
      const invalidCommute = {
        origin: '123 Main St',
        destination: '456 Work Ave',
        mode: 'bus_per_km',
        days: 8,
      };
      const result = commuteSchema.safeParse(invalidCommute);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Cannot exceed 7 days.');
      }
    });

    it('should fail on invalid mode', () => {
      const invalidCommute = {
        origin: '123 Main St',
        destination: '456 Work Ave',
        mode: 'teleportation',
        days: 5,
      };
      const result = commuteSchema.safeParse(invalidCommute);
      expect(result.success).toBe(false);
    });
  });
});
