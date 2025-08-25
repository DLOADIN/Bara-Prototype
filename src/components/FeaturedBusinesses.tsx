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
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
          phone: '+250 123 456 789',
          website: 'https://example.com',
          address: '123 Main Street, Kigali',
          latitude: -1.9441,
          longitude: 30.0619,
          logo_url: null,
          is_premium: true,
          is_verified: true,
          has_coupons: true,
          accepts_orders_online: true,
          is_kid_friendly: false,
          is_sponsored_ad: true,
          category: { name: 'Restaurant', slug: 'restaurant' },
          reviews: [
            { id: '1', rating: 4.8, content: 'Amazing food!', created_at: '2024-01-01' },
            { id: '2', rating: 5.0, content: 'Best restaurant in town!', created_at: '2024-01-02' }
          ]
        },
        {
          id: 'sponsored-2',
          name: 'Luxury Hotel',
          slug: 'luxury-hotel',
          description: '5-star accommodation with premium amenities',
          phone: '+250 987 654 321',
          website: 'https://hotel-example.com',
          address: '456 Luxury Avenue, Kigali',
          latitude: -1.9441,
          longitude: 30.0619,
          logo_url: null,
          is_premium: true,
          is_verified: true,
          has_coupons: false,
          accepts_orders_online: true,
          is_kid_friendly: true,
          is_sponsored_ad: true,
          category: { name: 'Hotel', slug: 'hotel' },
          reviews: [
            { id: '3', rating: 4.9, content: 'Exceptional service!', created_at: '2024-01-03' }
          ]
        },
        {
          id: 'sponsored-3',
          name: 'Tech Solutions',
          slug: 'tech-solutions',
          description: 'Innovative technology solutions for businesses',
          phone: '+250 555 123 456',
          website: 'https://tech-example.com',
          address: '789 Innovation Road, Kigali',
          latitude: -1.9441,
          longitude: 30.0619,
          logo_url: null,
          is_premium: false,
          is_verified: true,
          has_coupons: true,
          accepts_orders_online: false,
          is_kid_friendly: false,
          is_sponsored_ad: true,
          category: { name: 'Technology', slug: 'technology' },
          reviews: [
            { id: '4', rating: 4.7, content: 'Great tech solutions!', created_at: '2024-01-04' }
          ]
        }
      ];

      // Filter by category if specified
      const filtered = categorySlug 
        ? mockSponsoredBusinesses.filter(b => b.category?.slug === categorySlug)
        : mockSponsoredBusinesses;

      // Limit the number of displayed businesses
      setFeaturedBusinesses(filtered.slice(0, maxDisplay));
    } catch (error) {
      console.error('Error fetching featured businesses:', error);
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
      const category = featuredBusinesses[0]?.category?.name;
      return category ? t('featuredBusinesses.featuredCategory', { category }) : t('featuredBusinesses.featuredBusinesses');
    }
    return t('featuredBusinesses.featuredBusinesses');
  };

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
    return null; // Don't show the component if no featured businesses
  }

  return (
    <Card className="w-full">
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
