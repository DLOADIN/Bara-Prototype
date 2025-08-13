-- Supabase Storage Setup for Business Images
-- Run these commands in your Supabase SQL editor

-- 1. Create storage bucket for business images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'business-images',
  'business-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Create storage policies for the bucket

-- Policy: Allow authenticated users to upload images
CREATE POLICY "Allow authenticated users to upload business images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'business-images' AND
  (storage.foldername(name))[1]::uuid = auth.uid() OR
  (storage.foldername(name))[1]::uuid IN (
    SELECT id FROM public.businesses 
    WHERE owner_id = auth.uid()
  )
);

-- Policy: Allow public read access to business images
CREATE POLICY "Allow public read access to business images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'business-images');

-- Policy: Allow business owners to update their images
CREATE POLICY "Allow business owners to update their images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'business-images' AND
  (storage.foldername(name))[1]::uuid IN (
    SELECT id FROM public.businesses 
    WHERE owner_id = auth.uid()
  )
);

-- Policy: Allow business owners to delete their images
CREATE POLICY "Allow business owners to delete their images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'business-images' AND
  (storage.foldername(name))[1]::uuid IN (
    SELECT id FROM public.businesses 
    WHERE owner_id = auth.uid()
  )
);

-- 3. Create function to clean up orphaned images when business is deleted
CREATE OR REPLACE FUNCTION cleanup_business_images()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete all images associated with the deleted business
  DELETE FROM storage.objects 
  WHERE bucket_id = 'business-images' 
    AND (storage.foldername(name))[1]::uuid = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 4. Create trigger to automatically clean up images
CREATE TRIGGER cleanup_business_images_trigger
  AFTER DELETE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION cleanup_business_images();

-- 5. Create function to get business image URLs
CREATE OR REPLACE FUNCTION get_business_images(business_uuid UUID)
RETURNS TABLE (
  image_url TEXT,
  image_path TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    storage.get_public_url('business-images', obj.name) as image_url,
    obj.name as image_path,
    obj.created_at
  FROM storage.objects obj
  WHERE obj.bucket_id = 'business-images'
    AND (storage.foldername(obj.name))[1]::uuid = business_uuid
  ORDER BY obj.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Grant necessary permissions
GRANT USAGE ON SCHEMA storage TO public;
GRANT SELECT ON storage.objects TO public;
GRANT INSERT, UPDATE, DELETE ON storage.objects TO authenticated;

-- 7. Create RLS policies for the businesses table to work with storage
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to active businesses
CREATE POLICY "Allow public read access to active businesses"
ON public.businesses FOR SELECT
TO public
USING (status = 'active');

-- Policy: Allow business owners to update their businesses
CREATE POLICY "Allow business owners to update their businesses"
ON public.businesses FOR UPDATE
TO authenticated
USING (owner_id = auth.uid());

-- Policy: Allow business owners to delete their businesses
CREATE POLICY "Allow business owners to delete their businesses"
ON public.businesses FOR DELETE
TO authenticated
USING (owner_id = auth.uid()); 