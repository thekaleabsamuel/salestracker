import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
  Download as DownloadIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import BusinessResultsTable from './BusinessResultsTable';
import BusinessTrackingGrid from './BusinessTrackingGrid';
import { searchBusinesses } from '../services/placesApi';
import { 
  getTrackedBusinesses, 
  addBusinessesToTracking, 
  updateTrackedBusiness, 
  deleteTrackedBusiness 
} from '../services/trackingApi';

const BusinessSearchDashboard = () => {
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    radius: 50,
  });
  const [businesses, setBusinesses] = useState([]);
  const [trackedBusinesses, setTrackedBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Get user's current location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log('Geolocation error:', error);
        }
      );
    }
  }, []);

  // Load tracked businesses from backend on component mount
  useEffect(() => {
    loadTrackedBusinesses();
  }, []);

  // Load tracked businesses from backend
  const loadTrackedBusinesses = async () => {
    try {
      const data = await getTrackedBusinesses();
      setTrackedBusinesses(data);
    } catch (error) {
      console.error('Error loading tracked businesses:', error);
      // Fallback to localStorage if backend is unavailable
      const saved = localStorage.getItem('trackedBusinesses');
      if (saved) {
        try {
          setTrackedBusinesses(JSON.parse(saved));
        } catch (parseError) {
          console.error('Error parsing localStorage data:', parseError);
        }
      }
    }
  };

  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleInputChange = (field) => (event) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      setSearchParams(prev => ({
        ...prev,
        location: `${userLocation.lat}, ${userLocation.lng}`
      }));
    }
  };

  const handleSearch = async () => {
    if (!searchParams.keyword.trim()) {
      setError('Please enter a business keyword');
      return;
    }

    if (!searchParams.location.trim()) {
      setError('Please enter a location or use current location');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const results = await searchBusinesses(searchParams);
      setBusinesses(results);
      // Switch to search results tab
      setActiveTab(0);
    } catch (err) {
      setError(err.message || 'Failed to search businesses');
      setBusinesses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchParams({
      keyword: '',
      location: '',
      radius: 50,
    });
    setBusinesses([]);
    setError('');
  };

  const handleExport = (format) => {
    if (businesses.length === 0) return;

    if (format === 'csv') {
      exportToCSV();
    } else if (format === 'excel') {
      exportToExcel();
    }
  };

  const exportToCSV = () => {
    const headers = ['Business Name', 'Address', 'Phone', 'Rating', 'Website', 'Types'];
    const csvContent = [
      headers.join(','),
      ...businesses.map(business => [
        `"${business.name}"`,
        `"${business.formatted_address}"`,
        `"${business.formatted_phone_number || 'N/A'}"`,
        business.rating || 'N/A',
        `"${business.website || 'N/A'}"`,
        `"${business.types?.join(', ') || 'N/A'}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business_search_${searchParams.keyword}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    // For Excel export, we'll use the xlsx library
    import('xlsx').then((XLSX) => {
      const worksheet = XLSX.utils.json_to_sheet(businesses.map(business => ({
        'Business Name': business.name,
        'Address': business.formatted_address,
        'Phone': business.formatted_phone_number || 'N/A',
        'Rating': business.rating || 'N/A',
        'Website': business.website || 'N/A',
        'Types': business.types?.join(', ') || 'N/A'
      })));
      
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Businesses');
      
      XLSX.writeFile(workbook, `business_search_${searchParams.keyword}_${new Date().toISOString().split('T')[0]}.xlsx`);
    });
  };

  // Business tracking functions
  const handleAddBusinesses = async (businessesToAdd) => {
    try {
      // Add to backend
      const addedBusinesses = await addBusinessesToTracking(businessesToAdd);
      
      // Update local state
      setTrackedBusinesses(prev => [...prev, ...addedBusinesses]);
      
      // Also save to localStorage as backup
      localStorage.setItem('trackedBusinesses', JSON.stringify([...trackedBusinesses, ...addedBusinesses]));
      
      showSnackbar(`Added ${businessesToAdd.length} business${businessesToAdd.length !== 1 ? 'es' : ''} to tracking!`, 'success');
      
      // Switch to tracking tab to show newly added businesses
      setActiveTab(1);
    } catch (error) {
      console.error('Error adding businesses to tracking:', error);
      showSnackbar('Failed to add businesses to tracking. Using localStorage as backup.', 'warning');
      
      // Fallback to localStorage
      const updatedTracking = [...trackedBusinesses, ...businessesToAdd];
      setTrackedBusinesses(updatedTracking);
      localStorage.setItem('trackedBusinesses', JSON.stringify(updatedTracking));
      setActiveTab(1);
    }
  };

  const handleUpdateBusiness = async (updatedBusiness) => {
    try {
      // Update in backend
      const result = await updateTrackedBusiness(updatedBusiness.place_id, updatedBusiness);
      
      // Update local state
      setTrackedBusinesses(prev => 
        prev.map(business => 
          business.place_id === updatedBusiness.place_id ? result : business
        )
      );
      
      // Also update localStorage as backup
      const updatedTracking = trackedBusinesses.map(business => 
        business.place_id === updatedBusiness.place_id ? result : business
      );
      localStorage.setItem('trackedBusinesses', JSON.stringify(updatedTracking));
      
      showSnackbar('Business updated successfully!', 'success');
    } catch (error) {
      console.error('Error updating business:', error);
      showSnackbar('Failed to update business in backend. Using localStorage as backup.', 'warning');
      
      // Fallback to localStorage
      setTrackedBusinesses(prev => 
        prev.map(business => 
          business.place_id === updatedBusiness.place_id ? updatedBusiness : business
        )
      );
      localStorage.setItem('trackedBusinesses', JSON.stringify(trackedBusinesses));
    }
  };

  const handleDeleteBusiness = async (businessId) => {
    try {
      // Delete from backend
      await deleteTrackedBusiness(businessId);
      
      // Update local state
      setTrackedBusinesses(prev => prev.filter(business => business.place_id !== businessId));
      
      // Also update localStorage as backup
      const updatedTracking = trackedBusinesses.filter(business => business.place_id !== businessId);
      localStorage.setItem('trackedBusinesses', JSON.stringify(updatedTracking));
      
      showSnackbar('Business removed from tracking!', 'success');
    } catch (error) {
      console.error('Error deleting business:', error);
      showSnackbar('Failed to delete business from backend. Using localStorage as backup.', 'warning');
      
      // Fallback to localStorage
      setTrackedBusinesses(prev => prev.filter(business => business.place_id !== businessId));
      localStorage.setItem('trackedBusinesses', JSON.stringify(trackedBusinesses));
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Business Search Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Find local businesses by industry and location
          </Typography>
        </Box>

        {/* Search Form */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Business Type/Keyword"
                placeholder="e.g., IT companies, HVAC contractors, law offices"
                value={searchParams.keyword}
                onChange={handleInputChange('keyword')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Location"
                placeholder="Address, city, or coordinates"
                value={searchParams.location}
                onChange={handleInputChange('location')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Use current location">
                        <IconButton onClick={handleUseCurrentLocation} disabled={!userLocation}>
                          <MyLocationIcon />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Radius (miles)</InputLabel>
                <Select
                  value={searchParams.radius}
                  label="Radius (miles)"
                  onChange={handleInputChange('radius')}
                >
                  <MenuItem value={10}>10 miles</MenuItem>
                  <MenuItem value={25}>25 miles</MenuItem>
                  <MenuItem value={50}>50 miles</MenuItem>
                  <MenuItem value={100}>100 miles</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                sx={{ height: 56 }}
              >
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              onClick={handleClear}
              startIcon={<ClearIcon />}
            >
              Clear
            </Button>
          </Box>
        </Paper>

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="business dashboard tabs">
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Search Results
                  {businesses.length > 0 && (
                    <Chip 
                      label={businesses.length} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  )}
                </Box>
              } 
            />
            <Tab 
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  Business Tracking
                  {trackedBusinesses.length > 0 && (
                    <Chip 
                      label={trackedBusinesses.length} 
                      size="small" 
                      color="secondary" 
                      variant="outlined"
                    />
                  )}
                </Box>
              } 
            />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <>
            {/* Results Summary */}
            {businesses.length > 0 && (
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Search Results
                  </Typography>
                  <Chip 
                    label={`${businesses.length} businesses found`} 
                    color="primary" 
                    variant="outlined"
                  />
                </Box>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Export to CSV">
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleExport('csv')}
                    >
                      CSV
                    </Button>
                  </Tooltip>
                  <Tooltip title="Export to Excel">
                    <Button
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleExport('excel')}
                    >
                      Excel
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            )}

            {/* Results Table */}
            {businesses.length > 0 && (
              <BusinessResultsTable 
                businesses={businesses} 
                onAddToTracking={handleAddBusinesses}
              />
            )}

            {/* No Results Message */}
            {!loading && businesses.length === 0 && searchParams.keyword && searchParams.location && !error && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No businesses found. Try adjusting your search criteria.
                </Typography>
              </Box>
            )}
          </>
        )}

        {activeTab === 1 && (
          <BusinessTrackingGrid
            trackedBusinesses={trackedBusinesses}
            onUpdateBusiness={handleUpdateBusiness}
            onDeleteBusiness={handleDeleteBusiness}
          />
        )}
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BusinessSearchDashboard;
