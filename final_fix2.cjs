const fs = require('fs');

function fix(file, searches, replaces) {
  if (fs.existsSync(file)) {
    let text = fs.readFileSync(file, 'utf8');
    for (let i = 0; i < searches.length; i++) {
      text = text.replace(searches[i], replaces[i]);
    }
    fs.writeFileSync(file, text);
  }
}

// 1. DailySummaryCard.tsx
fix('src/components/dashboard/DailySummaryCard.tsx', [/\`Today's\`/g, /Today's/g, /"Today's"/g, /'s/g], ['`Today&apos;s`', 'Today&apos;s', '"Today&apos;s"', '&apos;s']);
let c = fs.readFileSync('src/components/dashboard/DailySummaryCard.tsx', 'utf8');
c = c.replace(/You&apos;&apos;re/g, "You&apos;re").replace(/You&apos;&apos;ve/g, "You&apos;ve").replace(/haven&apos;&apos;t/g, "haven&apos;t");
fs.writeFileSync('src/components/dashboard/DailySummaryCard.tsx', c);

// 2. ActivityForm.tsx
fix('src/components/log/ActivityForm.tsx', [/const handleSubmit = async \(e: React.FormEvent\) => \{/g], ['const handleSubmit = async (e: React.FormEvent): Promise<void> => {']);

// 3. ConfirmationStep.tsx
fix('src/components/log/ConfirmationStep.tsx', [/\(err: any\)/g], ['(err: unknown)']);

// 4. useAuth.ts
let useAuth = fs.readFileSync('src/hooks/useAuth.ts', 'utf8');
useAuth = useAuth.replace("import type { User } from 'firebase/auth';\n/**\n * @module hooks/useAuth\n */\n\nimport { useState } from 'react';\n", "/**\n * @module hooks/useAuth\n */\nimport type { User } from 'firebase/auth';\nimport { useState } from 'react';\n");
fs.writeFileSync('src/hooks/useAuth.ts', useAuth);

// 5. InsightsPage.tsx
fix('src/pages/InsightsPage.tsx', [/const fetchInsights = async \(\): Promise<void> => \{/g], ['const fetchInsights = React.useCallback(async (): Promise<void> => {']);
fix('src/pages/InsightsPage.tsx', [/      setLoading\(false\);\n    \}\n  \};\n\n  useEffect\(/g], ['      setLoading(false);\n    }\n  }, [activities]);\n\n  useEffect(']);

// 6. LogActivityPage.tsx
fix('src/pages/LogActivityPage.tsx', [/\(err: any\)/g], ['(err: unknown)']);

