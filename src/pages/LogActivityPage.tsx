/**
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
import { trackError } from '../utils/errorTracker';

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
      trackError(err as Error);
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
            <div key={i} className={`h-2 flex-1 rounded-full ${step >= i ? 'bg-carbon-500' : 'bg-gray-200'}`} />
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
