-- Add missing payment_amount column to sponsored_banners to fix PGRST204
-- Safe to run multiple times

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'sponsored_banners'
      AND column_name  = 'payment_amount'
  ) THEN
    ALTER TABLE public.sponsored_banners
      ADD COLUMN payment_amount numeric;
  END IF;
END $$;

-- Optional: grant usage if needed (usually covered by existing policies/roles)
-- GRANT SELECT, INSERT, UPDATE ON public.sponsored_banners TO anon, authenticated;


