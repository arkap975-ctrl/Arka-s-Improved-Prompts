
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';

/**
 * Initializes and mounts the React application.
 * Wrapped in a function to ensure the DOM is fully interactive.
 */
const initializeApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error("Critical Error: Root element '#root' was not found in the DOM.");
    return;
  }

  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error("Failed to initialize React application:", error);
    rootElement.innerHTML = `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: 20px;">
        <h2 style="color: #f87171; font-weight: 600; margin-bottom: 10px;">Deployment Issue Detected</h2>
        <p style="color: #94a3b8; font-size: 0.875rem;">The application failed to initialize. Please check the browser console for details.</p>
      </div>
    `;
  }
};

// Check if DOM is already ready, otherwise wait for it
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
