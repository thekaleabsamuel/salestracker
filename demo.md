# Business Search Dashboard Demo Guide

## 🎯 Quick Demo

### 1. Start the Application
```bash
npm run dev
```
Open your browser to `http://localhost:5173`

### 2. Test Search Functionality

#### Example Searches:
- **Business Type**: "Mexican restaurants"
- **Location**: "Los Angeles, CA"
- **Radius**: 50 miles

#### Alternative Searches:
- "HVAC contractors" + "Chicago, IL" + 25 miles
- "law offices" + "Miami, FL" + 100 miles
- "coffee shops" + "Seattle, WA" + 10 miles

### 3. Explore Features

#### Search Form:
- ✅ Enter business keywords
- ✅ Set location manually or use current location
- ✅ Adjust search radius
- ✅ Clear form and start over

#### Results Table:
- ✅ Sort by business name, address, or rating
- ✅ Filter results using the search bar
- ✅ Paginate through large result sets
- ✅ View business details (phone, website, types)

#### Export Options:
- ✅ Download as CSV
- ✅ Download as Excel (.xlsx)

### 4. Mock Data Mode

**No API Key Required!** The application includes sample data for testing:

- **El Mariachi Mexican Restaurant** - 4.5★ rating
- **Downtown HVAC Services** - 4.8★ rating  
- **Smith & Associates Law Office** - 4.2★ rating
- **Green Thumb Landscaping** - 4.6★ rating
- **Tech Solutions IT Services** - 4.7★ rating

### 5. Responsive Design

Test the application on different screen sizes:
- **Desktop**: Full table view with all columns
- **Tablet**: Responsive grid layout
- **Mobile**: Stacked layout for small screens

## 🔧 Advanced Testing

### Geolocation Testing
1. Allow location access when prompted
2. Click the location icon next to the location field
3. Verify coordinates are populated

### Error Handling
1. Try searching without entering a keyword
2. Try searching without entering a location
3. Verify error messages appear correctly

### Performance Testing
1. Search with large radius (100 miles)
2. Test pagination with many results
3. Verify smooth scrolling and sorting

## 📱 Browser Compatibility

Tested on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## 🚀 Next Steps

1. **Get Google Places API Key** for real data
2. **Customize the theme** to match your brand
3. **Deploy to production** using the build command
4. **Integrate with your systems** for business use

---

**Happy Testing! 🎉**



