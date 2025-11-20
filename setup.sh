#!/bin/bash

# Sales Tracker - Quick Setup Script
# This script sets up the environment files for easy plug-and-play setup

echo "🚀 Sales Tracker - Quick Setup"
echo "================================"
echo ""

# Check if .env already exists
if [ -f ".env" ]; then
    echo "⚠️  Frontend .env file already exists. Skipping..."
else
    echo "📝 Creating frontend .env file..."
    cp env.example .env
    echo "✅ Frontend .env created!"
fi

# Check if server/.env already exists
if [ -f "server/.env" ]; then
    echo "⚠️  Backend .env file already exists. Skipping..."
else
    echo "📝 Creating backend .env file..."
    cp server/.env.example server/.env
    echo "✅ Backend .env created!"
    echo ""
    echo "⚠️  IMPORTANT: Edit server/.env and add your Google Places API key!"
    echo "   Open server/.env and replace YOUR_API_KEY_HERE with your actual API key"
fi

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit server/.env and add your Google Places API key"
echo "2. Run: npm install (in root directory)"
echo "3. Run: cd server && npm install"
echo "4. Start backend: cd server && npm start"
echo "5. Start frontend: npm run dev (in new terminal)"
echo ""

