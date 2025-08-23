import { useEffect, useRef, useState } from 'react';
import { MAP_CONFIG } from '@/config/maps';
import { MapDebugInfo } from './MapDebugInfo';

interface Business {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  category?: {
    name: string;
    slug: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    content: string;
    created_at: string;
  }>;
}

interface CityMapGoogleProps {
  cityName: string;
  latitude: number;
  longitude: number;
  businesses: Business[];
  height?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export const CityMapGoogle = ({ 
  cityName, 
  latitude, 
  longitude, 
  businesses, 
  height = "500px" 
}: CityMapGoogleProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [containerReady, setContainerReady] = useState(false);

  // Check if container is ready
  useEffect(() => {
    if (mapRef.current) {
      setContainerReady(true);
    }
  }, []);

  useEffect(() => {
    let loadingTimeout: NodeJS.Timeout;
    let scriptLoaded = false;

    const loadGoogleMaps = async () => {
      try {
        console.log('🚀 Starting Google Maps loading process...');
        console.log('📍 City:', cityName);
        console.log('🎯 Coordinates:', { lat: latitude, lng: longitude });
        console.log('🏢 Businesses:', businesses.length);
        console.log('🗺️ Map container available:', !!mapRef.current);
        console.log('🔧 Container ready:', containerReady);
        
        // Check if container is ready
        if (!containerReady) {
          console.log('⏳ Container not ready yet, waiting...');
          return;
        }
        
        // Check if we have valid coordinates
        if (!latitude || !longitude) {
          setError('Invalid coordinates provided for map');
          setIsLoading(false);
          return;
        }

        // Check if map container is available
        if (!mapRef.current) {
          console.error('❌ Map container not available yet');
          setError('Map container not available - please refresh the page');
          setIsLoading(false);
          return;
        }

        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          console.log('✅ Google Maps already loaded');
          initializeMap();
          return;
        }

        // Set loading timeout
        loadingTimeout = setTimeout(() => {
          if (!scriptLoaded) {
            console.error('⏰ Map loading timeout');
            setError('Map loading timeout - please check your internet connection and API key');
            setIsLoading(false);
          }
        }, 20000); // 20 second timeout

        // Load Google Maps script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_CONFIG.GOOGLE_MAPS_API_KEY}&libraries=places&loading=async&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        // Create global callback function
        (window as any).initMap = () => {
          console.log('✅ Google Maps script loaded successfully');
          scriptLoaded = true;
          clearTimeout(loadingTimeout);
          initializeMap();
        };
        
        script.onerror = (error) => {
          console.error('❌ Failed to load Google Maps script:', error);
          clearTimeout(loadingTimeout);
          setError('Failed to load Google Maps - Check your API key and internet connection');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('❌ Error loading Google Maps:', error);
        clearTimeout(loadingTimeout);
        setError('Error loading Google Maps');
        setIsLoading(false);
      }
    };

    const initializeMap = () => {
      console.log('🗺️ Initializing map...');
      console.log('📦 Map ref available:', !!mapRef.current);
      console.log('🌐 Google Maps available:', !!window.google);
      
      if (!mapRef.current) {
        console.error('❌ Map container not available');
        setError('Map container not available - please refresh the page');
        setIsLoading(false);
        return;
      }

      if (!window.google) {
        console.error('❌ Google Maps not available');
        setError('Google Maps not available - please check your internet connection');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🗺️ Initializing Google Map...');
        
        // Create map instance
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 13,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          backgroundColor: '#f8fafc',
          styles: [
            {
              featureType: 'poi.business',
              stylers: [{ visibility: 'on' }]
            },
            {
              featureType: 'transit',
              elementType: 'labels.icon',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        mapInstanceRef.current = map;
        console.log('✅ Google Map initialized successfully');

        // Add city center marker
        addCityMarker(map);
        
        // Add business markers
        addBusinessMarkers(map);
        
        // Fit map to show all markers
        fitMapToMarkers(map);
        
        setMapLoaded(true);
        setIsLoading(false);
        console.log('🎉 Map setup completed successfully');
        
      } catch (error) {
        console.error('❌ Error initializing Google Map:', error);
        setError(`Error initializing map: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    const addCityMarker = (map: any) => {
      try {
        // Create city marker
        const cityMarker = new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: map,
          title: cityName,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 15,
            fillColor: '#3B82F6',
            fillOpacity: 0.9,
            strokeColor: '#1E40AF',
            strokeWeight: 3
          },
          label: {
            text: cityName.charAt(0).toUpperCase(),
            color: '#FFFFFF',
            fontSize: '16px',
            fontWeight: 'bold'
          }
        });

        // Create info window for city marker
        const cityInfoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 16px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
              <h3 style="margin: 0 0 8px 0; color: #1F2937; font-size: 18px; font-weight: bold;">
                ${cityName}
              </h3>
              <p style="margin: 0; color: #6B7280; font-size: 14px;">
                🏙️ City Center
              </p>
              <p style="margin: 4px 0 0 0; color: #9CA3AF; font-size: 12px;">
                📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
              </p>
              <p style="margin: 8px 0 0 0; color: #059669; font-size: 12px; font-weight: 500;">
                🏢 ${businesses.length} businesses nearby
              </p>
            </div>
          `
        });

        cityMarker.addListener('click', () => {
          cityInfoWindow.open(map, cityMarker);
        });

        markersRef.current.push(cityMarker);
        console.log('✅ City marker added successfully');
      } catch (error) {
        console.error('❌ Error adding city marker:', error);
      }
    };

    const addBusinessMarkers = (map: any) => {
      try {
        console.log(`🏢 Adding ${businesses.length} business markers...`);
        
        businesses.forEach((business, index) => {
          if (business.latitude && business.longitude) {
            console.log(`📍 Adding business marker ${index + 1}: ${business.name}`);
            
            // Create business marker
            const businessMarker = new window.google.maps.Marker({
              position: { lat: business.latitude, lng: business.longitude },
              map: map,
              title: business.name,
              icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: '#10B981',
                fillOpacity: 0.8,
                strokeColor: '#059669',
                strokeWeight: 2
              },
              label: {
                text: '🏢',
                fontSize: '14px'
              }
            });

            // Create info window for business
            const getAverageRating = (business: Business) => {
              if (!business.reviews || business.reviews.length === 0) return 0;
              const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
              return totalRating / business.reviews.length;
            };

            const averageRating = getAverageRating(business);
            const ratingStars = '⭐'.repeat(Math.round(averageRating));

            const businessInfoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 16px; max-width: 300px; font-family: system-ui, -apple-system, sans-serif;">
                  <h3 style="margin: 0 0 8px 0; color: #1F2937; font-size: 16px; font-weight: bold;">
                    ${business.name}
                  </h3>
                  ${business.category ? `
                    <p style="margin: 0 0 8px 0; color: #6B7280; font-size: 12px; background: #F3F4F6; padding: 4px 8px; border-radius: 6px; display: inline-block;">
                      ${business.category.name}
                    </p>
                  ` : ''}
                  ${business.description ? `
                    <p style="margin: 8px 0; color: #4B5563; font-size: 14px; line-height: 1.4;">
                      ${business.description}
                    </p>
                  ` : ''}
                  ${business.address ? `
                    <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
                      📍 ${business.address}
                    </p>
                  ` : ''}
                  ${business.phone ? `
                    <p style="margin: 4px 0; color: #6B7280; font-size: 12px;">
                      📞 ${business.phone}
                    </p>
                  ` : ''}
                  ${averageRating > 0 ? `
                    <p style="margin: 8px 0 0 0; color: #F59E0B; font-size: 12px; font-weight: 500;">
                      ${ratingStars} ${averageRating.toFixed(1)} (${business.reviews?.length || 0} reviews)
                    </p>
                  ` : ''}
                </div>
              `
            });

            businessMarker.addListener('click', () => {
              businessInfoWindow.open(map, businessMarker);
            });

            markersRef.current.push(businessMarker);
          }
        });
        
        console.log(`✅ Added ${businesses.filter(b => b.latitude && b.longitude).length} business markers`);
      } catch (error) {
        console.error('❌ Error adding business markers:', error);
      }
    };

    const fitMapToMarkers = (map: any) => {
      try {
        if (markersRef.current.length > 0) {
          console.log('🔍 Fitting map to show all markers...');
          const bounds = new window.google.maps.LatLngBounds();
          markersRef.current.forEach(marker => {
            bounds.extend(marker.getPosition());
          });
          map.fitBounds(bounds);
          
          // Add some padding and limit zoom
          window.google.maps.event.addListenerOnce(map, 'idle', () => {
            if (map.getZoom() > 16) {
              map.setZoom(16);
            }
            console.log('✅ Map bounds fitted successfully');
          });
        }
      } catch (error) {
        console.error('❌ Error fitting map to markers:', error);
      }
    };

    // Start loading process when container is ready
    if (containerReady) {
      // Small delay to ensure DOM is fully rendered
      setTimeout(() => {
        loadGoogleMaps();
      }, 100);
    }

    // Cleanup function
    return () => {
      clearTimeout(loadingTimeout);
      // Clear markers
      markersRef.current.forEach(marker => {
        if (marker && marker.map) {
          marker.setMap(null);
        }
      });
      markersRef.current = [];
      // Remove global callback and retry counter
      delete (window as any).initMap;
      delete (window as any).mapRetryCount;
    };
  }, [cityName, latitude, longitude, businesses, containerReady]);

  // Show error state
  if (error) {
    return (
      <div 
        style={{ height }} 
        className="bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200"
      >
        <div className="text-center p-6">
          <div className="text-red-500 text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Map Error</h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <div className="text-xs text-gray-500 space-y-1">
            <p>• Check your internet connection</p>
            <p>• Verify Google Maps API key is valid</p>
            <p>• Ensure billing is enabled in Google Cloud Console</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div 
        style={{ height }} 
        className="bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600 font-medium">Loading map...</p>
          <p className="text-gray-500 text-sm mt-1">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  // Show map
  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height, minHeight: '400px' }} 
        className="w-full rounded-lg border border-gray-200 shadow-sm bg-gray-50"
        data-testid="map-container"
      />
      
      {/* Business count badge */}
      <div className="absolute top-4 right-4 bg-white bg-opacity-95 px-4 py-2 rounded-full shadow-lg border border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🏢</span>
          <span className="text-sm font-medium text-gray-700">
            {businesses.filter(b => b.latitude && b.longitude).length} businesses
          </span>
        </div>
      </div>

      {/* City name badge */}
      <div className="absolute top-4 left-4 bg-blue-600 bg-opacity-95 px-4 py-2 rounded-full shadow-lg">
        <span className="text-sm font-medium text-white">
          📍 {cityName}
        </span>
      </div>

      {/* Map loaded indicator */}
      {mapLoaded && (
        <div className="absolute bottom-4 left-4 bg-green-600 bg-opacity-95 px-3 py-1 rounded-full shadow-lg">
          <span className="text-xs font-medium text-white">
            ✅ Map Loaded
          </span>
        </div>
      )}

      {/* Debug Info - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <MapDebugInfo 
          mapRef={mapRef}
          cityName={cityName}
          latitude={latitude}
          longitude={longitude}
        />
      )}
    </div>
  );
};
