# Google Maps Setup Guide

## 🗺️ Setting Up Google Maps for Your City Pages

### 1. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Maps JavaScript API**
   - **Places API** (for enhanced functionality)
4. Go to "Credentials" and create an API key
5. Copy your API key

### 2. Configure Your Environment

Create a `.env` file in your project root:

```env
# Google Maps API Configuration
VITE_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Other environment variables...
```

### 3. API Key Restrictions (Recommended)

For security, restrict your API key:

1. **Application restrictions**: HTTP referrers
2. **API restrictions**: 
   - Maps JavaScript API
   - Places API
3. **Referrer restrictions**: Add your domain (e.g., `localhost:5173/*` for development)

### 4. Features Included

The Google Maps integration includes:

- **City Center Marker**: Blue circular marker with city initial
- **Business Markers**: Green markers with building emoji
- **Interactive Info Windows**: Click markers for details
- **Rich Business Information**: Name, category, description, address, phone, ratings
- **Auto-fit Bounds**: Map automatically shows all markers
- **Custom Styling**: Clean, modern map appearance
- **Loading States**: Smooth loading experience
- **Error Handling**: Graceful fallbacks

### 5. Map Features

- **Zoom Controls**: Standard Google Maps zoom
- **Street View**: Available on supported locations
- **Fullscreen Mode**: Toggle fullscreen view
- **Map Type Control**: Switch between map types
- **Business Count Badge**: Shows number of businesses on map

### 6. Development vs Production

- **Development**: Uses a demo API key (limited functionality)
- **Production**: Requires your own API key for full features

### 7. Troubleshooting

If maps don't load:

1. Check browser console for errors
2. Verify API key is correct
3. Ensure APIs are enabled in Google Cloud Console
4. Check API key restrictions
5. Verify billing is enabled (required for Google Maps)

### 8. Cost Considerations

Google Maps has usage-based pricing:
- **Free tier**: $200 monthly credit
- **Typical usage**: Very low cost for small to medium applications
- **Monitor usage**: Check Google Cloud Console billing

### 9. Alternative Maps

If you prefer other map providers:
- **Mapbox**: Already configured in `src/config/maps.ts`
- **OpenStreetMap**: Previous Leaflet implementation available
- **Custom**: Easy to swap map providers

---

**Note**: The current implementation uses a demo API key for development. Replace it with your own API key for production use.
