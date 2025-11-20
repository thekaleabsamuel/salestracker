# Business Search Dashboard

A powerful internal web tool designed to help users quickly locate and organize local business information by industry and location. Powered by the Google Places API, this tool allows users to search for businesses within a specified radius and export results for reporting or outreach purposes.

## 👋 For Your Coworker - Quick Start

**The API key is already configured!** Just follow these steps:

1. **Clone the repository**
2. **Install dependencies**:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```
3. **Start the backend** (Terminal 1):
   ```bash
   cd server
   npm start
   ```
4. **Start the frontend** (Terminal 2):
   ```bash
   npm run dev
   ```
5. **Open your browser**: http://localhost:5173

**That's it!** The API key is already in the repo, so you're ready to go! 🎉

---

**For detailed setup instructions, see `README_FIRST.md`**

## 🚀 Features

- **Keyword-based search** by industry or business type
- **Location-aware results** using inputted addresses or browser geolocation
- **Comprehensive data output** including business name, address, phone number, rating, and website
- **Interactive grid/table** with sorting, filtering, and pagination
- **Export functionality** to Excel or CSV formats
- **Responsive design** that works on desktop and mobile devices
- **Mock data support** for development and testing

## 🛠️ Technology Stack

- **Frontend**: React 19 with Material-UI (MUI)
- **Styling**: Emotion CSS-in-JS with Material-UI theme
- **API Integration**: Google Places API
- **Data Export**: XLSX library for Excel, native CSV export
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js 18+ and npm
- Google Places API key (optional for development)

## 🚀 Quick Start

### For Local Development

**See `LOCAL_SETUP.md` for detailed step-by-step instructions.**

Quick start:
```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd server
npm install
cd ..

# 3. Set up environment variables
# Create .env in root: VITE_API_URL=http://localhost:3001/api
# Create server/.env: GOOGLE_PLACES_API_KEY=your_key_here

# 4. Start backend (in one terminal)
cd server
npm start

# 5. Start frontend (in another terminal)
npm run dev
```

The application will open at `http://localhost:5173`

**Note**: The backend must be running for full functionality. The app will use mock data if the backend is unavailable.

## 🔑 Google Places API Setup

To use real business data, you'll need to set up the Google Places API:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Places API
4. Create credentials (API key)
5. Add the API key to your `.env` file as `VITE_GOOGLE_PLACES_API_KEY`

**Important**: The Google Places API has usage limits and costs. Check the [pricing page](https://developers.google.com/maps/documentation/places/web-service/pricing) for current rates.

## 📱 Usage

### Basic Search

1. **Enter Business Type**: Type keywords like "Mexican restaurants", "HVAC contractors", or "law offices"
2. **Set Location**: Enter an address, city, or use your current location
3. **Choose Radius**: Select search radius (10, 25, 50, or 100 miles)
4. **Click Search**: View results in the interactive table

### Advanced Features

- **Filter Results**: Use the filter bar to search within results
- **Sort Data**: Click column headers to sort by business name, address, or rating
- **Export Data**: Download results as CSV or Excel files
- **Pagination**: Navigate through large result sets

### Current Location

The app automatically detects your location when you first visit. Click the location icon next to the location field to use your current coordinates.

## 🎨 Customization

### Theme Customization

Edit the theme in `src/App.jsx`:

```jsx
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2', // Change primary color
    },
    secondary: {
      main: '#dc004e', // Change secondary color
    },
  },
});
```

### Styling

Customize the appearance by modifying `src/App.css` or adding Material-UI `sx` props to components.

## 📊 Data Structure

Business results include:

- **Basic Info**: Name, address, phone number
- **Rating**: Google rating and number of reviews
- **Contact**: Website URL and business hours
- **Categories**: Business types and classifications

## 🔧 Development

### Project Structure

```
src/
├── components/
│   ├── BusinessSearchDashboard.jsx    # Main dashboard component
│   └── BusinessResultsTable.jsx       # Results table component
├── services/
│   └── placesApi.js                   # Google Places API service
├── App.jsx                            # Main app component
└── App.css                            # Global styles
```

### Adding New Features

1. **New API Endpoints**: Extend `placesApi.js` with additional methods
2. **UI Components**: Create new components in the `components/` directory
3. **Styling**: Use Material-UI's `sx` prop or modify `App.css`

### Testing

The application includes mock data for testing without an API key. To test with real data:

1. Set up Google Places API
2. Add your API key to `.env`
3. Restart the development server

## 🚀 Deployment

### Important: Full-Stack Application

This is a **full-stack application** with:
- **Frontend**: React app (can be deployed to static hosting)
- **Backend**: Express.js server (needs a platform that supports Node.js servers)

**⚠️ Vercel Limitation**: Vercel is great for frontends and serverless functions, but doesn't support long-running Express servers. You'll need to deploy the backend separately.

### Option 1: Local Development (Recommended for Team Sharing)

**Best for**: Sharing with coworkers, internal tools, development

1. **Set up GitHub repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Share the repository** with your coworker

3. **Your coworker follows** `LOCAL_SETUP.md` to set up locally

**Pros**: 
- ✅ Free
- ✅ Full control
- ✅ Easy to update
- ✅ No deployment complexity

**Cons**: 
- ❌ Requires local setup
- ❌ Backend must be running locally

### Option 2: Separate Deployment (Production)

**Best for**: Production use, external access

#### Frontend Deployment (Vercel/Netlify)

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Set environment variable** in Vercel/Netlify:
   - `VITE_API_URL` = your deployed backend URL (e.g., `https://your-backend.railway.app/api`)

3. **Deploy**:
   - **Vercel**: Connect GitHub repo, set build command to `npm run build`, output directory to `dist`
   - **Netlify**: Drag `dist` folder or connect repo

#### Backend Deployment (Railway/Render/Heroku)

**Railway** (Recommended - Easy & Free tier available):
1. Go to [railway.app](https://railway.app)
2. Create new project from GitHub repo
3. Select the `server` directory as root
4. Add environment variable: `GOOGLE_PLACES_API_KEY=your_key`
5. Deploy - Railway will provide a URL like `https://your-app.railway.app`
6. Update frontend `VITE_API_URL` to `https://your-app.railway.app/api`

**Render** (Alternative):
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repo, set root directory to `server`
4. Add environment variables
5. Deploy

**Pros**: 
- ✅ Accessible from anywhere
- ✅ No local setup needed
- ✅ Professional deployment

**Cons**: 
- ❌ Requires two separate deployments
- ❌ May have costs for backend hosting
- ❌ More complex setup

### Option 3: Convert to Serverless (Advanced)

Convert the Express backend to Vercel serverless functions. This requires refactoring the backend code.

### Build for Production

```bash
# Frontend
npm run build

# Backend (if deploying separately)
cd server
# No build needed - just deploy the server.js file
```

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🆘 Support

For issues or questions:

1. Check the [GitHub Issues](link-to-issues) page
2. Review the Google Places API documentation
3. Ensure your API key is properly configured

## 🔮 Future Enhancements

- [ ] Advanced filtering options
- [ ] Business comparison tools
- [ ] Saved searches and favorites
- [ ] Integration with CRM systems
- [ ] Batch export options
- [ ] Real-time business updates
- [ ] Map view integration

---

**Built with ❤️ using React and Material-UI**
