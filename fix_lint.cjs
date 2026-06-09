const fs = require('fs');

function fixLint(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  
  // Replace (someVar as any) with (someVar as unknown as import('vitest').Mock)
  content = content.replace(/\(useAuth as any\)/g, "(useAuth as unknown as import('vitest').Mock)");
  content = content.replace(/\(useNavigate as any\)/g, "(useNavigate as unknown as import('vitest').Mock)");
  
  // Replace generic `as any` with `as unknown` or ignore it via eslint
  content = content.replace(/as any\)/g, "as unknown)");
  content = content.replace(/as any;/g, "as unknown;");
  content = content.replace(/as any\]\)/g, "as unknown[])");
  
  // Replace prop 'any' in mocks
  content = content.replace(/: any\)/g, ": Record<string, unknown>)");
  content = content.replace(/as any,/g, "as unknown,");
  
  // other instances of any
  content = content.replace(/import\('react'\).ReactElement/g, "import('react').ReactElement");
  
  fs.writeFileSync(path, content);
}

const testFiles = [
  'src/test/features/FootprintChart.test.tsx',
  'src/test/hooks/useActivities.test.ts',
  'src/test/hooks/useAuth.test.ts',
  'src/test/layouts/AppLayout.test.tsx',
  'src/test/pages/LandingPage.test.tsx',
  'src/test/services/activityService.test.ts',
  'src/test/services/authService.test.ts',
  'src/test/services/geminiService.test.ts'
];

testFiles.forEach(fixLint);

// Fix FootprintChart.tsx
let chart = fs.readFileSync('src/components/features/FootprintChart.tsx', 'utf8');
chart = chart.replace(/\(a: any, b: any\)/g, "(a: Record<string, unknown>, b: Record<string, unknown>)");
chart = chart.replace(/as any\[\]/g, "as Record<string, unknown>[]");
fs.writeFileSync('src/components/features/FootprintChart.tsx', chart);

// Fix useActivities.ts
let useAct = fs.readFileSync('src/hooks/useActivities.ts', 'utf8');
useAct = useAct.replace(/activities: any\[\]/g, "activities: import('../types').ActivityEntry[]");
useAct = useAct.replace(/addActivity: \(data: any\)/g, "addActivity: (data: Omit<import('../types').ActivityEntry, 'id' | 'co2Kg' | 'timestamp'>)");
fs.writeFileSync('src/hooks/useActivities.ts', useAct);

// Fix useActivities.ts imports
let useAct2 = fs.readFileSync('src/hooks/useActivities.ts', 'utf8');
useAct2 = useAct2.replace("import { useState, useEffect, useCallback } from 'react';", "import { useState, useEffect, useCallback } from 'react';\nimport { ActivityEntry } from '../types';");
fs.writeFileSync('src/hooks/useActivities.ts', useAct2);
