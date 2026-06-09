/**
 * @module components/landing/FeatureCard
 */

import React from 'react';

interface FeatureCardProps {
  title: string;
  icon: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, icon }): import('react').ReactElement => (
  <div className="bg-slate-900 rounded-2xl p-6 flex flex-col gap-4 border border-slate-800">
    <div className="text-3xl text-green-500 bg-slate-950 w-12 h-12 flex items-center justify-center rounded-xl">
      {icon}
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
  </div>
);
