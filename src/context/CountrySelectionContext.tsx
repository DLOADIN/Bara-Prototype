import React, { createContext, useContext, useMemo, useState } from 'react';

export interface SelectedCountry {
  id: string;
  name: string;
  code: string;
  flag_url?: string | null;
}

interface CountrySelectionContextValue {
  selectedCountry: SelectedCountry | null;
  setSelectedCountry: (country: SelectedCountry | null) => void;
  clearSelectedCountry: () => void;
}

const CountrySelectionContext = createContext<CountrySelectionContextValue | undefined>(undefined);

export const CountrySelectionProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCountry, setSelectedCountry] = useState<SelectedCountry | null>(null);

  const value = useMemo(() => ({
    selectedCountry,
    setSelectedCountry,
    clearSelectedCountry: () => setSelectedCountry(null),
  }), [selectedCountry]);

  return (
    <CountrySelectionContext.Provider value={value}>
      {children}
    </CountrySelectionContext.Provider>
  );
};

export const useCountrySelection = (): CountrySelectionContextValue => {
  const ctx = useContext(CountrySelectionContext);
  if (!ctx) {
    throw new Error('useCountrySelection must be used within a CountrySelectionProvider');
  }
  return ctx;
};


