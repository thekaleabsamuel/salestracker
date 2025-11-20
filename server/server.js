const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Google Places API configuration - Using NEW API
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACES_BASE_URL = 'https://places.googleapis.com/v1';

// Convert miles to meters
const milesToMeters = (miles) => miles * 1609.34;

// In-memory storage for tracked businesses (in production, you'd use a database)
let trackedBusinesses = [];

// Load tracked businesses from file on server start
const fs = require('fs');
const path = require('path');
const TRACKING_FILE = path.join(__dirname, 'tracked_businesses.json');

// Load existing tracked businesses
try {
  if (fs.existsSync(TRACKING_FILE)) {
    const data = fs.readFileSync(TRACKING_FILE, 'utf8');
    trackedBusinesses = JSON.parse(data);
    console.log(`Loaded ${trackedBusinesses.length} tracked businesses from storage`);
  }
} catch (error) {
  console.error('Error loading tracked businesses:', error);
}

// Save tracked businesses to file
const saveTrackedBusinesses = () => {
  try {
    fs.writeFileSync(TRACKING_FILE, JSON.stringify(trackedBusinesses, null, 2));
    console.log(`Saved ${trackedBusinesses.length} tracked businesses to storage`);
  } catch (error) {
    console.error('Error saving tracked businesses:', error);
  }
};

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Business Search Backend is running!',
    apiKey: GOOGLE_PLACES_API_KEY ? 'Configured' : 'Missing',
    timestamp: new Date().toISOString()
  });
});

// Test Google Places API endpoint
app.get('/api/test-places-api', async (req, res) => {
  try {
    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ 
        error: 'Google Places API key not configured' 
      });
    }

    console.log('Testing Google Places API (New)...');
    
    // Test with a simple nearby search using the new API
    const testUrl = `${GOOGLE_PLACES_BASE_URL}/places:searchNearby`;
    const testResponse = await axios.post(testUrl, {
      locationRestriction: {
        circle: {
          center: {
            latitude: 39.7392,
            longitude: -104.9903
          },
          radius: 5000.0
        }
      },
      includedTypes: ["restaurant"]
    }, {
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.rating,places.userRatingCount'
      }
    });

    console.log('Places API test response:', testResponse.data);
    
    if (testResponse.data.places && testResponse.data.places.length > 0) {
      res.json({ 
        status: 'success', 
        message: 'Google Places API (New) is working!',
        results: testResponse.data.places.length,
        apiStatus: 'OK'
      });
    } else {
      res.json({ 
        status: 'success', 
        message: 'Google Places API (New) is working but no results found',
        results: 0,
        apiStatus: 'OK'
      });
    }

  } catch (error) {
    console.error('Places API test error:', error.response?.data || error.message);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to test Google Places API (New)',
      error: error.response?.data || error.message,
      statusCode: error.response?.status
    });
  }
});

// Search businesses endpoint using NEW API
app.post('/api/search-businesses', async (req, res) => {
  try {
    const { keyword, location, radius } = req.body;

    if (!keyword || !location) {
      return res.status(400).json({ 
        error: 'Missing required parameters: keyword and location' 
      });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ 
        error: 'Google Places API key not configured' 
      });
    }

    console.log(`Searching for: ${keyword} in ${location} within ${radius} miles`);

    // Use text search directly instead of geocoding + nearby search
    console.log('Using text search with location...');
    const searchUrl = `${GOOGLE_PLACES_BASE_URL}/places:searchText`;
    
    // Build search request for new API
    const searchRequest = {
      textQuery: `${keyword} in ${location}`,
      maxResultCount: 20
    };

    // For now, just use text search without location restrictions
    // This will work with just the Places API enabled

    const searchResponse = await axios.post(searchUrl, searchRequest, {
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types,places.websiteUri,places.internationalPhoneNumber,places.businessStatus'
      }
    });

    console.log('Search response received');

    if (!searchResponse.data.places || searchResponse.data.places.length === 0) {
      console.log('No businesses found');
      return res.json({ businesses: [] });
    }

    console.log(`Found ${searchResponse.data.places.length} businesses`);

    // Transform the new API response to match our expected format
    console.log('Processing business data...');
    const businesses = searchResponse.data.places.map(place => ({
      place_id: place.id,
      name: place.displayName?.text || 'Unknown Name',
      formatted_address: place.formattedAddress || 'Address not available',
      formatted_phone_number: place.internationalPhoneNumber || 'Phone not available',
      rating: place.rating || null,
      user_ratings_total: place.userRatingCount || 0,
      website: place.websiteUri || null,
      types: place.types || [],
      business_status: place.businessStatus || 'OPERATIONAL'
    }));

    console.log(`Successfully processed ${businesses.length} businesses`);
    res.json({ businesses });

  } catch (error) {
    console.error('Error searching businesses:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to search businesses', 
      details: error.response?.data || error.message,
      statusCode: error.response?.status
    });
  }
});

// Text search endpoint using NEW API
app.post('/api/search-businesses-text', async (req, res) => {
  try {
    const { query, location, radius } = req.body;

    if (!query || !location) {
      return res.status(400).json({ 
        error: 'Missing required parameters: query and location' 
      });
    }

    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ 
        error: 'Google Places API key not configured' 
      });
    }

    console.log(`Text search for: ${query} in ${location} within ${radius} miles`);

    // Use text search with the new API
    const searchUrl = `${GOOGLE_PLACES_BASE_URL}/places:searchText`;
    const searchRequest = {
      textQuery: query,
      locationRestriction: {
        circle: {
          center: {
            latitude: 39.7392, // Default to Denver for now
            longitude: -104.9903
          },
          radius: milesToMeters(radius)
        }
      },
      maxResultCount: 20
    };

    const searchResponse = await axios.post(searchUrl, searchRequest, {
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.types,places.websiteUri,places.internationalPhoneNumber,places.businessStatus'
      }
    });

    if (!searchResponse.data.places || searchResponse.data.places.length === 0) {
      return res.json({ businesses: [] });
    }

    // Transform response
    const businesses = searchResponse.data.places.map(place => ({
      place_id: place.id,
      name: place.displayName?.text || 'Unknown Name',
      formatted_address: place.formattedAddress || 'Address not available',
      formatted_phone_number: place.internationalPhoneNumber || 'Phone not available',
      rating: place.rating || null,
      user_ratings_total: place.userRatingCount || 0,
      website: place.websiteUri || null,
      types: place.types || [],
      business_status: place.businessStatus || 'OPERATIONAL'
    }));

    console.log(`Found ${businesses.length} businesses`);
    res.json({ businesses });

  } catch (error) {
    console.error('Error in text search:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to search businesses', 
      details: error.response?.data || error.message,
      statusCode: error.response?.status
    });
  }
});

// Get business details endpoint using NEW API
app.get('/api/business-details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;

    if (!GOOGLE_PLACES_API_KEY) {
      return res.status(500).json({ 
        error: 'Google Places API key not configured' 
      });
    }

    const detailsUrl = `${GOOGLE_PLACES_BASE_URL}/places/${placeId}`;
    const detailsResponse = await axios.get(detailsUrl, {
      headers: {
        'X-Goog-Api-Key': GOOGLE_PLACES_API_KEY,
        'X-Goog-FieldMask': 'id,displayName,formattedAddress,rating,userRatingCount,types,websiteUri,internationalPhoneNumber,businessStatus,openingHours'
      }
    });

    // Transform to match expected format
    const place = detailsResponse.data;
    const business = {
      place_id: place.id,
      name: place.displayName?.text || 'Unknown Name',
      formatted_address: place.formattedAddress || 'Address not available',
      formatted_phone_number: place.internationalPhoneNumber || 'Phone not available',
      rating: place.rating || null,
      user_ratings_total: place.userRatingCount || 0,
      website: place.websiteUri || null,
      types: place.types || [],
      business_status: place.businessStatus || 'OPERATIONAL',
      opening_hours: place.openingHours || null
    };

    res.json({ business });

  } catch (error) {
    console.error('Error getting business details:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to get business details', 
      details: error.response?.data || error.message,
      statusCode: error.response?.status
    });
  }
});

// Business tracking endpoints
app.get('/api/tracked-businesses', (req, res) => {
  try {
    console.log(`GET /api/tracked-businesses - Returning ${trackedBusinesses.length} businesses`);
    res.json({
      success: true,
      data: trackedBusinesses,
      count: trackedBusinesses.length
    });
  } catch (error) {
    console.error('Error getting tracked businesses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get tracked businesses',
      details: error.message
    });
  }
});

app.post('/api/tracked-businesses', (req, res) => {
  try {
    const { businesses } = req.body;
    
    if (!businesses || !Array.isArray(businesses)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: businesses array required'
      });
    }

    // Get existing place_ids to check for duplicates
    const existingPlaceIds = trackedBusinesses.map(business => business.place_id);
    
    // Filter out duplicates based on place_id
    const uniqueBusinesses = businesses.filter(business => 
      business.place_id && !existingPlaceIds.includes(business.place_id)
    );

    const duplicateCount = businesses.length - uniqueBusinesses.length;

    if (duplicateCount > 0) {
      console.log(`${duplicateCount} duplicate businesses skipped based on place_id`);
    }

    if (uniqueBusinesses.length === 0) {
      return res.json({
        success: true,
        message: `All ${businesses.length} businesses were already in tracking (duplicates)`,
        data: [],
        skipped_count: duplicateCount,
        total_count: trackedBusinesses.length,
        duplicates: duplicateCount
      });
    }

    // Add new businesses with tracking metadata
    const newBusinesses = uniqueBusinesses.map(business => ({
      ...business,
      added_date: business.added_date || 'not contacted',
  last_updated: new Date().toISOString(),
      contact_status: business.contact_status || 'not contacted',
      notes: business.notes || ''
    }));

    trackedBusinesses.push(...newBusinesses);
    saveTrackedBusinesses();

    console.log(`POST /api/tracked-businesses - Added ${newBusinesses.length} businesses, skipped ${duplicateCount} duplicates. Total: ${trackedBusinesses.length}`);
    
    res.json({
      success: true,
      message: `Added ${newBusinesses.length} business${newBusinesses.length !== 1 ? 'es' : ''} ${duplicateCount > 0 ? `(skipped ${duplicateCount} duplicates)` : ''} to tracking`,
      data: newBusinesses,
      total_count: trackedBusinesses.length,
      duplicates: duplicateCount,
      skipped_count: duplicateCount
    });
  } catch (error) {
    console.error('Error adding tracked businesses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add businesses to tracking',
      details: error.message
    });
  }
});

app.put('/api/tracked-businesses/:placeId', (req, res) => {
  try {
    const { placeId } = req.params;
    const updates = req.body;
    
    const businessIndex = trackedBusinesses.findIndex(b => b.place_id === placeId);
    
    if (businessIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Business not found in tracking'
      });
    }

    // Update business with new data
    trackedBusinesses[businessIndex] = {
      ...trackedBusinesses[businessIndex],
      ...updates,
      last_updated: new Date().toISOString()
    };

    saveTrackedBusinesses();

    console.log(`PUT /api/tracked-businesses/${placeId} - Updated business: ${trackedBusinesses[businessIndex].name}`);
    
    res.json({
      success: true,
      message: 'Business updated successfully',
      data: trackedBusinesses[businessIndex]
    });
  } catch (error) {
    console.error('Error updating tracked business:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update business',
      details: error.message
    });
  }
});

app.delete('/api/tracked-businesses/:placeId', (req, res) => {
  try {
    const { placeId } = req.params;
    
    const businessIndex = trackedBusinesses.findIndex(b => b.place_id === placeId);
    
    if (businessIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Business not found in tracking'
      });
    }

    const deletedBusiness = trackedBusinesses.splice(businessIndex, 1)[0];
    saveTrackedBusinesses();

    console.log(`DELETE /api/tracked-businesses/${placeId} - Removed business: ${deletedBusiness.name}`);
    
    res.json({
      success: true,
      message: 'Business removed from tracking',
      data: deletedBusiness,
      total_count: trackedBusinesses.length
    });
  } catch (error) {
    console.error('Error deleting tracked business:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete business from tracking',
      details: error.message
    });
  }
});

app.delete('/api/tracked-businesses', (req, res) => {
  try {
    const { placeIds } = req.body;
    
    if (!placeIds || !Array.isArray(placeIds)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request: placeIds array required'
      });
    }

    const initialCount = trackedBusinesses.length;
    trackedBusinesses = trackedBusinesses.filter(b => !placeIds.includes(b.place_id));
    const deletedCount = initialCount - trackedBusinesses.length;
    
    saveTrackedBusinesses();

    console.log(`DELETE /api/tracked-businesses - Removed ${deletedCount} businesses. Remaining: ${trackedBusinesses.length}`);
    
    res.json({
      success: true,
      message: `Removed ${deletedCount} business${deletedCount !== 1 ? 'es' : ''} from tracking`,
      deleted_count: deletedCount,
      total_count: trackedBusinesses.length
    });
  } catch (error) {
    console.error('Error deleting multiple tracked businesses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete businesses from tracking',
      details: error.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Business Search Backend running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`🔑 API Key configured: ${GOOGLE_PLACES_API_KEY ? 'Yes' : 'No'}`);
  console.log(`🧪 Test Places API: http://localhost:${PORT}/api/test-places-api`);
  console.log(`📚 Using Google Places API (New) endpoints`);
});
