# JobBuddy AI — Deployment Guide

## Option 1: Render + Vercel (Split Deploy)

### Step 1 — Backend on Render
1. Push code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo
4. Set **Root Directory** to `server`
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `npm start`
7. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `8080` |
| `MONGO_URI` | *(your Atlas connection string)* |
| `DB_NAME` | `jobbuddy` |
| `JWT_SECRET` | *(generate below)* |
| `GEMINI_API_KEY` | *(your Gemini key)* |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app` |
| `LOG_LEVEL` | `info` |

8. Copy your Render URL: `https://jobbuddy-xxx.onrender.com`

### Step 2 — Frontend on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import repo
2. Set **Root Directory** to `client`
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `dist`
5. Add **Environment Variable**:

| Key | Value |
|-----|-------|
| `VITE_API_TARGET` | `https://jobbuddy-xxx.onrender.com` |

6. Update `vercel.json` → replace `your-render-backend.onrender.com` with actual URL
7. Deploy!

---

## ✅ Option 2: Render Full-Stack (Single Service) — RECOMMENDED

This is the simplest deployment. One Render service hosts both the Express API and the built React frontend. No Vercel needed.

### How it works
```
Render Service
└── Express (port 8080)
    ├── /api/v1/*     → API routes (auth, jobs, interview, quiz…)
    └── /*            → Serves client/dist/index.html (React SPA)
```

The frontend uses relative API paths (`/api/v1/...`) so everything runs on the same domain — no CORS issues.

---

### Step-by-Step Deployment

#### 1. Set up MongoDB Atlas
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create free M0 cluster
2. Database Access → Add user with `readWrite` on `jobbuddy`
3. Network Access → Add `0.0.0.0/0` (allow all IPs)
4. Connect → Drivers → Copy the connection string

#### 2. Get your Gemini API Key
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create an API key → copy it

#### 3. Generate a JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy the output — this is your `JWT_SECRET`.

#### 4. Push code to GitHub
```bash
cd c:\Users\Hp\Downloads\JobBuddyFinal\Job_Buddy
git init
git add .
git commit -m "Initial production commit"
git remote add origin https://github.com/YOUR_USERNAME/jobbuddy-ai.git
git push -u origin main
```

#### 5. Create Render Web Service
1. Go to [render.com](https://render.com) → New → **Web Service**
2. Connect your GitHub repository
3. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `jobbuddy-ai` |
| **Region** | Singapore (or nearest) |
| **Root Directory** | *(leave blank — uses repo root)* |
| **Environment** | `Node` |
| **Build Command** | `npm run build:full` |
| **Start Command** | `npm run start:prod` |
| **Plan** | Free |

4. Click **Advanced** → Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `8080` |
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net` |
| `DB_NAME` | `jobbuddy` |
| `JWT_SECRET` | *(your 64-char hex from Step 3)* |
| `GEMINI_API_KEY` | *(your Gemini key from Step 2)* |
| `LOG_LEVEL` | `info` |

> ⚠️ **Do NOT set `ALLOWED_ORIGINS`** — not needed for full-stack single-service deployment.

5. Click **Create Web Service** → Render builds and deploys automatically.

#### 6. Verify Deployment
After deploy (3–5 minutes):
```
GET https://jobbuddy-ai.onrender.com/api/v1/health
→ {"status":"ok","environment":"production","timestamp":"..."}
```

Open `https://jobbuddy-ai.onrender.com` — your full app is live!

---

### What Render Does (Automatic)

```
Build phase (render.yaml → build:full):
  1. cd client && npm install    (installs React deps)
  2. npm run build               (creates client/dist/)
  3. cd server && npm install    (installs Express deps)

Start phase:
  4. cd server && node index.js  (Express serves API + client/dist)
```

---

## Option 3: Docker (Self-Hosted / VPS)

```bash
# Clone repo
git clone https://github.com/YOUR_USERNAME/jobbuddy-ai.git
cd jobbuddy-ai

# Configure environment
cp server/.env.example server/.env
# Edit server/.env with your MongoDB Atlas URI, JWT_SECRET, GEMINI_API_KEY

# Build and run
docker-compose up -d

# Verify
curl http://localhost:8080/api/v1/health
```

---

## MongoDB Atlas Quick Setup

1. [cloud.mongodb.com](https://cloud.mongodb.com) → Create free **M0** cluster
2. **Database Access** → Add user → Password auth → `readWrite` on `jobbuddy`
3. **Network Access** → Add IP `0.0.0.0/0`
4. **Connect** → Drivers → Copy string like:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net
   ```
5. Use this as `MONGO_URI`

---

## Environment Variables Reference

### Server (`server/.env`)
```env
NODE_ENV=production
PORT=8080
MONGO_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net
DB_NAME=jobbuddy
JWT_SECRET=<64-char random hex>
GEMINI_API_KEY=<your-gemini-api-key>
LOG_LEVEL=info
# ALLOWED_ORIGINS=  ← only for split Vercel+Render deploy
```

---

## Health Check
```
GET /api/v1/health
→ 200 {"status":"ok","environment":"production","timestamp":"..."}
```

---

## Security Checklist Before Going Live
- [ ] `JWT_SECRET` is a 64-char random hex (not a simple word)
- [ ] `GEMINI_API_KEY` is not in git (`.gitignore` covers `server/.env`)
- [ ] MongoDB Atlas IP allowlist is `0.0.0.0/0` or Render's static IP
- [ ] `NODE_ENV=production` is set on Render
- [ ] Health check returns `200 ok` after deploy
