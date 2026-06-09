/**
 * @module components/log/ActivityForm
 * @description Step 2: Subtype and value input.
 */

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { activitySchema } from '../../utils/validation';

interface Props {
  readonly category: string;
  readonly onNext: (data: { subCategory: string; value: number }) => void;
  readonly onBack: () => void;
}

const OPTIONS: Record<string, string[]> = {
  transport: ['car_petrol', 'car_diesel', 'car_electric', 'bus', 'train', 'flight_domestic'],
  food: ['beef', 'chicken', 'vegetarian', 'vegan'],
  energy: ['electricity', 'natural_gas'],
  shopping: ['clothing', 'electronics'],
};

const stepSchema = activitySchema.pick({ subCategory: true, value: true });
type StepFormData = z.infer<typeof stepSchema>;

export const ActivityForm: React.FC<Props> = ({ category, onNext, onBack }): React.ReactElement => {
  const opts = OPTIONS[category] || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StepFormData>({
    resolver: zodResolver(stepSchema),
    defaultValues: {
      subCategory: '',
    },
  });

  return (
    <form
      onSubmit={handleSubmit(onNext)}
      className="bg-charcoal-core p-6 rounded-2xl shadow-sm border border-whisper-border space-y-6"
      noValidate
    >
      <div>
        <label
          htmlFor="subCategory"
          className="block font-label-sm text-label-sm text-muted-steel mb-1"
        >
          Activity Type
        </label>
        <select
          id="subCategory"
          {...register('subCategory')}
          aria-invalid={errors.subCategory ? 'true' : 'false'}
          aria-describedby={errors.subCategory ? 'subCategory-error' : undefined}
          className="w-full p-3 bg-surface-container-high border border-whisper-border rounded-lg focus:ring-2 focus:ring-bio-emerald outline-none text-on-surface font-body-md"
        >
          <option value="">Select type...</option>
          {opts.map((opt) => (
            <option key={opt} value={opt}>
              {opt.replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>
        {errors.subCategory && (
          <p id="subCategory-error" className="text-critical-crimson text-sm mt-1" role="alert">
            {errors.subCategory.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="value" className="block font-label-sm text-label-sm text-muted-steel mb-1">
          Value (km, meals, kWh)
        </label>
        <input
          id="value"
          type="number"
          min="0.1"
          step="0.1"
          {...register('value', { valueAsNumber: true })}
          aria-invalid={errors.value ? 'true' : 'false'}
          aria-describedby={errors.value ? 'value-error' : undefined}
          className="w-full p-3 bg-surface-container-high border border-whisper-border rounded-lg focus:ring-2 focus:ring-bio-emerald outline-none text-on-surface font-body-md"
        />
        {errors.value && (
          <p id="value-error" className="text-critical-crimson text-sm mt-1" role="alert">
            {errors.value.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-whisper-border">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-muted-steel hover:bg-surface-variant rounded-lg font-label-sm text-label-sm font-bold"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-bio-emerald text-deep-void rounded-lg hover:opacity-90 font-label-sm text-label-sm font-bold"
        >
          Continue
        </button>
      </div>
    </form>
  );
};
