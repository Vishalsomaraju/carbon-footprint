/**
 * @module src/main
 */

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';

if (import.meta.env.MODE === 'development') {
  import('@axe-core/react').then((axe) => {
    axe.default(React, createRoot as unknown as typeof createRoot, 1000);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
