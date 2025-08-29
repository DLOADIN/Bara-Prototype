import { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Globe, Star, Search, Map, Building2, Users, Award, ChevronDown, UtensilsCrossed, Wine, Coffee, Car, Home, Scale, Bed, Plane, Building, Scissors, BookOpen, Film, Stethoscope, User, Church, Leaf, Palette, Landmark, Hospital, Book, ShoppingBag, Trees, Pill, Mail, Gamepad2, GraduationCap, Truck, Zap, Wrench, Heart, Dumbbell, Laptop, Shield, Calculator, Megaphone, Briefcase, Camera, Calendar, Music, Sparkles } from "lucide-react";
import { useBusinessesByCategory, useBusinessSearch, useCitiesByCategory } from "@/hooks/useBusinesses";
import { Business } from "@/lib/businessService";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/supabase";
import { FeaturedBusinesses } from "@/components/FeaturedBusinesses";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Category-specific amenities mapping
const getCategoryAmenities = (categorySlug: string) => {
  const amenitiesMap: { [key: string]: { icon: any; label: string }[] } = {
    'restaurants': [
      { icon: UtensilsCrossed, label: 'Food' },
      { icon: Wine, label: 'Drinks' }
    ],
    'cafes': [
      { icon: Coffee, label: 'Coffee' },
      { icon: Wine, label: 'Beverages' }
    ],
    'coffee-shops': [
      { icon: Coffee, label: 'Coffee' },
      { icon: Wine, label: 'Beverages' }
    ],
    'bars': [
      { icon: Wine, label: 'Drinks' },
      { icon: UtensilsCrossed, label: 'Snacks' }
    ],
    'hotels': [
      { icon: Bed, label: 'Accommodation' },
      { icon: Wrench, label: 'Services' }
    ],
    'hospitals': [
      { icon: Stethoscope, label: 'Medical' },
      { icon: Heart, label: 'Healthcare' }
    ],
    'clinics': [
      { icon: Stethoscope, label: 'Medical' },
      { icon: Heart, label: 'Healthcare' }
    ],
    'dentists': [
      { icon: Stethoscope, label: 'Dental' },
      { icon: Heart, label: 'Healthcare' }
    ],
    'doctors': [
      { icon: Stethoscope, label: 'Medical' },
      { icon: Heart, label: 'Healthcare' }
    ],
    'pharmacies': [
      { icon: Pill, label: 'Medication' },
      { icon: Heart, label: 'Healthcare' }
    ],
    'auto-repair': [
      { icon: Car, label: 'Automotive' },
      { icon: Wrench, label: 'Repair' }
    ],
    'car-dealerships': [
      { icon: Car, label: 'Automotive' },
      { icon: Building, label: 'Sales' }
    ],
    'real-estate': [
      { icon: Home, label: 'Properties' },
      { icon: Building, label: 'Real Estate' }
    ],
    'lawyers': [
      { icon: Scale, label: 'Legal' },
      { icon: Building, label: 'Services' }
    ],
    'banks': [
      { icon: Building, label: 'Banking' },
      { icon: Shield, label: 'Financial' }
    ],
    'schools': [
      { icon: GraduationCap, label: 'Education' },
      { icon: Book, label: 'Learning' }
    ],
    'universities': [
      { icon: GraduationCap, label: 'Higher Education' },
      { icon: Book, label: 'Learning' }
    ],
    'gyms-fitness': [
      { icon: Dumbbell, label: 'Fitness' },
      { icon: Heart, label: 'Health' }
    ],
    'beauty-salons': [
      { icon: Scissors, label: 'Beauty' },
      { icon: Heart, label: 'Wellness' }
    ],
    'salons': [
      { icon: Scissors, label: 'Beauty' },
      { icon: Heart, label: 'Wellness' }
    ],
    'spas-wellness': [
      { icon: Heart, label: 'Wellness' },
      { icon: Sparkles, label: 'Relaxation' }
    ],
    'museums': [
      { icon: Building2, label: 'Culture' },
      { icon: Palette, label: 'Art' }
    ],
    'galleries-art': [
      { icon: Palette, label: 'Art' },
      { icon: Building2, label: 'Culture' }
    ],
    'cinemas-theatres': [
      { icon: Film, label: 'Entertainment' },
      { icon: Users, label: 'Shows' }
    ],
    'shopping': [
      { icon: ShoppingBag, label: 'Retail' },
      { icon: Building, label: 'Shopping' }
    ],
    'markets': [
      { icon: ShoppingBag, label: 'Retail' },
      { icon: Building, label: 'Shopping' }
    ],
    'airports': [
      { icon: Plane, label: 'Aviation' },
      { icon: Building, label: 'Travel' }
    ],
    'transportation': [
      { icon: Truck, label: 'Transport' },
      { icon: Car, label: 'Vehicles' }
    ],
    'tours': [
      { icon: Map, label: 'Tourism' },
      { icon: Users, label: 'Guided Tours' }
    ],
    'recreation': [
      { icon: Gamepad2, label: 'Entertainment' },
      { icon: Users, label: 'Activities' }
    ],
    'parks': [
      { icon: Trees, label: 'Outdoors' },
      { icon: Heart, label: 'Recreation' }
    ],
    'libraries': [
      { icon: Book, label: 'Books' },
      { icon: Building, label: 'Learning' }
    ],
    'bookstores': [
      { icon: Book, label: 'Books' },
      { icon: Building, label: 'Retail' }
    ],
    'post-offices': [
      { icon: Mail, label: 'Mail' },
      { icon: Building, label: 'Services' }
    ],
    'utilities': [
      { icon: Zap, label: 'Utilities' },
      { icon: Building, label: 'Services' }
    ],
    'services': [
      { icon: Wrench, label: 'Services' },
      { icon: Building, label: 'Support' }
    ]
  };
  
  return amenitiesMap[categorySlug] || [
    { icon: Building, label: 'Services' },
    { icon: Heart, label: 'Support' }
  ];
};

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
  const [countries, setCountries] = useState<Array<{ id: string; name: string; code: string; business_count: number }>>([]);
  const [loadingCountries, setLoadingCountries] = useState<boolean>(true);
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

  // Sort businesses: sponsored ads first, then by selected sort option
  const sortedBusinesses = [...filteredBusinesses].sort((a, b) => {
    // First priority: sponsored ads
    if (a.is_sponsored_ad && !b.is_sponsored_ad) return -1;
    if (!a.is_sponsored_ad && b.is_sponsored_ad) return 1;
    
    // Second priority: selected sort option
    switch (sortBy) {
      case 'rating': {
        const ratingA = getAverageRating(a);
        const ratingB = getAverageRating(b);
        return sortOrder === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      }
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

  // Load countries that have businesses
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        // First, get all countries from the countries table
        const { data: allCountries, error: countriesError } = await db.countries()
          .select(`
            id,
            name,
            code
          `)
          .order('name', { ascending: true });

        if (countriesError) {
          console.error('Error fetching countries:', countriesError);
          return;
        }

        // Then, get business counts for countries that have businesses
        const { data: businessData, error: businessError } = await db.businesses()
          .select(`
            country_id,
            countries (
              id,
              name,
              code
            )
          `)
          .not('country_id', 'is', null);

        if (businessError) {
          console.error('Error fetching business data:', businessError);
          return;
        }
        // else if(!businessError) {
        //   console.log('Business data fetched successfully');
        //   return;
        // }

        // Create an object to count businesses per country
        const businessCountMap: { [key: string]: number } = {};
        
        businessData?.forEach((business: any) => {
          if (business.countries) {
            const countryId = business.countries.id;
            businessCountMap[countryId] = (businessCountMap[countryId] || 0) + 1;
          }
        });

        // Combine all countries with their business counts
        const countriesWithCounts = allCountries?.map(country => ({
          id: country.id,
          name: country.name,
          code: country.code,
          business_count: businessCountMap[country.id] || 0
        })) || [];

        // Sort by business count (descending) then by name
        const sortedCountries = countriesWithCounts.sort((a, b) => {
          if (b.business_count !== a.business_count) {
            return b.business_count - a.business_count;
          }
          return a.name.localeCompare(b.name);
        });

        setCountries(sortedCountries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
            <div className="flex-1 min-w-0">
              <Input
                type="text"
                placeholder={`Search ${categoryName}...`}
                value={searchTerm}
                className="w-full font-roboto bg-gray-50 cursor-not-allowed text-sm sm:text-base"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="default" className="w-full justify-start font-roboto text-sm sm:text-base">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                    <span className="truncate">
                      {selectedCity 
                        ? `${selectedCity} (${countries.find(c => c.name === selectedCity)?.business_count || 0} businesses)`
                        : 'Select a Country'
                      }
                    </span>
                    <ChevronDown className="w-4 h-4 ml-auto flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full sm:w-[280px] max-h-[300px] overflow-auto">
                  {loadingCountries ? (
                    <div className="p-3 text-sm text-gray-500">Loading countries...</div>
                  ) : countries.length > 0 ? (
                    <>
                      {/* Show countries with businesses */}
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b">
                        Countries with businesses
                      </div>
                      {/* Clear filter option */}
                      <DropdownMenuItem 
                        onClick={() => setSelectedCity("")}
                        className="dropdown-menu-item-override cursor-pointer text-blue-600 font-medium"
                      >
                        <span>Show all countries</span>
                      </DropdownMenuItem>
                      {countries.map((country) => (
                        <DropdownMenuItem 
                          key={country.id} 
                          onClick={() => setSelectedCity(country.name)}
                          className="dropdown-menu-item-override cursor-pointer flex justify-between items-center"
                        >
                          <span className="truncate">{country.name}</span>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full flex-shrink-0">
                            {country.business_count} {country.business_count === 1 ? 'business' : 'businesses'}
                          </span>
                        </DropdownMenuItem>
                      ))}
                    </>
                  ) : (
                    <div className="p-3 text-sm text-gray-500">No countries found</div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <Button 
              onClick={handleSearch}
              className="bg-yp-blue text-white px-4 sm:px-6 lg:px-8 font-roboto w-full lg:w-auto text-sm sm:text-base h-10 lg:h-auto"
            >
              FIND
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
              <Button 
                variant={selectedFilters.includes('all') ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setSelectedFilters([])}
                className="font-roboto text-xs sm:text-sm"
              >
                <Building2 className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.all')}</span>
                <span className="sm:hidden">{t('listings.all')}</span>
              </Button>
              
              <Button 
                variant={selectedFilters.includes('order-online') ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => toggleFilter('order-online')}
                className="font-roboto text-xs sm:text-sm"
              >
                <Globe className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.orderOnline')}</span>
                <span className="sm:hidden">Order</span>
              </Button>
              
              <Button 
                variant={selectedFilters.includes('kid-friendly') ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => toggleFilter('kid-friendly')}
                className="font-roboto text-xs sm:text-sm"
              >
                <Users className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.kidFriendly')}</span>
                <span className="sm:hidden">Kids</span>
              </Button>
              
              <Button 
                variant={selectedFilters.includes('coupons') ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => toggleFilter('coupons')}
                className="font-roboto text-xs sm:text-sm"
              >
                <Award className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.coupons')}</span>
                <span className="sm:hidden">{t('listings.coupons')}</span>
              </Button>
              
              <Button 
                variant={selectedFilters.includes('verified') ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => toggleFilter('verified')}
                className="font-roboto text-xs sm:text-sm"
              >
                <Users className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{t('listings.verified')}</span>
                <span className="sm:hidden">{t('listings.verified')}</span>
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full lg:w-auto lg:ml-auto">
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-600 font-roboto">{t('listings.sort')}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="font-roboto text-xs sm:text-sm">
                      <span className="font-semibold truncate">
                        {sortBy === 'default' ? t('listings.default') : 
                         sortBy === 'distance' ? t('listings.distance') : 
                         sortBy === 'rating' ? t('listings.rating') : t('listings.nameAZ')}
                      </span>
                      <ChevronDown className="w-4 h-4 ml-1 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full sm:w-auto">
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
              
              <span className="text-xs sm:text-sm text-gray-600 font-roboto">
                {sortedBusinesses.length} {t('listings.businessesFound')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Main Content - Business Listings */}
          <div className="flex-1">
        {/* City-specific summary when a city is selected */}
        {selectedCity && !isSearchPage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-green-900 mb-1">
                  {categoryName} in {selectedCity}
                </h3>
                <p className="text-green-700 text-xs sm:text-sm">
                      {t('listings.showingBusinesses')} {sortedBusinesses.length} {t('listings.businessesInCity')} {selectedCity}
                </p>
              </div>
              <div className="text-left sm:text-right">
                    <div className="text-xl sm:text-2xl font-bold text-green-900">{sortedBusinesses.length}</div>
                    <div className="text-xs sm:text-sm text-green-700">{t('listings.businessesFoundCount')}</div>
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
                {sortedBusinesses.map((business, index) => {
              const avgRating = getAverageRating(business);
              const reviewCount = getReviewCount(business);
              const categoryAmenities = getCategoryAmenities(business.category?.slug || actualCategorySlug || '');
              
              // Calculate the display number (excluding sponsored ads from numbering)
              const displayNumber = sortedBusinesses
                .slice(0, index + 1)
                .filter(b => !b.is_sponsored_ad)
                .length;
              
              return (
                                  <div 
                    key={business.id} 
                    className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer relative"
                    style={{ 
                      '--ad-spacing': '2rem',
                      '--ad-offset': '550px'
                    } as React.CSSProperties}
                    onClick={() => handleBusinessClick(business)}
                  >
                  {/* Business Number Badge - Only show for non-sponsored ads */}
                  {!business.is_sponsored_ad && (
                    <div className="absolute -top-2 -left-2 w-8 h-8 bg-yp-blue text-white rounded-full flex items-center justify-center text-sm font-bold font-roboto shadow-md">
                      {displayNumber}
                    </div>
                  )}
                  

                  
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start mb-2 space-y-2 sm:space-y-0">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-yp-dark font-comfortaa mr-2 break-words">
                          {business.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">  
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
                      
                      <p className="text-gray-600 font-roboto mb-2 text-sm">
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
                          <span className="ml-2 text-xs sm:text-sm text-gray-600 font-roboto">
                            {avgRating.toFixed(1)} ({reviewCount} reviews)
                          </span>
                        </div>
                      )}
                      
                      
                      
                      {/* Business details */}
                      <div className="space-y-1 text-xs sm:text-sm text-gray-600 font-roboto">
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
                        {business.website && business.website_visible && (
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


                        {/* Category Amenities */}
                      {categoryAmenities.length > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-center mb-3 space-y-1 py-2 sm:space-y-0">
                          <span className="text-xs sm:text-sm font-medium text-gray-700 mr-2">Amenities:</span>
                          <div className="flex items-center gap-2">
                            {categoryAmenities.map((amenity, idx) => {
                              const IconComponent = amenity.icon;
                              return (
                                <div key={idx} className="flex items-center gap-1 text-gray-600">
                                  <IconComponent className="w-4 h-4" />
                                  <span className="text-xs">{amenity.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}


                        {business.description && (
                          <p className="text-gray-700 mt-2 line-clamp-2 break-words text-sm">
                            "{business.description}"
                          </p>
                        )}
                        
                        {/* Order Online Button and Sponsored Ad Badge */}
                        {(business.accepts_orders_online && business.order_online_url) || business.is_sponsored_ad ? (
                          <div className="flex items-center mt-3 w-full">
                            {/* Order Online Button - Only show if business accepts orders and has order URL */}
                            {business.accepts_orders_online && business.order_online_url && (
                              <a
                                href={business.order_online_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="inline-block"
                              >
                                <Button
                                  size="sm"
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-roboto h-8 px-3 flex items-center gap-2 text-xs sm:text-sm"
                                >
                                  <Globe className="w-4 h-4" />
                                  Order Online
                                </Button>
                              </a>
                            )}
                            
                            {/* Sponsored Ad Badge - Positioned to the right */}
                            {business.is_sponsored_ad && (
                              <div className="ml-auto bg-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-full font-medium shadow-sm">
                                Sponsored Ad
                              </div>
                            )}
                          </div>
                        ) : null}
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
                        {/* <Button size="sm" variant="outline" className="font-roboto w-full text-xs sm:text-sm">
                              {t('listings.moreInfo')}
                        </Button> */}
                      </Link>
                      <Link to={`/write-review/${business.id}`} className="w-full sm:w-auto">
                        <Button 
                          size="sm" 
                          className="bg-yp-blue text-white font-roboto w-full text-xs sm:text-sm"
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

          {/* Right Sidebar - Featured Businesses */}
          <div className="w-full lg:w-80 flex-shrink-0 mt-6 lg:mt-0">
            <FeaturedBusinesses
              citySlug={city}
              maxDisplay={6}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};