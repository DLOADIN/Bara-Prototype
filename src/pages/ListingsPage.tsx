import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Globe, Star, Search, Map, Building2, Users, Award, ChevronDown } from "lucide-react";
import { useBusinessesByCategory, useBusinessSearch } from "@/hooks/useBusinesses";
import { Business } from "@/lib/businessService";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/supabase";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ListingsPage = () => {
  const { city, category, categorySlug } = useParams();
  const navigate = useNavigate();
  
  // Determine which category slug to use
  const actualCategorySlug = categorySlug || category;
  
  // State for search and filters
  // Search bar is read-only (users can see but not edit)
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>(city || "");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [cities, setCities] = useState<Array<{ id: string; name: string; countries: { code: string } | null; latitude: number | null; longitude: number | null }>>([]);
  const [loadingCities, setLoadingCities] = useState<boolean>(true);

  // Fetch businesses by category
  const { 
    data: businesses = [], 
    isLoading: isLoadingCategory, 
    error: categoryError 
  } = useBusinessesByCategory(actualCategorySlug || "", selectedCity || undefined);

  // Search is read-only but functional for display
  const { 
    data: searchResults = [], 
    isLoading: isLoadingSearch, 
    error: searchError 
  } = useBusinessSearch(searchTerm, {
    category: actualCategorySlug,
    city: selectedCity || undefined
  });

  // Determine which data to display
  const displayBusinesses = searchTerm ? searchResults : businesses;
  const isLoading = isLoadingCategory || isLoadingSearch;
  const error = categoryError || searchError;
  
  const formatTitle = (str: string) => {
    return str?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || '';
  };

  const categoryName = formatTitle(actualCategorySlug || '');
  const cityName = formatTitle(city || '');

  // Search is read-only, no user input allowed
  const handleSearch = () => {
    // Search is handled by the hook automatically
  };

  // Handle filter toggle
  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  // Handle business click
  const handleBusinessClick = (business: Business) => {
    // Increment click count
    // BusinessService.incrementClickCount(business.id);
    
    // Navigate to business detail
    if (city) {
      navigate(`/${city}/${actualCategorySlug}/${business.id}`);
    } else {
      navigate(`/category/${actualCategorySlug}/${business.id}`);
    }
  };

  // Filter businesses based on selected filters
  const filteredBusinesses = displayBusinesses.filter(business => {
    if (selectedFilters.includes('premium') && !business.is_premium) return false;
    if (selectedFilters.includes('verified') && !business.is_verified) return false;
    if (selectedFilters.includes('24h') && !business.hours_of_operation?.includes('24')) return false;
    return true;
  });

  // Calculate average rating for a business
  const getAverageRating = (business: Business) => {
    if (!business.reviews || business.reviews.length === 0) return 0;
    const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / business.reviews.length;
  };

  // Get review count
  const getReviewCount = (business: Business) => {
    return business.reviews?.length || 0;
  };

  // Load cities with coordinates for proximity filtering
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data, error } = await db.cities()
          .select(`
            id,
            name,
            latitude,
            longitude,
            countries ( code )
          `)
          .order('name', { ascending: true });
        if (!error && data) {
          const typed = (data as unknown) as Array<{ 
            id: string; 
            name: string; 
            latitude: number | null; 
            longitude: number | null;
            countries: { code: string } | null 
          }>;
          setCities(typed);
        }
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Header />
        
        {/* Search Header Skeleton */}
        <div className="bg-yp-yellow py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-10 flex-1 max-w-md" />
              <Skeleton className="h-10 flex-1 max-w-md" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>

        {/* Results Skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-32 mb-3" />
                    <div className="flex gap-2 mb-3">
                      <Skeleton className="h-5 w-20" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-64" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-56" />
                    </div>
                  </div>
                  <div className="text-right">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background font-roboto">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-comfortaa font-bold text-yp-dark mb-4">
              Error Loading Businesses
            </h2>
            <p className="text-gray-600 mb-6">
              {error.message || 'An error occurred while loading businesses. Please try again.'}
            </p>
            <Button onClick={() => window.location.reload()} className="bg-yp-blue hover:bg-[#4e3c28]">
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-roboto">
      <Header />
      
      {/* Search Header */}
      <div className="bg-yp-yellow py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder={`Search ${categoryName}...`}
                value={searchTerm}
                readOnly
                className="w-full font-roboto bg-gray-50 cursor-not-allowed"
              />
            </div>
            <div className="flex-1 max-w-md">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-start font-roboto">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    {selectedCity || 'Select City'}
                    <ChevronDown className="w-4 h-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[280px] max-h-[300px] overflow-auto">
                  {loadingCities ? (
                    <div className="p-3 text-sm text-gray-500">Loading cities...</div>
                  ) : (
                    cities.map((c) => (
                      <DropdownMenuItem key={c.id} onClick={() => setSelectedCity(`${c.name}`)}>
                        {c.name}{c.countries?.code ? `, ${c.countries.code}` : ''}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Button 
              onClick={handleSearch}
              className="bg-yp-blue hover:bg-[#4e3c28] text-white px-8 font-roboto"
            >
              Find
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant={viewMode === 'map' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('map')}
              className="font-roboto"
            >
              <Map className="w-4 h-4 mr-1" />
              Map View
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('list')}
              className="font-roboto"
            >
              <Building2 className="w-4 h-4 mr-1" />
              List View
            </Button>
            
            <Button 
              variant={selectedFilters.includes('premium') ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => toggleFilter('premium')}
              className="font-roboto"
            >
              <Award className="w-4 h-4 mr-1" />
              Premium
            </Button>
            
            <Button 
              variant={selectedFilters.includes('verified') ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => toggleFilter('verified')}
              className="font-roboto"
            >
              <Users className="w-4 h-4 mr-1" />
              Verified
            </Button>
            
            <div className="ml-auto">
              <span className="text-sm text-gray-600 font-roboto">
                {filteredBusinesses.length} businesses found
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-roboto font-semibold text-gray-900 mb-2">
              No businesses found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `No businesses found matching "${searchTerm}"`
                : `No businesses found in ${categoryName}`
              }
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setSelectedCity("");
                setSelectedFilters([]);
              }}
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBusinesses.map((business) => {
              const avgRating = getAverageRating(business);
              const reviewCount = getReviewCount(business);
              
              return (
                <div 
                  key={business.id} 
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleBusinessClick(business)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold text-yp-dark font-comfortaa mr-2">
                          {business.name}
                        </h3>
                        {business.is_premium && (
                          <Badge variant="default" className="bg-yp-blue text-white text-xs">
                            Premium
                          </Badge>
                        )}
                        {business.is_verified && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ Verified
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 font-roboto mb-2">
                        {business.category?.name || 'Business'}
                      </p>
                      
                      {/* Rating */}
                      {reviewCount > 0 && (
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(avgRating)
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm text-gray-600 font-roboto">
                            {avgRating.toFixed(1)} ({reviewCount} reviews)
                          </span>
                        </div>
                      )}
                      
                      {/* Business details */}
                      <div className="space-y-1 text-sm text-gray-600 font-roboto">
                        {business.address && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {business.address}
                          </div>
                        )}
                        {business.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            <a 
                              href={`tel:${business.phone}`} 
                              className="text-yp-blue hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {business.phone}
                            </a>
                          </div>
                        )}
                        {business.website && (
                          <div className="flex items-center">
                            <Globe className="w-4 h-4 mr-2" />
                            <a 
                              href={`https://${business.website}`} 
                              className="text-yp-blue hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {business.website}
                            </a>
                          </div>
                        )}
                        {business.description && (
                          <p className="text-gray-700 mt-2 line-clamp-2">
                            {business.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="space-y-2">
                        <Link 
                          to={city 
                            ? `/${city}/${actualCategorySlug}/${business.id}`
                            : `/category/${actualCategorySlug}/${business.id}`
                          }
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button size="sm" variant="outline" className="font-roboto w-full">
                            More Info
                          </Button>
                        </Link>
                        <Link to="/write-review">
                          <Button 
                            size="sm" 
                            className="bg-yp-blue hover:bg-yp-blue/90 text-white font-roboto w-full"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Write Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};