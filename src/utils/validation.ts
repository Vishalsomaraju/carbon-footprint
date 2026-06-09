/**
 * @module utils/validation
 */
import { z } from 'zod';

import { EMISSION_FACTORS } from '../constants';

const allowedCategories = Object.keys(EMISSION_FACTORS) as [string, ...string[]];

export const activitySchema = z.object({
  category: z.enum(allowedCategories, {
    message: 'Invalid category selected.',
  }),
  subCategory: z.string().min(1, 'Activity type is required.'),
  value: z.number({ message: 'Value must be a number' }).positive('Value must be greater than 0.'),
  description: z.string().max(200, 'Description must be under 200 characters.').optional(),
  date: z.string().datetime({ message: 'Invalid date format.' }),
});

export const commuteSchema = z.object({
  origin: z.string().min(3, 'Origin is required (min 3 chars).'),
  destination: z.string().min(3, 'Destination is required (min 3 chars).'),
  mode: z.enum(Object.keys(EMISSION_FACTORS.transport) as [string, ...string[]]),
  days: z
    .number({ message: 'Days must be a number' })
    .min(1, 'Must commute at least 1 day.')
    .max(7, 'Cannot exceed 7 days.'),
});

export type ActivityFormData = z.infer<typeof activitySchema>;
export type CommuteFormData = z.infer<typeof commuteSchema>;
