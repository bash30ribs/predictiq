# PredictIQ — Production Deployment Guide

This guide explains how to deploy PredictIQ live to the internet with a public HTTPS URL and persistent SQLite database storage.

---

## Recommended Deployment Options

### Option 1: Railway.app (Easiest — 100% Automated)

Railway natively supports Next.js, Docker, and Persistent Disks. Your SQLite database (`predictiq.db`) will stay permanently preserved.

1. Sign up for a free account at [railway.app](https://railway.app).
2. Click **New Project** $\rightarrow$ **Deploy from GitHub repo**.
3. Select your repository: `bash30ribs/predictiq`.
4. Railway will automatically detect the [`railway.json`](file:///home/ribs/freee/railway.json) and [`Dockerfile`](file:///home/ribs/freee/Dockerfile).
5. In Railway service settings:
   - Click **Add Volume**.
   - Mount Path: `/app/frontend/data`
6. Click **Deploy**.
7. Railway assigns a public URL (e.g. `https://predictiq-production.up.railway.app`).

---

### Option 2: Render.com (Free Tier with Persistent Disk)

Render supports our [`render.yaml`](file:///home/ribs/freee/render.yaml) blueprint:

1. Sign up at [render.com](https://render.com).
2. Click **New +** $\rightarrow$ **Blueprint**.
3. Connect your GitHub repository: `bash30ribs/predictiq`.
4. Render automatically configures the web service and attaches the persistent disk `/opt/render/project/src/frontend/data`.
5. Click **Apply**.
6. Your app is live with automated SSL certificates.

---

### Option 3: Docker & Cloud VPS (DigitalOcean / AWS EC2 / Hetzner)

If you have a Linux virtual machine:

1. Clone your repository:
   ```bash
   git clone https://github.com/bash30ribs/predictiq.git
   cd predictiq
   ```
2. Run with Docker Compose:
   ```bash
   docker compose up -d --build
   ```
3. Your app is running on port 3000, and SQLite database data is safely mounted to `./frontend/data`.

---

### Option 4: Pure Serverless via Vercel + Turso Cloud SQLite

If you prefer Vercel's edge network:
1. Create a free database on [turso.tech](https://turso.tech) (`turso db create predictiq`).
2. Set environment variables `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`.
3. Connect `bash30ribs/predictiq` on [vercel.com](https://vercel.com) and deploy.
