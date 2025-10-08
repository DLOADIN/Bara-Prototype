import { supabase } from './supabase';

// Supabase Storage functions for event images
export const uploadEventImage = async (file: File, eventId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${eventId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('event-images')
    .upload(fileName, file);
    
  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('event-images')
    .getPublicUrl(fileName);
  // Ensure public path for direct browser access
  const normalizedUrl = publicUrl.includes('/object/public/')
    ? publicUrl
    : publicUrl.replace('/storage/v1/object/', '/storage/v1/object/public/');
  return normalizedUrl;
};

export const deleteEventImage = async (imageUrl: string): Promise<void> => {
  const fileName = imageUrl.split('/').pop();
  const { error } = await supabase.storage
    .from('event-images')
    .remove([fileName]);
    
  if (error) throw error;
};

export const getEventImageUrl = (imagePath: string): string => {
  const { data: { publicUrl } } = supabase.storage
    .from('event-images')
    .getPublicUrl(imagePath);
  return publicUrl;
};

export interface EventCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface EventTicket {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  is_default: boolean;
  max_quantity?: number;
  registered_quantity: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  organizer_id?: string;
  organizer_name?: string;
  organizer_handle?: string;
  organizer_email?: string;
  organizer_phone?: string;
  country_id?: string;
  city_id?: string;
  venue?: string;
  venue_name?: string;
  venue_address?: string;
  venue_latitude?: number;
  venue_longitude?: number;
  address?: string;
  start_date: string;
  end_date: string;
  images?: string[];
  event_image_url?: string;
  event_images?: string[];
  category?: string;
  event_category_id?: string;
  tags?: string[];
  is_featured: boolean;
  event_status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  is_public: boolean;
  requires_approval: boolean;
  approved_by?: string;
  approved_at?: string;
  capacity?: number;
  registration_url?: string;
  website_url?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  view_count: number;
  registration_count: number;
  created_at: string;
  updated_at: string;
  updated_by?: string;
  
  // Related data
  country_name?: string;
  country_code?: string;
  city_name?: string;
  city_latitude?: number;
  city_longitude?: number;
  category_name?: string;
  category_icon?: string;
  category_color?: string;
  tickets?: EventTicket[];
}

export interface EventSearchParams {
  search_query?: string;
  country_id?: string;
  city_id?: string;
  category?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export interface EventSearchResult {
  events: Event[];
  total_count: number;
  has_more: boolean;
}

export interface City {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  population?: number;
}

export class EventsService {
  // Get all event categories
  static async getEventCategories(): Promise<EventCategory[]> {
    try {
      const { data, error } = await supabase
        .from('event_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching event categories:', error);
      throw error;
    }
  }

  // Get cities by country
  static async getCitiesByCountry(countryId: string): Promise<City[]> {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('id, name, latitude, longitude, population')
        .eq('country_id', countryId)
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching cities by country:', error);
      throw error;
    }
  }

  // Search events with filters
  static async searchEvents(params: EventSearchParams = {}): Promise<EventSearchResult> {
    try {
      const {
        search_query = '',
        country_id,
        city_id,
        category,
        start_date,
        end_date,
        limit = 20,
        offset = 0
      } = params;

      // Build the query without foreign key relationships
      let query = supabase
        .from('events')
        .select('*')
        .eq('is_public', true)
        .in('event_status', ['upcoming', 'ongoing'])
        .order('start_date', { ascending: true })
        .range(offset, offset + limit - 1);

      // Apply filters
      if (search_query) {
        query = query.or(`title.ilike.%${search_query}%,description.ilike.%${search_query}%,venue_name.ilike.%${search_query}%,organizer_name.ilike.%${search_query}%`);
      }

      if (country_id) {
        query = query.eq('country_id', country_id);
      }

      if (city_id) {
        query = query.eq('city_id', city_id);
      }

      if (category) {
        query = query.eq('category', category);
      }

      if (start_date) {
        query = query.gte('start_date', start_date);
      }

      if (end_date) {
        query = query.lte('end_date', end_date);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get total count separately to avoid any potential issues
      let totalCount = 0;
      try {
        const countQuery = supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .eq('is_public', true)
          .in('event_status', ['upcoming', 'ongoing']);

        // Apply the same filters for count
        if (search_query) {
          countQuery.or(`title.ilike.%${search_query}%,description.ilike.%${search_query}%,venue_name.ilike.%${search_query}%,organizer_name.ilike.%${search_query}%`);
        }
        if (country_id) {
          countQuery.eq('country_id', country_id);
        }
        if (city_id) {
          countQuery.eq('city_id', city_id);
        }
        if (category) {
          countQuery.eq('category', category);
        }
        if (start_date) {
          countQuery.gte('start_date', start_date);
        }
        if (end_date) {
          countQuery.lte('end_date', end_date);
        }

        const { count } = await countQuery;
        totalCount = count || 0;
      } catch (countError) {
        console.warn('Error getting count:', countError);
        totalCount = data?.length || 0;
      }

      // Get related data separately to avoid foreign key issues
      const events: Event[] = [];
      
      for (const event of data || []) {
        let countryData = null;
        let cityData = null;
        let categoryData = null;

        if (event.country_id) {
          const { data: country } = await supabase
            .from('countries')
            .select('name, code')
            .eq('id', event.country_id)
            .single();
          countryData = country;
        }

        if (event.city_id) {
          const { data: city } = await supabase
            .from('cities')
            .select('name, latitude, longitude')
            .eq('id', event.city_id)
            .single();
          cityData = city;
        }

        if (event.category) {
          const { data: category } = await supabase
            .from('event_categories')
            .select('name, icon, color')
            .eq('slug', event.category)
            .single();
          categoryData = category;
        }

        events.push({
          ...event,
          country_name: countryData?.name,
          country_code: countryData?.code,
          city_name: cityData?.name,
          city_latitude: cityData?.latitude,
          city_longitude: cityData?.longitude,
          category_name: categoryData?.name,
          category_icon: categoryData?.icon,
          category_color: categoryData?.color,
        });
      }

      return {
        events,
        total_count: totalCount,
        has_more: (offset + limit) < totalCount
      };
    } catch (error) {
      console.error('Error searching events:', error);
      throw error;
    }
  }

  // Get events by country
  static async getEventsByCountry(countryId: string): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('country_id', countryId)
        .eq('is_public', true)
        .in('event_status', ['upcoming', 'ongoing'])
        .order('start_date', { ascending: true });

      if (error) throw error;

      // Get related data separately
      const events: Event[] = [];
      
      for (const event of data || []) {
        let countryData = null;
        let cityData = null;
        let categoryData = null;

        if (event.country_id) {
          const { data: country } = await supabase
            .from('countries')
            .select('name, code')
            .eq('id', event.country_id)
            .single();
          countryData = country;
        }

        if (event.city_id) {
          const { data: city } = await supabase
            .from('cities')
            .select('name, latitude, longitude')
            .eq('id', event.city_id)
            .single();
          cityData = city;
        }

        if (event.category) {
          const { data: category } = await supabase
            .from('event_categories')
            .select('name, icon, color')
            .eq('slug', event.category)
            .single();
          categoryData = category;
        }

        events.push({
          ...event,
          country_name: countryData?.name,
          country_code: countryData?.code,
          city_name: cityData?.name,
          city_latitude: cityData?.latitude,
          city_longitude: cityData?.longitude,
          category_name: categoryData?.name,
          category_icon: categoryData?.icon,
          category_color: categoryData?.color,
        });
      }

      return events;
    } catch (error) {
      console.error('Error fetching events by country:', error);
      throw error;
    }
  }

  // Get single event by ID
  static async getEventById(eventId: string): Promise<Event | null> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .eq('is_public', true)
        .single();

      if (error) throw error;

      if (!data) return null;

      // Get related data separately
      let countryData = null;
      let cityData = null;
      let categoryData = null;
      let ticketsData = null;

      if (data.country_id) {
        const { data: country } = await supabase
          .from('countries')
          .select('name, code')
          .eq('id', data.country_id)
          .single();
        countryData = country;
      }

      if (data.city_id) {
        const { data: city } = await supabase
          .from('cities')
          .select('name, latitude, longitude')
          .eq('id', data.city_id)
          .single();
        cityData = city;
      }

      if (data.category) {
        const { data: category } = await supabase
          .from('event_categories')
          .select('name, icon, color')
          .eq('slug', data.category)
          .single();
        categoryData = category;
      }

      // Get tickets
      const { data: tickets } = await supabase
        .from('event_tickets')
        .select('*')
        .eq('event_id', eventId);
      ticketsData = tickets || [];

      return {
        ...data,
        country_name: countryData?.name,
        country_code: countryData?.code,
        city_name: cityData?.name,
        city_latitude: cityData?.latitude,
        city_longitude: cityData?.longitude,
        category_name: categoryData?.name,
        category_icon: categoryData?.icon,
        category_color: categoryData?.color,
        tickets: ticketsData
      };
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      throw error;
    }
  }

  // Create new event
  static async createEvent(eventData: Partial<Event>): Promise<Event> {
    try {
      console.log('Creating event with data:', eventData);
      
      const { data, error } = await supabase
        .from('events')
        .insert([eventData])
        .select('*')
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Event created successfully:', data);

      // Get related data separately to avoid foreign key issues
      let countryData = null;
      let cityData = null;
      let categoryData = null;

      if (data.country_id) {
        const { data: country } = await supabase
          .from('countries')
          .select('name, code')
          .eq('id', data.country_id)
          .single();
        countryData = country;
      }

      if (data.city_id) {
        const { data: city } = await supabase
          .from('cities')
          .select('name, latitude, longitude')
          .eq('id', data.city_id)
          .single();
        cityData = city;
      }

      if (data.category) {
        const { data: category } = await supabase
          .from('event_categories')
          .select('name, icon, color')
          .eq('slug', data.category)
          .single();
        categoryData = category;
      }

      return {
        ...data,
        country_name: countryData?.name,
        country_code: countryData?.code,
        city_name: cityData?.name,
        city_latitude: cityData?.latitude,
        city_longitude: cityData?.longitude,
        category_name: categoryData?.name,
        category_icon: categoryData?.icon,
        category_color: categoryData?.color,
      };
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  }

  // Update event
  static async updateEvent(eventId: string, eventData: Partial<Event>): Promise<Event> {
    try {
      const { data, error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', eventId)
        .select('*')
        .single();

      if (error) throw error;

      // Get related data separately
      let countryData = null;
      let cityData = null;
      let categoryData = null;

      if (data.country_id) {
        const { data: country } = await supabase
          .from('countries')
          .select('name, code')
          .eq('id', data.country_id)
          .single();
        countryData = country;
      }

      if (data.city_id) {
        const { data: city } = await supabase
          .from('cities')
          .select('name, latitude, longitude')
          .eq('id', data.city_id)
          .single();
        cityData = city;
      }

      if (data.category) {
        const { data: category } = await supabase
          .from('event_categories')
          .select('name, icon, color')
          .eq('slug', data.category)
          .single();
        categoryData = category;
      }

      return {
        ...data,
        country_name: countryData?.name,
        country_code: countryData?.code,
        city_name: cityData?.name,
        city_latitude: cityData?.latitude,
        city_longitude: cityData?.longitude,
        category_name: categoryData?.name,
        category_icon: categoryData?.icon,
        category_color: categoryData?.color,
      };
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  }

  // Delete event
  static async deleteEvent(eventId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  }

  // Create event tickets
  static async createEventTickets(eventId: string, tickets: Omit<EventTicket, 'id' | 'event_id' | 'created_at' | 'updated_at'>[]): Promise<EventTicket[]> {
    try {
      const ticketData = tickets.map(ticket => ({
        ...ticket,
        event_id: eventId
      }));

      const { data, error } = await supabase
        .from('event_tickets')
        .insert(ticketData)
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error creating event tickets:', error);
      throw error;
    }
  }

  // Update event tickets
  static async updateEventTickets(eventId: string, tickets: EventTicket[]): Promise<EventTicket[]> {
    try {
      // First, delete existing tickets
      await supabase
        .from('event_tickets')
        .delete()
        .eq('event_id', eventId);

      // Then insert new tickets
      const ticketData = tickets.map(ticket => ({
        ...ticket,
        event_id: eventId
      }));

      const { data, error } = await supabase
        .from('event_tickets')
        .insert(ticketData)
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error updating event tickets:', error);
      throw error;
    }
  }

  // Increment event view count
  static async incrementEventViewCount(eventId: string): Promise<void> {
    try {
      // First get the current view count
      const { data: eventData, error: fetchError } = await supabase
        .from('events')
        .select('view_count')
        .eq('id', eventId)
        .single();

      if (fetchError) throw fetchError;

      // Then update with incremented value
      const { error } = await supabase
        .from('events')
        .update({ view_count: (eventData?.view_count || 0) + 1 })
        .eq('id', eventId);

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing event view count:', error);
      throw error;
    }
  }

  // Get featured events
  static async getFeaturedEvents(limit: number = 6): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .eq('is_public', true)
        .in('event_status', ['upcoming', 'ongoing'])
        .order('start_date', { ascending: true })
        .limit(limit);

      if (error) throw error;

      // Get related data separately
      const events: Event[] = [];
      
      for (const event of data || []) {
        let countryData = null;
        let cityData = null;
        let categoryData = null;

        if (event.country_id) {
          const { data: country } = await supabase
            .from('countries')
            .select('name, code')
            .eq('id', event.country_id)
            .single();
          countryData = country;
        }

        if (event.city_id) {
          const { data: city } = await supabase
            .from('cities')
            .select('name, latitude, longitude')
            .eq('id', event.city_id)
            .single();
          cityData = city;
        }

        if (event.category) {
          const { data: category } = await supabase
            .from('event_categories')
            .select('name, icon, color')
            .eq('slug', event.category)
            .single();
          categoryData = category;
        }

        events.push({
          ...event,
          country_name: countryData?.name,
          country_code: countryData?.code,
          city_name: cityData?.name,
          city_latitude: cityData?.latitude,
          city_longitude: cityData?.longitude,
          category_name: categoryData?.name,
          category_icon: categoryData?.icon,
          category_color: categoryData?.color,
        });
      }

      return events;
    } catch (error) {
      console.error('Error fetching featured events:', error);
      throw error;
    }
  }

  // Get upcoming events
  static async getUpcomingEvents(limit: number = 10): Promise<Event[]> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_public', true)
        .eq('event_status', 'upcoming')
        .gte('start_date', new Date().toISOString())
        .order('start_date', { ascending: true })
        .limit(limit);

      if (error) throw error;

      // Get related data separately
      const events: Event[] = [];
      
      for (const event of data || []) {
        let countryData = null;
        let cityData = null;
        let categoryData = null;

        if (event.country_id) {
          const { data: country } = await supabase
            .from('countries')
            .select('name, code')
            .eq('id', event.country_id)
            .single();
          countryData = country;
        }

        if (event.city_id) {
          const { data: city } = await supabase
            .from('cities')
            .select('name, latitude, longitude')
            .eq('id', event.city_id)
            .single();
          cityData = city;
        }

        if (event.category) {
          const { data: category } = await supabase
            .from('event_categories')
            .select('name, icon, color')
            .eq('slug', event.category)
            .single();
          categoryData = category;
        }

        events.push({
          ...event,
          country_name: countryData?.name,
          country_code: countryData?.code,
          city_name: cityData?.name,
          city_latitude: cityData?.latitude,
          city_longitude: cityData?.longitude,
          category_name: categoryData?.name,
          category_icon: categoryData?.icon,
          category_color: categoryData?.color,
        });
      }

      return events;
    } catch (error) {
      console.error('Error fetching upcoming events:', error);
      throw error;
    }
  }
}

export default EventsService;
