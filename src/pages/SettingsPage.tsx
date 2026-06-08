/**
 * @module pages/SettingsPage
 */

import React from 'react';

import { Card, Button } from '../components/ui';

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <p className="text-gray-600 mb-4">Manage your application preferences and data here.</p>
        <Button variant="danger">Delete Account Data</Button>
      </Card>
    </div>
  );
};
