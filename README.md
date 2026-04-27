# StoryVibe — AI Narrative Workbench

> Turn creative sparks into production-ready scripts. AI-powered narrative workbench for video creators.

---

## Quick Start — Choose Your Path

### Option A: Docker (Recommended — Easiest)

**Requirements:** Docker Desktop installed

1. Install Docker Desktop: https://www.docker.com/products/docker-desktop
2. Open Terminal (Mac/Linux) or PowerShell (Windows) in this folder
3. Run:
   ```bash
   docker compose up
   ```
4. Open browser: http://localhost:3000

That's it. Both frontend and backend start automatically.

---

### Option B: Native Launch (No Docker)

**Requirements:** Node.js v18+ installed

#### Windows
1. Install Node.js: https://nodejs.org (download LTS, click Next until done)
2. Double-click `start.bat`
3. Open browser: http://localhost:3000

#### Mac
1. Install Node.js: https://nodejs.org (download LTS, double-click .pkg)
2. Open Terminal, drag this folder into Terminal, press Enter
3. Type: `./start.sh`
4. Open browser: http://localhost:3000

#### Linux
1. Install Node.js: `sudo apt install nodejs npm`
2. `cd` to this folder
3. `./start.sh`
4. Open browser: http://localhost:3000

---

### Option C: Manual (Developers)

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Build frontend
npm run build

# 3. Start backend (in one terminal)
node server/index.js

# 4. Start frontend (in another terminal)
npx serve dist -l 3000 --single

# 5. Open http://localhost:3000
```

---

## Project Structure

```
StoryVibe/
  start.bat          ← Windows: double-click to run
  start.sh           ← Mac/Linux: run ./start.sh
  docker-compose.yml ← Docker: run docker compose up
  Dockerfile         ← Container build config
  
  dist/              ← Built frontend (static files)
  server/            ← Backend API (Node.js + Express)
  src/               ← Frontend source code (React + TypeScript)
  
  README.md          ← This file
  package.json       ← Dependencies
```

---

## Developer Mode

1. Click the user icon in the sidebar
2. Enter password: `canvas2026`
3. Access API keys, OMNI diagnostics, and backend configuration

---

## Troubleshooting

### "Cannot find module" errors
Run `npm install --legacy-peer-deps` again.

### Port 3000 already in use
Kill the process: `lsof -ti:3000 | xargs kill -9` (Mac/Linux) or `taskkill /F /IM node.exe` (Windows)

### Zip extraction fails
Use 7-Zip (Windows): https://www.7-zip.org — or macOS built-in Archive Utility.

---

## Team Collaboration

See [COLLABORATION.md](./COLLABORATION.md) for how to invite team members to work on this project together.
