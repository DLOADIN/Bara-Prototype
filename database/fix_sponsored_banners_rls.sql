-- Fix RLS policies for sponsored_banners table
-- This script will make the table accessible to everyone for inserts

-- First, drop existing policies
DROP POLICY IF EXISTS "Public can view active sponsored banners" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Admins can manage sponsored banners" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Users can submit sponsored banner requests" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Users can view their own sponsored banner submissions" ON public.sponsored_banners;

-- Create new universal policies
-- Allow anyone to insert sponsored banners
CREATE POLICY "Anyone can insert sponsored banners" ON public.sponsored_banners
FOR INSERT WITH CHECK (true);

-- Allow anyone to view active banners
CREATE POLICY "Anyone can view active banners" ON public.sponsored_banners
FOR SELECT USING (is_active = true);

-- Allow admins to manage all banners
CREATE POLICY "Admins can manage all banners" ON public.sponsored_banners
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.jwt() ->> 'sub'
  )
);

-- Grant permissions to ensure access
GRANT ALL ON public.sponsored_banners TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
