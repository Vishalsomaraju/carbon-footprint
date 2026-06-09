const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.join(process.cwd(), p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
};

// 1. firebase.json
write('firebase.json', `{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }],
    "headers": [
      {
        "source": "**",
        "headers": [
          { "key": "X-Content-Type-Options", "value": "nosniff" },
          { "key": "X-Frame-Options", "value": "DENY" },
          { "key": "X-XSS-Protection", "value": "1; mode=block" },
          { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
          { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(self)" },
          { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
          { "key": "Content-Security-Policy", "value": "default-src 'self'; script-src 'self' 'unsafe-inline' https://maps.googleapis.com https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://generativelanguage.googleapis.com; frame-src 'none'" },
          { "key": "Cache-Control", "value": "no-cache" }
        ]
      },
      {
        "source": "**/*.@(js|css|woff2)",
        "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
      }
    ]
  }
}
`);

// 2. firestore.rules
write('firestore.rules', `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /activities/{activityId} {
      allow read, write: if request.auth != null && (resource == null || request.auth.uid == resource.data.userId);
    }
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
`);

// 3. Profile components
write('src/components/profile/GoalSlider.tsx', `/**
 * @module components/profile/GoalSlider
 */
import React, { useState, useEffect } from 'react';
import { doc, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config';
import { trackError, trackEvent } from '../../utils/errorTracker';

interface GoalSliderProps {
  userId: string;
}

export const GoalSlider: React.FC<GoalSliderProps> = ({ userId }): React.ReactElement => {
  const [goal, setGoal] = useState<number>(50);
  const [loading, setLoading] = useState(true);

  useEffect((): void => {
    const fetchGoal = async (): Promise<void> => {
      try {
        const d = await getDoc(doc(db, 'users', userId));
        if (d.exists() && d.data().weeklyGoalKg) setGoal(d.data().weeklyGoalKg);
      } catch (err: unknown) {
        trackError(err, 'GoalSlider.fetchGoal');
      } finally {
        setLoading(false);
      }
    };
    fetchGoal();
  }, [userId]);

  const handleSave = async (newGoal: number): Promise<void> => {
    try {
      const ref = doc(db, 'users', userId);
      const d = await getDoc(ref);
      if (d.exists()) await updateDoc(ref, { weeklyGoalKg: newGoal });
      else await setDoc(ref, { id: userId, weeklyGoalKg: newGoal, createdAt: Date.now() });
      trackEvent('goal_updated', { newGoal });
    } catch (err: unknown) {
      trackError(err, 'GoalSlider.handleSave');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <h3 className="font-bold text-gray-900 mb-2">Weekly Target (kg CO2)</h3>
      {loading ? <div className="h-6 w-1/2 bg-gray-200 animate-pulse rounded" /> : (
        <>
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-500 text-sm">20 kg</span>
            <span className="font-bold text-2xl text-carbon-600">{goal} kg</span>
            <span className="text-gray-500 text-sm">150 kg</span>
          </div>
          <input type="range" min="20" max="150" value={goal}
            onChange={(e): void => setGoal(Number(e.target.value))}
            onMouseUp={(): Promise<void> => handleSave(goal)}
            onTouchEnd={(): Promise<void> => handleSave(goal)}
            className="w-full accent-carbon-600 cursor-pointer"
          />
        </>
      )}
    </div>
  );
};
`);

write('src/components/profile/StatsSection.tsx', `/**
 * @module components/profile/StatsSection
 */
import React from 'react';
import { useActivities } from '../../hooks';

export const StatsSection: React.FC = (): React.ReactElement => {
  const { activities } = useActivities();
  const totalCo2 = activities.reduce((sum, a) => sum + a.carbonImpact, 0);

  let streak = 0;
  const days = new Set(activities.map(a => new Date(a.date).toISOString().split('T')[0])).size;
  if (days > 0) streak = days; // Simplified streak calculation for display

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
        <p className="text-sm text-gray-500 font-medium">Activities</p>
        <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
      </div>
      <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
        <p className="text-sm text-gray-500 font-medium">Total CO2</p>
        <p className="text-2xl font-bold text-gray-900">{totalCo2.toFixed(1)} <span className="text-sm">kg</span></p>
      </div>
      <div className="bg-white p-4 rounded-xl border shadow-sm text-center">
        <p className="text-sm text-gray-500 font-medium">Streak</p>
        <p className="text-2xl font-bold text-orange-500">{streak} 🔥</p>
      </div>
    </div>
  );
};
`);

write('src/pages/ProfilePage.tsx', `/**
 * @module pages/ProfilePage
 */
import React from 'react';
import { useAuth } from '../hooks';
import { GoalSlider } from '../components/profile/GoalSlider';
import { StatsSection } from '../components/profile/StatsSection';
import { trackEvent } from '../utils/errorTracker';

export const ProfilePage: React.FC = (): React.ReactElement => {
  const { user, logout } = useAuth();

  const handleSignOut = async (): Promise<void> => {
    try {
      await logout();
    } catch (err: unknown) {
      console.error(err);
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
`);
