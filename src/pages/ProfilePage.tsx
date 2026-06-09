/**
 * @module pages/ProfilePage
 */
import React from 'react';

import { useAuth } from '../hooks';
import { GoalSlider } from '../components/profile/GoalSlider';
import { StatsSection } from '../components/profile/StatsSection';
import { trackEvent, trackError } from '../utils/errorTracker';

export const ProfilePage: React.FC = (): React.ReactElement => {
  const { user, logout } = useAuth();

  const handleSignOut = async (): Promise<void> => {
    try {
      await logout();
    } catch (err: unknown) {
      trackError(err);
    }
  };

  const handleDeleteAccount = (): void => {
    const confirm = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirm) {
      trackEvent('account_deleted_requested');
      alert('Delete requested. You will be signed out.');
      handleSignOut();
    }
  };

  if (!user) return <div />;

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center gap-6">
        <img 
          src={user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.uid} 
          alt="Avatar" 
          className="w-20 h-20 rounded-full border-2 border-carbon-100"
        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.displayName || 'Eco Warrior'}</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
      </div>

      <StatsSection />
      
      <GoalSlider userId={user.uid} />

      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 mb-2">Account Settings</h3>
        <button 
          onClick={handleSignOut}
          className="w-full py-3 text-carbon-700 bg-carbon-50 font-medium rounded-lg hover:bg-carbon-100 transition-colors"
        >
          Sign Out
        </button>
        <button 
          onClick={handleDeleteAccount}
          className="w-full py-3 text-red-600 bg-red-50 font-medium rounded-lg hover:bg-red-100 transition-colors"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};
