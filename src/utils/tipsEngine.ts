/**
 * @module utils/tipsEngine
 * @description Deterministic rule-based insights generator based on Ecotrace methodology.
 */
import { EMISSION_FACTORS, TRANSIT_SHIFT_PERCENTAGE } from '../constants';
import { ActivityRecord, InsightMessage } from '../types';

/**
 * Generate context-aware tips based on user's actual logged activities.
 * Calculates exact potential savings based on EMISSION_FACTORS.
 */
export const generateDeterministicTips = (activities: ActivityRecord[]): InsightMessage[] => {
  const tips: (InsightMessage & { savings: number })[] = [];

  // Aggregate data by category and subcategory
  const totals = {
    transport: 0,
    car_petrol: 0,
    flight_international: 0,
    beef: 0,
  };

  activities.forEach((a) => {
    if (a.category === 'transport') {
      totals.transport += a.value;
      if (a.subCategory === 'car_petrol') totals.car_petrol += a.value;
      if (a.subCategory === 'flight_international') totals.flight_international += a.value;
    }
    if (a.category === 'food') {
      if (a.subCategory === 'beef') totals.beef += a.value;
    }
  });

  // 1. Shift from petrol car to electric
  if (totals.car_petrol > 0) {
    const savingsPerKm =
      EMISSION_FACTORS.transport.car_petrol_per_km - EMISSION_FACTORS.transport.car_electric_per_km;
    const estimatedSavings = totals.car_petrol * savingsPerKm;
    tips.push({
      id: `tip-ev-${Date.now()}`,
      type: 'tip',
      category: 'transport',
      title: 'Switch to an Electric Vehicle',
      body: `Based on your logged ${totals.car_petrol} km of petrol driving, switching to an EV could save you ${estimatedSavings.toFixed(1)} kg of CO₂.`,
      generatedAt: Date.now(),
      savings: estimatedSavings,
    });

    // 2. Shift to transit
    const transitSavings =
      totals.car_petrol *
      TRANSIT_SHIFT_PERCENTAGE *
      (EMISSION_FACTORS.transport.car_petrol_per_km - EMISSION_FACTORS.transport.train_per_km);
    if (transitSavings > 0) {
      tips.push({
        id: `tip-transit-${Date.now()}`,
        type: 'tip',
        category: 'transport',
        title: `Shift ${TRANSIT_SHIFT_PERCENTAGE * 100}% of drives to public transit`,
        body: `Swapping a quarter of your car journeys for the train or bus would save ${transitSavings.toFixed(1)} kg of CO₂.`,
        generatedAt: Date.now(),
        savings: transitSavings,
      });
    }
  }

  // 3. Shift diet from beef to chicken
  if (totals.beef > 0) {
    const savingsPerMeal =
      EMISSION_FACTORS.food.beef_per_meal - EMISSION_FACTORS.food.chicken_per_meal;
    const estimatedSavings = totals.beef * savingsPerMeal;
    tips.push({
      id: `tip-diet-${Date.now()}`,
      type: 'tip',
      category: 'food',
      title: 'Swap Beef for Lower-Impact Meats',
      body: `You've logged ${totals.beef} beef meals. Swapping these for chicken would save ${estimatedSavings.toFixed(1)} kg of CO₂.`,
      generatedAt: Date.now(),
      savings: estimatedSavings,
    });
  }

  // Sort by highest potential savings
  tips.sort((a, b) => b.savings - a.savings);

  // Return top 3 tips, stripping out the internal 'savings' property to match the InsightMessage interface
  return tips.slice(0, 3).map(({ savings: _savings, ...rest }) => rest);
};
