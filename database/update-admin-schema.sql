-- Update schema for admin functionality
-- Add missing fields to countries and cities tables

-- Add is_active and flag_emoji to countries table
ALTER TABLE public.countries 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS flag_emoji text;

-- Add is_active to cities table
ALTER TABLE public.cities 
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Update existing records to be active by default
UPDATE public.countries SET is_active = true WHERE is_active IS NULL;
UPDATE public.cities SET is_active = true WHERE is_active IS NULL;

-- Add some sample countries if the table is empty
INSERT INTO public.countries (name, code, flag_emoji, is_active) 
VALUES 
  ('Rwanda', 'RW', '🇷🇼', true),
  ('Kenya', 'KE', '🇰🇪', true),
  ('Uganda', 'UG', '🇺🇬', true),
  ('Tanzania', 'TZ', '🇹🇿', true),
  ('Ethiopia', 'ET', '🇪🇹', true)
ON CONFLICT (code) DO NOTHING;

-- Add some sample cities if the table is empty
INSERT INTO public.cities (name, country_id, is_active)
SELECT 
  'Kigali',
  c.id,
  true
FROM public.countries c 
WHERE c.code = 'RW'
ON CONFLICT DO NOTHING;

INSERT INTO public.cities (name, country_id, is_active)
SELECT 
  'Nairobi',
  c.id,
  true
FROM public.countries c 
WHERE c.code = 'KE'
ON CONFLICT DO NOTHING;

INSERT INTO public.cities (name, country_id, is_active)
SELECT 
  'Kampala',
  c.id,
  true
FROM public.countries c 
WHERE c.code = 'UG'
ON CONFLICT DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_countries_is_active ON public.countries(is_active);
CREATE INDEX IF NOT EXISTS idx_cities_is_active ON public.cities(is_active);
CREATE INDEX IF NOT EXISTS idx_cities_country_id ON public.cities(country_id);
