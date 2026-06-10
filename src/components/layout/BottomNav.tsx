/**
 * @module components/layout/BottomNav
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { NAV_ITEMS } from '../../constants/navigation';

export const BottomNav: React.FC = (): import('react').ReactElement => {
  const location = useLocation();
  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <nav aria-label="Mobile Navigation" className="md:hidden fixed bottom-0 w-full bg-surface-container-low border-t border-whisper-border flex justify-around p-2 z-40">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`p-2 rounded-lg flex flex-col items-center justify-center transition-colors ${
            isActive(item.path)
              ? 'text-primary bg-surface-variant'
              : 'text-muted-steel hover:text-on-surface-variant'
          }`}
        >
          {item.icon}
          <span className="font-label-sm text-[10px] mt-1 text-center">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};
