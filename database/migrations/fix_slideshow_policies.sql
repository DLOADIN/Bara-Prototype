-- Fix slideshow_images RLS policies to allow universal access
-- This migration removes restrictive policies and creates universal access

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Allow public to read active slideshow images" ON public.slideshow_images;
DROP POLICY IF EXISTS "Allow authenticated users to read all slideshow images" ON public.slideshow_images;
DROP POLICY IF EXISTS "Allow service role to manage all slideshow images" ON public.slideshow_images;

-- Create universal access policies for slideshow_images
CREATE POLICY "Universal insert access" ON public.slideshow_images
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Universal read access" ON public.slideshow_images
  FOR SELECT USING (true);

CREATE POLICY "Universal update access" ON public.slideshow_images
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Universal delete access" ON public.slideshow_images
  FOR DELETE USING (true);

-- Also fix storage policies to allow universal access
DROP POLICY IF EXISTS "Allow public to view slideshow images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload slideshow images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update slideshow images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete slideshow images" ON storage.objects;

-- Create universal storage policies
CREATE POLICY "Universal view access" ON storage.objects
  FOR SELECT USING (bucket_id = 'slideshow-images');

CREATE POLICY "Universal upload access" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'slideshow-images');

CREATE POLICY "Universal update access" ON storage.objects
  FOR UPDATE USING (bucket_id = 'slideshow-images') WITH CHECK (bucket_id = 'slideshow-images');

CREATE POLICY "Universal delete access" ON storage.objects
  FOR DELETE USING (bucket_id = 'slideshow-images');
