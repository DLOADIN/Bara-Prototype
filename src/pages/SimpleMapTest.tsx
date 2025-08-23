import { useState } from 'react';
import { CityMapLeafletCallback } from '@/components/CityMapLeafletCallback';

export const SimpleMapTest = () => {
  const [showMap, setShowMap] = useState(false);

  const testBusinesses = [
    {
      id: 'test-1',
      name: 'Test Restaurant',
      description: 'A test restaurant',
      phone: '+1234567890',
      website: 'https://example.com',
      address: '123 Test St',
      latitude: 30.0444 + 0.001,
      longitude: 31.2357 + 0.001,
      category: { name: 'Restaurant', slug: 'restaurant' },
      reviews: []
    }
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Simple Map Test</h1>
      
      <div className="mb-6">
        <button 
          onClick={() => setShowMap(!showMap)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>

      {showMap && (
        <div className="border border-gray-300 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">Cairo Map Test</h2>
          <CityMapLeafletCallback
            cityName="Cairo"
            latitude={30.0444}
            longitude={31.2357}
            businesses={testBusinesses}
            height="400px"
          />
        </div>
      )}

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Test Instructions:</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Click "Show Map" button</li>
          <li>Check if map loads without errors</li>
          <li>Look for debug info in bottom-right corner</li>
          <li>Check browser console for any errors</li>
        </ol>
      </div>
    </div>
  );
};
