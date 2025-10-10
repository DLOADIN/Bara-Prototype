import React from 'react';

export default function EnvChecker() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-bold text-yellow-800 mb-2">Environment Variables Check</h3>
      <div className="text-sm space-y-1">
        <div>
          <strong>VITE_SUPABASE_URL:</strong> {supabaseUrl ? '✅ Set' : '❌ Missing'}
          {supabaseUrl && <span className="text-gray-600 ml-2">({supabaseUrl.substring(0, 30)}...)</span>}
        </div>
        <div>
          <strong>VITE_SUPABASE_ANON_KEY:</strong> {supabaseKey ? '✅ Set' : '❌ Missing'}
          {supabaseKey && <span className="text-gray-600 ml-2">({supabaseKey.substring(0, 20)}...)</span>}
        </div>
      </div>
    </div>
  );
}

