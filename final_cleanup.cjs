const fs = require('fs');

// 1. Fix src/components/ui/index.ts
fs.writeFileSync('src/components/ui/index.ts', `
export * from './Button';
export * from './Card';
export * from './ErrorBoundary';
export * from './FormField';
export * from './Input';
export * from './LoadingSpinner';
export * from './Toast';
export * from './icons';
`);

// 2. Fix src/pages/LogActivityPage.tsx
let logPage = fs.readFileSync('src/pages/LogActivityPage.tsx', 'utf8');
logPage = logPage.replace("import { errorTracker }", "import { trackError }");
logPage = logPage.replace("errorTracker.trackError(", "trackError(");
fs.writeFileSync('src/pages/LogActivityPage.tsx', logPage);

// 3. Fix src/components/log/ActivityForm.tsx
let actForm = fs.readFileSync('src/components/log/ActivityForm.tsx', 'utf8');
actForm = actForm.replace("import React, { useState, useEffect } from 'react';", "import React, { useState } from 'react';");
fs.writeFileSync('src/components/log/ActivityForm.tsx', actForm);

// 4. Fix src/test/hooks/useActivities.test.ts
let testAct = fs.readFileSync('src/test/hooks/useActivities.test.ts', 'utf8');
testAct = testAct.replace(/\{ category: 'transport', \s*category:/g, "{ category:"); // Fix duplicate
testAct = testAct.replace(/\{ category: 'transport',/g, "{"); // Revert my broken fix
testAct = testAct.replace(/as Omit<ActivityRecord, "id" \| "co2Kg" \| "timestamp">/g, "as any");
fs.writeFileSync('src/test/hooks/useActivities.test.ts', testAct);

// 5. Fix useCommute.ts
let useCommute = fs.readFileSync('src/hooks/useCommute.ts', 'utf8');
useCommute = useCommute.replace(/\{\s*category: 'transport',\s*category: 'transport',/g, "{ category: 'transport',"); // Fix duplicate
fs.writeFileSync('src/hooks/useCommute.ts', useCommute);

// 6. Fix src/test/services/geminiService.test.ts
let gemTest = fs.readFileSync('src/test/services/geminiService.test.ts', 'utf8');
gemTest = gemTest.replace(/as unknown\[\]\);/g, "as any[]);");
fs.writeFileSync('src/test/services/geminiService.test.ts', gemTest);

// 7. Fix src/components/features/ActivityForm.tsx (the old one) - remove implicit any
let oldAct = fs.readFileSync('src/components/features/ActivityForm.tsx', 'utf8');
oldAct = oldAct.replace(/onChange=\{\(e\) => setSubCategory\(e\.target\.value\)\}/g, "onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSubCategory(e.target.value)}");
oldAct = oldAct.replace(/onChange=\{\(e\) => setValue\(e\.target\.value \? Number\(e\.target\.value\) : ''\)\}/g, "onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value ? Number(e.target.value) : '')}");
oldAct = oldAct.replace(/onChange=\{\(e\) => setDescription\(e\.target\.value\)\}/g, "onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}");
fs.writeFileSync('src/components/features/ActivityForm.tsx', oldAct);

// 8. Fix LandingPage imports
let landing = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');
landing = landing.replace("import { GoogleIcon } from '../components/ui/icons';", "import { GoogleIcon } from '../components/ui';");
fs.writeFileSync('src/pages/LandingPage.tsx', landing);
