# Simple Deployment Guide

This app uses GitHub Pages for frontend (just like your other project) and the backend can be configured separately.

## Frontend Deployment (GitHub Pages)

The frontend is deployed exactly like your other project:

```bash
npm run deploy:frontend
```

Or from frontend directory:
```bash
cd frontend
npm run deploy
```

This deploys to: `https://saumitradube.github.io/protocolassist`

## Backend Options

Since GitHub Pages only hosts static files, you have two options:

### Option 1: Use Runtime Configuration (Recommended - Already Set Up!)

The frontend has a **Settings button** that lets you configure the backend URL at runtime. No rebuild needed!

1. Deploy frontend: `npm run deploy:frontend`
2. Visit: `https://saumitradube.github.io/protocolassist`
3. Click the **Settings icon** (⚙️) in the navigation bar
4. Enter your backend URL (from any service you prefer)
5. Test and save

The URL is saved in your browser's localStorage.

### Option 2: Deploy Backend Separately

You can deploy the backend to any Python hosting service:
- **Render** (free tier)
- **Railway** 
- **Fly.io**
- **Heroku**
- Any other Python hosting

Then configure the frontend using Option 1 above.

## Local Development

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend  
npm run dev:frontend
```

The frontend automatically uses `http://localhost:8000` when running locally.

## That's It!

- Frontend: GitHub Pages (via npm, just like your other project)
- Backend: Configure via Settings UI (no rebuild needed)
- No Vercel, Railway, or other services required for frontend

