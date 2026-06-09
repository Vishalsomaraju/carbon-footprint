/**
 * @module pages/ProfilePage
 */

import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const ProfilePage = (): React.ReactElement => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Preferences</h2>
        <p className="text-gray-600 mb-4">Manage your application preferences and data here.</p>
        <Button variant="danger">Delete Account Data</Button>
      </Card>
    </div>
  );
};
