# 👋 Welcome! Quick Start Guide

## 🚀 Get Running in 5 Minutes

### Step 1: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### Step 2: Environment Files (Already Set Up!)

The `.env` files are already in the repo with default values. You can skip this step!

**If you need to update the API key:**
- Edit `server/.env` and replace `YOUR_API_KEY_HERE` with the actual key

### Step 3: Set Up Your Google Places API Key

You need to set up your own Google Places API key (it's free with $200/month credit):

1. **Follow the guide**: See `SETUP_NEW_API_KEY.md` for step-by-step instructions
2. **Get your API key** from Google Cloud Console
3. **Add it to the project**:
   - Open `server/.env` in a text editor
   - Find: `GOOGLE_PLACES_API_KEY=YOUR_API_KEY_HERE`
   - Replace `YOUR_API_KEY_HERE` with your actual API key
   - Save the file

**Quick setup**: Go to https://console.cloud.google.com/ → Enable "Places API (New)" → Create API key → Add to `server/.env`

### Step 4: Start the App

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Step 5: Open in Browser

Go to: **http://localhost:5173**

---

## 📚 Need More Help?

- **Detailed Setup**: See `LOCAL_SETUP.md`
- **API Key Help**: See `API_KEY_SETUP.md`
- **Troubleshooting**: Check `LOCAL_SETUP.md` troubleshooting section

---

**That's it! You're ready to go! 🎉**

