import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Globe, Star, Search, Map, Building2, Users, Award, ChevronDown } from "lucide-react";
import { useBusinessesByCategory, useBusinessSearch, useCitiesByCategory } from "@/hooks/useBusinesses";
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
  const { t } = useTranslation();
  const { city, category, categorySlug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Determine which category slug to use
  const actualCategorySlug = categorySlug || category;
  
  // Check if this is a search page
  const isSearchPage = actualCategorySlug === 'search';
  
  // Check if we're on a category page (URL starts with /category/)
  const isCategoryPage = window.location.pathname.startsWith('/category/');
  
  // Get search term from URL query params if it's a search page
  const urlSearchTerm = searchParams.get('q') || '';
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState(isSearchPage ? urlSearchTerm : "");
  // Only use city from URL if we're not on a category page
  const [selectedCity, setSelectedCity] = useState<string>(isCategoryPage ? "" : (city || ""));
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState<'default' | 'distance' | 'rating' | 'name'>('default');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [cities, setCities] = useState<Array<{ id: string; name: string; countries: { code: string } | null; latitude: number | null; longitude: number | null }>>([]);
  const [loadingCities, setLoadingCities] = useState<boolean>(true);
  const [categoryCities, setCategoryCities] = useState<Array<{ city_id: string; city_name: string; country_name: string; business_count: number }>>([]);
  const [loadingCategoryCities, setLoadingCategoryCities] = useState<boolean>(false);

  // Update search term when URL changes
  useEffect(() => {
    if (isSearchPage && urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
  }, [isSearchPage, urlSearchTerm]);

  // Fetch businesses by category (only if not a search page)
  const { 
    data: businesses = [], 
    isLoading: isLoadingCategory, 
    error: categoryError 
  } = useBusinessesByCategory(actualCategorySlug || "", selectedCity || undefined);

  // Search businesses (for search page or when search term is provided)
  const { 
    data: searchResults = [], 
    isLoading: isLoadingSearch, 
    error: searchError 
  } = useBusinessSearch(searchTerm, {
    category: isSearchPage ? undefined : actualCategorySlug, // Don't filter by category on search page
    city: selectedCity || undefined
  });

  // Get cities that have businesses in this category
  const { 
    data: citiesByCategory = [], 
    isLoading: isLoadingCitiesByCategory 
  } = useCitiesByCategory(actualCategorySlug || "");

  // Determine which data to display
  const displayBusinesses = isSearchPage || searchTerm ? searchResults : businesses;
  const isLoading = isSearchPage ? isLoadingSearch : (isLoadingCategory || isLoadingSearch);
  const error = isSearchPage ? searchError : (categoryError || searchError);
  
  const formatTitle = (str: string) => {
    return str?.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') || '';
  };

  const categoryName = isSearchPage ? t('listings.searchResults') : formatTitle(actualCategorySlug || '');
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
    if (selectedFilters.includes('coupons') && !business.has_coupons) return false;
    if (selectedFilters.includes('order-online') && !business.accepts_orders_online) return false;
    if (selectedFilters.includes('kid-friendly') && !business.is_kid_friendly) return false;
    return true;
  });

  // Sort businesses based on selected sort option
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        const ratingA = getAverageRating(a);
        const ratingB = getAverageRating(b);
        return sortOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      case 'name':
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      case 'distance':
        // For now, sort by creation date as proxy for distance
        // In a real implementation, you'd calculate actual distance
        return sortOrder === 'asc' 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      default:
        // Default sorting: premium first, then by creation date
        if (a.is_premium && !b.is_premium) return -1;
        if (!a.is_premium && b.is_premium) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
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
            <Button onClick={() => window.location.reload()} className="bg-yp-blue">
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
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 min-w-0">
              <Input
                type="text"
                placeholder={`Search ${categoryName}...`}
                value={searchTerm}
                readOnly
                className="w-full font-roboto bg-gray-50 cursor-not-allowed"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="w-full justify-start font-roboto">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="truncate">
                      {selectedCity 
                        ? `${selectedCity} (${citiesByCategory.find(c => c.city_name === selectedCity)?.business_count || 0} businesses)`
                        : 'Select a City'
                      }
                    </span>
                    <ChevronDown className="w-4 h-4 ml-auto flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[280px] max-h-[300px] overflow-auto">
                  {isLoadingCitiesByCategory ? (
                    <div className="p-3 text-sm text-gray-500">Loading cities...</div>
                  ) : citiesByCategory.length > 0 ? (
                    <>
                      {/* Show cities with businesses in this category */}
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                        Cities with {categoryName} businesses
                      </div>
                      {/* Clear filter option */}
                      <DropdownMenuItem 
                        onClick={() => setSelectedCity("")}
                        className="dropdown-menu-item-override cursor-pointer text-blue-600 font-medium"
                      >
                        <span>Show all cities</span>
                      </DropdownMenuItem>
                      {citiesByCategory.map((city) => (
                        <DropdownMenuItem 
                          key={city.city_id} 
                          onClick={() => setSelectedCity(city.city_name)}
                          className="dropdown-menu-item-override cursor-pointer flex justify-between items-center"
                        >
                          <span>{city.city_name}, {city.country_name}</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                            {city.business_count} {city.business_count === 1 ? 'business' : 'businesses'}
                          </span>
                        </DropdownMenuItem>
                      ))}
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-t">
                        All cities
                      </div>
                      {cities.map((c) => (
                        <DropdownMenuItem 
                          key={c.id} 
                          onClick={() => setSelectedCity(`${c.name}`)}
                          className="dropdown-menu-item-override cursor-pointer"
                        >
                          {c.name}{c.countries?.code ? `, ${c.countries.code}` : ''}
                        </DropdownMenuItem>
                      ))}
                    </>
                  ) : (
                    cities.map((c) => (
                      <DropdownMenuItem 
                        key={c.id} 
                        onClick={() => setSelectedCity(`${c.name}`)}
                        className="dropdown-menu-item-override cursor-pointer"
                      >
                        {c.name}{c.countries?.code ? `, ${c.countries.code}` : ''}
                      </DropdownMenuItem>
                    ))
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button 
              onClick={handleSearch}
              className="bg-yp-blue text-white px-6 sm:px-8 font-roboto w-full sm:w-auto"
            >
              FIND
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant={viewMode === 'map' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setViewMode('map')}
                className="font-roboto"
              >
                <Map className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.mapView')}</span>
                <span className="sm:hidden">Map</span>
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setViewMode('list')}
                className="font-roboto"
              >
                <Building2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.listView')}</span>
                <span className="sm:hidden">List</span>
              </Button>
              
              <Button 
                variant={selectedFilters.includes('all') ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setSelectedFilters([])}
                className="font-roboto"
              >
                <Building2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.all')}</span>
                <span className="sm:hidden">{t('listings.all')}</span>
              </Button>
              
              <Button 
                variant={selectedFilters.includes('order-online') ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => toggleFilter('order-online')}
                className="font-roboto"
              >
                <Globe className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.orderOnline')}</span>
                <span className="sm:hidden">Order</span>
              </Button>
              
              <Button 
                variant={selectedFilters.includes('kid-friendly') ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => toggleFilter('kid-friendly')}
                className="font-roboto"
              >
                <Users className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.kidFriendly')}</span>
                <span className="sm:hidden">Kids</span>
              </Button>
              
              <Button 
                variant={selectedFilters.includes('coupons') ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => toggleFilter('coupons')}
                className="font-roboto"
              >
                <Award className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.coupons')}</span>
                <span className="sm:hidden">{t('listings.coupons')}</span>
              </Button>
              
              <Button 
                variant={selectedFilters.includes('premium') ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => toggleFilter('premium')}
                className="font-roboto"
              >
                <Award className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.premium')}</span>
                <span className="sm:hidden">{t('listings.premium')}</span>
              </Button>
              
              <Button 
                variant={selectedFilters.includes('verified') ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => toggleFilter('verified')}
                className="font-roboto"
              >
                <Users className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.verified')}</span>
                <span className="sm:hidden">{t('listings.verified')}</span>
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 ml-auto">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 font-roboto">{t('listings.sort')}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="font-roboto">
                      <span className="font-semibold">
                        {sortBy === 'default' ? t('listings.default') : 
                         sortBy === 'distance' ? t('listings.distance') : 
                         sortBy === 'rating' ? t('listings.rating') : t('listings.nameAZ')}
                      </span>
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setSortBy('default')}>
                      <span className="font-semibold">{t('listings.default')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('distance')}>
                      <span className="font-semibold">{t('listings.distance')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('rating')}>
                      <span className="font-semibold">{t('listings.rating')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('name')}>
                      <span className="font-semibold">{t('listings.nameAZ')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <span className="text-sm text-gray-600 font-roboto">
                {sortedBusinesses.length} {t('listings.businessesFound')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Summary - Show when no city is selected */}
        {/* {!selectedCity && !isSearchPage && citiesByCategory.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  {categoryName} Available in {citiesByCategory.length} Cities
                </h3>
                <p className="text-blue-700 text-sm">
                  Select a city above to see businesses in that location, or browse all {filteredBusinesses.length} businesses below.
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">{filteredBusinesses.length}</div>
                <div className="text-sm text-blue-700">Total businesses</div>
              </div>
            </div>
          </div>
        )} */}

        {/* City-specific summary when a city is selected */}
        {selectedCity && !isSearchPage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-green-900 mb-1">
                  {categoryName} in {selectedCity}
                </h3>
                <p className="text-green-700 text-sm">
                  {t('listings.showingBusinesses')} {sortedBusinesses.length} {t('listings.businessesInCity')} {selectedCity}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-900">{sortedBusinesses.length}</div>
                <div className="text-sm text-green-700">{t('listings.businessesFoundCount')}</div>
              </div>
            </div>
          </div>
        )}

        {sortedBusinesses.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-roboto font-semibold text-gray-900 mb-2">
              {t('listings.noBusinessesFound')}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? `${t('listings.noBusinessesMatching')} "${searchTerm}"`
                : `${t('listings.noBusinessesInCategory')} ${categoryName}`
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
              {t('listings.clearFilters')}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedBusinesses.map((business) => {
              const avgRating = getAverageRating(business);
              const reviewCount = getReviewCount(business);
              
              return (
                <div 
                  key={business.id} 
                  className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleBusinessClick(business)}
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center mb-2 space-y-2 sm:space-y-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-yp-dark font-comfortaa mr-2 break-words">
                          {business.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2">  
                        {business.is_premium && (
                          <Badge variant="default" className="bg-yp-blue text-white text-xs">
                            {t('listings.premium')}
                          </Badge>
                        )}
                        {business.is_verified && (
                          <Badge variant="secondary" className="text-xs">
                            ✓ {t('listings.verified')}
                          </Badge>
                        )}
                        {business.has_coupons && (
                          <Badge variant="outline" className="text-xs border-orange-200 text-orange-700 bg-orange-50">
                            {t('listings.coupons')}
                          </Badge>
                        )}
                        {business.accepts_orders_online && (
                          <Badge variant="outline" className="text-xs border-green-200 text-green-700 bg-green-50">
                            {t('listings.orderOnline')}
                          </Badge>
                        )}
                        {business.is_kid_friendly && (
                          <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                            {t('listings.kidFriendly')}
                          </Badge>
                        )}
                        </div>
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
                          <div className="flex items-start">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="break-words">{business.address}</span>
                          </div>
                        )}
                        {business.phone && (
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                            <a 
                              href={`tel:${business.phone}`} 
                              className="text-yp-blue hover:underline break-all"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {business.phone}
                            </a>
                          </div>
                        )}
                        {business.website && (
                          <div className="flex items-start">
                            <Globe className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                            <a 
                              href={`https://${business.website}`} 
                              className="text-yp-blue hover:underline break-all"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {business.website}
                            </a>
                          </div>
                        )}
                        {business.description && (
                          <p className="text-gray-700 mt-2 line-clamp-2 break-words">
                            {business.description}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto">
                      <Link 
                        to={city 
                          ? `/${city}/${actualCategorySlug}/${business.id}`
                          : `/category/${actualCategorySlug}/${business.id}`
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="w-full sm:w-auto"
                      >
                        <Button size="sm" variant="outline" className="font-roboto w-full">
                          {t('listings.moreInfo')}
                        </Button>
                      </Link>
                      <Link to={`/write-review/${business.id}`} className="w-full sm:w-auto">
                        <Button 
                          size="sm" 
                          className="bg-yp-blue text-white font-roboto w-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {t('listings.writeReview')}
                        </Button>
                      </Link>
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