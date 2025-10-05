-- Fix Integer Overflow Issues - Events Schema Update
-- This migration fixes the integer overflow error by changing data types

-- 1. Change capacity from integer to bigint to handle large numbers
ALTER TABLE public.events 
ALTER COLUMN capacity TYPE bigint;

-- 2. Change registration_count from integer to bigint
ALTER TABLE public.events 
ALTER COLUMN registration_count TYPE bigint;

-- 3. Change view_count from integer to bigint
ALTER TABLE public.events 
ALTER COLUMN view_count TYPE bigint;

-- 4. Update event_tickets table
ALTER TABLE public.event_tickets 
ALTER COLUMN registered_quantity TYPE bigint;

ALTER TABLE public.event_tickets 
ALTER COLUMN max_quantity TYPE bigint;

-- 5. Ensure all required columns exist with correct types
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
ADD COLUMN IF NOT EXISTS event_images text[],
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
ADD COLUMN IF NOT EXISTS updated_by uuid;

-- 6. Remove old payment columns if they exist
ALTER TABLE public.events DROP COLUMN IF EXISTS ticket_price;
ALTER TABLE public.events DROP COLUMN IF EXISTS ticket_url;

-- 7. Update event_tickets table
ALTER TABLE public.event_tickets 
ADD COLUMN IF NOT EXISTS description text;

-- Remove old payment columns from event_tickets
ALTER TABLE public.event_tickets DROP COLUMN IF EXISTS price;
ALTER TABLE public.event_tickets DROP COLUMN IF EXISTS currency;
ALTER TABLE public.event_tickets DROP COLUMN IF EXISTS sold_quantity;

-- 8. Create the event-images storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- 9. Create storage policies for event images
CREATE POLICY IF NOT EXISTS "Anyone can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY IF NOT EXISTS "Anyone can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-images');

CREATE POLICY IF NOT EXISTS "Anyone can update event images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'event-images');

CREATE POLICY IF NOT EXISTS "Anyone can delete event images" ON storage.objects
  FOR DELETE USING (bucket_id = 'event-images');

-- 10. Set up universal RLS policies
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tickets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view public events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
DROP POLICY IF EXISTS "Organizers can update their events" ON public.events;
DROP POLICY IF EXISTS "Organizers can delete their events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage all events" ON public.events;
DROP POLICY IF EXISTS "Universal access to events" ON public.events;

DROP POLICY IF EXISTS "Anyone can view event categories" ON public.event_categories;
DROP POLICY IF EXISTS "Admins can manage event categories" ON public.event_categories;
DROP POLICY IF EXISTS "Universal access to event categories" ON public.event_categories;

DROP POLICY IF EXISTS "Anyone can view event tickets" ON public.event_tickets;
DROP POLICY IF EXISTS "Organizers can manage their event tickets" ON public.event_tickets;
DROP POLICY IF EXISTS "Admins can manage all event tickets" ON public.event_tickets;
DROP POLICY IF EXISTS "Universal access to event tickets" ON public.event_tickets;

-- Create universal policies
CREATE POLICY "Universal access to events" ON public.events
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Universal access to event categories" ON public.event_categories
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Universal access to event tickets" ON public.event_tickets
  FOR ALL USING (true) WITH CHECK (true);

-- 11. Grant universal permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.events TO anon, authenticated;
GRANT ALL ON public.event_categories TO anon, authenticated;
GRANT ALL ON public.event_tickets TO anon, authenticated;

-- 12. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_country_id ON public.events(country_id);
CREATE INDEX IF NOT EXISTS idx_events_city_id ON public.events(city_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_end_date ON public.events(end_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(event_status);
CREATE INDEX IF NOT EXISTS idx_events_is_public ON public.events(is_public);
CREATE INDEX IF NOT EXISTS idx_events_is_featured ON public.events(is_featured);
CREATE INDEX IF NOT EXISTS idx_event_tickets_event_id ON public.event_tickets(event_id);

-- 13. Insert default event categories if they don't exist
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
