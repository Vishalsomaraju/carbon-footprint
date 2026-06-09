/**
 * @module services/geminiService
 * @description Gemini AI integration for personalized carbon reduction insights.
 * Uses the Gemini REST API directly (no SDK dependency).
 */
import { env } from '../lib/env';
import { trackError, trackEvent } from '../utils/errorTracker';
import { GEMINI_MODEL } from '../constants';
import type { ActivityRecord, InsightMessage } from '../types';

const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeminiResponse {
  candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
}

async function callGemini(prompt: string): Promise<string> {
  const response = await fetch(`${GEMINI_API_URL}?key=${env.GEMINI_API_KEY}`, {
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
  if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
  const data = await response.json() as GeminiResponse;
  return data.candidates[0]?.content.parts[0]?.text ?? '';
}

export async function generateWeeklyInsights(activities: ActivityRecord[]): Promise<InsightMessage[]> {
  try {
    const summary = activities.reduce((acc, a) => {
      acc[a.category] = (acc[a.category] ?? 0) + a.carbonImpact;
      return acc;
    }, {} as Record<string, number>);

    const prompt = `You are a carbon footprint advisor. A user's activity summary for the past week (in kg CO2):
Transport: ${(summary['transport'] ?? 0).toFixed(2)} kg
Food: ${(summary['food'] ?? 0).toFixed(2)} kg
Energy: ${(summary['energy'] ?? 0).toFixed(2)} kg
Shopping: ${(summary['shopping'] ?? 0).toFixed(2)} kg
Total: ${Object.values(summary).reduce((a, b) => a + b, 0).toFixed(2)} kg

Provide exactly 3 actionable, specific tips to reduce their carbon footprint. Focus on their highest-emission category.
Format your response as JSON array: [{"title": "...", "body": "...", "category": "transport|food|energy|shopping|general", "type": "tip|warning"}]
Return ONLY the JSON array, no other text.`;

    const text = await callGemini(prompt);
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean) as Array<{ title: string; body: string; category: string; type: string }>;

    trackEvent('gemini_insights_generated', { activity_count: activities.length });

    return parsed.map((item, i) => ({
      id: `insight_${Date.now()}_${i}`,
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
    const prompt = `You are CarbonWise AI, a friendly carbon footprint reduction assistant. 
Context about the user: ${context}
User question: ${userMessage}
Give a helpful, specific, actionable response in 2-3 sentences. Focus on practical steps.`;
    const response = await callGemini(prompt);
    trackEvent('gemini_chat_message');
    return response;
  } catch (error) {
    trackError(error as Error, 'getReductionChat');
    throw error;
  }
}
