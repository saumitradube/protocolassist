# Backend URL Configuration

## ✅ Backend is Live!

**Backend URL:** `https://protocolassist.onrender.com`

**Health Check:** https://protocolassist.onrender.com/api/health
- Status: ✅ Healthy

## Configure Frontend

### Step 1: Visit Frontend
Go to: https://saumitradube.github.io/protocolassist

### Step 2: Open Settings
Click the **Settings icon (⚙️)** in the top navigation bar

### Step 3: Enter Backend URL
- **API Base URL:** `https://protocolassist.onrender.com`
- Click **"Test Connection"** to verify
- Click **"Save"** to store the URL

### Step 4: Test the App
1. Upload a PDF document
2. Send a chat message
3. Verify everything works!

## API Endpoints

- **Health Check:** `https://protocolassist.onrender.com/api/health`
- **Upload Documents:** `POST https://protocolassist.onrender.com/api/upload`
- **Chat:** `POST https://protocolassist.onrender.com/api/chat`

## GitHub Actions

The backend will automatically redeploy when you push changes to the `backend/` folder.

To update GitHub Actions with your Render Service ID:
1. Go to Render Dashboard
2. Find your Service ID
3. Add to GitHub Secrets: `RENDER_SERVICE_ID`

## Notes

- **Free Tier:** Render free tier may spin down after inactivity
- **First Request:** May take 30-60 seconds if service was idle
- **CORS:** Already configured for GitHub Pages

