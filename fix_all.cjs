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

const allFiles = walk('e:/carbon-footprint/src');

allFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  content = content.replace(/: any\b/g, ': unknown');
  content = content.replace(/<any>/g, '<unknown>');
  content = content.replace(/as any\b/g, 'as unknown');
  
  content = content.replace(/=> children/g, ': React.ReactNode => children');
  content = content.replace(/=> <div/g, ': React.ReactElement => <div');
  content = content.replace(/=> <span/g, ': React.ReactElement => <span');
  content = content.replace(/=> <button/g, ': React.ReactElement => <button');
  content = content.replace(/=> \(/g, ': React.ReactElement => (');
  
  content = content.replace(/vi\\.mock\\('([^']+)', \\(\\) => \\(\\{/g, "vi.mock('$1', (): Record<string, unknown> => ({");
  
  fs.writeFileSync(file, content);
});

console.log('Fixed more errors!');
