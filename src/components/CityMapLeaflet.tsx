import { useEffect, useRef, useState } from 'react';
import { MapPin, Building, Star, Phone, Globe } from 'lucide-react';
import L from 'leaflet';

// Add TypeScript declarations for Leaflet
declare global {
  interface Window {
    L: typeof L;
  }
}

interface CityMapLeafletProps {
  cityName: string;
  latitude: number;
  longitude: number;
  businesses: Array<{
    id: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    category?: { name: string };
    rating?: number;
    address?: string;
  }>;
  height?: string;
}

export const CityMapLeaflet = ({ cityName, latitude, longitude, businesses, height = '400px' }: CityMapLeafletProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('CityMapLeaflet useEffect triggered with:', { cityName, latitude, longitude, businessesCount: businesses.length });
    
    if (!mapRef.current) {
      console.log('Map ref not available yet');
      return;
    }

    if (!latitude || !longitude) {
      console.log('Invalid coordinates:', { latitude, longitude });
      setError('Invalid coordinates provided for map');
      setLoading(false);
      return;
    }

    const initializeMap = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Initializing Leaflet map...');

        // Create map instance
        const map = L.map(mapRef.current!).setView([latitude, longitude], 12);
        mapInstanceRef.current = map;
        console.log('Map instance created successfully');

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
          minZoom: 8
        }).addTo(map);
        console.log('OpenStreetMap tiles added');

        // Custom city center marker icon
        const cityIcon = L.divIcon({
          className: 'custom-city-marker',
          html: `
            <div style="
              width: 40px; 
              height: 40px; 
              background: #3B82F6; 
              border: 3px solid #1E40AF; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-weight: bold; 
              font-size: 16px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            ">
              ${cityName.charAt(0).toUpperCase()}
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        // Add city center marker
        const cityMarker = L.marker([latitude, longitude], { icon: cityIcon }).addTo(map);
        console.log('City marker added at:', [latitude, longitude]);
        
        // City info popup
        const cityPopup = L.popup({
          maxWidth: 250,
          className: 'city-popup'
        }).setContent(`
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 8px 0; color: #1F2937; font-size: 16px; font-weight: 600;">
              ${cityName}
            </h3>
            <p style="margin: 0; color: #6B7280; font-size: 14px;">City Center</p>
            <p style="margin: 5px 0 0 0; color: #6B7280; font-size: 12px;">
              ${businesses.length} businesses nearby
            </p>
          </div>
        `);

        cityMarker.bindPopup(cityPopup);

        // Custom business marker icon
        const businessIcon = L.divIcon({
          className: 'custom-business-marker',
          html: `
            <div style="
              width: 32px; 
              height: 32px; 
              background: #10B981; 
              border: 2px solid #059669; 
              border-radius: 6px; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              color: white; 
              font-weight: bold; 
              font-size: 14px;
              box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            ">
              🏢
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        // Add business markers
        let businessMarkersAdded = 0;
        businesses.forEach((business) => {
          if (business.latitude && business.longitude) {
            const businessMarker = L.marker([business.latitude, business.longitude], { 
              icon: businessIcon 
            }).addTo(map);

            // Business info popup
            const businessPopup = L.popup({
              maxWidth: 280,
              className: 'business-popup'
            }).setContent(`
              <div style="padding: 12px;">
                <h4 style="margin: 0 0 8px 0; color: #1F2937; font-size: 14px; font-weight: 600;">
                  ${business.name}
                </h4>
                ${business.category ? `
                  <p style="margin: 0 0 6px 0; color: #6B7280; font-size: 12px;">
                    📍 ${business.category.name}
                  </p>
                ` : ''}
                ${business.rating ? `
                  <p style="margin: 0 0 6px 0; color: #6B7280; font-size: 12px;">
                    ⭐ ${business.rating.toFixed(1)} rating
                  </p>
                ` : ''}
                ${business.address ? `
                  <p style="margin: 0; color: #6B7280; font-size: 12px;">
                    🏠 ${business.address}
                  </p>
                ` : ''}
              </div>
            `);

            businessMarker.bindPopup(businessPopup);
            businessMarkersAdded++;
          }
        });
        console.log(`Added ${businessMarkersAdded} business markers`);

        // Fit map to show all markers
        const bounds = L.latLngBounds([
          [latitude, longitude], // city center
          ...businesses
            .filter(b => b.latitude && b.longitude)
            .map(b => [b.latitude!, b.longitude!])
        ]);
        
        if (bounds.isValid()) {
          map.fitBounds(bounds, { padding: [20, 20] });
          console.log('Map bounds set to show all markers');
        }

        // Force a resize to ensure proper display
        setTimeout(() => {
          map.invalidateSize();
          console.log('Map size invalidated');
        }, 100);

        setLoading(false);
        console.log('Map initialization completed successfully');
      } catch (err) {
        console.error('Error loading Leaflet map:', err);
        setError('Failed to load map. Please try again.');
        setLoading(false);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        console.log('Map cleanup completed');
      }
    };
  }, [latitude, longitude, businesses, cityName]);

  // Handle map resize when container changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  }, [height]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center" style={{ height }}>
        <div className="text-red-600 mb-2">
          <MapPin className="w-8 h-8 mx-auto" />
        </div>
        <h3 className="text-red-800 font-medium mb-2">Map Loading Error</h3>
        <p className="text-red-700 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200" style={{ height }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading OpenStreetMap...</p>
          <p className="text-gray-500 text-xs mt-1">Powered by Leaflet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Map Container */}
      <div 
        ref={mapRef} 
        className="w-full rounded-lg border-2 border-blue-300 shadow-sm"
        style={{ height }}
      />
      
      {/* Map Controls Overlay */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[1000]">
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView([latitude, longitude], 12);
            }
          }}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          title="Reset to city center"
        >
          <MapPin className="w-5 h-5 text-blue-600" />
        </button>
        
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + 1);
            }
          }}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          title="Zoom in"
        >
          <span className="text-lg font-bold text-gray-700">+</span>
        </button>
        
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() - 1);
            }
          }}
          className="bg-white p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          title="Zoom out"
        >
          <span className="text-lg font-bold text-gray-700">−</span>
        </button>

        {/* Business Count Badge */}
        <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium shadow-md">
          {businesses.filter(b => b.latitude && b.longitude).length} businesses
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md border border-gray-200 z-[1000]">
        <div className="text-xs text-gray-600 space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            <span>City Center</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded-lg"></div>
            <span>Business</span>
          </div>
        </div>
      </div>

      {/* Attribution */}
      <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-600 z-[1000]">
        © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" className="hover:underline">OpenStreetMap</a> contributors
      </div>
    </div>
  );
};
