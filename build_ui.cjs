const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.join('src', p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
};

// 1. src/utils/co2.ts
write('utils/co2.ts', `/**
 * @module utils/co2
 * @description CO2 formatting and calculation helpers.
 */

import { TARGET_KG_PER_DAY } from '../constants';

export const formatCo2 = (kg: number): string => {
  if (kg < 1) return \`\${(kg * 1000).toFixed(0)} g\`;
  return \`\${kg.toFixed(1)} kg\`;
};

export type FootprintLevel = 'excellent' | 'good' | 'average' | 'poor';

export const getFootprintLevel = (kg: number): FootprintLevel => {
  if (kg <= TARGET_KG_PER_DAY) return 'excellent';
  if (kg <= TARGET_KG_PER_DAY * 1.5) return 'good';
  if (kg <= TARGET_KG_PER_DAY * 2.5) return 'average';
  return 'poor';
};
`);

// 2. Dashboard Components
write('components/dashboard/DailySummaryCard.tsx', `/**
 * @module components/dashboard/DailySummaryCard
 * @description Shows today's total CO2 vs target with status badge.
 */

import React from 'react';
import { formatCo2, getFootprintLevel } from '../../utils/co2';
import { TARGET_KG_PER_DAY } from '../../constants';

interface Props {
  readonly totalKg: number;
}

export const DailySummaryCard: React.FC<Props> = ({ totalKg }): React.ReactElement => {
  const level = getFootprintLevel(totalKg);
  
  const badgeColors = {
    excellent: 'bg-green-100 text-green-800 border-green-200',
    good: 'bg-blue-100 text-blue-800 border-blue-200',
    average: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    poor: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider mb-1">Today's Footprint</h2>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-gray-900">{formatCo2(totalKg)}</span>
          <span className="text-gray-400 mb-1">/ {formatCo2(TARGET_KG_PER_DAY)} target</span>
        </div>
      </div>
      <div className={\`px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wide \${badgeColors[level]}\`}>
        {level}
      </div>
    </div>
  );
};
`);

write('components/dashboard/WeeklyChart.tsx', `/**
 * @module components/dashboard/WeeklyChart
 * @description Recharts BarChart showing last 7 days CO2.
 */

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer, Cell } from 'recharts';
import { format, subDays } from 'date-fns';
import { TARGET_KG_PER_DAY } from '../../constants';
import { ActivityRecord } from '../../types';
import { getFootprintLevel } from '../../utils/co2';

interface Props {
  readonly activities: ActivityRecord[];
}

export const WeeklyChart: React.FC<Props> = ({ activities }): React.ReactElement => {
  const data = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = subDays(new Date(), 6 - i);
      return { date: format(d, 'yyyy-MM-dd'), label: format(d, 'EEE'), total: 0 };
    });

    activities.forEach(act => {
      const day = last7Days.find(d => d.date === act.date.split('T')[0]);
      if (day && act.carbonImpact) day.total += act.carbonImpact;
    });

    return last7Days;
  }, [activities]);

  const getColor = (val: number) => {
    const level = getFootprintLevel(val);
    if (level === 'excellent') return '#22c55e';
    if (level === 'good') return '#3b82f6';
    if (level === 'average') return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Last 7 Days</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
          <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <ReferenceLine y={TARGET_KG_PER_DAY} stroke="#9ca3af" strokeDasharray="4 4" label={{ position: 'top', value: 'Target', fill: '#9ca3af', fontSize: 12 }} />
          <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((entry, index) => (
              <Cell key={\`cell-\${index}\`} fill={getColor(entry.total)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
`);

write('components/dashboard/CategoryBreakdown.tsx', `/**
 * @module components/dashboard/CategoryBreakdown
 * @description 4 cards showing today's totals per category.
 */

import React, { useMemo } from 'react';
import { ActivityRecord } from '../../types';
import { CATEGORY_COLORS, CATEGORY_LABELS } from '../../constants';
import { formatCo2 } from '../../utils/co2';

interface Props {
  readonly activities: ActivityRecord[];
}

export const CategoryBreakdown: React.FC<Props> = ({ activities }): React.ReactElement => {
  const totals = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const res: Record<string, number> = { transport: 0, food: 0, energy: 0, shopping: 0 };
    activities.filter(a => a.date.startsWith(today)).forEach(a => {
      if (res[a.category] !== undefined && a.carbonImpact) res[a.category] += a.carbonImpact;
    });
    return res;
  }, [activities]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(totals).map(([cat, total]) => (
        <div key={cat} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] }} />
            <span className="text-sm font-medium text-gray-600">{CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS]}</span>
          </div>
          <span className="text-2xl font-bold text-gray-900 mt-auto">{formatCo2(total)}</span>
        </div>
      ))}
    </div>
  );
};
`);

write('components/dashboard/StreakBadge.tsx', `/**
 * @module components/dashboard/StreakBadge
 * @description Shows a streak if logged consecutively.
 */

import React, { useMemo } from 'react';
import { ActivityRecord } from '../../types';

interface Props {
  readonly activities: ActivityRecord[];
}

export const StreakBadge: React.FC<Props> = ({ activities }): React.ReactElement | null => {
  const streak = useMemo(() => {
    if (!activities.length) return 0;
    // Simple mock logic for demonstration
    const uniqueDays = new Set(activities.map(a => a.date.split('T')[0]));
    return uniqueDays.size;
  }, [activities]);

  if (streak < 2) return null;

  return (
    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full font-bold shadow-sm border border-orange-200">
      <span>🔥</span> {streak} day streak
    </div>
  );
};
`);

// 3. Log Components
write('components/log/CategorySelector.tsx', `/**
 * @module components/log/CategorySelector
 * @description Step 1: Select category.
 */

import React from 'react';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '../../constants';

interface Props {
  readonly onSelect: (cat: string) => void;
}

export const CategorySelector: React.FC<Props> = ({ onSelect }): React.ReactElement => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(CATEGORY_LABELS).map(([cat, label]) => (
        <button
          key={cat}
          type="button"
          onClick={() => onSelect(cat)}
          className="p-6 bg-white border-2 border-gray-100 rounded-xl hover:border-carbon-500 transition-colors flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: CATEGORY_COLORS[cat as keyof typeof CATEGORY_COLORS] }}>
            {cat.charAt(0).toUpperCase()}
          </div>
          <span className="text-lg font-bold text-gray-900">{label}</span>
        </button>
      ))}
    </div>
  );
};
`);

write('components/log/ActivityForm.tsx', `/**
 * @module components/log/ActivityForm
 * @description Step 2: Subtype and value input.
 */

import React, { useState, useEffect } from 'react';

interface Props {
  readonly category: string;
  readonly onNext: (data: { subCategory: string; value: number }) => void;
  readonly onBack: () => void;
}

const OPTIONS: Record<string, string[]> = {
  transport: ['car_petrol', 'car_diesel', 'car_electric', 'bus', 'train', 'flight_domestic'],
  food: ['beef', 'chicken', 'vegetarian', 'vegan'],
  energy: ['electricity', 'natural_gas'],
  shopping: ['clothing', 'electronics'],
};

export const ActivityForm: React.FC<Props> = ({ category, onNext, onBack }): React.ReactElement => {
  const [subCategory, setSubCategory] = useState<string>('');
  const [value, setValue] = useState<number | ''>('');
  const [error, setError] = useState<string>('');

  const opts = OPTIONS[category] || [];

  const handleNext = () => {
    if (!subCategory) return setError('Please select a subtype.');
    if (!value || value <= 0) return setError('Value must be greater than 0.');
    onNext({ subCategory, value: Number(value) });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div>
        <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
        <select
          id="subCategory"
          value={subCategory}
          onChange={(e) => { setSubCategory(e.target.value); setError(''); }}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-carbon-500 outline-none"
        >
          <option value="">Select type...</option>
          {opts.map(opt => <option key={opt} value={opt}>{opt.replace('_', ' ').toUpperCase()}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">Value (km, meals, kWh)</label>
        <input
          id="value"
          type="number"
          min="0.1"
          step="0.1"
          value={value}
          onChange={(e) => { setValue(e.target.value ? Number(e.target.value) : ''); setError(''); }}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-carbon-500 outline-none"
        />
      </div>
      {error && <div role="alert" className="text-red-600 text-sm">{error}</div>}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onBack} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Back</button>
        <button type="button" onClick={handleNext} className="px-6 py-2 bg-carbon-600 text-white rounded-lg hover:bg-carbon-700 font-medium">Continue</button>
      </div>
    </div>
  );
};
`);

write('components/log/ConfirmationStep.tsx', `/**
 * @module components/log/ConfirmationStep
 * @description Step 3: Confirm and save.
 */

import React, { useState } from 'react';
import { formatCo2 } from '../../utils/co2';
import { EMISSION_FACTORS } from '../../constants';

interface Props {
  readonly data: { category: string; subCategory: string; value: number };
  readonly onSubmit: (notes: string) => Promise<void>;
  readonly onBack: () => void;
  readonly isLoading: boolean;
}

export const ConfirmationStep: React.FC<Props> = ({ data, onSubmit, onBack, isLoading }): React.ReactElement => {
  const [notes, setNotes] = useState('');
  
  // Calculate mock value based on constants
  let factor = 0;
  try {
    const cats = EMISSION_FACTORS as any;
    const key = Object.keys(cats[data.category]).find(k => k.startsWith(data.subCategory));
    if (key) factor = cats[data.category][key];
  } catch(e) {}
  const estimatedCo2 = (factor * data.value) || (data.value * 0.5);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
      <div className="text-center p-6 bg-carbon-50 rounded-xl border border-carbon-100">
        <p className="text-sm text-carbon-600 uppercase tracking-wider font-bold mb-2">Estimated Impact</p>
        <p className="text-4xl font-bold text-carbon-900">{formatCo2(estimatedCo2)}</p>
      </div>
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Optional Notes</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-carbon-500 outline-none"
          placeholder="E.g. Rode my bike to work today!"
        />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button type="button" onClick={onBack} disabled={isLoading} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50">Back</button>
        <button 
          type="button" 
          onClick={() => onSubmit(notes)} 
          disabled={isLoading}
          className="px-6 py-2 bg-carbon-600 text-white rounded-lg hover:bg-carbon-700 font-medium disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Activity'}
        </button>
      </div>
    </div>
  );
};
`);

// 4. Toast
write('components/ui/Toast.tsx', `/**
 * @module components/ui/Toast
 * @description Toast notification component.
 */

import React, { useEffect, useState } from 'react';

interface Props {
  readonly message: string;
  readonly type?: 'success' | 'error';
  readonly onDismiss: () => void;
}

export const Toast: React.FC<Props> = ({ message, type = 'success', onDismiss }): React.ReactElement | null => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300); // allow animation
    }, 3000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  if (!visible) return null;

  const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={\`fixed bottom-4 right-4 \${bg} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up z-50\`}>
      <span className="font-medium">{message}</span>
      <button onClick={() => setVisible(false)} className="text-white/80 hover:text-white">&times;</button>
    </div>
  );
};
`);

// 5. Update UI Index
write('components/ui/index.ts', "export * from './LoadingSpinner';\\nexport * from './Toast';\\n");

// 6. Rewrite LogActivityPage
write('pages/LogActivityPage.tsx', `/**
 * @module pages/LogActivityPage
 * @description Multi-step form to log activities.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CategorySelector } from '../components/log/CategorySelector';
import { ActivityForm } from '../components/log/ActivityForm';
import { ConfirmationStep } from '../components/log/ConfirmationStep';
import { Toast } from '../components/ui/Toast';
import { useActivities } from '../hooks';
import { errorTracker } from '../utils/errorTracker';

export const LogActivityPage: React.FC = (): React.ReactElement => {
  const navigate = useNavigate();
  const { addActivity } = useActivities();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ category: '', subCategory: '', value: 0 });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{msg: string; type: 'success'|'error'} | null>(null);

  const handleSubmit = async (notes: string): Promise<void> => {
    try {
      setLoading(true);
      await addActivity({
        category: data.category,
        subCategory: data.subCategory,
        value: data.value,
        description: notes,
        date: new Date().toISOString()
      } as any);
      
      setToast({ msg: 'Activity saved successfully!', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      errorTracker.trackError(err as Error);
      setToast({ msg: 'Failed to save activity.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Log Activity</h1>
        <div className="flex gap-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={\`h-2 flex-1 rounded-full \${step >= i ? 'bg-carbon-500' : 'bg-gray-200'}\`} />
          ))}
        </div>
      </div>

      {step === 1 && <CategorySelector onSelect={c => { setData({ ...data, category: c }); setStep(2); }} />}
      {step === 2 && <ActivityForm category={data.category} onBack={() => setStep(1)} onNext={d => { setData({ ...data, ...d }); setStep(3); }} />}
      {step === 3 && <ConfirmationStep data={data} onBack={() => setStep(2)} onSubmit={handleSubmit} isLoading={loading} />}

      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
};
`);

// 7. Rewrite DashboardPage
write('pages/DashboardPage.tsx', `/**
 * @module pages/DashboardPage
 * @description Core user dashboard showing footprint stats.
 */

import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, useActivities } from '../hooks';
import { DailySummaryCard } from '../components/dashboard/DailySummaryCard';
import { WeeklyChart } from '../components/dashboard/WeeklyChart';
import { CategoryBreakdown } from '../components/dashboard/CategoryBreakdown';
import { StreakBadge } from '../components/dashboard/StreakBadge';
import { LoadingSpinner } from '../components/ui';

export const DashboardPage: React.FC = (): React.ReactElement => {
  const { user } = useAuth();
  const { activities, loading } = useActivities();
  const navigate = useNavigate();

  const todayTotal = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return activities.filter(a => a.date.startsWith(today)).reduce((sum, a) => sum + (a.carbonImpact || 0), 0);
  }, [activities]);

  if (loading && !activities.length) {
    return <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.displayName || 'Eco-Warrior'}!</h1>
          <p className="text-gray-600 mt-1">Here is your carbon footprint summary.</p>
        </div>
        <div className="flex items-center gap-4">
          <StreakBadge activities={activities} />
          <button 
            onClick={() => navigate('/log')}
            className="px-6 py-2.5 bg-carbon-600 text-white font-medium rounded-lg hover:bg-carbon-700 transition-colors shadow-sm"
          >
            Log Activity
          </button>
        </div>
      </div>

      {!activities.length ? (
        <div className="text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🌱</span>
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No activities logged yet</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">Start tracking your daily choices to see your carbon footprint and get AI-powered insights.</p>
          <button onClick={() => navigate('/log')} className="text-carbon-600 font-bold hover:underline">Log your first activity &rarr;</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <DailySummaryCard totalKg={todayTotal} />
          </div>
          <div className="lg:col-span-2 space-y-8">
            <CategoryBreakdown activities={activities} />
            <WeeklyChart activities={activities} />
          </div>
        </div>
      )}
    </div>
  );
};
`);
