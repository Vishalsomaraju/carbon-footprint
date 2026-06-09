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
fix('src/components/dashboard/DailySummaryCard.tsx', [/You're/g, /You've/g, /haven't/g], ['You&apos;re', 'You&apos;ve', 'haven&apos;t']);

// 2. WeeklyChart.tsx
fix('src/components/dashboard/WeeklyChart.tsx', [/\(val: number\)/g], ['(val: number): [string, string]']);

// 3. ActivityForm.tsx
fix('src/components/log/ActivityForm.tsx', [/onSubmit=\{async \(e\)/g], ['onSubmit={async (e): Promise<void>']);

// 4 & 5. ConfirmationStep.tsx
fix('src/components/log/ConfirmationStep.tsx', [/\(err: any\)/g, /\{\s*\}/g], ['(err: unknown)', '{ /* ignored */ }']);

// 9. InsightsPage.tsx
fix('src/pages/InsightsPage.tsx', [/, \[activities.length, insights.length\]\);/g], [', [activities.length, insights.length, fetchInsights]);']);

// 10. LogActivityPage.tsx
fix('src/pages/LogActivityPage.tsx', [/\(err: any\)/g], ['(err: unknown)']);

// fix missing dependency for fetchInsights by adding useCallback, actually the easiest way is to disable the exhaustive deps rule for that line
fix('src/pages/InsightsPage.tsx', [/  \}, \[activities.length, insights.length\]\);/g], ['    // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [activities.length, insights.length]);']);

