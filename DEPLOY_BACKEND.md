# Backend Deployment Guide

This guide will help you deploy the FastAPI backend to Render (free tier).

## Step 1: Create Render Account

1. Go to [render.com](https://render.com)
2. Click **"Get Started for Free"**
3. Sign up with your GitHub account (recommended) or email

## Step 2: Create New Web Service

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub account if not already connected
3. Select your repository: `saumitradube/protocolassist`

## Step 3: Configure Backend Service

Fill in the following settings:

### Basic Settings:
- **Name**: `protocolassist-backend` (or any name you prefer)
- **Region**: Choose closest to you (e.g., `Oregon (US West)`)
- **Branch**: `main`
- **Root Directory**: `backend`

### Build & Deploy:
- **Environment**: `Python 3`
- **Build Command**: 
  ```bash
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```bash
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```

### Environment Variables:
Click **"Add Environment Variable"** and add:

- **Key**: `OPENAI_API_KEY`
- **Value**: Your OpenAI API key (you mentioned you saved it as a GitHub secret - use that value, or get it from https://platform.openai.com/api-keys)

### Plan:
- Select **"Free"** plan

## Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying your backend
3. Wait for deployment to complete (usually 2-5 minutes)
4. Once deployed, you'll see a URL like: `https://protocolassist-backend.onrender.com`

## Step 5: Configure Frontend

1. Visit your frontend: `https://saumitradube.github.io/protocolassist`
2. Click the **Settings icon** (⚙️) in the navigation bar
3. Enter your Render backend URL (e.g., `https://protocolassist-backend.onrender.com`)
4. Click **"Test Connection"** to verify
5. Click **"Save"**

## Step 6: Test the Deployment

1. **Test Backend Health:**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{"status": "healthy", "service": "clinical-protocol-assistant"}`

2. **Test Full Flow:**
   - Go to your frontend
   - Upload a PDF document
   - Send a chat message

## Troubleshooting

### Backend won't start:
- Check build logs in Render dashboard
- Verify `requirements.txt` has all dependencies
- Check that `OPENAI_API_KEY` is set correctly

### CORS errors:
- The backend already allows `https://saumitradube.github.io` in CORS settings
- If you get CORS errors, check `backend/app/main.py` CORS configuration

### Slow first request:
- Render free tier spins down after inactivity
- First request after idle time may take 30-60 seconds
- This is normal for free tier

## Alternative: Railway (If Render doesn't work)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. New Project → Deploy from GitHub repo
4. Select `saumitradube/protocolassist`
5. Settings:
   - Root Directory: `backend`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Variables → Add `OPENAI_API_KEY`
7. Get your Railway URL

## Quick Reference

**Render Backend URL Format:**
```
https://your-service-name.onrender.com
```

**Test Endpoint:**
```
https://your-service-name.onrender.com/api/health
```

**Frontend Configuration:**
- Settings icon → Enter backend URL → Test → Save

