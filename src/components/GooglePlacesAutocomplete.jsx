import React, { useState, useEffect, useRef } from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
} from '@mui/icons-material';

const GooglePlacesAutocomplete = ({ 
  value, 
  onChange, 
  onUseCurrentLocation, 
  userLocation,
  placeholder = "Address, city, or zip code",
  label = "Location"
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiReady, setApiReady] = useState(false);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const sessionToken = useRef(null);

  useEffect(() => {
    // Initialize Google Places services when component mounts
    const initializeServices = async () => {
      try {
        // Wait for Google Maps API to be ready
        if (window.google && window.google.maps) {
          setApiReady(true);
          initializeGoogleServices();
        } else if (window.loadGoogleMapsAPI) {
          const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
          if (apiKey && apiKey !== 'your_google_places_api_key_here') {
            await window.loadGoogleMapsAPI(apiKey);
            // The callback will set apiReady to true
          }
        }
      } catch (error) {
        console.error('Failed to initialize Google Maps API:', error);
      }
    };

    initializeServices();
  }, []);

  // Watch for when Google Maps API becomes available
  useEffect(() => {
    if (window.google && window.google.maps && !apiReady) {
      setApiReady(true);
      initializeGoogleServices();
    }
  }, [apiReady]);

  const initializeGoogleServices = () => {
    try {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        placesService.current = new window.google.maps.places.PlacesService(
          document.createElement('div')
        );
        sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
        setApiReady(true);
      }
    } catch (error) {
      console.error('Failed to initialize Google services:', error);
    }
  };

  useEffect(() => {
    // Update input value when external value changes
    if (value && typeof value === 'object' && value.formattedAddress) {
      setInputValue(value.formattedAddress);
    } else if (typeof value === 'string') {
      setInputValue(value);
    } else {
      setInputValue('');
    }
  }, [value]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    
    if (!apiReady || !autocompleteService.current || newInputValue.length < 3) {
      setSuggestions([]);
      return;
    }
    
    setLoading(true);
    
    autocompleteService.current.getPlacePredictions(
      {
        input: newInputValue,
        types: ['geocode', 'establishment'],
        sessionToken: sessionToken.current,
      },
      (predictions, status) => {
        setLoading(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const handlePlaceSelect = (event, selectedPlace) => {
    if (!selectedPlace || !selectedPlace.place_id || !placesService.current) {
      return;
    }

    // Get detailed place information
    placesService.current.getDetails(
      {
        placeId: selectedPlace.place_id,
        fields: ['geometry', 'formatted_address', 'name'],
        sessionToken: sessionToken.current,
      },
      (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && place) {
          const locationData = {
            placeId: selectedPlace.place_id,
            description: selectedPlace.description,
            lat: place.geometry?.location?.lat(),
            lng: place.geometry?.location?.lng(),
            formattedAddress: place.formatted_address || selectedPlace.description,
          };
          
          // Update the parent component with the selected location
          onChange(locationData);
          
          // Create a new session token for the next search
          sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
        }
      }
    );
  };

  const getOptionLabel = (option) => {
    if (typeof option === 'string') return option;
    return option.description || option.formattedAddress || '';
  };

  const isOptionEqualToValue = (option, value) => {
    if (typeof option === 'string' || typeof value === 'string') {
      return option === value;
    }
    return option.placeId === value.placeId;
  };

  // Show loading state if API is not ready
  if (!apiReady) {
    return (
      <TextField
        fullWidth
        label={label}
        placeholder="Loading Google Places... (or type manually)"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          // Allow manual input as fallback
          if (e.target.value.trim()) {
            onChange({
              placeId: 'manual_input',
              description: e.target.value,
              formattedAddress: e.target.value,
            });
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LocationIcon />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title="Use current location">
                <IconButton 
                  onClick={onUseCurrentLocation} 
                  disabled={!userLocation}
                >
                  <MyLocationIcon />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
    );
  }

  return (
    <Autocomplete
      freeSolo
      options={suggestions}
      value={inputValue}
      onChange={handlePlaceSelect}
      onInputChange={handleInputChange}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue}
      loading={loading}
      filterOptions={(x) => x} // Disable built-in filtering
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <LocationIcon />
              </InputAdornment>
            ),
                              endAdornment: (
                    <InputAdornment position="end">
                      {loading ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Tooltip title="Use current location">
                          <span>
                            <IconButton 
                              onClick={onUseCurrentLocation} 
                              disabled={!userLocation}
                            >
                              <MyLocationIcon />
                            </IconButton>
                          </span>
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <div>
            <div style={{ fontWeight: 'bold' }}>
              {option.structured_formatting?.main_text || option.description?.split(',')[0]}
            </div>
            <div style={{ fontSize: '0.875rem', color: 'rgba(0, 0, 0, 0.6)' }}>
              {option.structured_formatting?.secondary_text || option.description?.split(',').slice(1).join(',')}
            </div>
          </div>
        </li>
      )}
    />
  );
};

export default GooglePlacesAutocomplete;
