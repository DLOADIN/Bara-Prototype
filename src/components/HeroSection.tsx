import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, ChevronDown, Building2, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import heroImage from "@/assets/hero-kitchen.jpg";
import { db } from "@/lib/supabase";
import { BusinessService, Business } from "@/lib/businessService";
import { toast } from "sonner";

// Remove the hardcoded allLocations array and replace with Supabase data
interface City {
  id: string;
  name: string;
  country_id: string;
  latitude: number | null;
  longitude: number | null;
  population: number | null;
  countries: {
    name: string;
    code: string;
  };
}

export const HeroSection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data, error } = await db.cities()
          .select(`
            id,
            name,
            country_id,
            latitude,
            longitude,
            population,
            countries (
              name,
              code
            )
          `)
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching cities:', error);
        } else {
          // Type assertion to handle the Supabase response structure
          const typedData = (data as unknown) as Array<{
            id: string;
            name: string;
            country_id: string;
            latitude: number | null;
            longitude: number | null;
            population: number | null;
            countries: {
              name: string;
              code: string;
            } | null;
          }>;
          setCities(typedData || []);
          // Do not preselect a default location; allow empty city selection
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Search businesses as user types
  useEffect(() => {
    const searchBusinesses = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([]);
        setIsSearchOpen(false);
        return;
      }

      setSearchLoading(true);
      try {
        const cityName = location.split(',')[0]?.trim();
        const options: { city?: string } = {};
        if (cityName) {
          options.city = cityName;
        }
        const results = await BusinessService.searchBusinesses(searchTerm, options);
        setSearchResults(results);
        setIsSearchOpen(true);
      } catch (error) {
        console.error('Error searching businesses:', error);
        setSearchResults([]);
        // Don't show error to user, just show no results
      } finally {
        setSearchLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(searchBusinesses, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, location]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close search results when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSearch = async () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;
    
    try {
      const cityName = location.split(',')[0]?.trim();
      const options: { city?: string } = {};
      if (cityName) {
        options.city = cityName;
      }
      
      const results = await BusinessService.searchBusinesses(trimmed, options);
      
      if (results.length === 0) {
        toast.error(
          `No businesses found for "${trimmed}"${cityName ? ` in ${cityName}` : ''}. Please try a different search term.`,
          {
            description: "The business you're looking for is not available in our database.",
            duration: 5000,
          }
        );
        return;
      }
      
      // Navigate to search results if businesses are found
      if (cityName) {
        const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
        navigate(`/${citySlug}/search?q=${encodeURIComponent(trimmed)}`);
      } else {
        navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    } catch (error) {
      console.error('Error searching businesses:', error);
      toast.error(
        "Search failed. Please try again.",
        {
          description: "There was an error processing your search request.",
          duration: 4000,
        }
      );
    }
  };

  const handleBusinessClick = (business: Business) => {
    // Navigate to business detail page
    const cityName = business.city?.name?.toLowerCase().replace(/\s+/g, '-') || 'unknown';
    const categorySlug = business.category?.slug || 'business';
    navigate(`/${cityName}/${categorySlug}/${business.id}`);
    setIsSearchOpen(false);
    setSearchTerm("");
  };

  const formatCityDisplay = (city: City) => {
    return `${city.name}, ${city.countries?.code || ''}`;
  };

  const getAverageRating = (business: Business) => {
    if (!business.reviews || business.reviews.length === 0) return 0;
    const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / business.reviews.length;
  };

  return (
    <section className="relative">
      {/* Hero Image Background */}
      <div className="relative h-[60vh] sm:h-[65vh] md:h-[70vh] lg:h-[75vh] bg-cover bg-center bg-no-repeat" 
           style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-3 sm:px-4 md:px-6 lg:px-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-comfortaa font-bold text-yp-dark text-center mb-4 sm:mb-6 md:mb-8 px-2 leading-tight">
            {t('homepage.hero.title')}<sup className="text-xs sm:text-sm md:text-base">℠</sup>
          </h1>
          
          {/* Search Form */}
          <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-3 md:gap-4">
              {/* Business Search Input */}
              <div className="flex-1 relative search-container min-w-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yp-gray-dark w-4 h-4 sm:w-5 sm:h-5" />
                <Input
                  type="text"
                  placeholder={t('homepage.hero.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setIsSearchOpen(true);
                  }}
                  className="pl-8 sm:pl-10 h-11 sm:h-12 font-roboto border-yp-gray-medium focus:border-yp-blue focus:ring-yp-blue text-sm sm:text-base rounded-lg"
                />
                
                {/* Search Results Dropdown */}
                {isSearchOpen && (searchResults.length > 0 || searchLoading) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-yp-gray-medium rounded-lg shadow-lg z-50 max-h-60 sm:max-h-80 overflow-y-auto">
                    {searchLoading ? (
                      <div className="p-3 sm:p-4 text-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yp-blue mx-auto"></div>
                        <p className="text-xs text-yp-gray-dark mt-1">{t('common.loading')}</p>
                      </div>
                    ) : (
                      <div className="py-2">
                        {searchResults.length === 0 ? (
                          <div className="p-3 sm:p-4 text-center text-yp-gray-dark">
                            <p className="text-sm">No businesses found</p>
                            <p className="text-xs mt-1">Try a different search term</p>
                          </div>
                        ) : (
                          searchResults.map((business) => {
                            const avgRating = getAverageRating(business);
                            const reviewCount = business.reviews?.length || 0;
                            
                            return (
                              <div
                                key={business.id}
                                onClick={() => handleBusinessClick(business)}
                                className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 hover:bg-yp-gray-light cursor-pointer border-b border-yp-gray-light last:border-b-0 transition-colors"
                              >
                                <div className="flex-shrink-0">
                                  {business.logo_url ? (
                                    <img 
                                      src={business.logo_url} 
                                      alt={business.name}
                                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yp-gray-light rounded-full flex items-center justify-center">
                                      <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-yp-gray-dark" />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-yp-dark truncate text-sm sm:text-base">{business.name}</h4>
                                  <p className="text-xs sm:text-sm text-yp-gray-dark truncate">
                                    {business.category?.name} • {business.city?.name}
                                  </p>
                                  {reviewCount > 0 && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                                      <span className="text-xs text-yp-gray-dark">
                                        {avgRating.toFixed(1)} ({reviewCount})
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                {business.is_premium && (
                                  <div className="flex-shrink-0">
                                    <span className="text-xs bg-yp-blue text-white px-2 py-1 rounded-full">
                                      Premium
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              {/* Location Dropdown */}
              <div className="flex-1 relative min-w-0">
                <DropdownMenu open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                  <DropdownMenuTrigger asChild>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yp-gray-dark w-4 h-4 sm:w-5 sm:h-5" />
                      <Input
                        type="text"
                        placeholder={t('homepage.hero.locationPlaceholder')}
                        value={location}
                        readOnly
                        className="pl-8 sm:pl-10 pr-8 sm:pr-10 h-11 sm:h-12 font-roboto border-yp-gray-medium focus:border-yp-blue focus:ring-yp-blue cursor-pointer text-sm sm:text-base rounded-lg"
                      />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-yp-gray-dark w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full max-h-60 overflow-y-auto bg-white border border-yp-gray-medium shadow-lg rounded-lg">
                    <div className="p-2">
                      <h3 className="text-sm font-roboto font-semibold text-yp-dark mb-2 px-2">QUICK LOCATIONS</h3>
                      
                      {/* Default blank city option for global search */}
                      <DropdownMenuItem
                        onClick={() => {
                          setLocation("");
                          setIsLocationOpen(false);
                          navigate("/search");
                        }}
                        className={`dropdown-menu-item-override font-roboto px-2 py-2 cursor-pointer hover:bg-yp-gray-light ${
                          location === "" ? "bg-yp-gray-light text-yp-blue" : "text-yp-dark"
                        }`}
                      >
                      </DropdownMenuItem>
                      
                      {loading ? (
                        <div className="text-center py-4">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yp-blue mx-auto"></div>
                          <p className="text-xs text-yp-gray-dark mt-1">{t('common.loading')}</p>
                        </div>
                      ) : (
                        cities.map((city) => (
                          <DropdownMenuItem
                            key={city.id}
                            onClick={() => {
                              setLocation(formatCityDisplay(city));
                              setIsLocationOpen(false);
                              const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
                              navigate(`/${citySlug}/search`);
                            }}
                            className={`dropdown-menu-item-override font-roboto px-2 py-2 cursor-pointer hover:bg-yp-gray-light ${
                              location === formatCityDisplay(city) ? "bg-yp-gray-light text-yp-blue" : "text-yp-dark"
                            }`}
                          >
                            {formatCityDisplay(city)}
                          </DropdownMenuItem>
                        ))
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Search Button */}
              {/* <Button 
                onClick={handleSearch}
                className="bg-yp-blue hover:bg-[#4e3c28] text-white font-roboto font-semibold px-4 sm:px-6 md:px-8 h-11 sm:h-12 text-sm sm:text-base w-full sm:w-auto rounded-lg"
              >
                {t('homepage.hero.searchButton')}
              </Button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};