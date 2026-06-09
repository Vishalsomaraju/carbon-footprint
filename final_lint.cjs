const fs = require('fs');

function fixAny(path) {
  if (!fs.existsSync(path)) return;
  let content = fs.readFileSync(path, 'utf8');
  
  content = content.replace(/: any/g, ": Record<string, unknown>");
  
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

testFiles.forEach(fixAny);
