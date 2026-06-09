const fs = require('fs');
const path = require('path');

const write = (p, content) => {
  const fullPath = path.join(process.cwd(), p);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
};

// 1. firestore.rules
write('firestore.rules', `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /activities/{activityId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    match /dailySummaries/{summaryId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
`);

// 2. public/manifest.json
write('public/manifest.json', `{
  "name": "CarbonWise – Track Your Footprint",
  "short_name": "CarbonWise",
  "description": "Track, understand, and reduce your personal carbon footprint",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#020617",
  "theme_color": "#15803d",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
`);

// 3. index.html manifest
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('manifest.json')) {
  html = html.replace('</head>', '  <link rel="manifest" href="/manifest.json" />\n  </head>');
  fs.writeFileSync('index.html', html);
}

// 4. public/sw.js
write('public/sw.js', `const CACHE_NAME = 'carbonwise-v1';
const STATIC_ASSETS = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => cached ?? fetch(event.request))
  );
});
`);

// 5. src/main.tsx registration
let mainTsx = fs.readFileSync('src/main.tsx', 'utf8');
if (!mainTsx.includes('serviceWorker')) {
  const swCode = `\nif ('serviceWorker' in navigator) {\n  window.addEventListener('load', () => {\n    navigator.serviceWorker.register('/sw.js').catch(() => {});\n  });\n}\n\n`;
  mainTsx = mainTsx.replace('ReactDOM.createRoot', swCode + 'ReactDOM.createRoot');
  fs.writeFileSync('src/main.tsx', mainTsx);
}

// 6. .github/workflows/ci.yml
write('.github/workflows/ci.yml', `name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run test:coverage
      - run: npm run build
    env:
      VITE_FIREBASE_API_KEY: test_key
      VITE_FIREBASE_AUTH_DOMAIN: test.firebaseapp.com
      VITE_FIREBASE_PROJECT_ID: test_project
      VITE_FIREBASE_STORAGE_BUCKET: test.appspot.com
      VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789'
      VITE_FIREBASE_APP_ID: test_app_id
      VITE_FIREBASE_MEASUREMENT_ID: G-TEST
      VITE_GEMINI_API_KEY: test_gemini_key
      VITE_MAPS_API_KEY: test_maps_key
`);

// 7. Fix remaining lint errors
const replaceInFile = (p, search, replace) => {
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf8');
    content = content.replace(search, replace);
    fs.writeFileSync(p, content);
  }
};

replaceInFile('src/components/log/ActivityForm.tsx', /const handleSubmit = async \(e: React\.FormEvent\) => \{/g, 'const handleSubmit = async (e: React.FormEvent): Promise<void> => {');
replaceInFile('src/components/log/ConfirmationStep.tsx', /catch \(err: any\)/g, 'catch (err: unknown)');
replaceInFile('src/pages/LogActivityPage.tsx', /catch \(err: any\)/g, 'catch (err: unknown)');
replaceInFile('src/pages/InsightsPage.tsx', /import React, \{ useState, useEffect \} from 'react';/, "import React, { useState, useEffect, useCallback } from 'react';");
replaceInFile('src/pages/InsightsPage.tsx', /React\.useCallback/, "useCallback");
