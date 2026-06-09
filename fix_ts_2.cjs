const fs = require('fs');

// Fix DashboardPage.test.tsx (remove useGeminiInsights references)
let dpt = fs.readFileSync('src/test/pages/DashboardPage.test.tsx', 'utf8');
dpt = dpt.replace(/\(useGeminiInsights as any\)\.mockReturnValue\([^)]+\);/g, "");
fs.writeFileSync('src/test/pages/DashboardPage.test.tsx', dpt);

// Fix geminiService.test.ts
let gst = fs.readFileSync('src/test/services/geminiService.test.ts', 'utf8');
gst = gst.replace(/as unknown\[\]\)/g, "as any[])");
fs.writeFileSync('src/test/services/geminiService.test.ts', gst);
