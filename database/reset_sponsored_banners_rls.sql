-- COMPLETE RESET of sponsored_banners RLS policies
-- This script will completely remove all policies and recreate them

-- Step 1: Disable RLS temporarily
ALTER TABLE public.sponsored_banners DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (if any exist)
DROP POLICY IF EXISTS "Public can view active sponsored banners" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Admins can manage sponsored banners" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Users can submit sponsored banner requests" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Users can view their own sponsored banner submissions" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Anyone can insert sponsored banners" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Anyone can view active banners" ON public.sponsored_banners;
DROP POLICY IF EXISTS "Admins can manage all banners" ON public.sponsored_banners;

-- Step 3: Re-enable RLS
ALTER TABLE public.sponsored_banners ENABLE ROW LEVEL SECURITY;

-- Step 4: Create new, completely open policies
-- Policy 1: Allow anyone to insert (no restrictions)
CREATE POLICY "allow_anyone_insert" ON public.sponsored_banners
FOR INSERT 
WITH CHECK (true);

-- Policy 2: Allow anyone to select all banners
CREATE POLICY "allow_anyone_select" ON public.sponsored_banners
FOR SELECT 
USING (true);

-- Policy 3: Allow anyone to update
CREATE POLICY "allow_anyone_update" ON public.sponsored_banners
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Policy 4: Allow anyone to delete
CREATE POLICY "allow_anyone_delete" ON public.sponsored_banners
FOR DELETE 
USING (true);

-- Step 5: Grant explicit permissions
GRANT ALL ON public.sponsored_banners TO anon;
GRANT ALL ON public.sponsored_banners TO authenticated;
GRANT ALL ON public.sponsored_banners TO public;

-- Step 6: Grant schema usage
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO public;

-- Step 7: Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'sponsored_banners';
