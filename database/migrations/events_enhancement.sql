-- Events Enhancement Migration
-- This migration enhances the events system with proper categories, policies, and functionality

-- 1. Create event_categories table for event-specific categories
CREATE TABLE IF NOT EXISTS public.event_categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  color text DEFAULT '#6366f1',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_categories_pkey PRIMARY KEY (id)
);

-- 2. Create event_tickets table for multiple ticket types
CREATE TABLE IF NOT EXISTS public.event_tickets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL,
  name text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  currency text DEFAULT 'USD',
  description text,
  is_default boolean DEFAULT false,
  max_quantity integer,
  sold_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_tickets_pkey PRIMARY KEY (id),
  CONSTRAINT event_tickets_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE
);

-- 3. Enhance the existing events table with additional fields
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS organizer_name text,
ADD COLUMN IF NOT EXISTS organizer_handle text,
ADD COLUMN IF NOT EXISTS organizer_email text,
ADD COLUMN IF NOT EXISTS organizer_phone text,
ADD COLUMN IF NOT EXISTS venue_name text,
ADD COLUMN IF NOT EXISTS venue_address text,
ADD COLUMN IF NOT EXISTS venue_latitude numeric,
ADD COLUMN IF NOT EXISTS venue_longitude numeric,
ADD COLUMN IF NOT EXISTS event_image_url text,
ADD COLUMN IF NOT EXISTS capacity integer,
ADD COLUMN IF NOT EXISTS registration_url text,
ADD COLUMN IF NOT EXISTS website_url text,
ADD COLUMN IF NOT EXISTS facebook_url text,
ADD COLUMN IF NOT EXISTS twitter_url text,
ADD COLUMN IF NOT EXISTS instagram_url text,
ADD COLUMN IF NOT EXISTS event_status text DEFAULT 'upcoming' CHECK (event_status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS requires_approval boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS approved_by uuid,
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_by uuid,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS registration_count integer DEFAULT 0;


-- 5. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_country_id ON public.events(country_id);
CREATE INDEX IF NOT EXISTS idx_events_city_id ON public.events(city_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON public.events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(event_status);
CREATE INDEX IF NOT EXISTS idx_events_is_public ON public.events(is_public);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON public.events(is_featured);
CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON public.events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON public.event_tickets(event_id);


-- 7. Insert default event categories
INSERT INTO public.event_categories (name, slug, description, icon, color) VALUES
('Technology', 'technology', 'Tech conferences, hackathons, and innovation events', '💻', '#3b82f6'),
('Music', 'music', 'Concerts, festivals, and musical performances', '🎵', '#8b5cf6'),
('Art', 'art', 'Exhibitions, galleries, and artistic events', '🎨', '#f59e0b'),
('Business', 'business', 'Networking, conferences, and business events', '💼', '#10b981'),
('Food', 'food', 'Food festivals, tastings, and culinary events', '🍽️', '#f97316'),
('Fashion', 'fashion', 'Fashion shows, launches, and style events', '👗', '#ec4899'),
('Sports', 'sports', 'Sports events, tournaments, and competitions', '⚽', '#22c55e'),
('Education', 'education', 'Workshops, seminars, and educational events', '📚', '#6366f1'),
('Health', 'health', 'Health and wellness events', '🏥', '#ef4444'),
('Entertainment', 'entertainment', 'Entertainment and leisure events', '🎭', '#8b5cf6'),
('Community', 'community', 'Community gatherings and local events', '🤝', '#06b6d4'),
('Charity', 'charity', 'Fundraising and charitable events', '❤️', '#dc2626')
ON CONFLICT (slug) DO NOTHING;

-- 8. Create RLS policies for events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read public events
CREATE POLICY "Anyone can view public events" ON public.events
  FOR SELECT USING (is_public = true);

-- Policy: Allow authenticated users to create events
CREATE POLICY "Authenticated users can create events" ON public.events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Policy: Allow event organizers to update their events
CREATE POLICY "Organizers can update their events" ON public.events
  FOR UPDATE USING (auth.uid() = organizer_id);

-- Policy: Allow event organizers to delete their events
CREATE POLICY "Organizers can delete their events" ON public.events
  FOR DELETE USING (auth.uid() = organizer_id);

-- Policy: Allow admins to do anything with events
CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid()::text
    )
  );

-- 9. Create RLS policies for event_categories table
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read event categories
CREATE POLICY "Anyone can view event categories" ON public.event_categories
  FOR SELECT USING (true);

-- Policy: Allow admins to manage event categories
CREATE POLICY "Admins can manage event categories" ON public.event_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid()::text
    )
  );

-- 10. Create RLS policies for event_tickets table
ALTER TABLE public.event_tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read event tickets
CREATE POLICY "Anyone can view event tickets" ON public.event_tickets
  FOR SELECT USING (true);

-- Policy: Allow event organizers to manage tickets for their events
CREATE POLICY "Organizers can manage their event tickets" ON public.event_tickets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.events 
      WHERE events.id = event_tickets.event_id 
      AND events.organizer_id = auth.uid()
    )
  );

-- Policy: Allow admins to manage all event tickets
CREATE POLICY "Admins can manage all event tickets" ON public.event_tickets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.uid()::text
    )
  );

-- 11. Create functions for event filtering and searching

-- Function to get events by country
CREATE OR REPLACE FUNCTION get_events_by_country(country_uuid uuid)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  venue_name text,
  venue_address text,
  event_image_url text,
  category text,
  organizer_name text,
  country_name text,
  city_name text,
  ticket_price numeric,
  capacity integer,
  registration_count integer
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.description,
    e.start_date,
    e.end_date,
    e.venue_name,
    e.venue_address,
    e.event_image_url,
    e.category,
    e.organizer_name,
    c.name as country_name,
    ci.name as city_name,
    e.ticket_price,
    e.capacity,
    e.registration_count
  FROM public.events e
  LEFT JOIN public.countries c ON e.country_id = c.id
  LEFT JOIN public.cities ci ON e.city_id = ci.id
  WHERE e.country_id = country_uuid 
    AND e.is_public = true 
    AND e.event_status IN ('upcoming', 'ongoing')
  ORDER BY e.start_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search events
CREATE OR REPLACE FUNCTION search_events(
  search_query text DEFAULT '',
  country_uuid uuid DEFAULT NULL,
  city_uuid uuid DEFAULT NULL,
  category_filter text DEFAULT NULL,
  start_date_filter timestamp with time zone DEFAULT NULL,
  end_date_filter timestamp with time zone DEFAULT NULL,
  limit_count integer DEFAULT 20,
  offset_count integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  venue_name text,
  venue_address text,
  event_image_url text,
  category text,
  organizer_name text,
  country_name text,
  city_name text,
  ticket_price numeric,
  capacity integer,
  registration_count integer,
  total_count bigint
) AS $$
DECLARE
  total_events bigint;
BEGIN
  -- Get total count for pagination
  SELECT COUNT(*) INTO total_events
  FROM public.events e
  LEFT JOIN public.countries c ON e.country_id = c.id
  LEFT JOIN public.cities ci ON e.city_id = ci.id
  WHERE 
    (search_query = '' OR to_tsvector('english', e.title || ' ' || COALESCE(e.description, '') || ' ' || COALESCE(e.venue_name, '') || ' ' || COALESCE(e.organizer_name, '')) @@ plainto_tsquery('english', search_query))
    AND (country_uuid IS NULL OR e.country_id = country_uuid)
    AND (city_uuid IS NULL OR e.city_id = city_uuid)
    AND (category_filter IS NULL OR e.category = category_filter)
    AND (start_date_filter IS NULL OR e.start_date >= start_date_filter)
    AND (end_date_filter IS NULL OR e.end_date <= end_date_filter)
    AND e.is_public = true 
    AND e.event_status IN ('upcoming', 'ongoing');

  -- Return filtered events with total count
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.description,
    e.start_date,
    e.end_date,
    e.venue_name,
    e.venue_address,
    e.event_image_url,
    e.category,
    e.organizer_name,
    c.name as country_name,
    ci.name as city_name,
    e.ticket_price,
    e.capacity,
    e.registration_count,
    total_events
  FROM public.events e
  LEFT JOIN public.countries c ON e.country_id = c.id
  LEFT JOIN public.cities ci ON e.city_id = ci.id
  WHERE 
    (search_query = '' OR to_tsvector('english', e.title || ' ' || COALESCE(e.description, '') || ' ' || COALESCE(e.venue_name, '') || ' ' || COALESCE(e.organizer_name, '')) @@ plainto_tsquery('english', search_query))
    AND (country_uuid IS NULL OR e.country_id = country_uuid)
    AND (city_uuid IS NULL OR e.city_id = city_uuid)
    AND (category_filter IS NULL OR e.category = category_filter)
    AND (start_date_filter IS NULL OR e.start_date >= start_date_filter)
    AND (end_date_filter IS NULL OR e.end_date <= end_date_filter)
    AND e.is_public = true 
    AND e.event_status IN ('upcoming', 'ongoing')
  ORDER BY e.start_date ASC
  LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get cities by country for event filtering
CREATE OR REPLACE FUNCTION get_cities_by_country(country_uuid uuid)
RETURNS TABLE (
  id uuid,
  name text,
  latitude numeric,
  longitude numeric,
  population bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.latitude,
    c.longitude,
    c.population
  FROM public.cities c
  WHERE c.country_id = country_uuid 
    AND c.is_active = true
  ORDER BY c.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get event categories
CREATE OR REPLACE FUNCTION get_event_categories()
RETURNS TABLE (
  id uuid,
  name text,
  slug text,
  description text,
  icon text,
  color text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ec.id,
    ec.name,
    ec.slug,
    ec.description,
    ec.icon,
    ec.color
  FROM public.event_categories ec
  WHERE ec.is_active = true
  ORDER BY ec.sort_order ASC, ec.name ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to events table
DROP TRIGGER IF EXISTS update_events_updated_at ON public.events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to event_categories table
DROP TRIGGER IF EXISTS update_event_categories_updated_at ON public.event_categories;
CREATE TRIGGER update_event_categories_updated_at
  BEFORE UPDATE ON public.event_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply updated_at trigger to event_tickets table
DROP TRIGGER IF EXISTS update_event_tickets_updated_at ON public.event_tickets;
CREATE TRIGGER update_event_tickets_updated_at
  BEFORE UPDATE ON public.event_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 13. Create view for event details with all related information
CREATE OR REPLACE VIEW event_details AS
SELECT 
  e.id,
  e.title,
  e.description,
  e.start_date,
  e.end_date,
  e.venue_name,
  e.venue_address,
  e.venue_latitude,
  e.venue_longitude,
  e.event_image_url,
  e.category,
  e.organizer_name,
  e.organizer_handle,
  e.organizer_email,
  e.organizer_phone,
  e.capacity,
  e.registration_count,
  e.ticket_price,
  e.registration_url,
  e.website_url,
  e.facebook_url,
  e.twitter_url,
  e.instagram_url,
  e.event_status,
  e.is_public,
  e.is_featured,
  e.view_count,
  e.created_at,
  e.updated_at,
  c.name as country_name,
  c.code as country_code,
  ci.name as city_name,
  ci.latitude as city_latitude,
  ci.longitude as city_longitude,
  ec.name as category_name,
  ec.icon as category_icon,
  ec.color as category_color
FROM public.events e
LEFT JOIN public.countries c ON e.country_id = c.id
LEFT JOIN public.cities ci ON e.city_id = ci.id
LEFT JOIN public.event_categories ec ON e.category = ec.slug;

-- 14. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.events TO authenticated;
GRANT ALL ON public.event_categories TO authenticated;
GRANT ALL ON public.event_tickets TO authenticated;
GRANT EXECUTE ON FUNCTION get_events_by_country(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION search_events(text, uuid, uuid, text, timestamp with time zone, timestamp with time zone, integer, integer) TO authenticated;
GRANT EXECUTE ON FUNCTION get_cities_by_country(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_event_categories() TO authenticated;
GRANT SELECT ON event_details TO authenticated;

-- 15. Create indexes for the search function
CREATE INDEX IF NOT EXISTS idx_events_country_city ON public.events(country_id, city_id);
CREATE INDEX IF NOT EXISTS idx_events_category_status ON public.events(category, event_status);
CREATE INDEX IF NOT EXISTS idx_events_date_range ON public.events(start_date, end_date);

-- 16. Insert sample events for testing
INSERT INTO public.events (
  title, description, organizer_name, organizer_handle, organizer_email,
  country_id, city_id, venue_name, venue_address,
  start_date, end_date, event_image_url, category,
  ticket_price, capacity, website_url, is_public, is_featured
) VALUES
(
  'African Tech Summit 2024',
  'Join us for the largest gathering of tech innovators, entrepreneurs, and investors in Africa. This summit will feature keynote speeches, panel discussions, and networking opportunities.',
  'Africa Tech Network',
  '@africatech',
  'info@africatech.net',
  (SELECT id FROM public.countries WHERE code = 'KE' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Nairobi' LIMIT 1),
  'Kenyatta International Convention Centre',
  'Harambee Ave, Nairobi, Kenya',
  '2024-10-15 09:00:00+00',
  '2024-10-15 17:00:00+00',
  'https://images.unsplash.com/photo-1505373879543-15cdf5d1d1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'technology',
  150.00,
  1000,
  'https://africatechsummit.com',
  true,
  true
),
(
  'Afrobeat Music Festival',
  'Experience the best of Afrobeat music with performances from top artists across Africa. Food, drinks, and good vibes guaranteed!',
  'Afrobeat Promotions',
  '@afrobeatpromo',
  'info@afrobeatpromo.com',
  (SELECT id FROM public.countries WHERE code = 'NG' LIMIT 1),
  (SELECT id FROM public.cities WHERE name = 'Lagos' LIMIT 1),
  'Tafawa Balewa Square',
  'Tafawa Balewa Square, Lagos Island, Lagos, Nigeria',
  '2024-11-05 18:00:00+00',
  '2024-11-05 23:00:00+00',
  'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  'music',
  75.00,
  5000,
  'https://afrobeatfest.com',
  true,
  true
)
ON CONFLICT DO NOTHING;

-- 17. Insert sample tickets for the events
INSERT INTO public.event_tickets (event_id, name, price, description, is_default, max_quantity)
SELECT 
  e.id,
  'Early Bird',
  0.00,
  'Free early bird tickets',
  true,
  100
FROM public.events e
WHERE e.title = 'African Tech Summit 2024'
ON CONFLICT DO NOTHING;

INSERT INTO public.event_tickets (event_id, name, price, description, is_default, max_quantity)
SELECT 
  e.id,
  'General Admission',
  150.00,
  'Standard admission ticket',
  false,
  800
FROM public.events e
WHERE e.title = 'African Tech Summit 2024'
ON CONFLICT DO NOTHING;

INSERT INTO public.event_tickets (event_id, name, price, description, is_default, max_quantity)
SELECT 
  e.id,
  'VIP',
  250.00,
  'VIP access with premium benefits',
  false,
  100
FROM public.events e
WHERE e.title = 'African Tech Summit 2024'
ON CONFLICT DO NOTHING;
