# ShivAmrit Healers — Hostinger Deployment Guide

This project is fully configured and optimized for **Hostinger** deployment (both **Hostinger Shared/Cloud Web Hosting** with LiteSpeed/Apache and **Hostinger Node.js VPS / Application Manager**).

---

## ⚡ Option 1: Instant 1-Click Upload (Recommended for 95% of Users)

Hostinger Shared, Cloud, and Premium Web Hosting uses LiteSpeed / Apache with `public_html/`.

### Step 1: Generate the Hostinger Package
In your terminal, run:
```bash
npm run package:hostinger
```
*(Or if you prefer standard build: `npm run build`)*

This creates `hostinger-deploy.zip` in your project root containing the production build with pre-configured `.htaccess`, relative assets, and SPA routing.

### Step 2: Upload to Hostinger File Manager
1. Log in to your **Hostinger hPanel** (`https://hpanel.hostinger.com`).
2. Go to **Websites** → Click **Manage** on your domain.
3. Open **Files** → **File Manager** (Access files of your website).
4. Enter the `public_html` directory (delete default `default.php` if present).
5. Click the **Upload** icon at the top right → Select `hostinger-deploy.zip`.
6. Right-click `hostinger-deploy.zip` → Click **Extract** → Select the current `public_html` directory.
7. (Optional) Delete `hostinger-deploy.zip` after extracting.

### Step 3: Done!
Visit your domain (e.g. `https://yourdomain.com`).
- The sacred ShivAmrit Healers store is live immediately.
- Refreshing pages, direct deep links, and modals work smoothly without 404 errors thanks to the included `.htaccess`.

---

## 🚀 Option 2: Deploying via Git / GitHub on Hostinger

If your Hostinger plan includes Git:
1. In Hostinger hPanel, go to **Advanced** → **Git**.
2. Paste your repository URL and choose the `main` branch.
3. Set the directory to `/public_html`.
4. Add the deployment script in Hostinger:
   ```bash
   npm install
   npm run build
   cp -r dist/* public_html/
   ```

---

## 🖥️ Option 3: Hostinger Node.js Application / VPS

If you are running Hostinger VPS or using the **Node.js Application Manager** in hPanel:
1. Set **Node.js version**: 18.x or 20.x+.
2. Set **Application root**: `/home/your-user/domains/yourdomain.com/public_html`
3. Set **Application startup file**: `server.js`
4. Run:
   ```bash
   npm install --production=false
   npm run build
   npm start
   ```
The provided `server.js` starts the Express server, binds to `process.env.PORT || 3000`, serves the `dist` folder, and handles SPA route fallbacks.

---

## 🛡️ Pre-Configured Hostinger Optimizations Included

1. **`.htaccess` with LiteSpeed/Apache Rules**:
   - Single Page Application (SPA) URL rewriting to `index.html`.
   - Automatic HTTPS redirect.
   - Long-term caching for immutable hashed assets (`Cache-Control: max-age=31536000`).
   - Gzip and Brotli compression (`mod_deflate`).
   - Security headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`.
2. **Relative Base Path (`base: './'`)**:
   - Ensures the website works seamlessly whether placed at domain root (`https://domain.com/`) or inside a subfolder (`https://domain.com/store/`).
3. **Optimized Rollup Chunks**:
   - Clean vendor splitting for React and icons, ensuring fast first-load times and high Google PageSpeed scores on Hostinger servers.
