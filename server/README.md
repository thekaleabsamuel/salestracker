# Business Search Backend Server

This is the backend server for the Business Search Dashboard that handles Google Places API calls without CORS issues.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file with your Google Places API key:
```bash
GOOGLE_PLACES_API_KEY=your_api_key_here
```

### 3. Start Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Health Check
- **GET** `/health` - Server status

### Search Businesses
- **POST** `/api/search-businesses`
  - Body: `{ "keyword": "IT companies", "location": "Denver, CO", "radius": 50 }`

### Text Search
- **POST** `/api/search-businesses-text`
  - Body: `{ "query": "IT companies", "location": "Denver, CO", "radius": 50 }`

### Business Details
- **GET** `/api/business-details/:placeId`
  - Returns detailed information for a specific business

## 🔧 Configuration

- **Port**: 3001 (configurable via `PORT` environment variable)
- **CORS**: Enabled for frontend communication
- **API Key**: Loaded from `.env` file

## 🎯 Perfect for E-Waste Recycling

This backend is specifically designed to help find:
- **IT companies** in Colorado
- **Office buildings** and business centers
- **Schools** and educational institutions
- **Any business** that might need e-waste recycling services

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables
- `PORT` - Server port (default: 3001)
- `GOOGLE_PLACES_API_KEY` - Your Google Places API key

## 📊 Features

- ✅ **No CORS issues** - Handles API calls server-side
- ✅ **Real Google data** - Live business information
- ✅ **Error handling** - Graceful fallbacks
- ✅ **Logging** - Track API usage and errors
- ✅ **Scalable** - Easy to extend with new endpoints

---

**Built with Express.js and Google Places API**



