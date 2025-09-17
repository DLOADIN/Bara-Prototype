-- QUICK FIX: Allow anyone to do all CRUD operations on sponsored_banners
-- Run this in Supabase SQL Editor

-- Disable RLS temporarily
ALTER TABLE public.sponsored_banners DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Public can view active sponsored banners" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Admins can manage sponsored banners" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Users can submit sponsored banner requests" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Users can view their own sponsored banner submissions" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Anyone can insert sponsored banners" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Anyone can view active banners" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Admins can manage all banners" ON public.sponsored_banners;
DROP POLICY IF EXISTS "allow_anyone_insert" ON public.sponsored_banners;
DROP POLICY IF EXISTS "allow_anyone_select" ON public.sponsored_banners;
DROP POLICY IF EXISTS "allow_anyone_update" ON public.sponsored_banners;
DROP POLICY IF EXISTS "allow_anyone_delete" ON public.sponsored_banners;
DROP POLICY IF EXISTS "insert_anyone" ON public.sponsored_banners;
DROP POLICY IF EXISTS "select_anyone" ON public.sponsored_banners;
DROP POLICY IF EXISTS "update_anyone" ON public.sponsored_banners;
DROP POLICY IF EXISTS "delete_anyone" ON public.sponsored_banners;

-- Re-enable RLS
ALTER TABLE public.sponsored_banners ENABLE ROW LEVEL SECURITY;

-- Create completely open policies for all CRUD operations
CREATE POLICY "open_insert" ON public.sponsored_banners FOR INSERT WITH CHECK (true);
CREATE POLICY "open_select" ON public.sponsored_banners FOR SELECT USING (true);
CREATE POLICY "open_update" ON public.sponsored_banners FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "open_delete" ON public.sponsored_banners FOR DELETE USING (true);

-- Grant all permissions
GRANT ALL ON public.sponsored_banners TO anon, authenticated, public;
GRANT USAGE ON SCHEMA public TO anon, authenticated, public;
