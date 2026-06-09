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
const files = [];
walkDir(srcPath, f => {
  if (f.endsWith('.ts') || f.endsWith('.tsx')) {
    files.push(f);
  }
});

let missingJSDoc = [];
let over80Lines = [];
let asyncMissingTrackError = [];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  
  // 1. JSDoc
  if (!content.includes('@module')) {
    missingJSDoc.push(f);
  }
  
  // 5. Component > 80 lines (approx check: file > 80 lines for .tsx)
  if (f.endsWith('.tsx') && lines.length > 80) {
    over80Lines.push(f);
  }
  
  // 3. Async without try/catch/trackError
  // We'll just check if file has "async " and not "trackError"
  if (content.includes('async ') && !content.includes('trackError') && !f.includes('.test.')) {
    asyncMissingTrackError.push(f);
  }
});

console.log('=== AUDIT RESULTS ===');
console.log('Missing @module:', missingJSDoc.length > 0 ? missingJSDoc.map(f => path.basename(f)).join(', ') : 'None');
console.log('Components > 80 lines:', over80Lines.length > 0 ? over80Lines.map(f => path.basename(f)).join(', ') : 'None');
console.log('Async missing trackError (potential):', asyncMissingTrackError.length > 0 ? asyncMissingTrackError.map(f => path.basename(f)).join(', ') : 'None');
