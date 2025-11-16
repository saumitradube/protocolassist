# GitHub Actions Backend Deployment Setup

This guide will help you set up automatic backend deployment using GitHub Actions to Render.

## Step 1: Get Render API Key

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click on your account → **Account Settings**
3. Scroll to **API Keys** section
4. Click **"Create API Key"**
5. Give it a name (e.g., "GitHub Actions")
6. **Copy the API key** - you'll need it in the next step

## Step 2: Create Backend Service on Render (First Time Only)

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
7. Wait for first deployment to complete

## Step 3: Get Service ID

1. In Render dashboard, click on your service
2. Look at the URL - it will be something like: `https://dashboard.render.com/web/protocolassist-backend-xxxxx`
3. The Service ID is the part after the last dash: `xxxxx`
4. Or go to **Settings** → **Service Details** → Copy the **Service ID**

## Step 4: Add GitHub Secrets

1. Go to your GitHub repository: https://github.com/saumitradube/protocolassist
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add two secrets:

   **Secret 1:**
   - **Name**: `RENDER_API_KEY`
   - **Value**: Your Render API key (from Step 1)

   **Secret 2:**
   - **Name**: `RENDER_SERVICE_ID`
   - **Value**: Your Service ID (from Step 3)

## Step 5: Test Deployment

1. Make a small change to any file in `backend/` directory
2. Commit and push:
   ```bash
   git add backend/
   git commit -m "Test backend deployment"
   git push origin main
   ```
3. Go to **Actions** tab in GitHub
4. Watch the workflow run
5. Once complete, your backend will be deployed automatically!

## How It Works

- **Automatic**: Every time you push changes to `backend/` folder, it auto-deploys
- **Manual**: You can also trigger manually from Actions tab → "Deploy Backend" → "Run workflow"
- **Fast**: Deployment takes 2-5 minutes

## Verify Deployment

After deployment, test your backend:
```
https://your-service-name.onrender.com/api/health
```

Should return: `{"status": "healthy", "service": "clinical-protocol-assistant"}`

## Configure Frontend

1. Visit: `https://saumitradube.github.io/protocolassist`
2. Click Settings icon (⚙️)
3. Enter your Render backend URL
4. Test and save

## Troubleshooting

### Workflow fails:
- Check that `RENDER_API_KEY` and `RENDER_SERVICE_ID` secrets are set correctly
- Verify the Service ID matches your Render service
- Check Actions logs for detailed error messages

### Backend not updating:
- Make sure you're pushing to `main` branch
- Verify changes are in `backend/` directory
- Check Render dashboard for deployment status

