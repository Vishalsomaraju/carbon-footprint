const fs = require('fs');

// Fix useAsync.ts
let useAsync = fs.readFileSync('src/hooks/useAsync.ts', 'utf8');
useAsync = useAsync.replace(/setError\(err\);/g, 'setError(err as Error);');
fs.writeFileSync('src/hooks/useAsync.ts', useAsync);

// Fix useAuth.ts
let useAuth = fs.readFileSync('src/hooks/useAuth.ts', 'utf8');
if (!useAuth.includes('import { User }')) {
  useAuth = useAuth.replace("import { useState, useEffect } from 'react';", "import { useState, useEffect } from 'react';\nimport { User } from 'firebase/auth';");
}
useAuth = useAuth.replace(/setError\(err\);/g, 'setError(err as Error);');
fs.writeFileSync('src/hooks/useAuth.ts', useAuth);

// Mass fix test files by replacing `as unknown)` with `as any)` where mock is complaining
const testFiles = [
  'src/test/features/FootprintChart.test.tsx',
  'src/test/hooks/useActivities.test.ts',
  'src/test/hooks/useAuth.test.ts',
  'src/test/layouts/AppLayout.test.tsx',
  'src/test/pages/AuthPage.test.tsx',
  'src/test/services/activityService.test.ts',
  'src/test/services/authService.test.ts',
  'src/test/services/geminiService.test.ts'
];

testFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/as unknown/g, 'as any');
    content = content.replace(/as import\('vitest'\).Mock/g, 'as any');
    content = content.replace(/import\("react"\).ReactElement/g, 'any');
    content = content.replace(/import\('react'\).ReactElement/g, 'any');
    content = content.replace(/ReactElement<unknown, string \| JSXElementConstructor<any>>/g, 'any');
    content = content.replace(/=> Promise<unknown>/g, '=> Promise<any>');
    content = content.replace(/=> unknown/g, '=> any');
    fs.writeFileSync(file, content);
  }
});
