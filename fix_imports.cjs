const fs = require('fs');

function removeEmptyLinesBetweenImports(path) {
  if (!fs.existsSync(path)) return;
  let lines = fs.readFileSync(path, 'utf8').split('\n');
  let result = [];
  let inImports = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('import ')) {
      inImports = true;
      result.push(line);
    } else if (inImports && line.trim() === '') {
      // skip empty lines between imports
      if (i + 1 < lines.length && lines[i+1].startsWith('import ')) {
        continue;
      } else {
        inImports = false;
        result.push(line);
      }
    } else {
      inImports = false;
      result.push(line);
    }
  }
  
  fs.writeFileSync(path, result.join('\n'));
}

['src/layouts/AppLayout.tsx', 'src/pages/LandingPage.tsx', 'src/pages/LogActivityPage.tsx'].forEach(removeEmptyLinesBetweenImports);
