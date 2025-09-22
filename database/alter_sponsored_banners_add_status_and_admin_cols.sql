-- Bring sponsored_banners in line with the app's expectations
-- Adds: status, admin_notes, payment_reference, approved_at, approved_by
-- Safe to run multiple times

DO $$
BEGIN
  -- status text DEFAULT 'pending'
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='sponsored_banners' AND column_name='status'
  ) THEN
    ALTER TABLE public.sponsored_banners
      ADD COLUMN status text DEFAULT 'pending';
  END IF;

  -- admin_notes text
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='sponsored_banners' AND column_name='admin_notes'
  ) THEN
    ALTER TABLE public.sponsored_banners
      ADD COLUMN admin_notes text;
  END IF;

  -- payment_reference text
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='sponsored_banners' AND column_name='payment_reference'
  ) THEN
    ALTER TABLE public.sponsored_banners
      ADD COLUMN payment_reference text;
  END IF;

  -- approved_at timestamptz
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='sponsored_banners' AND column_name='approved_at'
  ) THEN
    ALTER TABLE public.sponsored_banners
      ADD COLUMN approved_at timestamp with time zone;
  END IF;

  -- approved_by text
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema='public' AND table_name='sponsored_banners' AND column_name='approved_by'
  ) THEN
    ALTER TABLE public.sponsored_banners
      ADD COLUMN approved_by text;
  END IF;
END $$;


