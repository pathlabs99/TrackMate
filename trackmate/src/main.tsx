/**
 * @fileoverview Main entry point for the TrackMate mobile app.
 * @author TrackMate Team
 * @date 2025-04-13
 * @filename main.tsx
 *
 * This file serves as the application entry point, setting up React
 * and the Ionic router for the TrackMate app.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { IonReactRouter } from '@ionic/react-router';
import App from './App';

/**
 * Get the root DOM element and create a React root
 */
const container = document.getElementById('root');
const root = createRoot(container!);

/**
 * Render the application wrapped in StrictMode and IonReactRouter
 */
root.render(
  <React.StrictMode>
    <IonReactRouter>
      <App />
    </IonReactRouter>
  </React.StrictMode>
);