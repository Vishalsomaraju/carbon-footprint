/**
 * @module pages/LandingPage
 * @description Public landing and sign-in page with features overview
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks';
import { Button } from '../components/ui/Button';
import { GoogleIcon } from '../components/ui';

export const LandingPage: React.FC = (): import('react').ReactElement => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleLogin = async (): Promise<void> => {
    try {
      await login();
    } catch (err) {
      // Error is handled and tracked in hook
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl w-full text-left">
          <FeatureCard 
            title="Track Daily Activities"
            icon="📊"
          />
          <FeatureCard 
            title="AI Personalized Insights"
            icon="✨"
          />
          <FeatureCard 
            title="Commute Calculator"
            icon="🚗"
          />
        </div>
      </main>

      <footer className="p-6 text-center text-slate-500 text-sm border-t border-slate-900 mt-auto">
        Carbon data based on IPCC and UK DESNZ emission factors
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ title: string; icon: string }> = ({ title, icon }): import('react').ReactElement => (
  <div className="bg-slate-900 rounded-2xl p-6 flex flex-col gap-4 border border-slate-800">
    <div className="text-3xl text-green-500 bg-slate-950 w-12 h-12 flex items-center justify-center rounded-xl">
      {icon}
    </div>
    <h3 className="text-xl font-bold">{title}</h3>
  </div>
);
