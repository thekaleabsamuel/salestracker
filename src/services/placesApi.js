// Business Search API service using backend server
// This service calls our backend server which handles Google Places API calls

const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Mock data for development/testing when backend is not available
const MOCK_BUSINESSES = [
  {
    place_id: 'mock_1',
    name: 'El Mariachi Mexican Restaurant',
    formatted_address: '123 Main St, Downtown, CA 90210',
    formatted_phone_number: '(555) 123-4567',
    rating: 4.5,
    user_ratings_total: 127,
    website: 'https://elmariachi.example.com',
    types: ['restaurant', 'food', 'establishment'],
    opening_hours: { open_now: true }
  },
  {
    place_id: 'mock_2',
    name: 'Downtown HVAC Services',
    formatted_address: '456 Oak Ave, Downtown, CA 90210',
    formatted_phone_number: '(555) 987-6543',
    rating: 4.8,
    user_ratings_total: 89,
    website: 'https://downtownhvac.example.com',
    types: ['hvac_contractor', 'home_goods_store', 'establishment'],
    opening_hours: { open_now: false }
  },
  {
    place_id: 'mock_3',
    name: 'Smith & Associates Law Office',
    formatted_address: '789 Pine St, Downtown, CA 90210',
    formatted_phone_number: '(555) 456-7890',
    rating: 4.2,
    user_ratings_total: 45,
    website: 'https://smithlaw.example.com',
    types: ['lawyer', 'establishment'],
    opening_hours: { open_now: true }
  },
  {
    place_id: 'mock_4',
    name: 'Green Thumb Landscaping',
    formatted_address: '321 Elm St, Downtown, CA 90210',
    formatted_phone_number: '(555) 789-0123',
    rating: 4.6,
    user_ratings_total: 67,
    website: 'https://greenthumb.example.com',
    types: ['landscaper', 'home_goods_store', 'establishment'],
    opening_hours: { open_now: true }
  },
  {
    place_id: 'mock_5',
    name: 'Tech Solutions IT Services',
    formatted_address: '654 Maple Dr, Downtown, CA 90210',
    formatted_phone_number: '(555) 321-6540',
    rating: 4.7,
    user_ratings_total: 93,
    website: 'https://techsolutions.example.com',
    types: ['computer_repair', 'electronics_store', 'establishment'],
    opening_hours: { open_now: false }
  }
];

// Search for businesses using backend server
export const searchBusinesses = async (searchParams) => {
  const { keyword, location, radius } = searchParams;

  try {
    // Try to call the backend server first
    const response = await fetch(`${BACKEND_BASE_URL}/search-businesses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keyword, location, radius }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`Backend API call successful: Found ${data.businesses.length} businesses`);
      return data.businesses;
    } else {
      const errorData = await response.json();
      console.warn('Backend API call failed:', errorData.error);
      throw new Error(errorData.error || 'Backend API call failed');
    }

  } catch (error) {
    console.warn('Backend server unavailable, using mock data:', error.message);
    
    // Fallback to enhanced mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Enhanced mock data that filters based on search criteria
    let filteredBusinesses = MOCK_BUSINESSES.filter(business => 
      business.name.toLowerCase().includes(keyword.toLowerCase()) ||
      business.types.some(type => type.toLowerCase().includes(keyword.toLowerCase()))
    );
    
    // Simulate location-based filtering
    if (location.toLowerCase().includes('colorado') || location.toLowerCase().includes('co')) {
      // Add Colorado-specific businesses for e-waste recycling
      filteredBusinesses = [
        ...filteredBusinesses,
        {
          place_id: 'mock_co_1',
          name: 'Denver Tech Solutions',
          formatted_address: '1234 Tech Blvd, Denver, CO 80202',
          formatted_phone_number: '(303) 555-0123',
          rating: 4.6,
          user_ratings_total: 89,
          website: 'https://denvertech.example.com',
          types: ['computer_repair', 'electronics_store', 'establishment'],
          opening_hours: { open_now: true }
        },
        {
          place_id: 'mock_co_2',
          name: 'Colorado Office Solutions',
          formatted_address: '567 Business Center Dr, Boulder, CO 80301',
          formatted_phone_number: '(303) 555-0456',
          rating: 4.4,
          user_ratings_total: 67,
          website: 'https://coloradooffice.example.com',
          types: ['office_supplies', 'business_service', 'establishment'],
          opening_hours: { open_now: true }
        },
        {
          place_id: 'mock_co_3',
          name: 'Mountain View School District',
          formatted_address: '890 Education Way, Colorado Springs, CO 80901',
          formatted_phone_number: '(719) 555-0789',
          rating: 4.2,
          user_ratings_total: 234,
          website: 'https://mountainview.edu',
          types: ['school', 'education', 'establishment'],
          opening_hours: { open_now: false }
        }
      ];
    }
    
    // Simulate radius-based limiting
    if (radius < 50) {
      filteredBusinesses = filteredBusinesses.slice(0, 3);
    }
    
    return filteredBusinesses;
  }
};

// Get business details by place ID
export const getBusinessDetails = async (placeId) => {
  try {
    // Try to call the backend server first
    const response = await fetch(`${BACKEND_BASE_URL}/business-details/${placeId}`);

    if (response.ok) {
      const data = await response.json();
      return data.business;
    } else {
      const errorData = await response.json();
      console.warn('Backend API call failed:', errorData.error);
      throw new Error(errorData.error || 'Backend API call failed');
    }

  } catch (error) {
    console.warn('Backend server unavailable, returning mock data:', error.message);
    // Fallback to mock data
    return MOCK_BUSINESSES.find(business => business.place_id === placeId) || null;
  }
};

// Search for businesses by text query (alternative method)
export const searchBusinessesByText = async (query, location, radius) => {
  try {
    // Try to call the backend server first
    const response = await fetch(`${BACKEND_BASE_URL}/search-businesses-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, location, radius }),
    });

    if (response.ok) {
      const data = await response.json();
      return data.businesses;
    } else {
      const errorData = await response.json();
      console.warn('Backend API call failed:', errorData.error);
      throw new Error(errorData.error || 'Backend API call failed');
    }

  } catch (error) {
    console.warn('Backend server unavailable, using mock data:', error.message);
    
    // Fallback to mock data
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCK_BUSINESSES.filter(business => 
      business.name.toLowerCase().includes(query.toLowerCase()) ||
      business.types.some(type => type.toLowerCase().includes(query.toLowerCase()))
    );
  }
};
