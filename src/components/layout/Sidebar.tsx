/**
 * @module components/layout/Sidebar
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import { NAV_ITEMS } from '../../constants/navigation';

export const Sidebar: React.FC = (): import('react').ReactElement => {
  const location = useLocation();
  const isActive = (path: string): boolean => location.pathname === path;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 text-slate-300">
      <div className="p-4 flex items-center gap-2">
        <span className="text-2xl">🍃</span>
        <span className="font-bold text-xl text-white tracking-wide" style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}>
          CarbonWise
        </span>
      </div>
      <nav className="flex-1 px-2 py-4 space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-green-600 text-white'
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
};
