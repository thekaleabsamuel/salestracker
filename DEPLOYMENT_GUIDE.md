# 🚀 Deployment Guide - Quick Reference

## Why Vercel Alone Won't Work

Your application has:
- ✅ **Frontend** (React) - Can deploy to Vercel
- ❌ **Backend** (Express.js server) - Needs to run continuously

**Problem**: Vercel is designed for serverless functions, not long-running Node.js servers. Your Express backend needs to stay running 24/7 to handle API requests.

## Recommended Solution: Local Setup via GitHub

**Best option for sharing with a coworker:**

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Share the repo** with your coworker

3. **They follow** `LOCAL_SETUP.md` to set up locally

**Why this works well:**
- ✅ Free and simple
- ✅ No deployment complexity
- ✅ Easy to update (just push to GitHub)
- ✅ Full control over environment
- ✅ Perfect for internal tools

## Alternative: Separate Deployments

If you need it accessible online (not just locally):

### Frontend → Vercel
- Build: `npm run build`
- Deploy the `dist` folder
- Set env var: `VITE_API_URL=https://your-backend-url.com/api`

### Backend → Railway (Recommended)
- Free tier available
- Easy setup
- Deploy the `server` directory
- Set env var: `GOOGLE_PLACES_API_KEY=your_key`
- Get URL: `https://your-app.railway.app`
- Update frontend `VITE_API_URL` to point to this

**Other backend options:**
- Render.com (free tier)
- Heroku (paid)
- DigitalOcean App Platform
- AWS/Google Cloud (more complex)

## What I've Updated

✅ Made backend URL configurable via `VITE_API_URL` environment variable
✅ Created `LOCAL_SETUP.md` - comprehensive setup guide for your coworker
✅ Updated `README.md` with deployment options
✅ Updated `.gitignore` to exclude `.env` files
✅ Updated `env.example` with proper configuration

## Next Steps

1. **For local sharing** (recommended):
   - Push to GitHub
   - Share repo with coworker
   - They follow `LOCAL_SETUP.md`

2. **For online deployment**:
   - Deploy backend to Railway/Render
   - Deploy frontend to Vercel
   - Update `VITE_API_URL` in Vercel to point to backend

---

**Questions?** Check `LOCAL_SETUP.md` for detailed instructions!

