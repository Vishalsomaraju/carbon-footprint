/**
 * @module services/geminiService
 */

import { ActivityRecord, InsightMessage } from '../types';
import { env } from '../lib/env';

export const geminiService = {
  generateWeeklyInsights: async (activities: ActivityRecord[]): Promise<InsightMessage[]> => {
    if (!env.GEMINI_API_KEY) {
      console.warn("Gemini API key is not configured.");
      return [
        { id: '1', type: 'tip', title: 'Eat less meat', body: 'Reduce your meat consumption to significantly lower your carbon footprint.', category: 'food', generatedAt: Date.now() },
        { id: '2', type: 'tip', title: 'Use public transport', body: 'Consider taking public transport or biking for short trips.', category: 'transport', generatedAt: Date.now() }
      ];
    }

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

      const payload = {
        contents: [{
          parts: [{ text: prompt }]
        }]
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) return [];

      const cleanJson = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);
      
      return parsed.map((item: any, i: number) => ({
        id: `insight_${Date.now()}_${i}`,
        type: item.type || 'tip',
        title: item.title || 'Tip',
        body: item.body || item.text || item,
        category: item.category || 'general',
        generatedAt: Date.now()
      }));
    } catch (error) {
      console.error("Error generating insights with Gemini:", error);
      throw error;
    }
  },

  getReductionChat: async (userMessage: string, context: string): Promise<string> => {
    if (!env.GEMINI_API_KEY) {
       return "Gemini API key is missing. I'm a fallback bot: " + userMessage;
    }

    try {
      const prompt = `You are CarbonWise AI, a friendly carbon footprint reduction assistant. 
Context about the user: ${context}
User question: ${userMessage}
Give a helpful, specific, actionable response in 2-3 sentences. Focus on practical steps.`;

      const payload = {
        contents: [{
          parts: [{ text: prompt }]
        }]
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return textResponse || 'No response generated.';
    } catch (error) {
      console.error("Error in getReductionChat:", error);
      throw error;
    }
  }
};
