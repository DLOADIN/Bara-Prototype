-- Drop existing table and recreate with simplified schema
DROP TABLE IF EXISTS public.sponsored_banners CASCADE;

-- Create sponsored_banners table with simplified schema
CREATE TABLE public.sponsored_banners (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  country_id uuid NOT NULL,
  company_name text NOT NULL,
  company_website text NOT NULL,
  banner_image_url text NOT NULL,
  banner_alt_text text,
  is_active boolean DEFAULT false,
  submitted_by_user_id uuid,
  payment_status text DEFAULT 'pending'::text, -- e.g., 'pending', 'paid', 'failed'
  payment_id text, -- Stripe Payment Intent ID or similar
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sponsored_banners_pkey PRIMARY KEY (id),
  CONSTRAINT sponsored_banners_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id),
  CONSTRAINT sponsored_banners_submitted_by_user_id_fkey FOREIGN KEY (submitted_by_user_id) REFERENCES public.users(id)
);

-- Ensure only one active banner per country
CREATE UNIQUE INDEX IF NOT EXISTS unique_active_banner_per_country
ON public.sponsored_banners (country_id)
WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.sponsored_banners ENABLE ROW LEVEL SECURITY;

-- Universal policies - allow anyone to insert, read active banners, and admins to manage all
CREATE POLICY "Anyone can insert sponsored banners" ON public.sponsored_banners
FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view active banners" ON public.sponsored_banners
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage all banners" ON public.sponsored_banners
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admin_users 
    WHERE admin_users.user_id = auth.jwt() ->> 'sub'
  )
);

-- Grant permissions
GRANT ALL ON public.sponsored_banners TO anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated;
