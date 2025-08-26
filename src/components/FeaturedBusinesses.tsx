import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Phone, 
  Globe, 
  MapPin, 
  Star,
  ExternalLink,
  Navigation,
  Info
} from 'lucide-react';
import { Business } from '@/lib/businessService';

interface FeaturedBusinessesProps {
  citySlug?: string;
  categorySlug?: string;
  maxDisplay?: number;
}

export const FeaturedBusinesses: React.FC<FeaturedBusinessesProps> = ({
  citySlug,
  categorySlug,
  maxDisplay = 5
}) => {
  const [featuredBusinesses, setFeaturedBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedBusinesses();
  }, [citySlug, categorySlug]);

  const fetchFeaturedBusinesses = async () => {
    try {
      setLoading(true);
      
      // For now, we'll simulate fetching sponsored businesses
      // In production, this would call the actual API
      const mockSponsoredBusinesses: Business[] = [
        {
          id: 'sponsored-1',
          name: 'Premium Restaurant',
          slug: 'premium-restaurant',
          description: 'Exclusive dining experience with world-class cuisine',
          category_id: 'restaurant-1',
          city_id: 'kigali-1',
          country_id: 'rwanda-1',
          phone: '+250 123 456 789',
          email: 'info@premium-restaurant.com',
          website: 'https://example.com',
          address: '123 Main Street, Kigali',
          status: 'active' as const,
          latitude: -1.9441,
          longitude: 30.0619,
          hours_of_operation: null,
          services: null,
          images: null,
          logo_url: null,
          view_count: 150,
          click_count: 45,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          is_premium: true,
          is_verified: true,
          has_coupons: true,
          accepts_orders_online: true,
          is_kid_friendly: false,
          is_sponsored_ad: true,
          category: { 
            id: 'restaurant-1',
            name: 'Restaurant', 
            slug: 'restaurant',
            icon: '🍽️'
          },
          reviews: [
            { id: '1', rating: 4.8, title: 'Amazing food!', content: 'Amazing food!', created_at: '2024-01-01' },
            { id: '2', rating: 5.0, title: 'Best restaurant in town!', content: 'Best restaurant in town!', created_at: '2024-01-02' }
          ]
        },
        {
          id: 'sponsored-2',
          name: 'Luxury Hotel',
          slug: 'luxury-hotel',
          description: '5-star accommodation with premium amenities',
          category_id: 'hotel-1',
          city_id: 'kigali-1',
          country_id: 'rwanda-1',
          phone: '+250 987 654 321',
          email: 'info@luxury-hotel.com',
          website: 'https://hotel-example.com',
          address: '456 Luxury Avenue, Kigali',
          status: 'active' as const,
          latitude: -1.9441,
          longitude: 30.0619,
          hours_of_operation: null,
          services: null,
          images: null,
          logo_url: null,
          view_count: 200,
          click_count: 60,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          is_premium: true,
          is_verified: true,
          has_coupons: false,
          accepts_orders_online: true,
          is_kid_friendly: true,
          is_sponsored_ad: true,
          category: { 
            id: 'hotel-1',
            name: 'Hotel', 
            slug: 'hotel',
            icon: '🏨'
          },
          reviews: [
            { id: '3', rating: 4.9, title: 'Exceptional service!', content: 'Exceptional service!', created_at: '2024-01-03' }
          ]
        },
        {
          id: 'sponsored-3',
          name: 'Tech Solutions',
          slug: 'tech-solutions',
          description: 'Innovative technology solutions for businesses',
          category_id: 'tech-1',
          city_id: 'kigali-1',
          country_id: 'rwanda-1',
          phone: '+250 555 123 456',
          email: 'info@tech-solutions.com',
          website: 'https://tech-example.com',
          address: '789 Innovation Road, Kigali',
          status: 'active' as const,
          latitude: -1.9441,
          longitude: 30.0619,
          hours_of_operation: null,
          services: null,
          images: null,
          logo_url: null,
          view_count: 120,
          click_count: 30,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          is_premium: false,
          is_verified: true,
          has_coupons: true,
          accepts_orders_online: false,
          is_kid_friendly: false,
          is_sponsored_ad: true,
          category: { 
            id: 'tech-1',
            name: 'Technology', 
            slug: 'technology',
            icon: '💻'
          },
          reviews: [
            { id: '4', rating: 4.7, title: 'Great tech solutions!', content: 'Great tech solutions!', created_at: '2024-01-04' }
          ]
        },
        {
          id: 'sponsored-4',
          name: 'Addis Ababa Delights',
          slug: 'addis-ababa-delights',
          description: 'Authentic Ethiopian cuisine in the heart of Addis Ababa',
          category_id: 'restaurant-2',
          city_id: 'addis-1',
          country_id: 'ethiopia-1',
          phone: '+251 123 456 789',
          email: 'info@addis-delights.com',
          website: 'https://addis-delights.com',
          address: '789 Bole Road, Addis Ababa, Ethiopia',
          status: 'active' as const,
          latitude: 9.0320,
          longitude: 38.7636,
          hours_of_operation: null,
          services: null,
          images: null,
          logo_url: null,
          view_count: 180,
          click_count: 55,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          is_premium: true,
          is_verified: true,
          has_coupons: true,
          accepts_orders_online: true,
          is_kid_friendly: true,
          is_sponsored_ad: true,
          category: { 
            id: 'restaurant-2',
            name: 'Restaurant', 
            slug: 'restaurant',
            icon: '🍽️'
          },
          reviews: [
            { id: '5', rating: 4.9, title: 'Best Ethiopian food!', content: 'Best Ethiopian food!', created_at: '2024-01-05' }
          ]
        },
        {
          id: 'sponsored-5',
          name: 'Kigali Business Hub',
          slug: 'kigali-business-hub',
          description: 'Modern business center with premium services',
          category_id: 'business-1',
          city_id: 'kigali-1',
          country_id: 'rwanda-1',
          phone: '+250 123 789 456',
          email: 'info@kigali-hub.com',
          website: 'https://kigali-hub.com',
          address: '321 Business District, Kigali, Rwanda',
          status: 'active' as const,
          latitude: -1.9441,
          longitude: 30.0619,
          hours_of_operation: null,
          services: null,
          images: null,
          logo_url: null,
          view_count: 90,
          click_count: 25,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          is_premium: true,
          is_verified: true,
          has_coupons: false,
          accepts_orders_online: true,
          is_kid_friendly: false,
          is_sponsored_ad: true,
          category: { 
            id: 'business-1',
            name: 'Business Services', 
            slug: 'business-services',
            icon: '🏢'
          },
          reviews: [
            { id: '6', rating: 4.8, title: 'Excellent business services!', content: 'Excellent business services!', created_at: '2024-01-06' }
          ]
        }
      ];

      // Filter by category if specified, but always show some businesses
      let filtered = mockSponsoredBusinesses;
      if (categorySlug) {
        const categoryFiltered = mockSponsoredBusinesses.filter(b => b.category?.slug === categorySlug);
        // If category filtering returns no results, show all businesses instead
        filtered = categoryFiltered.length > 0 ? categoryFiltered : mockSponsoredBusinesses;
      }

      // Limit the number of displayed businesses
      const limited = filtered.slice(0, maxDisplay);
      console.log('FeaturedBusinesses: categorySlug:', categorySlug, 'filtered count:', filtered.length, 'limited count:', limited.length);
      setFeaturedBusinesses(limited);
    } catch (error) {
      console.error('Error fetching featured businesses:', error);
      // Fallback to showing all mock businesses if there's an error
      const fallbackBusinesses = [
        {
          id: 'fallback-1',
          name: 'Featured Business',
          slug: 'featured-business',
          description: 'Premium business services',
          category_id: 'business-1',
          city_id: 'city-1',
          country_id: 'country-1',
          phone: '+123 456 7890',
          email: 'info@featured.com',
          website: 'https://featured.com',
          address: '123 Business Street',
          status: 'active' as const,
          latitude: 0,
          longitude: 0,
          hours_of_operation: null,
          services: null,
          images: null,
          logo_url: null,
          view_count: 100,
          click_count: 20,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
          is_premium: true,
          is_verified: true,
          has_coupons: true,
          accepts_orders_online: true,
          is_kid_friendly: true,
          is_sponsored_ad: true,
          category: { 
            id: 'business-1',
            name: 'Business Services', 
            slug: 'business-services',
            icon: '🏢'
          },
          reviews: [
            { id: '1', rating: 4.5, title: 'Great service!', content: 'Great service!', created_at: '2024-01-01' }
          ]
        }
      ];
      setFeaturedBusinesses(fallbackBusinesses.slice(0, maxDisplay));
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = (business: Business) => {
    if (!business.reviews || business.reviews.length === 0) return 0;
    const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / business.reviews.length;
  };

  const getCategoryDisplayName = () => {
    if (categorySlug) {
      // Try to get category name from the first business
      const categoryName = featuredBusinesses[0]?.category?.name;
      if (categoryName) {
        return `Featured ${categoryName}s`;
      }
    }
    return 'Featured Businesses';
  };

  // Fallback text for missing translations
  const t = (key: string) => {
    const translations: Record<string, string> = {
      'featuredBusinesses.title': 'Featured Businesses',
      'featuredBusinesses.sponsored': 'Sponsored',
      'featuredBusinesses.ad': 'Ad',
      'featuredBusinesses.reviews': 'reviews',
      'featuredBusinesses.website': 'Website',
      'featuredBusinesses.directions': 'Directions',
      'featuredBusinesses.moreInfo': 'More Info',
      'featuredBusinesses.noFeaturedYet': 'No featured businesses yet',
      'featuredBusinesses.comingSoon': 'Coming soon!'
    };
    return translations[key] || key;
  };

  // Add debugging
  console.log('FeaturedBusinesses render:', { 
    citySlug, 
    categorySlug, 
    maxDisplay, 
    featuredBusinessesCount: featuredBusinesses.length,
    loading 
  });

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-yp-dark">
            {getCategoryDisplayName()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (featuredBusinesses.length === 0) {
    return (
      <Card className="w-[300vh] border-2 border-blue-300 bg-blue-50">
        {/* Test element to ensure visibility */}
        <CardHeader>  
          <CardTitle className="text-lg font-semibold text-yp-dark flex items-center justify-between">
            {t('featuredBusinesses.title')}
            <Badge variant="secondary" className="text-xs">
              {t('featuredBusinesses.sponsored')}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {t('featuredBusinesses.noFeaturedYet')}
            </p>
            <p className="text-xs text-gray-400">
              {t('featuredBusinesses.comingSoon')}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-[60vh] border-2 border-blue-300 bg-blue-50">
      {/* Test element to ensure visibility */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-yp-dark flex items-center justify-between">
          {getCategoryDisplayName()}
          <Badge variant="secondary" className="text-xs">
            {t('featuredBusinesses.sponsored')}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {featuredBusinesses.map((business) => (
          <div key={business.id} className="border-b border-gray-100 pb-4 last:border-b-0">
            {/* Business Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-yp-dark text-sm truncate">
                  {business.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {business.phone}
                </p>
              </div>
              <Badge variant="outline" className="text-xs ml-2">
                {t('featuredBusinesses.ad')}
              </Badge>
            </div>

            {/* Category */}
            {business.category && (
              <p className="text-xs text-gray-600 mb-2">
                {business.category.name}
              </p>
            )}

            {/* Address */}
            {business.address && (
              <p className="text-xs text-gray-600 mb-3 flex items-start">
                <MapPin className="w-3 h-3 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2">{business.address}</span>
              </p>
            )}

            {/* Rating */}
            {business.reviews && business.reviews.length > 0 && (
              <div className="flex items-center space-x-2 mb-3">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                <span className="text-xs font-medium text-gray-900">
                  {getAverageRating(business).toFixed(1)}
                </span>
                <span className="text-xs text-gray-500">
                  ({business.reviews.length} {t('featuredBusinesses.reviews')})
                </span>
              </div>
            )}

            {/* Action Links */}
            <div className="flex items-center space-x-2 text-xs">
              {business.website && (
                <Link to={business.website} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-yp-blue hover:text-yp-blue-dark">
                    <Globe className="w-3 h-3 mr-1" />
                    {t('featuredBusinesses.website')}
                  </Button>
                </Link>
              )}
              
              <Button variant="ghost" size="sm" className="h-6 px-2 text-yp-blue hover:text-yp-blue-dark">
                <Navigation className="w-3 h-3 mr-1" />
                {t('featuredBusinesses.directions')}
              </Button>
              
              <Link to={`/${citySlug || 'city'}/${business.category?.slug || 'business'}/${business.id}`}>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-yp-blue hover:text-yp-blue-dark">
                  <Info className="w-3 h-3 mr-1" />
                  {t('featuredBusinesses.moreInfo')}
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
