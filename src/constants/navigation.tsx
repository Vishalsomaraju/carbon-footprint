/**
 * @module constants/navigation
 */
import React from 'react';

import { ROUTES } from './index';

export interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: React.ReactNode;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DASHBOARD,
    icon: <span className="material-symbols-outlined">monitoring</span>,
  },
  {
    label: 'Log Activity',
    path: ROUTES.LOG,
    icon: <span className="material-symbols-outlined">add_circle</span>,
  },
  {
    label: 'AI Insights',
    path: ROUTES.INSIGHTS,
    icon: <span className="material-symbols-outlined">query_stats</span>,
  },
  {
    label: 'Commute',
    path: ROUTES.COMMUTE,
    icon: <span className="material-symbols-outlined">electric_car</span>,
  },
  {
    label: 'Profile',
    path: ROUTES.PROFILE,
    icon: <span className="material-symbols-outlined">person</span>,
  },
];
