-- Enhanced Reviews Schema to Support Anonymous Reviews
-- This script adds support for anonymous reviews with optional reviewer information

-- First, drop the existing foreign key constraint
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;

-- Make user_id nullable
ALTER TABLE public.reviews ALTER COLUMN user_id DROP NOT NULL;

-- Add new columns for anonymous reviewer information
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS reviewer_name text;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS reviewer_email text;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS is_anonymous boolean DEFAULT false;

-- Add a comment to document the changes
COMMENT ON COLUMN public.reviews.user_id IS 'User ID for authenticated users, NULL for anonymous reviews';
COMMENT ON COLUMN public.reviews.reviewer_name IS 'Name provided by anonymous reviewer (optional)';
COMMENT ON COLUMN public.reviews.reviewer_email IS 'Email provided by anonymous reviewer (optional)';
COMMENT ON COLUMN public.reviews.is_anonymous IS 'Flag indicating if this is an anonymous review';

-- Add a check constraint to ensure user_id is either null or a valid UUID
ALTER TABLE public.reviews DROP CONSTRAINT IF EXISTS reviews_user_id_check;
ALTER TABLE public.reviews ADD CONSTRAINT reviews_user_id_check 
CHECK (user_id IS NULL OR user_id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$');

-- Add a check constraint to ensure either user_id or reviewer_name is provided
ALTER TABLE public.reviews ADD CONSTRAINT reviews_reviewer_info_check 
CHECK (
  (user_id IS NOT NULL) OR 
  (user_id IS NULL AND (reviewer_name IS NOT NULL OR is_anonymous = true))
);

-- Create an index for better performance on anonymous reviews
CREATE INDEX IF NOT EXISTS idx_reviews_anonymous ON public.reviews(is_anonymous) WHERE is_anonymous = true;

-- Create an index for reviewer name searches
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_name ON public.reviews(reviewer_name) WHERE reviewer_name IS NOT NULL;

-- Update existing reviews to set is_anonymous flag
UPDATE public.reviews SET is_anonymous = true WHERE user_id IS NULL;

-- Add a trigger to automatically set is_anonymous flag
CREATE OR REPLACE FUNCTION set_anonymous_flag()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NULL THEN
    NEW.is_anonymous = true;
  ELSE
    NEW.is_anonymous = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_set_anonymous_flag ON public.reviews;
CREATE TRIGGER trigger_set_anonymous_flag
  BEFORE INSERT OR UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION set_anonymous_flag();
