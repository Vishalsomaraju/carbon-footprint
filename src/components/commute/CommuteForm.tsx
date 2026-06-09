/**
 * @module components/commute/CommuteForm
 */
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { EMISSION_FACTORS } from '../../constants';
import { commuteSchema, CommuteFormData } from '../../utils/validation';

interface CommuteFormProps {
  loading: boolean;
  error: string;
  onCalculate: (data: CommuteFormData) => void;
  defaultValues: CommuteFormData;
}

export const CommuteForm: React.FC<CommuteFormProps> = ({
  loading,
  error,
  onCalculate,
  defaultValues,
}): import('react').ReactElement => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommuteFormData>({
    resolver: zodResolver(commuteSchema),
    defaultValues,
  });

  return (
    <form
      onSubmit={handleSubmit(onCalculate)}
      className="lg:col-span-1 bg-charcoal-core p-6 rounded-2xl border border-whisper-border shadow-sm space-y-4 h-fit"
      noValidate
    >
      <div>
        <label htmlFor="origin" className="block font-label-sm text-label-sm text-muted-steel mb-1">
          Origin (Home)
        </label>
        <input
          id="origin"
          {...register('origin')}
          aria-invalid={errors.origin ? 'true' : 'false'}
          aria-describedby={errors.origin ? 'origin-error' : undefined}
          className="w-full p-2.5 bg-surface-container-high border border-whisper-border rounded-lg outline-none focus:ring-2 focus:ring-bio-emerald text-on-surface placeholder-muted-steel font-body-md"
          placeholder="e.g. 123 Main St"
        />
        {errors.origin && (
          <p id="origin-error" className="text-critical-crimson text-sm mt-1" role="alert">
            {errors.origin.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="destination"
          className="block font-label-sm text-label-sm text-muted-steel mb-1"
        >
          Destination (Work)
        </label>
        <input
          id="destination"
          {...register('destination')}
          aria-invalid={errors.destination ? 'true' : 'false'}
          aria-describedby={errors.destination ? 'destination-error' : undefined}
          className="w-full p-2.5 bg-surface-container-high border border-whisper-border rounded-lg outline-none focus:ring-2 focus:ring-bio-emerald text-on-surface placeholder-muted-steel font-body-md"
          placeholder="e.g. 456 Office Blvd"
        />
        {errors.destination && (
          <p id="destination-error" className="text-critical-crimson text-sm mt-1" role="alert">
            {errors.destination.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="mode" className="block font-label-sm text-label-sm text-muted-steel mb-1">
          Transport Mode
        </label>
        <select
          id="mode"
          {...register('mode')}
          className="w-full p-2.5 bg-surface-container-high border border-whisper-border rounded-lg outline-none focus:ring-2 focus:ring-bio-emerald text-on-surface font-body-md"
        >
          {Object.keys(EMISSION_FACTORS.transport).map((k) => (
            <option key={k} value={k}>
              {k.replace('_per_km', '').replace('_', ' ').toUpperCase()}
            </option>
          ))}
        </select>
        {errors.mode && (
          <p className="text-critical-crimson text-sm mt-1" role="alert">
            {errors.mode.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="days" className="block font-label-sm text-label-sm text-muted-steel mb-1">
          Work Days / Week
        </label>
        <input
          id="days"
          type="number"
          min="1"
          max="7"
          {...register('days', { valueAsNumber: true })}
          aria-invalid={errors.days ? 'true' : 'false'}
          aria-describedby={errors.days ? 'days-error' : undefined}
          className="w-full p-2.5 bg-surface-container-high border border-whisper-border rounded-lg outline-none focus:ring-2 focus:ring-bio-emerald text-on-surface font-body-md"
        />
        {errors.days && (
          <p id="days-error" className="text-critical-crimson text-sm mt-1" role="alert">
            {errors.days.message}
          </p>
        )}
      </div>

      {error && (
        <div role="alert" className="text-critical-crimson text-sm mt-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 mt-4 bg-bio-emerald text-deep-void rounded-lg font-label-sm text-label-sm font-bold hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Calculating...' : 'Calculate'}
      </button>
    </form>
  );
};
