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

### Step 3: Verify API Key (Usually Already Set!)

The API key should already be in `server/.env` when you clone the repo!

**If it's not set:**
1. Open `server/.env` in a text editor
2. Find: `GOOGLE_PLACES_API_KEY=YOUR_API_KEY_HERE`
3. Replace `YOUR_API_KEY_HERE` with the actual API key
4. Save the file

**Most likely, you can skip this step!** The key is already configured.

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

