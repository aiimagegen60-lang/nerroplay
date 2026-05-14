import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";
import App from './App.tsx';
import './index.css';

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
      <SpeedInsights />
      <Analytics />
    </StrictMode>,
  );
} catch (err) {
  console.error("CRITICAL_RENDER_ERROR:", err);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `<div style="padding: 20px; color: red;">Failed to start app. ${err}</div>`;
  }
}
