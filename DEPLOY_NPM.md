# Full Deployment via NPM

This guide shows how to deploy both frontend and backend using npm commands - no external services like Railway needed!

## Prerequisites

1. **Node.js 18+** installed
2. **Vercel account** (free tier available) - Sign up at [vercel.com](https://vercel.com)
3. **OpenAI API Key** (already saved in GitHub secrets)

## Initial Setup (One Time)

### 1. Install Dependencies

```bash
npm install
```

This installs:
- Frontend dependencies
- Vercel CLI (for backend deployment)

### 2. Login to Vercel

```bash
npx vercel login
```

Follow the prompts to authenticate with Vercel (you can use GitHub to sign in).

### 3. Link Your Backend to Vercel

```bash
cd backend
npx vercel link
```

When prompted:
- **Set up and develop?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → `protocolassist-backend` (or your choice)
- **Directory?** → `./` (current directory)

### 4. Set Environment Variables

```bash
cd backend
npx vercel env add OPENAI_API_KEY
```

When prompted:
- **What's the value of OPENAI_API_KEY?** → Enter your OpenAI API key (from GitHub secrets)
- **Which Environments should it be available on?** → Select all (Production, Preview, Development)

**Or set it via Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add `OPENAI_API_KEY` with your key value

## Deployment

### Deploy Everything (Frontend + Backend)

From the project root:

```bash
npm run deploy:all
```

This will:
1. Deploy backend to Vercel (gets URL automatically)
2. Deploy frontend to GitHub Pages
3. You'll see the backend URL in the terminal output

### Deploy Backend Only

```bash
npm run deploy:backend
```

After deployment, Vercel will show you the backend URL:
```
✅ Production: https://protocolassist-backend.vercel.app
```

**Save this URL!** You'll need it to configure the frontend.

### Deploy Frontend Only

```bash
npm run deploy:frontend
```

## After First Backend Deployment

1. **Get your Vercel backend URL:**
   - It will be shown in the terminal after `npm run deploy:backend`
   - Or check: `cd backend && npx vercel ls`
   - Or visit Vercel dashboard: https://vercel.com/dashboard

2. **Configure GitHub Pages:**
   - Visit: `https://saumitradube.github.io/protocolassist`
   - Click the **Settings icon** (⚙️) in the navigation bar
   - Enter your Vercel backend URL (e.g., `https://protocolassist-backend.vercel.app`)
   - Click **"Test Connection"** to verify
   - Click **"Save"** to store the URL

3. **That's it!** Your app is now fully deployed and working.

## Quick Commands Reference

```bash
# Install all dependencies
npm install

# Deploy everything
npm run deploy:all

# Deploy backend only
npm run deploy:backend

# Deploy frontend only  
npm run deploy:frontend

# View Vercel deployments
npx vercel ls

# View Vercel logs
npx vercel logs
```

## Troubleshooting

### Backend deployment fails

1. **Check Vercel CLI is installed:**
   ```bash
   npx vercel --version
   ```

2. **Verify environment variables:**
   ```bash
   cd backend
   npx vercel env ls
   ```

3. **Check Vercel dashboard:** https://vercel.com/dashboard

### Frontend can't connect to backend

1. **Verify backend URL is correct:**
   - Get URL: `npx vercel ls` or check Vercel dashboard
   - Test: `curl https://your-backend.vercel.app/api/health`

2. **Check CORS settings:**
   - Backend should allow `https://saumitradube.github.io`
   - Already configured in `backend/app/main.py`

3. **Update API URL in GitHub Pages:**
   - Click Settings icon
   - Enter correct backend URL
   - Test and save

## Notes

- **Vercel Free Tier:**
  - 100GB bandwidth/month
  - Serverless functions with 10s timeout
  - Perfect for this application

- **Storage:**
  - ChromaDB data is stored in `/tmp` on Vercel (ephemeral)
  - For persistent storage, consider upgrading or using external storage

- **Auto-deployment:**
  - Vercel can auto-deploy on git push (optional)
  - Configure in Vercel dashboard → Settings → Git

