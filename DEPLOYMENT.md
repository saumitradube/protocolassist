# Deployment Guide

This guide explains how to deploy the Protocol Assistant application.

## Frontend Deployment (GitHub Pages)

The frontend is configured to deploy automatically to GitHub Pages via GitHub Actions.

### Prerequisites

1. **Enable GitHub Pages** in your repository:
   - Go to Settings → Pages
   - Source: Select "GitHub Actions"
   - Save

2. **Set Repository Secrets** (Settings → Secrets and variables → Actions):
   - `REACT_APP_API_BASE_URL`: Your backend API URL (e.g., `https://your-backend.railway.app` or `https://your-backend.render.com`)
   - `OPENAI_API_KEY`: Already set (for backend use)

### Automatic Deployment

The workflow automatically deploys when you push to the `main` branch:
- Builds the React app
- Deploys to `https://saumitradube.github.io/protocolassist`

### Manual Deployment

You can also trigger deployment manually:
- Go to Actions tab
- Select "Deploy to GitHub Pages"
- Click "Run workflow"

## Backend Deployment

GitHub Pages only hosts static sites, so the backend must be deployed separately. Here are recommended options:

### Option 1: Railway

1. Create account at [railway.app](https://railway.app)
2. New Project → Deploy from GitHub repo
3. Select your repository
4. Set root directory to `backend`
5. Add environment variable:
   - `OPENAI_API_KEY`: Your OpenAI API key (from GitHub secrets)
6. Railway will auto-detect Python and install dependencies
7. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
8. Get your Railway URL (e.g., `https://your-app.railway.app`)
9. Update `REACT_APP_API_BASE_URL` in GitHub secrets with this URL

### Option 2: Render

1. Create account at [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repository
4. Settings:
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Environment: Python 3
5. Add environment variable:
   - `OPENAI_API_KEY`: Your OpenAI API key
6. Deploy and get your Render URL
7. Update `REACT_APP_API_BASE_URL` in GitHub secrets

### Option 3: Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment: `heroku config:set OPENAI_API_KEY=your-key`
5. Deploy: `git subtree push --prefix backend heroku main`
6. Get your Heroku URL
7. Update `REACT_APP_API_BASE_URL` in GitHub secrets

## CORS Configuration

Make sure your backend allows requests from GitHub Pages. Update `backend/app/main.py`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://saumitradube.github.io",
        "http://localhost:3000",  # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Testing the Deployment

1. **Frontend**: Visit `https://saumitradube.github.io/protocolassist`
2. **Backend**: Test API at `https://your-backend-url/api/health`
3. **Full Flow**: Upload a document and send a chat message

## Troubleshooting

### Frontend can't connect to backend
- Check `REACT_APP_API_BASE_URL` is set correctly in GitHub secrets
- Verify backend is running and accessible
- Check CORS settings in backend

### Build fails
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs in Actions tab

### Backend deployment fails
- Verify `OPENAI_API_KEY` is set correctly
- Check Python version compatibility
- Review deployment logs

## Local Development

For local development, both services should run:
- Backend: `cd backend && uvicorn app.main:app --reload`
- Frontend: `cd frontend && npm start`

Frontend will use `http://localhost:8000` by default (see `frontend/src/api/client.ts`).

