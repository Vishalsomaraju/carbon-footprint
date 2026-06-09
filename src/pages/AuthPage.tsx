/**
 * @module pages/AuthPage
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks';
import { Card, Button, LoadingSpinner, GoogleIcon } from '../components/ui';

export const AuthPage: React.FC = (): React.ReactElement => {
  const { login, user, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async (): Promise<void> => {
    try {
      await login();
      // user will navigate due to useEffect
    } catch (err) {
      // error is handled in hook
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full space-y-8 p-8 text-center">
        <div>
          <span className="text-6xl mb-4 block">🌍</span>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to EcoTrack
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Track and reduce your carbon footprint starting today.
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error.message || 'Failed to authenticate. Please try again.'}
          </div>
        )}

        <Button 
          onClick={handleLogin} 
          className="w-full flex items-center justify-center gap-2"
          variant="secondary"
          size="lg"
        >
          <GoogleIcon className="w-5 h-5" />
          Continue with Google
        </Button>
      </Card>
    </div>
  );
};
