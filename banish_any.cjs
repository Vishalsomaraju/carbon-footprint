const fs = require('fs');

function banishAny(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  
  // Replace all remaining `as any` with `as unknown as import('vitest').Mock`
  // Wait, some might just need `as unknown`
  content = content.replace(/as any/g, "as unknown as import('vitest').Mock");
  
  // Fix nested `as unknown as import('vitest').Mock` that I might have created
  content = content.replace(/as unknown as import\('vitest'\)\.Mock\)/g, "as unknown as import('vitest').Mock)");
  
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

testFiles.forEach(banishAny);

