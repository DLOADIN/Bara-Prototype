-- Migration: Add new business features
-- Run this script to add the new columns to existing businesses table

-- Add new business feature columns
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS has_coupons BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS accepts_orders_online BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_kid_friendly BOOLEAN DEFAULT false;

-- Create indexes for the new columns
CREATE INDEX IF NOT EXISTS idx_businesses_has_coupons ON public.businesses(has_coupons);
CREATE INDEX IF NOT EXISTS idx_businesses_accepts_orders_online ON public.businesses(accepts_orders_online);
CREATE INDEX IF NOT EXISTS idx_businesses_is_kid_friendly ON public.businesses(is_kid_friendly);

-- Update some sample businesses with the new features
UPDATE public.businesses 
SET 
    has_coupons = true,
    accepts_orders_online = true,
    is_kid_friendly = true
WHERE name ILIKE '%restaurant%' OR name ILIKE '%cafe%' OR name ILIKE '%pizza%';

UPDATE public.businesses 
SET 
    has_coupons = true,
    accepts_orders_online = false,
    is_kid_friendly = false
WHERE name ILIKE '%hotel%' OR name ILIKE '%spa%' OR name ILIKE '%salon%';

UPDATE public.businesses 
SET 
    has_coupons = false,
    accepts_orders_online = true,
    is_kid_friendly = true
WHERE name ILIKE '%playground%' OR name ILIKE '%toy%' OR name ILIKE '%child%';

-- Verify the changes
SELECT 
    name,
    has_coupons,
    accepts_orders_online,
    is_kid_friendly
FROM public.businesses 
LIMIT 10;
