-- Setup Supabase Storage bucket for sponsored banners
-- Run this in Supabase SQL Editor

-- Create the storage bucket for sponsored banners
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'sponsored-banners',
  'sponsored-banners',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for the storage bucket
-- Allow anyone to upload images
CREATE POLICY "Anyone can upload sponsored banner images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'sponsored-banners');

-- Allow anyone to view images
CREATE POLICY "Anyone can view sponsored banner images" ON storage.objects
FOR SELECT USING (bucket_id = 'sponsored-banners');

-- Allow anyone to update images (for admin management)
CREATE POLICY "Anyone can update sponsored banner images" ON storage.objects
FOR UPDATE USING (bucket_id = 'sponsored-banners');

-- Allow anyone to delete images (for admin management)
CREATE POLICY "Anyone can delete sponsored banner images" ON storage.objects
FOR DELETE USING (bucket_id = 'sponsored-banners');

-- Grant permissions
GRANT ALL ON storage.objects TO anon, authenticated, public;
GRANT USAGE ON SCHEMA storage TO anon, authenticated, public;
