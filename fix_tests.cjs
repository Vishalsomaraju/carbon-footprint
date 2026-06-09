const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const srcPath = path.join(__dirname, 'src');
walkDir(srcPath, f => {
  if (f.endsWith('.ts') || f.endsWith('.tsx')) {
    let content = fs.readFileSync(f, 'utf8');
    
    // Fix arrow functions in mock factories and other callbacks
    // e.g. vi.mock('...', () => {
    content = content.replace(/vi\.mock\((['"`].*?['"`]),\s*\(\)\s*=>\s*(\{.*?\})\s*\)/gs, 'vi.mock($1, (): Record<string, unknown> => $2)');
    content = content.replace(/vi\.mock\((['"`].*?['"`]),\s*\(\)\s*=>\s*\(\{/g, 'vi.mock($1, (): Record<string, unknown> => ({');

    // Fix implicit any to import('vitest').Mock
    content = content.replace(/as any/g, "as import('vitest').Mock");
    content = content.replace(/:( )?any/g, ": unknown");

    fs.writeFileSync(f, content);
  }
});
console.log('Fixed more test return types and any types.');
