const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.join('src', p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
};

// 1. geminiService.ts
write('services/geminiService.ts', `/**
 * @module services/geminiService
 * @description Gemini AI integration for personalized carbon reduction insights.
 * Uses the Gemini REST API directly (no SDK dependency).
 */
import { env } from '../lib/env';
import { trackError, trackEvent } from '../utils/errorTracker';
import { GEMINI_MODEL } from '../constants';
import type { ActivityRecord, InsightMessage } from '../types';

const GEMINI_API_URL = \`https://generativelanguage.googleapis.com/v1beta/models/\${GEMINI_MODEL}:generateContent\`;

interface GeminiResponse {
  candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
}

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(\`\${GEMINI_API_URL}?key=\${env.GEMINI_API_KEY}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
      safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }),
  });
  if (!response.ok) throw new Error(\`Gemini API error: \${response.status}\`);
  const data = await response.json() as GeminiResponse;
  return data.candidates[0]?.content.parts[0]?.text ?? '';
}

export async function generateWeeklyInsights(activities: ActivityRecord[]): Promise<InsightMessage[]> {
  try {
    const summary = activities.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] ?? 0) + a.carbonImpact;
      return acc;
    }, {} as Record<string, number>);

    const prompt = \`You are a carbon footprint advisor. A user's activity summary for the past week (in kg CO2):
Transport: \${(summary['transport'] ?? 0).toFixed(2)} kg
Food: \${(summary['food'] ?? 0).toFixed(2)} kg
Energy: \${(summary['energy'] ?? 0).toFixed(2)} kg
Shopping: \${(summary['shopping'] ?? 0).toFixed(2)} kg
Total: \${Object.values(summary).reduce((a, b) => a + b, 0).toFixed(2)} kg

Provide exactly 3 actionable, specific tips to reduce their carbon footprint. Focus on their highest-emission category.
Format your response as JSON array: [{"title": "...", "body": "...", "category": "transport|food|energy|shopping|general", "type": "tip|warning"}]
Return ONLY the JSON array, no other text.\`;

    const text = await callGemini(prompt);
    const clean = text.replace(/\`\`\`json|\`\`\`/g, '').trim();
    const parsed = JSON.parse(clean) as Array<{ title: string; body: string; category: string; type: string }>;

    trackEvent('gemini_insights_generated', { activity_count: activities.length });

    return parsed.map((item, i) => ({
      id: \`insight_\${Date.now()}_\${i}\`,
      type: (item.type as InsightMessage['type']) || 'tip',
      title: item.title,
      body: item.body,
      category: item.category as InsightMessage['category'],
      generatedAt: Date.now(),
    }));
  } catch (error) {
    trackError(error as Error, 'generateWeeklyInsights');
    throw error;
  }
}

export async function getReductionChat(userMessage: string, context: string): Promise<string> {
  try {
    const prompt = \`You are CarbonWise AI, a friendly carbon footprint reduction assistant. 
Context about the user: \${context}
User question: \${userMessage}
Give a helpful, specific, actionable response in 2-3 sentences. Focus on practical steps.\`;
    const response = await callGemini(prompt);
    trackEvent('gemini_chat_message');
    return response;
  } catch (error) {
    trackError(error as Error, 'getReductionChat');
    throw error;
  }
}
`);

// 2. mapsService.ts
write('services/mapsService.ts', `/// <reference types="@types/google.maps" />
/**
 * @module services/mapsService
 * @description Google Maps Distance Matrix API integration for commute emissions.
 */
import { Loader } from '@googlemaps/js-api-loader';
import { env } from '../lib/env';
import { trackError, trackEvent } from '../utils/errorTracker';
import { EMISSION_FACTORS, MAPS_LIBRARIES } from '../constants';

let loaderInstance: Loader | null = null;

function getMapsLoader(): Loader {
  if (!loaderInstance) {
    loaderInstance = new Loader({
      apiKey: env.MAPS_API_KEY,
      version: 'weekly',
      libraries: [...MAPS_LIBRARIES] as any,
    });
  }
  return loaderInstance;
}

export interface CommuteResult {
  readonly distanceKm: number;
  readonly durationMinutes: number;
  readonly origin: string;
  readonly destination: string;
  readonly dailyCo2Kg: number;
  readonly annualCo2Kg: number;
  readonly transportMode: string;
}

export async function calculateCommuteEmissions(
  origin: string,
  destination: string,
  transportMode: keyof typeof EMISSION_FACTORS.transport,
  workDaysPerWeek: number
): Promise<CommuteResult> {
  try {
    const loader = getMapsLoader();
    await loader.load();

    const service = new window.google.maps.DistanceMatrixService();
    const gmMode = transportMode.includes('car') || transportMode === 'motorcycle'
      ? window.google.maps.TravelMode.DRIVING
      : transportMode === 'train' || transportMode === 'bus'
      ? window.google.maps.TravelMode.TRANSIT
      : transportMode === 'cycling'
      ? window.google.maps.TravelMode.BICYCLING
      : window.google.maps.TravelMode.WALKING;

    const result = await service.getDistanceMatrix({
      origins: [origin],
      destinations: [destination],
      travelMode: gmMode,
      unitSystem: window.google.maps.UnitSystem.METRIC,
    });

    const element = result.rows[0]?.elements[0];
    if (!element || element.status !== 'OK') {
      throw new Error('Could not calculate route distance');
    }

    const distanceKm = (element.distance?.value ?? 0) / 1000;
    const durationMinutes = Math.round((element.duration?.value ?? 0) / 60);
    const factor = EMISSION_FACTORS.transport[transportMode as keyof typeof EMISSION_FACTORS.transport] as number;
    const dailyCo2Kg = parseFloat((factor * distanceKm * 2).toFixed(3)); // round trip
    const annualCo2Kg = parseFloat((dailyCo2Kg * workDaysPerWeek * 52).toFixed(2));

    trackEvent('commute_calculated', { transport_mode: transportMode, distance_km: distanceKm });

    return { distanceKm, durationMinutes, origin, destination, dailyCo2Kg, annualCo2Kg, transportMode };
  } catch (error) {
    trackError(error as Error, 'calculateCommuteEmissions');
    throw error;
  }
}
`);

// 3. analytics
write('utils/errorTracker.ts', `/**
 * @module utils/errorTracker
 * @description Shared error and event tracking.
 */
export const trackError = (error: unknown, context?: string): void => {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(\`[ErrorTracker] \${context ? \`(\${context}) \` : ''}\${msg}\`, error);
};

export const trackEvent = (eventName: string, properties?: Record<string, any>): void => {
  console.log(\`[Analytics] \${eventName}\`, properties);
};
`);

// 4. InsightsPage.tsx
write('pages/InsightsPage.tsx', `/**
 * @module pages/InsightsPage
 * @description Displays AI-generated weekly insights and provides a chat assistant.
 */
import React, { useState, useEffect } from 'react';
import { generateWeeklyInsights, getReductionChat } from '../services/geminiService';
import { useActivities } from '../hooks';
import { InsightMessage } from '../types';
import { CATEGORY_COLORS } from '../constants';
import { trackError } from '../utils/errorTracker';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const InsightsPage: React.FC = (): React.ReactElement => {
  const { activities } = useActivities();
  const [insights, setInsights] = useState<InsightMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastGenTime, setLastGenTime] = useState(0);

  const [chatMsg, setChatMsg] = useState('');
  const [chatResp, setChatResp] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await generateWeeklyInsights(activities);
      setInsights(result);
      setLastGenTime(Date.now());
    } catch (err) {
      setError('Failed to load insights. Please try again later.');
      trackError(err, 'fetchInsights UI');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activities.length > 0 && insights.length === 0) {
      fetchInsights();
    } else if (activities.length === 0) {
      setLoading(false);
    }
  }, [activities.length]);

  const handleRegenerate = () => {
    if (Date.now() - lastGenTime < 60000) return;
    fetchInsights();
  };

  const handleChat = async () => {
    if (!chatMsg.trim()) return;
    try {
      setChatLoading(true);
      setChatResp('');
      const context = \`User has \${activities.length} activities logged.\`;
      const response = await getReductionChat(chatMsg, context);
      setChatResp(response);
      setChatMsg('');
    } catch (err) {
      setChatResp('Sorry, I encountered an error. Try again.');
      trackError(err, 'handleChat UI');
    } finally {
      setChatLoading(false);
    }
  };

  const getIcon = (cat: string) => {
    if (cat === 'transport') return '🚗';
    if (cat === 'food') return '🍔';
    if (cat === 'energy') return '⚡';
    if (cat === 'shopping') return '🛍️';
    return '💡';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-1">Personalized advice based on your logs.</p>
        </div>
        <button 
          onClick={handleRegenerate}
          disabled={loading || (Date.now() - lastGenTime < 60000)}
          className="px-4 py-2 bg-carbon-100 text-carbon-700 font-medium rounded-lg hover:bg-carbon-200 disabled:opacity-50"
        >
          Regenerate Insights
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><LoadingSpinner size="lg" /></div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center">
          <p>{error}</p>
          <button onClick={fetchInsights} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">Retry</button>
        </div>
      ) : activities.length === 0 ? (
        <div className="p-6 bg-gray-50 text-gray-600 rounded-xl text-center border border-dashed border-gray-300">
          Log some activities first to get personalized insights!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map(i => (
            <div key={i.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl mb-4" style={{ backgroundColor: CATEGORY_COLORS[i.category as keyof typeof CATEGORY_COLORS] || '#e5e7eb' }}>
                {getIcon(i.category || 'general')}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{i.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed flex-grow">{i.body}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-12">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Ask CarbonWise AI</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={chatMsg}
            onChange={(e) => setChatMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleChat()}
            placeholder="Ask about reducing emissions..."
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-carbon-500 outline-none"
          />
          <button onClick={handleChat} disabled={chatLoading} className="px-6 py-3 bg-carbon-600 text-white rounded-lg hover:bg-carbon-700 disabled:opacity-50 font-medium">
            Send
          </button>
        </div>
        {chatLoading && <div className="p-4"><LoadingSpinner size="sm" /></div>}
        {chatResp && (
          <div className="p-4 bg-carbon-50 rounded-lg border border-carbon-100 text-carbon-800 leading-relaxed">
            {chatResp}
          </div>
        )}
      </div>
    </div>
  );
};
`);

// 5. CommutePage.tsx
write('pages/CommutePage.tsx', `/**
 * @module pages/CommutePage
 * @description Commute emissions calculator using Maps API.
 */
import React, { useState } from 'react';
import { calculateCommuteEmissions, CommuteResult } from '../services/mapsService';
import { EMISSION_FACTORS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useActivities } from '../hooks';
import { trackError } from '../utils/errorTracker';
import { Toast } from '../components/ui/Toast';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

export const CommutePage: React.FC = (): React.ReactElement => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [mode, setMode] = useState<keyof typeof EMISSION_FACTORS.transport>('car_petrol_per_km');
  const [days, setDays] = useState(5);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CommuteResult | null>(null);
  const [error, setError] = useState('');
  
  const { addActivity } = useActivities();
  const [toast, setToast] = useState<{msg: string, type: 'success'|'error'} | null>(null);
  const [logLoading, setLogLoading] = useState(false);

  const handleCalculate = async () => {
    if (!origin || !destination) return setError('Please enter origin and destination');
    try {
      setLoading(true);
      setError('');
      const res = await calculateCommuteEmissions(origin, destination, mode, days);
      setResult(res);
    } catch (err) {
      setError('Could not calculate commute. Please check the locations.');
      trackError(err, 'handleCalculate');
    } finally {
      setLoading(false);
    }
  };

  const handleLog = async () => {
    if (!result) return;
    try {
      setLogLoading(true);
      await addActivity({
        category: 'transport',
        subCategory: mode,
        value: result.distanceKm * 2, // round trip
        description: \`Commute: \${origin} to \${destination}\`,
        date: new Date().toISOString()
      });
      setToast({ msg: 'Commute logged successfully!', type: 'success' });
    } catch (err) {
      setToast({ msg: 'Failed to log commute.', type: 'error' });
      trackError(err, 'handleLog');
    } finally {
      setLogLoading(false);
    }
  };

  // Generate comparison chart data
  const chartData = result ? Object.entries(EMISSION_FACTORS.transport).map(([key, factor]) => {
    return {
      name: key.replace('_per_km', '').replace('_', ' '),
      value: factor * result.distanceKm * 2 * days * 52, // Annual kg
      rawKey: key
    };
  }).sort((a, b) => b.value - a.value) : [];

  const bestAlternative = chartData.find(d => d.value < (result?.annualCo2Kg || 0));
  const savings = bestAlternative ? (result!.annualCo2Kg - bestAlternative.value) : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Commute Calculator</h1>
        <p className="text-gray-600 mt-1">Estimate your daily and annual commute emissions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4 h-fit">
          <div>
            <label htmlFor="origin" className="block text-sm font-medium text-gray-700 mb-1">Origin (Home)</label>
            <input id="origin" value={origin} onChange={e => setOrigin(e.target.value)} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-carbon-500" placeholder="e.g. 123 Main St" />
          </div>
          <div>
            <label htmlFor="dest" className="block text-sm font-medium text-gray-700 mb-1">Destination (Work)</label>
            <input id="dest" value={destination} onChange={e => setDestination(e.target.value)} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-carbon-500" placeholder="e.g. 456 Office Blvd" />
          </div>
          <div>
            <label htmlFor="mode" className="block text-sm font-medium text-gray-700 mb-1">Transport Mode</label>
            <select id="mode" value={mode} onChange={e => setMode(e.target.value as any)} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-carbon-500">
              {Object.keys(EMISSION_FACTORS.transport).map(k => (
                <option key={k} value={k}>{k.replace('_per_km', '').replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-1">Work Days / Week</label>
            <input id="days" type="number" min="1" max="7" value={days} onChange={e => setDays(Number(e.target.value))} className="w-full p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-carbon-500" />
          </div>
          
          {error && <div role="alert" className="text-red-600 text-sm mt-2">{error}</div>}
          
          <button onClick={handleCalculate} disabled={loading} className="w-full py-3 mt-4 bg-carbon-600 text-white rounded-lg font-medium hover:bg-carbon-700 disabled:opacity-50">
            {loading ? 'Calculating...' : 'Calculate'}
          </button>
        </div>

        {result && (
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm uppercase tracking-wider font-bold mb-1">Daily Co2</p>
                <p className="text-3xl font-bold text-gray-900">{result.dailyCo2Kg.toFixed(1)} <span className="text-lg font-normal text-gray-500">kg</span></p>
                <p className="text-sm text-gray-500 mt-2">{result.distanceKm.toFixed(1)} km &bull; {result.durationMinutes} mins</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 text-sm uppercase tracking-wider font-bold mb-1">Annual Co2</p>
                <p className="text-3xl font-bold text-gray-900">{result.annualCo2Kg.toFixed(0)} <span className="text-lg font-normal text-gray-500">kg</span></p>
                <p className="text-sm text-gray-500 mt-2">Requires ~{(result.annualCo2Kg / 21).toFixed(0)} trees to offset</p>
              </div>
            </div>

            {bestAlternative && savings > 10 && (
              <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                <p className="text-green-800">
                  <span className="font-bold">💡 Tip:</span> If you switched to <strong>{bestAlternative.name}</strong>, you'd save <strong>{savings.toFixed(0)} kg</strong> of CO2 per year!
                </p>
              </div>
            )}

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-80 flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Annual Emissions by Mode</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563' }} width={90} />
                    <Tooltip cursor={{ fill: '#f9fafb' }} formatter={(val: number) => [val.toFixed(0) + ' kg', 'Annual CO2']} />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                      {chartData.map((entry, index) => (
                        <Cell key={\`cell-\${index}\`} fill={entry.rawKey === mode ? '#10b981' : '#e5e7eb'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="flex justify-end">
              <button onClick={handleLog} disabled={logLoading} className="px-6 py-3 bg-carbon-600 text-white rounded-lg font-medium hover:bg-carbon-700 disabled:opacity-50 flex items-center gap-2">
                {logLoading ? <LoadingSpinner size="sm" /> : null} Log This Commute
              </button>
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast.msg} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
};
`);

// 6. Delete old useGeminiInsights.ts to prevent duplicate clashes, we use geminiService
if (fs.existsSync('src/hooks/useGeminiInsights.ts')) {
  fs.rmSync('src/hooks/useGeminiInsights.ts');
}
if (fs.existsSync('src/test/hooks/useGeminiInsights.test.ts')) {
  fs.rmSync('src/test/hooks/useGeminiInsights.test.ts');
}
// Clean up old files to avoid tsc errors
if (fs.existsSync('src/components/features/FootprintChart.tsx')) fs.rmSync('src/components/features/FootprintChart.tsx');
if (fs.existsSync('src/components/features/ActivityForm.tsx')) fs.rmSync('src/components/features/ActivityForm.tsx');
if (fs.existsSync('src/components/features/InsightCard.tsx')) fs.rmSync('src/components/features/InsightCard.tsx');
if (fs.existsSync('src/components/features/CategorySelect.tsx')) fs.rmSync('src/components/features/CategorySelect.tsx');
if (fs.existsSync('src/components/features/ChatSection.tsx')) fs.rmSync('src/components/features/ChatSection.tsx');
if (fs.existsSync('src/hooks/useCommute.ts')) fs.rmSync('src/hooks/useCommute.ts');
