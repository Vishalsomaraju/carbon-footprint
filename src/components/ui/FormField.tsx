/**
 * @module ui/FormField
 */

import React, { ReactNode } from 'react';
import { clsx } from 'clsx';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
  helpText?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  children,
  required,
  helpText,
  className,
}) => {
  return (
    <div className={clsx('flex flex-col gap-1.5', className)}>
      <label htmlFor={htmlFor} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {children}
      {helpText && <p className="text-sm text-gray-500">{helpText}</p>}
    </div>
  );
};
