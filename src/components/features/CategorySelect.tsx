/**
 * @module features/CategorySelect
 */

import React from 'react';

import { FormField } from '../ui';
import { EMISSION_FACTORS, CATEGORY_LABELS } from '../../constants';

interface CategorySelectProps {
  category: string;
  subCategory: string;
  onChangeCategory: (c: string) => void;
  onChangeSubCategory: (sc: string) => void;
  disabled?: boolean;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  category,
  subCategory,
  onChangeCategory,
  onChangeSubCategory,
  disabled
}): JSX.Element => {
  const subCategories: string[] = category in EMISSION_FACTORS 
    ? Object.keys(EMISSION_FACTORS[category as keyof typeof EMISSION_FACTORS])
    : [];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const newCat = e.target.value;
    onChangeCategory(newCat);
    const newSubs = newCat in EMISSION_FACTORS 
      ? Object.keys(EMISSION_FACTORS[newCat as keyof typeof EMISSION_FACTORS]) 
      : [];
    onChangeSubCategory(newSubs[0] || '');
  };

  return (
    <div className="space-y-4">
      <FormField label="Category" htmlFor="category" required>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={disabled}
        >
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </FormField>

      {subCategories.length > 0 && (
        <FormField label="Type" htmlFor="subCategory" required>
          <select
            id="subCategory"
            value={subCategory}
            onChange={(e) => onChangeSubCategory(e.target.value)}
            className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={disabled}
          >
            {subCategories.map(sc => (
              <option key={sc} value={sc}>
                {sc.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </FormField>
      )}
    </div>
  );
};
