/**
 * =============================================================
 * VITE CONFIGURATION FILE
 * =============================================================
 *
 * Vite is our build tool and dev server. This config file tells
 * Vite how to process our React application.
 *
 * Key things this config does:
 * 1. Enables the React plugin (for JSX transform and Fast Refresh)
 * 2. Sets the dev server port to 3000
 * 3. Configures proxy for API requests (optional, we use axios baseURL instead)
 *
 * Why Vite over Create React App?
 * - Lightning-fast dev server (uses native ES modules)
 * - Faster builds (uses Rollup under the hood)
 * - Better DX with instant Hot Module Replacement (HMR)
 * =============================================================
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  /* Register the React plugin — this handles:
   * - Automatic JSX runtime (no need to import React in every file)
   * - Fast Refresh for instant feedback during development
   */
  plugins: [react()],

  /* Dev server configuration */
  server: {
    port: 5174, // Run our frontend on port 3000
    open: true, // Auto-open browser when dev server starts
  },
});
