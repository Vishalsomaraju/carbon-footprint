const fs = require('fs');

function replaceInFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const [search, replace] of replacements) {
    if (typeof search === 'string') {
      content = content.split(search).join(replace);
    } else {
      content = content.replace(search, replace);
    }
  }
  fs.writeFileSync(filePath, content);
}

replaceInFile('e:/carbon-footprint/src/App.tsx', [
  ['(): JSX.Element', '(): React.ReactElement']
]);

replaceInFile('e:/carbon-footprint/src/test/contexts/AuthContext.test.tsx', [['./AuthContext', '../../contexts/AuthContext']]);

replaceInFile('e:/carbon-footprint/src/test/features/ActivityForm.test.tsx', [['./ActivityForm', '../../components/features/ActivityForm']]);
replaceInFile('e:/carbon-footprint/src/test/features/FootprintChart.test.tsx', [['./FootprintChart', '../../components/features/FootprintChart']]);
replaceInFile('e:/carbon-footprint/src/test/features/InsightCard.test.tsx', [['./InsightCard', '../../components/features/InsightCard']]);

replaceInFile('e:/carbon-footprint/src/test/hooks/useActivities.test.ts', [
  ['../.../../contexts/AuthContext', '../../contexts/AuthContext'],
  ['./useActivities', '../../hooks/useActivities'],
  ['../services', '../../services']
]);
replaceInFile('e:/carbon-footprint/src/test/hooks/useAuth.test.ts', [
  ['../.../../contexts/AuthContext', '../../contexts/AuthContext'],
  ['./useAuth', '../../hooks/useAuth'],
  ['../services', '../../services']
]);
replaceInFile('e:/carbon-footprint/src/test/hooks/useGeminiInsights.test.ts', [
  ['./useGeminiInsights', '../../hooks/useGeminiInsights'],
  ['../services', '../../services']
]);

replaceInFile('e:/carbon-footprint/src/test/layouts/AppLayout.test.tsx', [
  ['./AppLayout', '../../layouts/AppLayout'],
  ['../hooks', '../../hooks']
]);

replaceInFile('e:/carbon-footprint/src/test/pages/AuthPage.test.tsx', [
  ['./AuthPage', '../../pages/AuthPage'],
  ['../hooks', '../../hooks']
]);
replaceInFile('e:/carbon-footprint/src/test/pages/DashboardPage.test.tsx', [
  ['./DashboardPage', '../../pages/DashboardPage'],
  ['../hooks', '../../hooks']
]);

replaceInFile('e:/carbon-footprint/src/test/services/activityService.test.ts', [
  ['../activityService', '../../services/activityService']
]);
replaceInFile('e:/carbon-footprint/src/test/services/analyticsService.test.ts', [
  ['./analyticsService', '../../services/analyticsService'],
  ['../config', '../../config']
]);
replaceInFile('e:/carbon-footprint/src/test/services/authService.test.ts', [
  ['../authService', '../../services/authService']
]);
replaceInFile('e:/carbon-footprint/src/test/services/geminiService.test.ts', [
  ['./geminiService', '../../services/geminiService'],
  ['../lib/env', '../../lib/env']
]);

replaceInFile('e:/carbon-footprint/src/test/ui/ui.test.tsx', [
  ['./Button', '../../components/ui/Button'],
  ['./Card', '../../components/ui/Card'],
  ['./Input', '../../components/ui/Input'],
  ['./FormField', '../../components/ui/FormField'],
  ['./LoadingSpinner', '../../components/ui/LoadingSpinner']
]);

replaceInFile('e:/carbon-footprint/src/test/unit/App.test.tsx', [
  ['./App', '../../App']
]);

console.log('Done!');
