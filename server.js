/**
 * ShivAmrit Healers — Hostinger Node.js Production Server
 * For Hostinger VPS / Cloud / hPanel Node.js Application Manager
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');

// Serve static assets with caching headers
app.use(
  express.static(distPath, {
    maxAge: '1y',
    immutable: true,
    setHeaders: (res, filePath) => {
      // Don't cache index.html
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
    },
  })
);

// SPA Fallback: Any route not matching a static file returns index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ ShivAmrit Healers running on Hostinger port ${PORT}`);
  console.log(`📍 Serving from: ${distPath}`);
});
