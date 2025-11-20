const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Get all tracked businesses
export const getTrackedBusinesses = async () => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/tracked-businesses`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error fetching tracked businesses:', error);
    throw new Error('Failed to fetch tracked businesses');
  }
};

// Add businesses to tracking
export const addBusinessesToTracking = async (businesses) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/tracked-businesses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ businesses }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error('Error adding businesses to tracking:', error);
    throw new Error('Failed to add businesses to tracking');
  }
};

// Update a tracked business
export const updateTrackedBusiness = async (placeId, updates) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/tracked-businesses/${placeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error updating tracked business:', error);
    throw new Error('Failed to update tracked business');
  }
};

// Delete a tracked business
export const deleteTrackedBusiness = async (placeId) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/tracked-businesses/${placeId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error deleting tracked business:', error);
    throw new Error('Failed to delete tracked business');
  }
};

// Delete multiple tracked businesses
export const deleteMultipleTrackedBusinesses = async (placeIds) => {
  try {
    const response = await fetch(`${BACKEND_BASE_URL}/tracked-businesses`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ placeIds }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error deleting multiple tracked businesses:', error);
    throw new Error('Failed to delete tracked businesses');
  }
};



