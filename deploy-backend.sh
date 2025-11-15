#!/bin/bash

# Backend Deployment Preparation Script
# This script helps prepare your backend for deployment

set -e

echo "🚀 Backend Deployment Preparation"
echo "=================================="
echo ""

# Check if we're in the right directory
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "✅ Checking backend files..."

# Check required files
if [ -f "backend/requirements.txt" ]; then
    echo "  ✓ requirements.txt found"
else
    echo "  ❌ requirements.txt missing"
    exit 1
fi

if [ -f "backend/app/main.py" ]; then
    echo "  ✓ main.py found"
else
    echo "  ❌ main.py missing"
    exit 1
fi

echo ""
echo "📋 Deployment Checklist:"
echo ""
echo "1. ✅ Backend files are ready"
echo "2. ⏳ Go to https://render.com and sign up/login"
echo "3. ⏳ Create new Web Service"
echo "4. ⏳ Connect GitHub repository: saumitradube/protocolassist"
echo "5. ⏳ Configure settings (see DEPLOY_BACKEND.md)"
echo "6. ⏳ Add OPENAI_API_KEY environment variable"
echo "7. ⏳ Deploy and get your backend URL"
echo "8. ⏳ Configure frontend with backend URL"
echo ""
echo "📖 Detailed instructions: See DEPLOY_BACKEND.md"
echo ""
echo "🔗 Quick Links:"
echo "   - Render Dashboard: https://dashboard.render.com"
echo "   - Frontend: https://saumitradube.github.io/protocolassist"
echo ""

