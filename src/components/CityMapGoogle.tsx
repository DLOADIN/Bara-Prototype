import { useEffect, useRef, useState } from 'react';
import { MAP_CONFIG } from '@/config/maps';

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
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state when component is rendered
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only proceed if component is mounted and we have a map container
    if (!isMounted || !mapRef.current) {
      return;
    }

    console.log('CityMapGoogle useEffect triggered with:', {
      cityName,
      latitude,
      longitude,
      businessesCount: businesses.length,
      isMounted,
      hasMapRef: !!mapRef.current
    });

    // Add a timeout to prevent endless loading
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        console.error('Map loading timeout - taking too long');
        setError('Map loading timeout - please check your internet connection and API key');
        setIsLoading(false);
      }
    }, 15000); // 15 second timeout

    const loadGoogleMaps = async () => {
      try {
        console.log('Starting Google Maps loading process...');
        console.log('API Key being used:', MAP_CONFIG.GOOGLE_MAPS_API_KEY.substring(0, 10) + '...');
        
        // Check if Google Maps is already loaded
        if (window.google && window.google.maps) {
          console.log('Google Maps already loaded');
          clearTimeout(loadingTimeout);
          initializeMap();
          return;
        }

        // Load Google Maps script with proper async loading
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_CONFIG.GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log('Google Maps script loaded successfully');
          console.log('Google Maps API available:', !!window.google?.maps);
          clearTimeout(loadingTimeout);
          initializeMap();
        };
        
        script.onerror = (error) => {
          console.error('Failed to load Google Maps script:', error);
          clearTimeout(loadingTimeout);
          setError('Failed to load Google Maps - Check your API key and internet connection');
          setIsLoading(false);
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Google Maps:', error);
        clearTimeout(loadingTimeout);
        setError('Error loading Google Maps');
        setIsLoading(false);
      }
    };

    const initializeMap = () => {
      if (!mapRef.current || !window.google) {
        console.error('Map container or Google Maps not available');
        console.error('Map ref:', !!mapRef.current);
        console.error('Google Maps available:', !!window.google);
        setError('Map container or Google Maps not available');
        setIsLoading(false);
        return;
      }

      try {
        console.log('Initializing Google Map with coordinates:', { lat: latitude, lng: longitude });
        
        // Create map instance with enhanced styling
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: MAP_CONFIG.DEFAULT_ZOOM,
          styles: MAP_CONFIG.MAP_STYLES,
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          gestureHandling: 'cooperative',
          backgroundColor: '#f8fafc'
        });

        mapInstanceRef.current = map;
        console.log('Google Map initialized successfully');

        // Create city center marker using AdvancedMarkerElement
        const createCityMarker = async () => {
          try {
            const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
            
            // Create city marker content
            const cityMarkerContent = document.createElement('div');
            cityMarkerContent.className = 'city-marker';
            cityMarkerContent.innerHTML = `
              <div style="
                width: 40px; 
                height: 40px; 
                background: linear-gradient(135deg, #3B82F6, #1E40AF);
                border: 3px solid #FFFFFF;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-weight: bold;
                color: white;
                font-size: 16px;
              ">
                ${cityName.charAt(0).toUpperCase()}
              </div>
            `;

            const cityMarker = new AdvancedMarkerElement({
              position: { lat: latitude, lng: longitude },
              map: map,
              title: cityName,
              content: cityMarkerContent
            });

            // Create info window for city marker
            const cityInfoWindow = new window.google.maps.InfoWindow({
              content: `
                <div style="padding: 12px; max-width: 250px; font-family: system-ui, -apple-system, sans-serif;">
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
            console.log('City marker added successfully');
          } catch (error) {
            console.error('Error creating city marker:', error);
            // Fallback to regular marker if AdvancedMarkerElement fails
            createFallbackCityMarker();
          }
        };

        const createFallbackCityMarker = () => {
          const cityMarker = new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: cityName,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 12,
              fillColor: '#3B82F6',
              fillOpacity: 0.8,
              strokeColor: '#1E40AF',
              strokeWeight: 2
            },
            label: {
              text: cityName.charAt(0).toUpperCase(),
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 'bold'
            }
          });

          const cityInfoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; max-width: 250px;">
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
          console.log('Fallback city marker added successfully');
        };

        // Create business markers using AdvancedMarkerElement
        const createBusinessMarkers = async () => {
          try {
            const { AdvancedMarkerElement } = await window.google.maps.importLibrary("marker");
            
            console.log('Adding business markers:', businesses.length);
            businesses.forEach((business, index) => {
              if (business.latitude && business.longitude) {
                console.log(`Adding business marker ${index + 1}:`, business.name);
                
                // Create business marker content
                const businessMarkerContent = document.createElement('div');
                businessMarkerContent.className = 'business-marker';
                businessMarkerContent.innerHTML = `
                  <div style="
                    width: 36px; 
                    height: 36px; 
                    background: linear-gradient(135deg, #10B981, #059669);
                    border: 2px solid #FFFFFF;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.12);
                    font-size: 18px;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                  " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                    🏢
                  </div>
                `;

                const businessMarker = new AdvancedMarkerElement({
                  position: { lat: business.latitude, lng: business.longitude },
                  map: map,
                  title: business.name,
                  content: businessMarkerContent
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
                    <div style="padding: 12px; max-width: 280px; font-family: system-ui, -apple-system, sans-serif;">
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
          } catch (error) {
            console.error('Error creating business markers:', error);
            // Fallback to regular markers
            createFallbackBusinessMarkers();
          }
        };

        const createFallbackBusinessMarkers = () => {
          businesses.forEach((business, index) => {
            if (business.latitude && business.longitude) {
              const businessMarker = new window.google.maps.Marker({
                position: { lat: business.latitude, lng: business.longitude },
                map: map,
                title: business.name,
                icon: {
                  path: window.google.maps.SymbolPath.CIRCLE,
                  scale: 10,
                  fillColor: '#10B981',
                  fillOpacity: 0.8,
                  strokeColor: '#059669',
                  strokeWeight: 2
                },
                label: {
                  text: '🏢',
                  fontSize: '12px'
                }
              });

              // Create info window for business (same content as above)
              const getAverageRating = (business: Business) => {
                if (!business.reviews || business.reviews.length === 0) return 0;
                const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
                return totalRating / business.reviews.length;
              };

              const averageRating = getAverageRating(business);
              const ratingStars = '⭐'.repeat(Math.round(averageRating));

              const businessInfoWindow = new window.google.maps.InfoWindow({
                content: `
                  <div style="padding: 12px; max-width: 280px;">
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
        };

        // Initialize markers
        createCityMarker().then(() => {
          createBusinessMarkers().then(() => {
            // Fit map to show all markers
            if (markersRef.current.length > 0) {
              console.log('Fitting map to show all markers:', markersRef.current.length);
              const bounds = new window.google.maps.LatLngBounds();
              markersRef.current.forEach(marker => {
                bounds.extend(marker.position);
              });
              map.fitBounds(bounds);
              
              // Add some padding to the bounds
              const listener = window.google.maps.event.addListenerOnce(map, 'idle', () => {
                if (map.getZoom() > 15) {
                  map.setZoom(15);
                }
                console.log('Map bounds fitted successfully');
              });
            }

            setIsLoading(false);
            console.log('Map initialization completed successfully');
          });
        });

      } catch (error) {
        console.error('Error initializing Google Map:', error);
        setError(`Error initializing map: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setIsLoading(false);
      }
    };

    // Start loading Google Maps
    loadGoogleMaps();

    // Cleanup function
    return () => {
      clearTimeout(loadingTimeout);
      // Clear markers
      markersRef.current.forEach(marker => {
        if (marker && marker.map) {
          marker.map = null;
        }
      });
      markersRef.current = [];
    };
  }, [cityName, latitude, longitude, businesses, isMounted]);

  if (error) {
    return (
      <div 
        style={{ height }} 
        className="bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200"
      >
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-2">🗺️</div>
          <p className="text-gray-600 font-medium">Map Error</p>
          <p className="text-gray-500 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div 
        style={{ height }} 
        className="bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        style={{ height }} 
        className="w-full rounded-lg border border-gray-200 shadow-sm"
      />
      
      {/* Enhanced business count badge */}
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
    </div>
  );
};
