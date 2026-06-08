/**
 * @module services/geminiService
 */

import { ActivityRecord, Insight } from '../types';
import { env } from '../lib/env';

export const geminiService = {
  generateInsights: async (activities: ActivityRecord[]): Promise<Insight[]> => {
    if (!env.GEMINI_API_KEY) {
      console.warn("Gemini API key is not configured.");
      return [
        { id: '1', category: 'general', text: 'Reduce your meat consumption to significantly lower your carbon footprint.' },
        { id: '2', category: 'transport', text: 'Consider taking public transport or biking for short trips.' }
      ];
    }

    try {
      const payload = {
        contents: [{
          parts: [{
            text: `Analyze these carbon footprint activities and provide 3 actionable, highly personalized tips to reduce their footprint. Return ONLY a JSON array of objects with "category" and "text". Activities: ${JSON.stringify(activities)}`
          }]
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
        id: `insight-${i}`,
        category: item.category || 'general',
        text: item.text || item
      }));
    } catch (error) {
      console.error("Error generating insights with Gemini:", error);
      throw error;
    }
  }
};
