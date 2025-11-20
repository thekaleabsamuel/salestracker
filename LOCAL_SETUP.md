# 🚀 Local Setup Guide for Sales Tracker

This guide will help you set up and run the Sales Tracker application on your local machine.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (to clone the repository) - [Download here](https://git-scm.com/)

To check if you have these installed, run:
```bash
node --version   # Should show v18.x.x or higher
npm --version    # Should show 9.x.x or higher
git --version    # Should show git version
```

## 🔧 Step-by-Step Setup

### Step 1: Clone the Repository

If you haven't already, clone the repository from GitHub:

```bash
git clone <repository-url>
cd salestracker
```

### Step 2: Install Frontend Dependencies

Install all the required packages for the frontend:

```bash
npm install
```

This will install all the React, Material-UI, and other frontend dependencies.

### Step 3: Install Backend Dependencies

Navigate to the server directory and install backend dependencies:

```bash
cd server
npm install
cd ..
```

### Step 4: Set Up Environment Variables

**Quick Setup (Recommended):**

Run the setup script to create all environment files:
```bash
chmod +x setup.sh
./setup.sh
```

This creates both `.env` files automatically. Then you just need to add your API key (see below).

**Manual Setup:**

#### Frontend Environment Variables

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

The default value (`http://localhost:3001/api`) is already correct for local development - no changes needed!

#### Backend Environment Variables

**You need to set up your own Google Places API key:**

1. **Set up your API key** (see `SETUP_NEW_API_KEY.md` for detailed instructions):
   - Go to https://console.cloud.google.com/
   - Enable "Places API (New)"
   - Create an API key
   - Set up billing (required, but you get $200/month free)

2. **Add it to `server/.env`**:
   - Open `server/.env` in a text editor
   - Find: `GOOGLE_PLACES_API_KEY=YOUR_API_KEY_HERE`
   - Replace `YOUR_API_KEY_HERE` with your actual API key
   - Save the file

**Note**: Each person needs their own API key. It's free to set up and you get $200/month in free credits!

### Step 5: Start the Backend Server

Open a terminal window and start the backend server:

```bash
cd server
npm start
```

You should see:
```
🚀 Business Search Backend running on port 3001
📍 Health check: http://localhost:3001/health
```

**Keep this terminal window open** - the backend needs to keep running.

### Step 6: Start the Frontend

Open a **new terminal window** (keep the backend running in the first one) and start the frontend:

```bash
# Make sure you're in the root directory (salestracker/)
npm run dev
```

You should see:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Step 7: Open the Application

Open your web browser and navigate to:
```
http://localhost:5173
```

You should see the Sales Tracker dashboard!

## 🧪 Testing the Setup

### Test the Backend

1. Open a browser and go to: `http://localhost:3001/health`
2. You should see a JSON response with status "OK"

### Test the Frontend

1. Try searching for businesses (e.g., "restaurants in Denver")
2. If you have a Google Places API key configured, you'll get real results
3. If not, you'll see mock data (which is fine for testing)

## 🛠️ Running Both Servers Easily

### Option 1: Use Two Terminal Windows
- Terminal 1: `cd server && npm start`
- Terminal 2: `npm run dev`

### Option 2: Use a Process Manager (Advanced)

You can use `concurrently` to run both servers with one command. First install it:

```bash
npm install --save-dev concurrently
```

Then add this script to the root `package.json`:
```json
"scripts": {
  "dev:all": "concurrently \"npm run dev\" \"cd server && npm start\""
}
```

Run with: `npm run dev:all`

## 📁 Project Structure

```
salestracker/
├── src/                    # Frontend React code
│   ├── components/         # React components
│   ├── services/          # API service files
│   └── ...
├── server/                # Backend Express server
│   ├── server.js         # Main server file
│   └── package.json      # Backend dependencies
├── package.json          # Frontend dependencies
├── .env                  # Frontend environment variables
└── server/.env           # Backend environment variables
```

## 🔍 Troubleshooting

### Port Already in Use

**Error**: `Port 3001 is already in use` or `Port 5173 is already in use`

**Solution**: 
- Find what's using the port: `lsof -i :3001` (Mac/Linux) or `netstat -ano | findstr :3001` (Windows)
- Kill the process or change the port in the `.env` file

### Backend Not Connecting

**Error**: Frontend can't connect to backend

**Solutions**:
1. Make sure the backend is running (`npm start` in `server/` directory)
2. Check that `VITE_API_URL` in root `.env` matches the backend port
3. Verify the backend is accessible at `http://localhost:3001/health`

### Module Not Found Errors

**Error**: `Cannot find module 'xyz'`

**Solution**: 
```bash
# In root directory
npm install

# In server directory
cd server
npm install
```

### Google Places API Errors

**Error**: API key errors or no results

**Solutions**:
1. Verify your API key is correct in `server/.env`
2. Make sure Places API (New) is enabled in Google Cloud Console
3. Check API quotas and billing in Google Cloud Console
4. The app will use mock data if the API fails (which is fine for testing)

## 🚀 Next Steps

Once everything is running:

1. **Explore the features**: Search for businesses, track them, export data
2. **Read the README.md**: For detailed feature documentation
3. **Check SETUP.md**: For additional setup information
4. **Customize**: Modify colors, add features, etc.

## 💡 Tips

- **Development Mode**: The frontend auto-reloads when you make changes
- **Backend Restart**: You need to manually restart the backend if you change `server.js`
- **Environment Variables**: Never commit `.env` files to Git (they're in `.gitignore`)
- **Mock Data**: The app works without an API key using mock data for testing

## 🆘 Need Help?

If you run into issues:

1. Check that both servers are running
2. Verify environment variables are set correctly
3. Check the browser console for errors
4. Check the terminal output for backend errors
5. Make sure all dependencies are installed

---

**Happy tracking! 📊✨**

