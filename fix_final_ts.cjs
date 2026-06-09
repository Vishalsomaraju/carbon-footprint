const fs = require('fs');

const replaceInFile = (p, search, replace) => {
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(p, content);
  }
};

replaceInFile('src/components/log/ConfirmationStep.tsx', /const cats = EMISSION_FACTORS as any;/g, 'const cats = EMISSION_FACTORS as Record<string, Record<string, number>>;');
replaceInFile('src/pages/LogActivityPage.tsx', /\} as any\);/g, "} as import('../types').ActivityRecord);");

