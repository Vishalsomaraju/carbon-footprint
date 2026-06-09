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
    <nav className="md:hidden fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 flex justify-around p-2 z-40 text-slate-300">
      {NAV_ITEMS.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`p-2 rounded-lg flex flex-col items-center justify-center transition-colors ${
            isActive(item.path) ? 'text-green-500' : 'hover:text-white'
          }`}
        >
          {item.icon}
          <span className="text-[10px] mt-1 font-medium">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};
