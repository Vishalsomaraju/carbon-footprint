const fs = require('fs');

const replaceInFile = (path, search, replace) => {
  if (fs.existsSync(path)) {
    let content = fs.readFileSync(path, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(path, content);
  }
};

replaceInFile('src/components/dashboard/DailySummaryCard.tsx', /You're/g, 'You&apos;re');
replaceInFile('src/components/dashboard/DailySummaryCard.tsx', /haven't/g, 'haven&apos;t');
replaceInFile('src/components/dashboard/DailySummaryCard.tsx', /You've/g, 'You&apos;ve');

replaceInFile('src/components/dashboard/WeeklyChart.tsx', /formatter=\{\(val: number\)/g, 'formatter={(val: number): [string, string]');

replaceInFile('src/components/log/ActivityForm.tsx', /onSubmit=\{async \(e\)/g, 'onSubmit={async (e): Promise<void>');

replaceInFile('src/components/log/ConfirmationStep.tsx', /catch \(err: any\)/g, 'catch (err: unknown)');
replaceInFile('src/components/log/ConfirmationStep.tsx', /\} catch \(err: unknown\) \{\s*\}/g, '} catch (err: unknown) { console.error(err); }');

replaceInFile('src/components/ui/Toast.tsx', /useEffect\(\(\) => \{/g, 'useEffect((): (() => void) => {');
replaceInFile('src/components/ui/Toast.tsx', /const timer = setTimeout\(\(\) => \{/g, 'const timer = setTimeout((): void => {');

replaceInFile('src/hooks/useAuth.ts', /import \{\s*useContext\s*\} from 'react';\n\nimport/g, "import { useContext } from 'react';\nimport");

replaceInFile('src/pages/CommutePage.tsx', /const handleCalculate = async \(\)/g, 'const handleCalculate = async (): Promise<void>');
replaceInFile('src/pages/CommutePage.tsx', /const handleLog = async \(\)/g, 'const handleLog = async (): Promise<void>');
replaceInFile('src/pages/CommutePage.tsx', /e.target.value as any/g, 'e.target.value as unknown');
replaceInFile('src/pages/CommutePage.tsx', /you'd/g, 'you&apos;d');

replaceInFile('src/pages/InsightsPage.tsx', /const fetchInsights = async \(\)/g, 'const fetchInsights = async (): Promise<void>');
replaceInFile('src/pages/InsightsPage.tsx', /const handleRegenerate = \(\)/g, 'const handleRegenerate = (): void');
replaceInFile('src/pages/InsightsPage.tsx', /const handleChat = async \(\)/g, 'const handleChat = async (): Promise<void>');
replaceInFile('src/pages/InsightsPage.tsx', /const getIcon = \(cat: string\)/g, 'const getIcon = (cat: string): string');
replaceInFile('src/pages/InsightsPage.tsx', /\[activities\.length\]\)/g, '[activities.length, insights.length]');

replaceInFile('src/pages/LogActivityPage.tsx', /catch \(err: any\)/g, 'catch (err: unknown)');

replaceInFile('src/services/mapsService.ts', /libraries: \[\.\.\.MAPS_LIBRARIES\] as any/g, 'libraries: [...MAPS_LIBRARIES] as unknown[]');

replaceInFile('src/test/pages/DashboardPage.test.tsx', /useAuth as any/g, 'useAuth as unknown as import("vitest").Mock');
replaceInFile('src/test/pages/DashboardPage.test.tsx', /useActivities as any/g, 'useActivities as unknown as import("vitest").Mock');

replaceInFile('src/test/services/geminiService.test.ts', /global.fetch as any/g, 'global.fetch as unknown as import("vitest").Mock');

replaceInFile('src/utils/errorTracker.ts', /Record<string, any>/g, 'Record<string, unknown>');

