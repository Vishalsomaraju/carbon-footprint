/**
 * @module pages/LandingPage
 * @description Public landing and sign-in page with features overview
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks';
import { trackError } from '../utils/errorTracker';
import { Button } from '../components/ui/Button';
import { GoogleIcon } from '../components/ui';
import { FeatureCard } from '../components/landing/FeatureCard';

/**
 * LandingPage component
 * Displays the marketing copy, feature cards, and Google Sign-in button.
 * Automatically redirects authenticated users to the dashboard.
 * @returns {import('react').ReactElement} The landing page UI
 */

export const LandingPage: React.FC = (): import('react').ReactElement => {
  const { login, user, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleLogin = async (): Promise<void> => {
    try {
      await login();
    } catch (err: unknown) {
      trackError(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 
          className="text-4xl md:text-6xl font-extrabold mb-6 max-w-4xl tracking-tight"
          style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
        >
          Understand your impact. Start reducing it today.
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-12">
          Track your carbon footprint across transport, food, energy, and shopping. 
          Get AI-powered insights tailored to your lifestyle.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Button
            onClick={handleLogin}
            disabled={loading}
            className="bg-green-600 hover:bg-green-500 text-white rounded-xl px-8 py-4 text-lg font-semibold flex items-center gap-3 transition-colors disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <GoogleIcon className="w-6 h-6" />
            )}
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>

          {error && (
            <div className="text-red-400 bg-red-400/10 px-4 py-3 rounded-lg max-w-md text-sm border border-red-400/20">
              {error.message || 'Failed to sign in with Google. Please check your console.'}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full text-left">
          <FeatureCard 
            title="Track Daily Activities"
            icon="monitoring"
          />
          <FeatureCard 
            title="AI Personalized Insights"
            icon="query_stats"
          />
          <FeatureCard 
            title="Commute Calculator"
            icon="electric_car"
          />
        </div>
      </main>

      <footer className="p-6 text-center text-slate-500 text-sm border-t border-slate-900 mt-auto">
        Carbon data based on IPCC and UK DESNZ emission factors
      </footer>
    </div>
  );
};
