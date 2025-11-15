# Deployment Guide

This guide explains how to deploy the Protocol Assistant application.

## Frontend Deployment (GitHub Pages)

The frontend is deployed manually using a command-line script that builds locally and pushes to the `gh-pages` branch.

### Prerequisites

1. **Enable GitHub Pages** in your repository:
   - Go to Settings → Pages
   - Source: Select "Deploy from a branch"
   - Branch: Select `gh-pages` / `root`
   - Save

2. **Set Environment Variable** (optional):
   - Set `REACT_APP_API_BASE_URL` environment variable before deploying
   - Example: `export REACT_APP_API_BASE_URL=https://your-backend.railway.app`
   - If not set, defaults to `http://localhost:8000` (for development)

### Manual Deployment

#### Option 1: Using the deploy script (Recommended)

From the project root directory:

```bash
# Set your backend API URL (optional, defaults to localhost:8000)
export REACT_APP_API_BASE_URL=https://your-backend-url.com

# Run the deployment script
./deploy.sh
```

#### Option 2: Using npm scripts directly

From the `frontend` directory:

```bash
cd frontend

# Set your backend API URL (optional)
export REACT_APP_API_BASE_URL=https://your-backend-url.com

# Build and deploy
npm run deploy
```

This will:
1. Build the React app (`npm run build`)
2. Deploy to the `gh-pages` branch
3. Your site will be available at `https://saumitradube.github.io/protocolassist`

### First Time Setup

If this is your first deployment, you may need to configure git:

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

The `gh-pages` package will automatically create the `gh-pages` branch and push the built files.

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
- Check `REACT_APP_API_BASE_URL` environment variable is set correctly before building
- Verify backend is running and accessible
- Check CORS settings in backend (should include `https://saumitradube.github.io`)

### Build fails
- Check Node.js version (should be 18+)
- Verify all dependencies are installed: `cd frontend && npm install --legacy-peer-deps`
- Check build logs in terminal output

### Deployment fails
- Ensure you have git configured: `git config user.name` and `git config user.email`
- Check that you have push access to the repository
- Verify the `gh-pages` package is installed: `npm list gh-pages`

### Backend deployment fails
- Verify `OPENAI_API_KEY` is set correctly
- Check Python version compatibility
- Review deployment logs

## Local Development

For local development, both services should run:
- Backend: `cd backend && uvicorn app.main:app --reload`
- Frontend: `cd frontend && npm start`

Frontend will use `http://localhost:8000` by default (see `frontend/src/api/client.ts`).

