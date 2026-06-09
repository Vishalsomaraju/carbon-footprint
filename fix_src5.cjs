const fs = require('fs');

function replaceFile(path, regex, replacement) {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(regex, replacement);
    fs.writeFileSync(path, content);
  }
}

// CategorySelect
replaceFile('src/components/features/CategorySelect.tsx', /export const CategorySelect: React.FC<Props> = \({ value, onChange, error, className = '' }\) => {/, "export const CategorySelect: React.FC<Props> = ({ value, onChange, error, className = '' }): import('react').ReactElement => {");
replaceFile('src/components/features/CategorySelect.tsx', /import React from 'react';/, "import React, { JSX } from 'react';");

// FootprintChart
replaceFile('src/components/features/FootprintChart.tsx', /\(a: \{ date: string; \}, b: \{ date: string; \}\) =>/g, "(a: any, b: any) =>");
replaceFile('src/components/features/FootprintChart.tsx', /const dateA = new Date\(a.date\);/g, "const dateA = new Date(a?.date || '');");
replaceFile('src/components/features/FootprintChart.tsx', /Object.values\(grouped\).sort\(/g, "(Object.values(grouped) as any[]).sort(");

// useActivities
replaceFile('src/hooks/useActivities.ts', /export const useActivities = \(\): UseActivitiesReturn => {/, "export interface UseActivitiesReturn { activities: any[]; loading: boolean; error: Error | null; addActivity: (data: any) => Promise<void>; }\nexport const useActivities = (): UseActivitiesReturn => {");
replaceFile('src/hooks/useActivities.ts', /setError\(err\);/g, "setError(err as Error);");

// useAuth
replaceFile('src/hooks/useAuth.ts', /import { useState, useEffect } from 'react';/, "import { useState, useEffect } from 'react';\nimport { User } from 'firebase/auth';");
replaceFile('src/hooks/useAuth.ts', /const signInWithGoogle = async \(\): Promise<void> => {/g, "const signInWithGoogle = async (): Promise<User> => {");

// Tests
replaceFile('src/test/features/FootprintChart.test.tsx', /\{ children \}: unknown/g, "{ children }: { children?: import('react').ReactNode }");
replaceFile('src/test/pages/AuthPage.test.tsx', /\{ children, onClick, isLoading \}: unknown/g, "{ children, onClick, isLoading }: any");
replaceFile('src/test/pages/AuthPage.test.tsx', /\{ children \}: unknown/g, "{ children }: any");
replaceFile('src/test/services/geminiService.test.ts', /as unknown\[\]\);/g, "as any[]);");

