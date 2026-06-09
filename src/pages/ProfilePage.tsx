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
    const confirm = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.',
    );
    if (confirm) {
      trackEvent('account_deleted_requested');
      alert('Delete requested. You will be signed out.');
      handleSignOut();
    }
  };

  if (!user) return <div />;

  return (
    <div className="flex-1 overflow-y-auto p-gutter-md lg:p-8">
      <div className="max-w-2xl mx-auto space-y-8 pb-20">
        <div className="bg-charcoal-core p-6 rounded-2xl border border-whisper-border shadow-sm flex items-center gap-6">
          <img
            src={user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.uid}
            alt="Avatar"
            className="w-20 h-20 rounded-full border-2 border-surface-container-high"
          />
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">{user.displayName || 'Eco Warrior'}</h1>
            <p className="font-body-md text-body-md text-muted-steel">{user.email}</p>
          </div>
        </div>

        <StatsSection />

        <GoalSlider userId={user.uid} />

        <div className="bg-charcoal-core p-6 rounded-2xl border border-whisper-border shadow-sm space-y-4">
          <h3 className="font-bold text-on-surface mb-2">Account Settings</h3>
          <button
            onClick={handleSignOut}
            className="w-full py-3 text-on-surface bg-surface-container-high font-medium rounded-lg hover:bg-surface-variant transition-colors"
          >
            Sign Out
          </button>
          <button
            onClick={handleDeleteAccount}
            className="w-full py-3 text-critical-crimson bg-critical-crimson/10 font-medium rounded-lg hover:bg-critical-crimson/20 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
