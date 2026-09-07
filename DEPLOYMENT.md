# PredictIQ — Zero-Docker Production Deployment Guide

This guide explains how to deploy PredictIQ live to the internet permanently with **zero Docker**, **zero containers**, and **no heavy virtualization dependencies**. It runs on pure, native Node.js and SQLite.

---

## The Best Zero-Docker Cloud Hosting Options

### Option 1: Render.com (Recommended — 100% Native Node.js & Free Tier)

Render provides native Node.js web services with automated SSL certificates, continuous deployment from GitHub, and zero Docker configuration.

1. Create a free account at [render.com](https://render.com).
2. Click **New +** $\rightarrow$ **Blueprint**.
3. Connect your GitHub repository: `bash30ribs/predictiq`.
4. Render automatically reads [`render.yaml`](file:///home/ribs/freee/render.yaml) which uses native Node (`runtime: node`).
5. Render automatically:
   - Runs `npm install && npm run build`
   - Starts the server with `npm run start`
   - Attaches a persistent disk for SQLite `predictiq.db` at `frontend/data/`
6. Click **Apply**.
7. In ~2 minutes, your platform is live at a public HTTPS URL (e.g. `https://predictiq.onrender.com`).

---

### Option 2: Railway.app (Native Node Service — Zero Docker)

Railway automatically recognizes Next.js and builds it with native Node.js without any Dockerfile.

1. Sign up for a free account at [railway.app](https://railway.app).
2. Click **New Project** $\rightarrow$ **Deploy from GitHub repo**.
3. Select your repository: `bash30ribs/predictiq`.
4. Railway detects [`railway.json`](file:///home/ribs/freee/railway.json) and compiles natively using Node.
5. In your service settings on Railway:
   - Click **Add Volume**.
   - Mount path: `frontend/data`
6. Click **Generate Domain**.
7. Your app is live permanently with a public HTTPS URL.

---

### Option 3: Vercel (Creators of Next.js — 1-Click Zero Docker)

For maximum worldwide speed with zero server management:

1. Sign up at [vercel.com](https://vercel.com) using your GitHub account.
2. Click **Add New...** $\rightarrow$ **Project**.
3. Import your GitHub repository: `bash30ribs/predictiq`.
4. Under **Root Directory**, click **Edit** and choose `frontend`.
5. Framework Preset will automatically detect **Next.js**.
6. Click **Deploy**.
7. Your application is live across 100+ global edge locations with instant HTTPS.

---

### Option 4: Any Linux VPS (Ubuntu / Debian / AWS EC2 / DigitalOcean) using PM2

If you prefer hosting on your own standard Linux virtual server without Docker:

1. Connect to your server via SSH:
   ```bash
   ssh user@your-server-ip
   ```

2. Install Node.js (if not already installed):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. Clone your GitHub repository and build:
   ```bash
   git clone https://github.com/bash30ribs/predictiq.git
   cd predictiq/frontend
   npm install
   npm run build
   ```

4. Start the app with PM2 (Process Manager for 24/7 background execution):
   ```bash
   npx pm2 start npm --name "predictiq" -- start -- -p 3000
   npx pm2 save
   npx pm2 startup
   ```

5. (Optional) Point Nginx or Caddy to port 3000 with your custom domain.
   - All customer data, user accounts, and reviews persist directly in `frontend/data/predictiq.db`.
