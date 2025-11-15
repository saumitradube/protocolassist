# Quick Backend Deployment Guide

Your frontend is live but needs a backend API. Here are the fastest ways to deploy:

## 🚀 Option 1: Railway (Easiest - Recommended)

1. Go to [railway.app](https://railway.app) and sign up/login
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository: `saumitradube/protocolassist`
4. In the project settings:
   - **Root Directory**: Set to `backend`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Go to Variables tab and add:
   - `OPENAI_API_KEY` = (your OpenAI API key from GitHub secrets)
6. Railway will auto-deploy. Get your URL (e.g., `https://your-app.railway.app`)
7. **Important**: Update CORS in `backend/app/main.py` to include your Railway URL if needed

## 🚀 Option 2: Render (Free Tier Available)

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New" → "Web Service"
3. Connect your GitHub repository: `saumitradube/protocolassist`
4. Configure:
   - **Name**: `protocolassist-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variable:
   - `OPENAI_API_KEY` = (your OpenAI API key)
6. Click "Create Web Service"
7. Get your Render URL (e.g., `https://your-app.onrender.com`)

## 🔄 After Backend is Deployed

Once you have your backend URL (e.g., `https://your-app.railway.app`):

1. **Redeploy frontend with the new API URL:**
   ```bash
   export REACT_APP_API_BASE_URL=https://your-backend-url.com
   ./deploy.sh
   ```

2. **Verify CORS is configured** - The backend should already allow `https://saumitradube.github.io` (we updated it earlier)

3. **Test the connection:**
   - Visit: `https://your-backend-url.com/api/health`
   - Should return: `{"status": "healthy", "service": "clinical-protocol-assistant"}`

## ⚠️ Important Notes

- The backend needs persistent storage for ChromaDB. Railway and Render provide this.
- Make sure your OpenAI API key is set correctly in the deployment platform
- The CORS configuration in `backend/app/main.py` already includes GitHub Pages origin

