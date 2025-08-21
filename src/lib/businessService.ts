import { db } from './supabase';

export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  city_id: string;
  country_id: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  status: 'pending' | 'active' | 'suspended' | 'premium';
  is_premium: boolean;
  is_verified: boolean;
  latitude: number | null;
  longitude: number | null;
  hours_of_operation: any | null;
  services: any | null;
  images: string[] | null;
  logo_url: string | null;
  view_count: number;
  click_count: number;
  created_at: string;
  updated_at: string;
  
  // Joined fields
  category?: {
    id: string;
    name: string;
    slug: string;
    icon: string | null;
  };
  city?: {
    id: string;
    name: string;
    country_id: string;
  };
  country?: {
    id: string;
    name: string;
    code: string;
    flag_url: string | null;
  };
  reviews?: {
    id: string;
    rating: number;
    title: string | null;
    content: string | null;
    created_at: string;
  }[];
}

export interface BusinessFilters {
  category?: string;
  city?: string;
  country?: string;
  status?: 'active' | 'premium';
  search?: string;
  is_verified?: boolean;
  is_premium?: boolean;
}

export interface BusinessSearchParams {
  categorySlug?: string;
  citySlug?: string;
  countryCode?: string;
  searchTerm?: string;
  filters?: BusinessFilters;
  page?: number;
  limit?: number;
}

export interface City {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  countries: { code: string } | null;
}

export class BusinessService {
  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  /**
   * Get nearby cities for proximity filtering
   */
  static async getNearbyCities(cityName: string, radiusKm: number = 50): Promise<string[]> {
    try {
      // First get the selected city coordinates
      const { data: cityData, error: cityError } = await db.cities()
        .select('id, name, latitude, longitude')
        .eq('name', cityName)
        .single();

      if (cityError || !cityData || !cityData.latitude || !cityData.longitude) {
        return [cityName]; // Return just the selected city if no coordinates
      }

      // Get all cities with coordinates
      const { data: allCities, error: citiesError } = await db.cities()
        .select('id, name, latitude, longitude')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null);

      if (citiesError || !allCities) {
        return [cityName];
      }

      // Filter cities within radius
      const nearbyCities = allCities
        .filter(city => {
          const distance = this.calculateDistance(
            cityData.latitude!,
            cityData.longitude!,
            city.latitude!,
            city.longitude!
          );
          return distance <= radiusKm;
        })
        .map(city => city.name);

      return nearbyCities.length > 0 ? nearbyCities : [cityName];
    } catch (error) {
      console.error('Error getting nearby cities:', error);
      return [cityName];
    }
  }

  /**
   * Fetch businesses with filters and joins
   */
  static async getBusinesses(params: BusinessSearchParams = {}): Promise<Business[]> {
    try {
      // Use inner joins to ensure category/city filters work reliably
      let query = db.businesses()
        .select(`
          *,
          category:categories!businesses_category_id_fkey(id, name, slug, icon),
          city:cities!businesses_city_id_fkey(id, name, country_id),
          country:countries!businesses_country_id_fkey(id, name, code, flag_url),
          reviews:reviews(id, rating, title, content, created_at)
        `, { head: false })
        .eq('status', 'active');

      // Apply category filter
      if (params.categorySlug) {
        // filter via related table column
        query = query.eq('categories.slug', params.categorySlug);
      }

      // Apply city filter with proximity
      if (params.citySlug) {
        const nearbyCities = await this.getNearbyCities(params.citySlug);
        if (nearbyCities.length > 1) {
          // Use OR condition for multiple nearby cities
          query = query.in('cities.name', nearbyCities);
        } else {
          query = query.eq('cities.name', params.citySlug);
        }
      }

      // Apply country filter
      if (params.countryCode) {
        query = query.eq('countries.code', params.countryCode);
      }

      // Apply search filter
      if (params.searchTerm) {
        query = query.or(`name.ilike.%${params.searchTerm}%,description.ilike.%${params.searchTerm}%`);
      }

      // Apply premium filter
      if (params.filters?.is_premium) {
        query = query.eq('is_premium', true);
      }

      // Apply verification filter
      if (params.filters?.is_verified) {
        query = query.eq('is_verified', true);
      }

      // Order by premium status and creation date
      query = query.order('is_premium', { ascending: false })
                  .order('created_at', { ascending: false });

      // Apply pagination
      if (params.page && params.limit) {
        const offset = (params.page - 1) * params.limit;
        query = query.range(offset, offset + params.limit - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching businesses:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getBusinesses:', error);
      throw error;
    }
  }

  /**
   * Get business by ID with full details
   */
  static async getBusinessById(id: string): Promise<Business | null> {
    try {
      const { data, error } = await db.businesses()
        .select(`
          *,
          category:categories!businesses_category_id_fkey(id, name, slug, icon),
          city:cities!businesses_city_id_fkey(id, name, country_id),
          country:countries!businesses_country_id_fkey(id, name, code, flag_url),
          reviews:reviews(id, rating, title, content, created_at)
        `)
        .eq('id', id)
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Error fetching business:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getBusinessById:', error);
      return null;
    }
  }

  /**
   * Get businesses by category slug
   */
  static async getBusinessesByCategory(categorySlug: string, citySlug?: string): Promise<Business[]> {
    try {
      let query = db.businesses()
        .select(`
          *,
          category:categories!businesses_category_id_fkey(id, name, slug, icon),
          city:cities!businesses_city_id_fkey(id, name, country_id),
          country:countries!businesses_country_id_fkey(id, name, code, flag_url),
          reviews:reviews(id, rating, title, content, created_at)
        `)
        .eq('status', 'active')
        .eq('categories.slug', categorySlug);

      if (citySlug) {
        const nearbyCities = await this.getNearbyCities(citySlug);
        if (nearbyCities.length > 1) {
          // Use OR condition for multiple nearby cities
          query = query.in('cities.name', nearbyCities);
        } else {
          query = query.eq('cities.name', citySlug);
        }
      }

      const { data, error } = await query
        .order('is_premium', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching businesses by category:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in getBusinessesByCategory:', error);
      throw error;
    }
  }

  /**
   * Search businesses by name or description
   */
  static async searchBusinesses(searchTerm: string, filters: BusinessFilters = {}): Promise<Business[]> {
    try {
      let query = db.businesses()
        .select(`
          *,
          category:categories!businesses_category_id_fkey(id, name, slug, icon),
          city:cities!businesses_city_id_fkey(id, name, country_id),
          country:countries!businesses_country_id_fkey(id, name, code, flag_url),
          reviews:reviews(id, rating, title, content, created_at)
        `)
        .eq('status', 'active')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

      // Apply additional filters
      if (filters.category) {
        query = query.eq('categories.slug', filters.category);
      }

      if (filters.city) {
        const nearbyCities = await this.getNearbyCities(filters.city);
        if (nearbyCities.length > 1) {
          query = query.in('cities.name', nearbyCities);
        } else {
          query = query.eq('cities.name', filters.city);
        }
      }

      if (filters.country) {
        query = query.eq('countries.code', filters.country);
      }

      const { data, error } = await query
        .order('is_premium', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching businesses:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchBusinesses:', error);
      throw error;
    }
  }

  /**
   * Get business count by category
   */
  static async getBusinessCountByCategory(categorySlug: string): Promise<number> {
    try {
      const { count, error } = await db.businesses()
        .select('id, categories!inner(slug)', { count: 'exact', head: true })
        .eq('status', 'active')
        .eq('categories.slug', categorySlug);

      if (error) {
        console.error('Error getting business count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error in getBusinessCountByCategory:', error);
      return 0;
    }
  }

  /**
   * Increment view count for a business
   */
  static async incrementViewCount(businessId: string): Promise<void> {
    try {
      const { error } = await db.businesses()
        .update({ view_count: db.businesses().select('view_count').eq('id', businessId).single().then(r => (r.data?.view_count || 0) + 1) })
        .eq('id', businessId);

      if (error) {
        console.error('Error incrementing view count:', error);
      }
    } catch (error) {
      console.error('Error in incrementViewCount:', error);
    }
  }

  /**
   * Increment click count for a business
   */
  static async incrementClickCount(businessId: string): Promise<void> {
    try {
      const { error } = await db.businesses()
        .update({ click_count: db.businesses().select('click_count').eq('id', businessId).single().then(r => (r.data?.click_count || 0) + 1) })
        .eq('id', businessId);

      if (error) {
        console.error('Error incrementing click count:', error);
      }
    } catch (error) {
      console.error('Error in incrementClickCount:', error);
    }
  }
}
