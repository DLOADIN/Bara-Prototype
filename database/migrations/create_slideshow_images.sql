-- Migration: Create slideshow images table for dynamic homepage slideshow
-- This migration creates a table to manage slideshow images with on/off toggle

-- Create slideshow_images table
CREATE TABLE IF NOT EXISTS public.slideshow_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_url text NOT NULL,
  image_alt_text text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  uploaded_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT slideshow_images_pkey PRIMARY KEY (id),
  CONSTRAINT slideshow_images_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id)
);

-- Create index for better performance on active images
CREATE INDEX IF NOT EXISTS idx_slideshow_images_active ON public.slideshow_images(is_active);
CREATE INDEX IF NOT EXISTS idx_slideshow_images_sort_order ON public.slideshow_images(sort_order);
CREATE INDEX IF NOT EXISTS idx_slideshow_images_created_at ON public.slideshow_images(created_at);

-- Add RLS policies for slideshow_images
ALTER TABLE public.slideshow_images ENABLE ROW LEVEL SECURITY;

-- Allow public to read active slideshow images
CREATE POLICY "Allow public to read active slideshow images" ON public.slideshow_images
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to read all slideshow images
CREATE POLICY "Allow authenticated users to read all slideshow images" ON public.slideshow_images
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow service role to manage all slideshow images (for admin)
CREATE POLICY "Allow service role to manage all slideshow images" ON public.slideshow_images
  FOR ALL USING (auth.role() = 'service_role');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_slideshow_images_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_slideshow_images_updated_at ON public.slideshow_images;
CREATE TRIGGER trigger_update_slideshow_images_updated_at
  BEFORE UPDATE ON public.slideshow_images
  FOR EACH ROW
  EXECUTE FUNCTION update_slideshow_images_updated_at();

-- Insert some default slideshow images (optional - you can remove this if you don't want defaults)
