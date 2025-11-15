#!/bin/bash

# Deployment script for GitHub Pages
# This script builds the frontend and deploys it to the gh-pages branch

set -e  # Exit on error

echo "🚀 Starting deployment to GitHub Pages..."

# Navigate to frontend directory
cd frontend

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Set API base URL from environment variable or use default
export REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL:-"http://localhost:8000"}

echo "🔨 Building React app..."
echo "   API Base URL: $REACT_APP_API_BASE_URL"

# Build the app
npm run build

echo "📤 Deploying to GitHub Pages (gh-pages branch)..."

# Deploy to gh-pages branch
npm run deploy

echo "✅ Deployment complete!"
echo "🌐 Your site should be available at: https://saumitradube.github.io/protocolassist"
echo ""
echo "Note: It may take a few minutes for changes to appear."

