import { useEffect, useRef, useState } from 'react';

export const UltraSimpleMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState('Starting...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        setStatus('Loading Leaflet...');
        
        // Add CSS
        if (!document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Wait for CSS to load
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setStatus('Importing Leaflet...');
        const L = await import('leaflet');
        
        setStatus('Checking container...');
        if (!mapRef.current) {
          throw new Error('Map container not found');
        }
        
        setStatus('Creating map...');
        const map = L.map(mapRef.current, {
          center: [30.0444, 31.2357], // Cairo
          zoom: 13
        });
        
        setStatus('Adding tiles...');
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        setStatus('Adding marker...');
        L.marker([30.0444, 31.2357])
          .addTo(map)
          .bindPopup('Cairo, Egypt');
        
        setStatus('Map loaded successfully!');
        console.log('✅ Ultra simple map loaded');
        
      } catch (err) {
        console.error('❌ Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    loadMap();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded">
        <h3 className="text-red-800 font-bold">Error</h3>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-2 bg-blue-50 border border-blue-200 rounded">
        <p className="text-blue-800">Status: {status}</p>
      </div>
      
      <div 
        ref={mapRef} 
        className="w-full h-96 border border-gray-300 rounded"
        style={{ minHeight: '400px' }}
      />
    </div>
  );
};
