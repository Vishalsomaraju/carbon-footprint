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
    
    // 1. Add JSDoc
    if (!content.includes('@module')) {
      const basename = path.basename(f, path.extname(f));
      const jsdoc = `/**\n * @module ${basename}\n */\n\n`;
      content = jsdoc + content;
    }

    // 2. Add return types for tests
    if (f.includes('test')) {
      // describe('...', () => {
      content = content.replace(/describe\((['"`].*?['"`]),\s*\(\)\s*=>\s*\{/g, 'describe($1, (): void => {');
      // it('...', () => {
      content = content.replace(/it\((['"`].*?['"`]),\s*\(\)\s*=>\s*\{/g, 'it($1, (): void => {');
      // it('...', async () => {
      content = content.replace(/it\((['"`].*?['"`]),\s*async\s*\(\)\s*=>\s*\{/g, 'it($1, async (): Promise<void> => {');
      // beforeEach(() => {
      content = content.replace(/beforeEach\(\(\)\s*=>\s*\{/g, 'beforeEach((): void => {');
      // afterEach(() => {
      content = content.replace(/afterEach\(\(\)\s*=>\s*\{/g, 'afterEach((): void => {');
      
      // also handle vi.mock
      // vi.mock('...', () => ({
      // content = content.replace(/vi\.mock\((['"`].*?['"`]),\s*\(\)\s*=>\s*\(\{/g, 'vi.mock($1, (): Record<string, any> => ({');
    }

    fs.writeFileSync(f, content);
  }
});
console.log('JSDocs and test return types added.');
