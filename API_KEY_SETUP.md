# 🔑 API Key Setup - Quick Reference

## For Plug-and-Play Setup

To make this work immediately, you need to add the Google Places API key to the backend.

### Option 1: Use Shared API Key (Easiest)

If your teammate shared the API key with you:

1. **Get the API key** from `SHARED_API_KEY.txt` or ask your teammate
2. **Open the file**: `server/.env`
3. **Find this line**:
   ```
   GOOGLE_PLACES_API_KEY=YOUR_API_KEY_HERE
   ```
4. **Replace `YOUR_API_KEY_HERE` with the actual API key**
5. **Save the file**

### Option 2: Manual Setup

1. **Open the file**: `server/.env`

2. **Find this line**:
   ```
   GOOGLE_PLACES_API_KEY=YOUR_API_KEY_HERE
   ```

3. **Replace `YOUR_API_KEY_HERE` with the actual API key**:
   ```
   GOOGLE_PLACES_API_KEY=AIzaSyC...your-actual-key-here
   ```

4. **Save the file**

5. **That's it!** The backend will use this key automatically.

### Example:

If your API key is `AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz`, your `server/.env` should look like:

```env
GOOGLE_PLACES_API_KEY=AIzaSyC1234567890abcdefghijklmnopqrstuvwxyz
PORT=3001
```

### Verify It Works:

1. Start the backend: `cd server && npm start`
2. Check the console - it should say: `🔑 API Key configured: Yes`
3. Test: Open `http://localhost:3001/health` in your browser

---

**Note**: Since this is a private repository, the `.env` files are committed to Git. The API key will be available when you clone the repo.

