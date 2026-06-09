const fs = require('fs');

// Fix mapsService comparisons
let ms = fs.readFileSync('src/services/mapsService.ts', 'utf8');
ms = ms.replace(/transportMode === 'motorcycle'/g, "transportMode.includes('motorcycle')");
ms = ms.replace(/transportMode === 'train'/g, "transportMode.includes('train')");
ms = ms.replace(/transportMode === 'bus'/g, "transportMode.includes('bus')");
ms = ms.replace(/transportMode === 'cycling'/g, "transportMode.includes('cycling')");
fs.writeFileSync('src/services/mapsService.ts', ms);

// Fix src/components/features/index.ts
let idx = fs.readFileSync('src/components/features/index.ts', 'utf8');
idx = idx.split('\n').filter(l => !l.includes('./ActivityForm') && !l.includes('./FootprintChart') && !l.includes('./InsightCard') && !l.includes('./ChatSection') && !l.includes('./CategorySelect')).join('\n');
fs.writeFileSync('src/components/features/index.ts', idx);

// Fix src/hooks/index.ts
let hIdx = fs.readFileSync('src/hooks/index.ts', 'utf8');
hIdx = hIdx.split('\n').filter(l => !l.includes('./useGeminiInsights') && !l.includes('./useCommute')).join('\n');
fs.writeFileSync('src/hooks/index.ts', hIdx);

// Delete old features that are giving errors
if (fs.existsSync('src/components/features/CommuteForm.tsx')) fs.rmSync('src/components/features/CommuteForm.tsx');
let idx2 = fs.readFileSync('src/components/features/index.ts', 'utf8');
idx2 = idx2.split('\n').filter(l => !l.includes('./CommuteForm')).join('\n');
fs.writeFileSync('src/components/features/index.ts', idx2);

// Delete old tests referencing deleted components
if (fs.existsSync('src/test/features/ActivityForm.test.tsx')) fs.rmSync('src/test/features/ActivityForm.test.tsx');
if (fs.existsSync('src/test/features/FootprintChart.test.tsx')) fs.rmSync('src/test/features/FootprintChart.test.tsx');
if (fs.existsSync('src/test/features/InsightCard.test.tsx')) fs.rmSync('src/test/features/InsightCard.test.tsx');

// Fix DashboardPage.test.tsx (remove useGeminiInsights)
let dpt = fs.readFileSync('src/test/pages/DashboardPage.test.tsx', 'utf8');
dpt = dpt.replace(/, useGeminiInsights/g, "");
dpt = dpt.replace(/import \{ useActivities \} from '\.\.\/\.\.\/hooks';/g, "import { useActivities } from '../../hooks';");
dpt = dpt.replace(/\(useGeminiInsights as any\)\.mockReturnValue\(\{[\s\S]*?\}\);/g, "");
fs.writeFileSync('src/test/pages/DashboardPage.test.tsx', dpt);

// Fix geminiService.test.ts
let gst = fs.readFileSync('src/test/services/geminiService.test.ts', 'utf8');
gst = gst.replace(/import \{ geminiService \} from '\.\.\/\.\.\/services\/geminiService';/g, "import { generateWeeklyInsights, getReductionChat } from '../../services/geminiService';\nconst geminiService = { generateWeeklyInsights, getReductionChat };");
fs.writeFileSync('src/test/services/geminiService.test.ts', gst);

