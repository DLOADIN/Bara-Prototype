import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  MapPin, 
  Phone, 
  Crown, 
  Building, 
  ArrowLeft,
  Grid3X3,
  List,
  Globe,
  Users,
  Landmark,
  Hash
} from "lucide-react";
import { db } from "@/lib/supabase";
import { useSponsoredBanners } from "@/hooks/useSponsoredBanners";

interface Country {
  id: string;
  name: string;
  code: string;
  flag_url: string | null;
  wikipedia_url: string | null;
  description: string | null;
  population: number | null;
  capital: string | null;
  currency: string | null;
  language: string | null;
  flag_emoji?: string | null;
  president_name?: string | null;
  gdp_usd?: number | null;
  average_age?: number | null;
  largest_city?: string | null;
  largest_city_population?: number | null;
  capital_population?: number | null;
  formation_date?: string | null;
  hdi_score?: number | null;
  calling_code?: string | null;
  timezone?: string | null;
  area_sq_km?: number | null;
  ethnic_groups?: Array<{ name: string; percentage: number; note?: string }>;
  wikipedia_description?: string | null;
  coat_of_arms_url?: string | null;
}

interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  website: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  is_premium: boolean;
  category?: {
    name: string;
    slug: string;
  };
  city?: {
    name: string;
  };
  reviews?: Array<{
    id: string;
    rating: number;
    content: string;
    created_at: string;
  }>;
}

export const CountryDetailPage: React.FC = () => {
  const { countrySlug } = useParams<{ countrySlug: string }>();
  const navigate = useNavigate();
  
  const [country, setCountry] = useState<Country | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [wikipediaLoading, setWikipediaLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Sponsored banner functionality
  const { 
    banners: sponsoredBanners, 
    fetchBannerByCountry, 
    incrementBannerClick, 
    incrementBannerView 
  } = useSponsoredBanners();

  // Fetch country data
  useEffect(() => {
    if (!countrySlug) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // In a real app, you would fetch country data here
        // const countryData = await fetchCountryData(countrySlug);
        // setCountry(countryData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [countrySlug]);

  // Filter businesses based on search and category
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (business.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (business.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (business.city?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    
    const matchesCategory = !selectedCategory || business.category?.name === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Helper functions
  const getAverageRating = (business: Business): number => {
    if (!business.reviews || business.reviews.length === 0) return 0;
    const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / business.reviews.length;
  };

  const formatCountryName = (slug: string): string => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-yp-gray-light flex flex-col">
        <Header />
        <main className="flex-grow p-4">
          <div className="max-w-7xl mx-auto">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Not found state
  if (!country) {
    return (
      <div className="min-h-screen bg-yp-gray-light flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-yp-dark mb-4">Country Not Found</h1>
            <p className="text-gray-600 mb-6">The requested country could not be found.</p>
            <Button onClick={() => navigate('/')} className="bg-brand-blue">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-yp-gray-light flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Country Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-4 mb-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                {country.flag_url && (
                  <img
                    src={country.flag_url}
                    alt={`${country.name} flag`}
                    className="w-12 h-8 rounded shadow-sm"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-yp-dark font-comfortaa">
                    {formatCountryName(countrySlug || '')}
                  </h1>
                  {country.capital && country.capital !== 'Territory' && (
                    <p className="text-yp-gray-dark">
                      Capital: {country.capital}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Country Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Code</p>
                      <p className="text-lg font-semibold text-blue-800">{country.code}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {country.population && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-sm text-green-600 font-medium">Population</p>
                        <p className="text-lg font-semibold text-green-800">
                          {country.population.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {country.capital && country.capital !== 'Territory' && (
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Landmark className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="text-sm text-purple-600 font-medium">Capital</p>
                        <p className="text-lg font-semibold text-purple-800">{country.capital}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {country.currency && (
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-600">💵</span>
                      <div>
                        <p className="text-sm text-yellow-600 font-medium">Currency</p>
                        <p className="text-lg font-semibold text-yellow-800">{country.currency}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex items-center space-x-4 w-full">
                <Input
                  type="text"
                  placeholder="Search businesses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 max-w-md"
                />
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {Array.from(
                    new Set(
                      businesses
                        .map(b => b.category?.name)
                        .filter((name): name is string => !!name)
                    )
                  ).map((categoryName) => (
                    <option key={categoryName} value={categoryName}>
                      {categoryName}
                    </option>
                  ))}
                </select>
                
                <div className="flex border border-gray-300 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Business Listings */}
          {filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search criteria' 
                  : 'No businesses have been added to this country yet'}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {filteredBusinesses.map((business) => (
                <Card key={business.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {business.logo_url ? (
                            <img 
                              src={business.logo_url} 
                              alt={`${business.name} logo`}
                              className="w-8 h-8 rounded object-cover"
                            />
                          ) : (
                            <Building className="w-6 h-6 text-blue-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-lg font-semibold text-yp-dark truncate">
                            {business.name}
                          </CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            {business.category && (
                              <Badge variant="outline" className="text-xs">
                                {business.category.name}
                              </Badge>
                            )}
                            {business.city && (
                              <Badge variant="secondary" className="text-xs">
                                {business.city.name}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {business.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {business.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      {business.address && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="truncate">{business.address}</span>
                        </div>
                      )}
                      
                      {business.phone && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{business.phone}</span>
                        </div>
                      )}
                    </div>
                    
                    {business.reviews && business.reviews.length > 0 && (
                      <div className="flex items-center space-x-2 mb-4">
                        <Crown className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium text-gray-900">
                          {getAverageRating(business).toFixed(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({business.reviews.length} reviews)
                        </span>
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      <Link 
                        to={`/${countrySlug}/${business.category?.slug ?? 'business'}/${business.id}`}
                        className="flex-1"
                      >
                        <Button variant="outline" className="w-full text-sm">
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/write-review/${business.id}`}>
                        <Button size="sm" className="bg-brand-blue text-white text-sm">
                          Review
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CountryDetailPage;
