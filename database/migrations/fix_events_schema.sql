-- Clean up old migration and run the new one
-- First, let's check what columns exist and clean up

-- Drop the old migration's sample data
DELETE FROM public.event_tickets WHERE event_id IN (
  SELECT id FROM public.events WHERE title IN ('African Tech Summit 2024', 'Afrobeat Music Festival')
);

DELETE FROM public.events WHERE title IN ('African Tech Summit 2024', 'Afrobeat Music Festival');

-- Remove old payment-related columns if they exist
ALTER TABLE public.events DROP COLUMN IF EXISTS ticket_price;
ALTER TABLE public.events DROP COLUMN IF EXISTS ticket_url;

-- Remove old price column from event_tickets if it exists
ALTER TABLE public.event_tickets DROP COLUMN IF EXISTS price;
ALTER TABLE public.event_tickets DROP COLUMN IF EXISTS currency;
ALTER TABLE public.event_tickets DROP COLUMN IF EXISTS sold_quantity;

-- Add the new columns if they don't exist
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

-- Add registered_quantity to event_tickets if it doesn't exist
ALTER TABLE public.event_tickets 
ADD COLUMN IF NOT EXISTS registered_quantity integer DEFAULT 0;

-- Add foreign key constraint for event_category_id if it doesn't exist
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS event_category_id uuid;

-- Create foreign key constraint to event_categories
ALTER TABLE public.events 
ADD CONSTRAINT IF NOT EXISTS events_event_category_id_fkey 
FOREIGN KEY (event_category_id) REFERENCES public.event_categories(id);

-- Create index for the foreign key
CREATE INDEX IF NOT EXISTS idx_events_event_category_id ON public.events(event_category_id);

-- Create the event-images storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for event images
CREATE POLICY IF NOT EXISTS "Anyone can view event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY IF NOT EXISTS "Anyone can upload event images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-images');

CREATE POLICY IF NOT EXISTS "Anyone can update event images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'event-images');

CREATE POLICY IF NOT EXISTS "Anyone can delete event images" ON storage.objects
  FOR DELETE USING (bucket_id = 'event-images');

-- Update RLS policies to be universal
DROP POLICY IF EXISTS "Anyone can view public events" ON public.events;
DROP POLICY IF EXISTS "Authenticated users can create events" ON public.events;
DROP POLICY IF EXISTS "Organizers can update their events" ON public.events;
DROP POLICY IF EXISTS "Organizers can delete their events" ON public.events;
DROP POLICY IF EXISTS "Admins can manage all events" ON public.events;

CREATE POLICY "Universal access to events" ON public.events
  FOR ALL USING (true) WITH CHECK (true);

-- Update event_categories policies
DROP POLICY IF EXISTS "Anyone can view event categories" ON public.event_categories;
DROP POLICY IF EXISTS "Admins can manage event categories" ON public.event_categories;

CREATE POLICY "Universal access to event categories" ON public.event_categories
  FOR ALL USING (true) WITH CHECK (true);

-- Update event_tickets policies
DROP POLICY IF EXISTS "Anyone can view event tickets" ON public.event_tickets;
DROP POLICY IF EXISTS "Organizers can manage their event tickets" ON public.event_tickets;
DROP POLICY IF EXISTS "Admins can manage all event tickets" ON public.event_tickets;

CREATE POLICY "Universal access to event tickets" ON public.event_tickets
  FOR ALL USING (true) WITH CHECK (true);

-- Grant universal permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.events TO anon, authenticated;
GRANT ALL ON public.event_categories TO anon, authenticated;
GRANT ALL ON public.event_tickets TO anon, authenticated;
