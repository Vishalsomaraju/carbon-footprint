/**
 * @module features/ActivityForm
 */

import React, { useState, memo } from 'react';

import { Card, Button, Input, FormField } from '../ui';
import { CategorySelect } from './CategorySelect';
import { trackError } from '../../utils/errorTracker';

interface ActivityFormProps {
  onSubmit: (data: { category: string; subCategory: string; value: number; description: string; date: string }) => Promise<void>;
  isLoading?: boolean;
}

export const ActivityForm: React.FC<ActivityFormProps> = memo(({ onSubmit, isLoading }) => {
  const [category, setCategory] = useState('transport');
  const [subCategory, setSubCategory] = useState('car_petrol_per_km');
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    
    if (!value || isNaN(Number(value))) {
      setError('Please enter a valid number for the value.');
      return;
    }

    try {
      await onSubmit({ category, subCategory, value: Number(value), description, date });
      setValue('');
      setDescription('');
    } catch (err) {
      trackError(err, 'ActivityForm.handleSubmit');
      setError('Failed to log activity. Please try again.');
    }
  };

  return (
    <Card className="w-full max-w-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Log Activity</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <CategorySelect 
          category={category} 
          subCategory={subCategory} 
          onChangeCategory={setCategory} 
          onChangeSubCategory={setSubCategory} 
          disabled={isLoading} 
        />

        <FormField label="Value" htmlFor="value" required helpText="e.g., km, kWh, meals">
          <Input id="value" type="number" step="0.01" value={value} onChange={(e) => setValue(e.target.value)} placeholder="0.00" disabled={isLoading} />
        </FormField>

        <FormField label="Description" htmlFor="description">
          <Input id="description" type="text" value={description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} placeholder="e.g., Drove to work" disabled={isLoading} />
        </FormField>
        
        <FormField label="Date" htmlFor="date" required>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} disabled={isLoading} />
        </FormField>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" isLoading={isLoading}>Log Activity</Button>
      </form>
    </Card>
  );
});
