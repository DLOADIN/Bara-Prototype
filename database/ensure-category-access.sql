-- ENSURE CATEGORIES ARE PUBLICLY ACCESSIBLE
-- This script creates the necessary RLS policies for categories

-- Enable RLS on categories table if not already enabled
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access to active categories" ON public.categories;

-- Create policy to allow public read access to active categories
CREATE POLICY "Allow public read access to active categories"
ON public.categories FOR SELECT
TO public
USING (is_active = true);

-- Verify the policy was created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'categories';

-- Test query to ensure categories are accessible
-- This should return all active categories
SELECT COUNT(*) as accessible_categories 
FROM public.categories 
WHERE is_active = true; 