const fs = require('fs');

let content = fs.readFileSync('src/test/pages/CommutePage.test.tsx', 'utf8');
content = content.replace(/Smart Commute/i, 'Commute Calculator');
fs.writeFileSync('src/test/pages/CommutePage.test.tsx', content);

let content2 = fs.readFileSync('src/components/profile/StatsSection.tsx', 'utf8');
// Fix the Date issue if it's there
content2 = content2.replace(/new Date\(a.date\)/g, "new Date(a.date || new Date().toISOString())");
fs.writeFileSync('src/components/profile/StatsSection.tsx', content2);
