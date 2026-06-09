const fs = require('fs');
const path = require('path');
const root = 'e:\\carbon-footprint\\src';

function check(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) check(full);
    else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      const lines = fs.readFileSync(full, 'utf8').split('\n');
      let isTest = full.includes('\\test\\');
      if (!isTest && lines.length > 80) console.log('Length > 80:', full);
      if (!lines.slice(0, 15).some((l) => l.includes('@module')))
        console.log('Missing @module:', full);
    }
  }
}
check(root);
