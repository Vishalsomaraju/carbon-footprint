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
    <nav className="hidden md:flex bg-surface-container-low border-r border-whisper-border w-72 flex-col pt-4 pb-8 z-50 transition-all duration-300 relative shrink-0">
      <div className="px-gutter-md mb-8 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-charcoal-core border border-whisper-border flex items-center justify-center overflow-hidden shrink-0">
          <span className="material-symbols-outlined fill text-bio-emerald">eco</span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">CarbonWise</h1>
          <p className="font-label-sm text-label-sm text-muted-steel mt-1">Terminal v2.4.0</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active
                  ? 'text-primary bg-surface-variant border-l-4 border-primary font-bold rounded-l-none scale-[0.98]'
                  : 'text-muted-steel font-medium hover:text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {item.icon}
              <span className="font-label-sm text-label-sm">{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="px-4 mt-auto space-y-4">
        <button className="w-full bg-surface-variant hover:bg-surface-container-high text-primary border border-whisper-border rounded-lg py-3 px-4 flex items-center justify-center gap-2 transition-colors duration-200">
          <span className="material-symbols-outlined">add</span>
          <span className="font-label-sm text-label-sm">Generate Report</span>
        </button>
        <div className="pt-4 border-t border-whisper-border space-y-1">
          <Link to="/support" className="flex items-center gap-3 text-muted-steel px-4 py-2 font-medium hover:text-on-surface-variant transition-colors duration-200 rounded-lg">
            <span className="material-symbols-outlined">contact_support</span>
            <span className="font-label-sm text-label-sm">Support</span>
          </Link>
          <Link to="/docs" className="flex items-center gap-3 text-muted-steel px-4 py-2 font-medium hover:text-on-surface-variant transition-colors duration-200 rounded-lg">
            <span className="material-symbols-outlined">menu_book</span>
            <span className="font-label-sm text-label-sm">Documentation</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};
