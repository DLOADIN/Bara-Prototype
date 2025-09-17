-- Setup Supabase Storage buckets for business images and logos
-- Run this in Supabase SQL Editor

-- Create the storage bucket for business images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business-images',
  'business-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create the storage bucket for business logos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business-logos',
  'business-logos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create RLS policies for business images bucket
-- Allow anyone to upload business images
CREATE POLICY "Anyone can upload business images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'business-images');

-- Allow anyone to view business images
CREATE POLICY "Anyone can view business images" ON storage.objects
FOR SELECT USING (bucket_id = 'business-images');

-- Allow anyone to update business images (for admin management)
CREATE POLICY "Anyone can update business images" ON storage.objects
FOR UPDATE USING (bucket_id = 'business-images');

-- Allow anyone to delete business images (for admin management)
CREATE POLICY "Anyone can delete business images" ON storage.objects
FOR DELETE USING (bucket_id = 'business-images');

-- Create RLS policies for business logos bucket
-- Allow anyone to upload business logos
CREATE POLICY "Anyone can upload business logos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'business-logos');

-- Allow anyone to view business logos
CREATE POLICY "Anyone can view business logos" ON storage.objects
FOR SELECT USING (bucket_id = 'business-logos');

-- Allow anyone to update business logos (for admin management)
CREATE POLICY "Anyone can update business logos" ON storage.objects
FOR UPDATE USING (bucket_id = 'business-logos');

-- Allow anyone to delete business logos (for admin management)
CREATE POLICY "Anyone can delete business logos" ON storage.objects
FOR DELETE USING (bucket_id = 'business-logos');

-- Grant permissions
GRANT ALL ON storage.objects TO anon, authenticated, public;
GRANT USAGE ON SCHEMA storage TO anon, authenticated, public;
