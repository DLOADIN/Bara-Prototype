-- Migration: Add Sponsored Advertising Features
-- Run this script to add sponsored advertising capabilities to existing database

-- Add is_sponsored_ad column to businesses table
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS is_sponsored_ad BOOLEAN DEFAULT false;

-- First, ensure extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Then try creating just the table
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    campaign_name TEXT NOT NULL,
    campaign_type TEXT NOT NULL DEFAULT 'featured_listing',
    target_cities TEXT[],
    target_categories TEXT[],
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    budget DECIMAL(10, 2) NOT NULL,
    spent_amount DECIMAL(10, 2) DEFAULT 0,
    daily_budget_limit DECIMAL(10, 2),
    is_active BOOLEAN DEFAULT false,
    admin_approved BOOLEAN DEFAULT false,
    admin_notes TEXT,
    performance_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
-- Use CONCURRENTLY to avoid table locks during index creation
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_businesses_is_sponsored_ad 
ON public.businesses(is_sponsored_ad);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ad_campaigns_business_id 
ON public.ad_campaigns(business_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ad_campaigns_is_active 
ON public.ad_campaigns(is_active);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_ad_campaigns_admin_approved 
ON public.ad_campaigns(admin_approved);

-- Create trigger function with more robust error handling
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW IS DISTINCT FROM OLD THEN
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger with additional safety checks
CREATE TRIGGER update_ad_campaigns_updated_at 
    BEFORE UPDATE ON public.ad_campaigns 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Safer update with error handling
WITH sponsored_businesses AS (
    SELECT id 
    FROM public.businesses 
    WHERE name ILIKE '%restaurant%' OR name ILIKE '%hotel%' 
    LIMIT 5
)
UPDATE public.businesses b
SET is_sponsored_ad = true 
FROM sponsored_businesses sb
WHERE b.id = sb.id;

-- Insert first campaign with proper syntax
INSERT INTO public.ad_campaigns (
    business_id,
    campaign_name,
    campaign_type,
    target_cities,
    target_categories,
    start_date,
    end_date,
    budget,
    is_active,
    admin_approved
)
SELECT 
    eb.id,
    'Summer Restaurant Promotion',
    'featured_listing',
    ARRAY['kigali', 'nairobi', 'kampala'],
    ARRAY['restaurant', 'food'],
    NOW(),
    NOW() + INTERVAL '30 days',
    500.00,
    true,
    true
FROM (
    SELECT id 
    FROM public.businesses 
    WHERE is_sponsored_ad = true 
    LIMIT 1
) eb
WHERE eb.id IS NOT NULL;

-- Insert second campaign with proper syntax
INSERT INTO public.ad_campaigns (
    business_id,
    campaign_name,
    campaign_type,
    target_cities,
    target_categories,
    start_date,
    end_date,
    budget,
    is_active,
    admin_approved
)
SELECT 
    eb.id,
    'Hotel Booking Campaign',
    'featured_listing',
    ARRAY['dar-es-salaam', 'addis-ababa'],
    ARRAY['hotel', 'accommodation'],
    NOW(),
    NOW() + INTERVAL '60 days',
    750.00,
    true,
    true
FROM (
    SELECT id 
    FROM public.businesses 
    WHERE is_sponsored_ad = true 
    LIMIT 1 OFFSET 1
) eb
WHERE eb.id IS NOT NULL;

-- Verification queries with more informative output
DO $$
DECLARE 
    sponsored_count INTEGER;
    active_campaigns_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO sponsored_count 
    FROM public.businesses 
    WHERE is_sponsored_ad = true;

    SELECT COUNT(*) INTO active_campaigns_count 
    FROM public.ad_campaigns 
    WHERE is_active = true AND admin_approved = true;

    RAISE NOTICE 'Businesses with sponsored ads: %', sponsored_count;
    RAISE NOTICE 'Active ad campaigns: %', active_campaigns_count;
END $$;
