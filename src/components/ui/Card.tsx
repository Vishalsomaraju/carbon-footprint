/**
 * @module ui/Card
 */

import React, { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div 
      className={clsx('bg-white rounded-xl shadow-md overflow-hidden border border-gray-100', className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={clsx('px-6 py-4 border-b border-gray-100', className)} {...props}>
    {children}
  </div>
);

export const CardBody: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={clsx('px-6 py-4', className)} {...props}>
    {children}
  </div>
);

export const CardFooter: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={clsx('px-6 py-4 bg-gray-50 border-t border-gray-100', className)} {...props}>
    {children}
  </div>
);
