# StoryVibe — Team Collaboration Guide

How to invite other people to work on this project with you.

---

## Option 1: Git + GitHub (Recommended for Code)

Best for: Multiple developers editing code simultaneously

### Step 1: Create a GitHub Repository
1. Go to https://github.com/new
2. Name it `storyvibe` (or any name)
3. Choose "Private" repository
4. Click "Create repository"

### Step 2: Upload Your Code
In Terminal (in this project folder):
```bash
git init
git add .
git commit -m "Initial StoryVibe project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/storyvibe.git
git push -u origin main
```

### Step 3: Invite Team Members
1. On GitHub, go to your repository
2. Click Settings → Collaborators → Add people
3. Enter their GitHub username or email
4. They will receive an invitation email

### Step 4: Team Members Download and Run
They only need to:
```bash
git clone https://github.com/YOUR_USERNAME/storyvibe.git
cd storyvibe
npm install --legacy-peer-deps
npm run build
./start.sh        # Mac/Linux
# or: start.bat   # Windows
```

### Real-Time Code Collaboration (Optional)
Install VS Code + Live Share extension:
1. Both open the project in VS Code
2. Click the Live Share icon in the bottom bar
3. Share the link — both can edit the same file simultaneously

---

## Option 2: Supabase Realtime (Data Sync)

Best for: Sharing scripts, assets, and generated content between users

StoryVibe already uses Supabase for cloud storage. Multiple users can:
- Share the same Supabase project
- See each other's scripts in real-time
- Collaborate on the same script

### How to Set Up Shared Supabase
1. One person creates a Supabase project: https://supabase.com
2. Go to Project Settings → API → copy URL and Anon Key
3. All team members paste these into Developer Settings (user icon → Developer Access)
4. Everyone's data syncs automatically

---

## Option 3: Cloud Deployment (Everyone Accesses the Same Instance)

Best for: Non-technical team members who just need to use the tool

Deploy to a cloud platform so everyone accesses the same URL:

### Free Options
- **Vercel** (frontend only): https://vercel.com — drag `dist/` folder
- **Railway/Render** (full stack): https://railway.app or https://render.com
- **Docker on any VPS**: Run `docker compose up` on a server

Once deployed, simply share the URL with your team. No installation needed.

---

## Quick Comparison

| Method | Best For | Technical Level |
|--------|---------|----------------|
| Git + GitHub | Code collaboration | Medium |
| Supabase | Data/sharing | Low |
| Cloud Deploy | End users | Very Low |

---

## Recommended Workflow

For a typical team:
1. **Developers**: Use Git + GitHub for code collaboration
2. **Content creators**: Use the cloud-deployed version (no setup)
3. **Everyone**: Share one Supabase project for data sync
