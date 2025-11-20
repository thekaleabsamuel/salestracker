@echo off
REM Sales Tracker - Quick Setup Script (Windows)
REM This script sets up the environment files for easy plug-and-play setup

echo.
echo 🚀 Sales Tracker - Quick Setup
echo ================================
echo.

REM Check if .env already exists
if exist ".env" (
    echo ⚠️  Frontend .env file already exists. Skipping...
) else (
    echo 📝 Creating frontend .env file...
    copy env.example .env >nul
    echo ✅ Frontend .env created!
)

REM Check if server\.env already exists
if exist "server\.env" (
    echo ⚠️  Backend .env file already exists. Skipping...
) else (
    echo 📝 Creating backend .env file...
    copy server\.env.example server\.env >nul
    echo ✅ Backend .env created!
    echo.
    echo ⚠️  IMPORTANT: Edit server\.env and add your Google Places API key!
    echo    Open server\.env and replace YOUR_API_KEY_HERE with your actual API key
)

echo.
echo ✨ Setup complete!
echo.
echo Next steps:
echo 1. Edit server\.env and add your Google Places API key
echo 2. Run: npm install (in root directory)
echo 3. Run: cd server ^&^& npm install
echo 4. Start backend: cd server ^&^& npm start
echo 5. Start frontend: npm run dev (in new terminal)
echo.

pause

