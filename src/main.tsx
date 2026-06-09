/**
 * @module src/main
 */

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import './index.css';

if (import.meta.env.MODE === 'development') {
  import('@axe-core/react').then((axe) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    axe.default(React, createRoot as any, 1000);
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
