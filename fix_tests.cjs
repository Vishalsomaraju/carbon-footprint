const fs = require('fs');
const glob = require('fs').readdirSync;

function walk(dir) {
  let results = [];
  const list = glob(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if(file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file);
    }
  });
  return results;
}

const testFiles = walk('e:/carbon-footprint/src/test');

testFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/as any\b/g, "as import('vitest').Mock");
  content = content.replace(/error: any\b/g, 'error: unknown');
  content = content.replace(/it\('([^']+)',\s*(async\s*)?\(\)\s*=>\s*\{/g, (match, p1, p2) => {
    return p2 ? `it('${p1}', async (): Promise<void> => {` : `it('${p1}', (): void => {`;
  });
  
  content = content.replace(/describe\('([^']+)',\s*\(\)\s*=>\s*\{/g, "describe('$1', (): void => {");
  content = content.replace(/beforeEach\(\(\)\s*=>\s*\{/g, 'beforeEach((): void => {');
  content = content.replace(/afterEach\(\(\)\s*=>\s*\{/g, 'afterEach((): void => {');
  
  fs.writeFileSync(file, content);
});

console.log('Test files patched');
