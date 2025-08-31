-- Allow anonymous reviews by modifying the reviews table
-- This script makes user_id nullable and removes the foreign key constraint

-- First, drop the existing foreign key constraint
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- Make user_id nullable
ALTER TABLE public.reviews ALTER COLUMN user_id DROP NOT NULL;

-- Add a comment to document the change
COMMENT ON COLUMN public.reviews.user_id IS 'User ID for authenticated users, NULL for anonymous reviews';

-- Optional: Add a check constraint to ensure user_id is either null or a valid UUID
ALTER TABLE public.reviews ADD CONSTRAINT reviews_user_id_check 
CHECK (user_id IS NULL OR user_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');

-- Update existing reviews that might have invalid user_id references
-- This is optional and only needed if you have existing data issues
-- UPDATE public.reviews SET user_id = NULL WHERE user_id NOT IN (SELECT id FROM public.users);
