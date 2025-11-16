# GitHub Actions Backend Deployment Setup

Choose one of the options below to deploy your backend automatically via GitHub Actions.

## Option 1: Render (Recommended - Free Tier)

### Step 1: Create Render Service (One Time)

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub and select `saumitradube/protocolassist`
4. Configure:
   - **Name**: `protocolassist-backend`
   - **Region**: Choose closest
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free
5. Add Environment Variable:
   - **Key**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key
6. Click **"Create Web Service"**
7. Wait for first deployment

### Step 2: Get Render API Credentials

1. In Render dashboard, go to **Account Settings** → **API Keys**
2. Click **"Create API Key"**
3. Copy the API key
4. In your service page, copy the **Service ID** from the URL or Settings

### Step 3: Add GitHub Secrets

1. Go to: https://github.com/saumitradube/protocolassist/settings/secrets/actions
2. Add two secrets:

   **Secret 1:**
   - **Name**: `RENDER_API_KEY`
   - **Value**: Your Render API key

   **Secret 2:**
   - **Name**: `RENDER_SERVICE_ID`
   - **Value**: Your Service ID (from service URL or settings)

### Step 4: Enable Workflow

The workflow file `.github/workflows/deploy-backend.yml` is already created. It will:
- Automatically deploy when you push changes to `backend/` folder
- Can be triggered manually from Actions tab

### Step 5: Test

1. Make a small change to any file in `backend/`
2. Commit and push:
   ```bash
   git add backend/
   git commit -m "Test GitHub Actions deployment"
   git push origin main
   ```
3. Go to **Actions** tab to watch deployment
4. Check Render dashboard for deployment status

---

## Option 2: Railway (Alternative)

### Step 1: Create Railway Project

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. New Project → Deploy from GitHub repo
4. Select `saumitradube/protocolassist`
5. Settings:
   - Root Directory: `backend`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Variables → Add `OPENAI_API_KEY`

### Step 2: Get Railway Token

1. Go to Railway dashboard → Account Settings
2. Generate new token
3. Copy the token

### Step 3: Add GitHub Secrets

1. Go to GitHub repository settings → Secrets
2. Add:
   - **Name**: `RAILWAY_TOKEN`
   - **Value**: Your Railway token
   - **Name**: `RAILWAY_SERVICE_ID`
   - **Value**: Your service ID (from Railway dashboard)

### Step 4: Rename Workflow

Rename `.github/workflows/deploy-backend-railway.yml` to `deploy-backend.yml` (or keep both)

---

## How It Works

### Automatic Deployment
- Every push to `main` branch with changes in `backend/` folder triggers deployment
- GitHub Actions runs the workflow
- Backend is automatically deployed to Render/Railway

### Manual Deployment
- Go to **Actions** tab
- Select **"Deploy Backend"** workflow
- Click **"Run workflow"**

### Workflow Steps
1. ✅ Checkout code
2. ✅ Trigger deployment (Render) or Deploy (Railway)
3. ✅ Service builds and deploys automatically

## Verify Deployment

After deployment completes:

1. **Test Backend:**
   ```
   https://your-service-name.onrender.com/api/health
   ```
   Should return: `{"status": "healthy", "service": "clinical-protocol-assistant"}`

2. **Configure Frontend:**
   - Visit: `https://saumitradube.github.io/protocolassist`
   - Click Settings icon (⚙️)
   - Enter backend URL
   - Test and save

## Troubleshooting

### Workflow fails:
- ✅ Check GitHub secrets are set correctly
- ✅ Verify Service ID matches your service
- ✅ Check Actions logs for detailed errors

### Backend not updating:
- ✅ Ensure you're pushing to `main` branch
- ✅ Verify changes are in `backend/` directory
- ✅ Check service dashboard for deployment status

### First deployment slow:
- ✅ First deployment takes 5-10 minutes (normal)
- ✅ Subsequent deployments are faster (2-5 minutes)

## Quick Commands

```bash
# Test deployment
git add backend/
git commit -m "Update backend"
git push origin main

# Check workflow status
# Go to: https://github.com/saumitradube/protocolassist/actions
```

