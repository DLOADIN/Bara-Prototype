-- Create sponsored_banners table
CREATE TABLE public.sponsored_banners (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  company_name text NOT NULL,
  company_website text NOT NULL,
  banner_image_url text NOT NULL,
  banner_alt_text text,
  country_id uuid NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_amount numeric DEFAULT 25.00,
  payment_reference text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'active', 'inactive')),
  admin_notes text,
  approved_by uuid,
  approved_at timestamp with time zone,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  click_count integer DEFAULT 0,
  view_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sponsored_banners_pkey PRIMARY KEY (id),
  CONSTRAINT sponsored_banners_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id),
  CONSTRAINT sponsored_banners_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.admin_users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_sponsored_banners_country_id ON public.sponsored_banners(country_id);
CREATE INDEX idx_sponsored_banners_status ON public.sponsored_banners(status);
CREATE INDEX idx_sponsored_banners_payment_status ON public.sponsored_banners(payment_status);
CREATE INDEX idx_sponsored_banners_created_at ON public.sponsored_banners(created_at);

-- Create RLS policies
ALTER TABLE public.sponsored_banners ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to active banners
CREATE POLICY "Public can view active sponsored banners" ON public.sponsored_banners
  FOR SELECT USING (status = 'active' AND payment_status = 'paid');

-- Policy for admin full access
CREATE POLICY "Admins can manage sponsored banners" ON public.sponsored_banners
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.jwt() ->> 'sub'
    )
  );

-- Policy for users to insert their own submissions
CREATE POLICY "Users can submit sponsored banner requests" ON public.sponsored_banners
  FOR INSERT WITH CHECK (true);

-- Policy for users to view their own submissions
CREATE POLICY "Users can view their own sponsored banner submissions" ON public.sponsored_banners
  FOR SELECT USING (
    contact_email = auth.jwt() ->> 'email' OR
    EXISTS (
      SELECT 1 FROM public.admin_users 
      WHERE admin_users.user_id = auth.jwt() ->> 'sub'
    )
  );

-- Create a function to ensure only one active banner per country
CREATE OR REPLACE FUNCTION ensure_single_active_banner_per_country()
RETURNS TRIGGER AS $$
BEGIN
  -- If the new banner is being set to active, deactivate all other banners for the same country
  IF NEW.status = 'active' AND NEW.payment_status = 'paid' THEN
    UPDATE public.sponsored_banners 
    SET status = 'inactive', updated_at = now()
    WHERE country_id = NEW.country_id 
      AND id != NEW.id 
      AND status = 'active';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce single active banner per country
CREATE TRIGGER trigger_ensure_single_active_banner
  BEFORE INSERT OR UPDATE ON public.sponsored_banners
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_active_banner_per_country();

-- Create a view for active banners with country information
CREATE VIEW public.active_sponsored_banners AS
SELECT 
  sb.*,
  c.name as country_name,
  c.code as country_code,
  c.flag_url as country_flag_url
FROM public.sponsored_banners sb
JOIN public.countries c ON sb.country_id = c.id
WHERE sb.status = 'active' 
  AND sb.payment_status = 'paid'
  AND (sb.end_date IS NULL OR sb.end_date > now())
  AND (sb.start_date IS NULL OR sb.start_date <= now());

-- Grant permissions
GRANT SELECT ON public.active_sponsored_banners TO anon, authenticated;
GRANT ALL ON public.sponsored_banners TO authenticated;


