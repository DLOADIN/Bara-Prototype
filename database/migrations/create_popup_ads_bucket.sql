-- Create popup-ads storage bucket
-- This script creates the storage bucket for popup ad images

-- 1) Create the bucket (public, 10MB limit, allowed image mime types)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'popup-ads',
  'popup-ads',
  true,
  10485760, -- 10 MB in bytes
  ARRAY['image/png','image/jpeg','image/jpg','image/webp','image/gif']
);

-- 2) Create permissive RLS policies on storage.objects for the bucket
-- Read
CREATE POLICY "popup ads public read" ON storage.objects FOR SELECT TO public USING (bucket_id = 'popup-ads');

-- Insert
CREATE POLICY "popup ads public insert" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'popup-ads');

-- Update
CREATE POLICY "popup ads public update" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'popup-ads');

-- Delete
CREATE POLICY "popup ads public delete" ON storage.objects FOR DELETE TO public USING (bucket_id = 'popup-ads');
