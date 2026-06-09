/**
 * @module components/landing/FeatureCard
 */

import React from 'react';

interface FeatureCardProps {
  title: string;
  icon: string; // Material Symbol name
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  icon,
}): import('react').ReactElement => (
  <div className="bg-charcoal-core rounded-2xl p-6 flex flex-col gap-4 border border-whisper-border">
    <div className="text-bio-emerald bg-deep-void w-12 h-12 flex items-center justify-center rounded-xl border border-whisper-border">
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <h3 className="text-xl font-bold text-on-surface">{title}</h3>
  </div>
);
