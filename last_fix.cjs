const fs = require('fs');

fs.writeFileSync('src/components/ui/icons/index.ts', "export * from './GoogleIcon';\n");

let actTest = fs.readFileSync('src/test/hooks/useActivities.test.ts', 'utf8');
actTest = actTest.replace(/addActivity\(\{\s+subCategory:/g, "addActivity({ category: 'transport', subCategory:");
actTest = actTest.replace(/addActivity\(\{\s+value:/g, "addActivity({ category: 'transport', value:");
fs.writeFileSync('src/test/hooks/useActivities.test.ts', actTest);

let gemTest = fs.readFileSync('src/test/services/geminiService.test.ts', 'utf8');
gemTest = gemTest.replace(/as any\[\]\);/g, "as any);");
fs.writeFileSync('src/test/services/geminiService.test.ts', gemTest);

let commuteHook = fs.readFileSync('src/hooks/useCommute.ts', 'utf8');
commuteHook = commuteHook.replace(/\{\s*category: 'transport',\s*category: 'transport',/g, "{ category: 'transport',");
fs.writeFileSync('src/hooks/useCommute.ts', commuteHook);
