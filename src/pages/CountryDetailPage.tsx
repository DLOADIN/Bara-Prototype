import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UltraSimpleMap } from "@/components/UltraSimpleMap";
import { CityInfo } from "@/components/CityInfo";
import { 
  MapPin, 
  Phone, 
  Star, 
  Building, 
  ArrowLeft,
  Grid3X3,
  List,
  Globe,
  Users,
  Landmark
} from "lucide-react";
import { db } from "@/lib/supabase";
import { Skeleton } from "@/components/ui/skeleton";

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
    slug: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    if (!countrySlug) {
      setLoading(false);
      return;
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 10000);

    fetchCountryData().catch(console.error);

    return () => clearTimeout(timeout);
  }, [countrySlug]);

  const fetchCountryData = async () => {
    try {
      const countryName = countrySlug
        .replace(/-/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
      
      const { data, error } = await db.countries()
        .select(`
          id,
          name,
          code,
          flag_url,
          wikipedia_url,
          description,
          population,
          capital,
          currency,
          language
        `)
        .ilike('name', countryName)
        .single();

      if (error) {
        console.error('Error fetching country:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setCountry(data);
        await fetchBusinesses(data);
      }
    } catch (error) {
      console.error('Error fetching country:', error);
      setLoading(false);
    }
  };

  const fetchBusinesses = async (countryData: Country) => {
    try {
      const { data, error } = await db.businesses()
        .select(`
          id,
          name,
          slug,
          description,
          phone,
          website,
          address,
          latitude,
          longitude,
          logo_url,
          is_premium,
          category:categories(name, slug),
          city:cities(name, slug),
          reviews(id, rating, content, created_at)
        `)
        .eq('status', 'active')
        .eq('country_id', countryData.id);

      if (error) {
        console.error('Error fetching businesses:', error);
        setBusinesses(generateSampleBusinesses(countryData));
        return;
      }

      const transformedBusinesses: Business[] = data?.map((business: any) => ({
        id: business.id,
        name: business.name,
        slug: business.slug,
        description: business.description,
        phone: business.phone,
        website: business.website,
        address: business.address,
        latitude: business.latitude,
        longitude: business.longitude,
        logo_url: business.logo_url,
        is_premium: business.is_premium,
        category: business.category ? {
          name: business.category.name,
          slug: business.category.slug
        } : undefined,
        city: business.city ? {
          name: business.city.name,
          slug: business.city.slug
        } : undefined,
        reviews: business.reviews || []
      })) || [];

      setBusinesses(transformedBusinesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      setBusinesses(generateSampleBusinesses(countryData));
    } finally {
      setLoading(false);
    }
  };

  const generateSampleBusinesses = (countryData: Country): Business[] => {
    return [
      {
        id: 'sample-1',
        name: 'Sample Restaurant',
        slug: 'sample-restaurant',
        description: 'A delicious local restaurant serving traditional cuisine',
        phone: '+20 123 456 789',
        website: 'https://example.com',
        address: '123 Main Street',
        latitude: 30.0444 + 0.001,
        longitude: 31.2357 + 0.001,
        logo_url: null,
        is_premium: false,
        category: { name: 'Restaurant', slug: 'restaurant' },
        city: { name: 'Sample City', slug: 'sample-city' },
        reviews: [{ id: '1', rating: 4.5, content: 'Great food!', created_at: '2024-01-01' }]
      },
      {
        id: 'sample-2',
        name: 'Sample Hotel',
        slug: 'sample-hotel',
        description: 'A comfortable hotel in the heart of the city',
        phone: '+20 987 654 321',
        website: 'https://hotel-example.com',
        address: '456 Tourism Avenue',
        latitude: 30.0444 - 0.001,
        longitude: 31.2357 - 0.001,
        logo_url: null,
        is_premium: true,
        category: { name: 'Hotel', slug: 'hotel' },
        city: { name: 'Sample City', slug: 'sample-city' },
        reviews: [{ id: '2', rating: 4.8, content: 'Excellent service!', created_at: '2024-01-02' }]
      }
    ];
  };

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = 
      business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (business.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (business.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (business.city?.name.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = !selectedCategory || business.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getAverageRating = (business: Business): number => {
    if (!business.reviews || business.reviews.length === 0) return 0;
    const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / business.reviews.length;
  };

  const formatCountryName = (slug: string): string => {
    return slug.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yp-gray-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!country) {
    return (
      <div className="min-h-screen bg-yp-gray-light">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-yp-dark mb-4">Country Not Found</h1>
            <Button onClick={() => navigate('/')} className="bg-yp-blue">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yp-gray-light">
      <Header />
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
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
                  {formatCountryName(countrySlug)}
                </h1>
                <p className="text-yp-gray-dark">
                  {country.population?.toLocaleString() ?? 'Unknown'} residents
                  {country.capital && ` • Capital: ${country.capital}`}
                </p>
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
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Population</p>
                    <p className="text-lg font-semibold text-green-800">
                      {country.population?.toLocaleString() ?? 'Unknown'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {country.capital && (
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
                    <Building className="w-5 h-5 text-yellow-600" />
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder="Search businesses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-yp-blue focus:border-transparent"
              >
                <option value="">All Categories</option>
                {Array.from(new Set(businesses.map(b => b.category?.name).filter((name): name is string => !!name))).map((categoryName) => (
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

        {filteredBusinesses.length === 0 ? (
          <div className="text-center py-12">
            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search criteria' : 'No businesses have been added to this country yet'}
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
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
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
                      <Button size="sm" className="bg-yp-blue text-white text-sm">
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
      
      <Footer />
    </div>
  );
};
