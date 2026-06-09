const fs = require('fs');

// Fix useActivities.ts ActivityEntry -> ActivityRecord
let useAct = fs.readFileSync('src/hooks/useActivities.ts', 'utf8');
useAct = useAct.replace(/ActivityEntry/g, 'ActivityRecord');
useAct = useAct.replace(/Omit<any, "id" \| "co2Kg" \| "timestamp">/g, 'any');
fs.writeFileSync('src/hooks/useActivities.ts', useAct);

// Fix useAuth.ts User
let useAuth = fs.readFileSync('src/hooks/useAuth.ts', 'utf8');
useAuth = useAuth.replace(/import \{ User \} from 'firebase\/auth';/g, "import type { User } from 'firebase/auth';");
if (!useAuth.includes("import type { User } from 'firebase/auth';")) {
    useAuth = "import type { User } from 'firebase/auth';\n" + useAuth;
}
fs.writeFileSync('src/hooks/useAuth.ts', useAuth);

// Fix geminiService.test.ts
let gemini = fs.readFileSync('src/test/services/geminiService.test.ts', 'utf8');
gemini = gemini.replace(/as unknown\[\]\);/g, "as import('../../src/types').ActivityRecord[]);");
fs.writeFileSync('src/test/services/geminiService.test.ts', gemini);
