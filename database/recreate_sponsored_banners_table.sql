-- COMPLETE RECREATION of sponsored_banners table
-- This will drop and recreate the entire table with proper RLS

-- Step 1: Drop the existing table completely (this will remove all policies)
DROP TABLE IF EXISTS public.sponsored_banners CASCADE;

-- Step 2: Recreate the table with the correct structure
CREATE TABLE public.sponsored_banners (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  country_id uuid NOT NULL,
  company_name text NOT NULL,
  company_website text NOT NULL,
  banner_image_url text NOT NULL,
  banner_alt_text text,
  is_active boolean DEFAULT false,
  submitted_by_user_id uuid,
  payment_status text DEFAULT 'pending'::text,
  payment_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sponsored_banners_pkey PRIMARY KEY (id),
  CONSTRAINT sponsored_banners_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id)
);

-- Step 3: Create unique constraint for one active banner per country
CREATE UNIQUE INDEX unique_active_banner_per_country
ON public.sponsored_banners (country_id)
WHERE is_active = true;

-- Step 4: Enable RLS
ALTER TABLE public.sponsored_banners ENABLE ROW LEVEL SECURITY;

-- Step 5: Create completely open policies for all CRUD operations
-- Allow anyone to insert
CREATE POLICY "insert_anyone" ON public.sponsored_banners
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to select all banners
CREATE POLICY "select_anyone" ON public.sponsored_banners
FOR SELECT 
USING (true);

-- Allow anyone to update
CREATE POLICY "update_anyone" ON public.sponsored_banners
FOR UPDATE 
USING (true)
WITH CHECK (true);

-- Allow anyone to delete
CREATE POLICY "delete_anyone" ON public.sponsored_banners
FOR DELETE 
USING (true);

-- Step 6: Grant permissions
GRANT ALL ON public.sponsored_banners TO anon, authenticated, public;
GRANT USAGE ON SCHEMA public TO anon, authenticated, public;

-- Step 7: Test insert (this should work now)
-- INSERT INTO public.sponsored_banners (country_id, company_name, company_website, banner_image_url) 
-- VALUES ('some-uuid', 'Test Company', 'https://test.com', 'https://test.com/banner.jpg');
