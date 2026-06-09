const fs = require('fs');
const path = require('path');

// Fix useAuth.ts
let useAuth = fs.readFileSync('src/hooks/useAuth.ts', 'utf8');
useAuth = useAuth.replace('const login = async (): Promise<void> => {', 'const login = async (): Promise<User> => {');
fs.writeFileSync('src/hooks/useAuth.ts', useAuth);

// Fix useCommute.ts
let useCommute = fs.readFileSync('src/hooks/useCommute.ts', 'utf8');
useCommute = useCommute.replace(/await addActivity\(\{/g, 'await addActivity({\n          category: "transport",');
// Let's just completely replace the call since we don't know exact spacing.
useCommute = useCommute.replace(/await addActivity\(\{\s+category: 'transport',\s+subCategory: mode,\s+value: distance,\s+description: \`Commute from \${origin} to \${destination}\`,\s+date: new Date\(\)\.toISOString\(\),\s+\}\);/s, "await addActivity({ category: 'transport', subCategory: mode, value: distance, description: `Commute from ${origin} to ${destination}`, date: new Date().toISOString() });");
fs.writeFileSync('src/hooks/useCommute.ts', useCommute);

// Fix useActivities.test.ts
let testUseAct = fs.readFileSync('src/test/hooks/useActivities.test.ts', 'utf8');
testUseAct = testUseAct.replace(/as Omit<ActivityRecord, "id" \| "co2Kg" \| "timestamp">/g, "as any");
testUseAct = testUseAct.replace(/addActivity\(\{/g, "addActivity({ category: 'transport', ");
fs.writeFileSync('src/test/hooks/useActivities.test.ts', testUseAct);

// Fix AppLayout.tsx imports
let appLayout = fs.readFileSync('src/layouts/AppLayout.tsx', 'utf8');
appLayout = appLayout.replace("import { ErrorBoundary } from '../components/ui';", "import { ErrorBoundary } from '../components/ui/ErrorBoundary';");
fs.writeFileSync('src/layouts/AppLayout.tsx', appLayout);

// Fix LandingPage.tsx imports
let landingPage = fs.readFileSync('src/pages/LandingPage.tsx', 'utf8');
landingPage = landingPage.replace("import { Button, GoogleIcon } from '../components/ui';", "import { Button } from '../components/ui/Button';\nimport { GoogleIcon } from '../components/ui/icons';");
fs.writeFileSync('src/pages/LandingPage.tsx', landingPage);

// Fix ProfilePage.tsx imports
if (fs.existsSync('src/pages/ProfilePage.tsx')) {
  let profilePage = fs.readFileSync('src/pages/ProfilePage.tsx', 'utf8');
  profilePage = profilePage.replace("import { Card, Button } from '../components/ui';", "import { Card } from '../components/ui/Card';\nimport { Button } from '../components/ui/Button';");
  fs.writeFileSync('src/pages/ProfilePage.tsx', profilePage);
}

// Fix CommutePage.tsx imports
if (fs.existsSync('src/pages/CommutePage.tsx')) {
  let commutePage = fs.readFileSync('src/pages/CommutePage.tsx', 'utf8');
  commutePage = commutePage.replace("import { Card } from '../components/ui';", "import { Card } from '../components/ui/Card';");
  fs.writeFileSync('src/pages/CommutePage.tsx', commutePage);
}
