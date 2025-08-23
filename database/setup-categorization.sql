-- =============================================
-- MASTER CATEGORIZATION SETUP SCRIPT
-- =============================================
-- This script runs all the necessary steps to ensure
-- proper business categorization in your Bara App

-- =============================================
-- STEP 1: VERIFY CURRENT STATE
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=== STEP 1: VERIFYING CURRENT STATE ===';
END $$;

-- Check current categories
SELECT 'Current Categories' as check_type, COUNT(*) as count
FROM public.categories 
WHERE is_active = true;

-- Check current businesses
SELECT 'Current Active Businesses' as check_type, COUNT(*) as count
FROM public.businesses 
WHERE status = 'active';

-- Check uncategorized businesses
SELECT 'Uncategorized Businesses' as check_type, COUNT(*) as count
FROM public.businesses 
WHERE category_id IS NULL AND status = 'active';

-- =============================================
-- STEP 2: ENSURE ALL CATEGORIES EXIST
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=== STEP 2: ENSURING ALL CATEGORIES EXIST ===';
END $$;

-- Insert core categories if they don't exist
INSERT INTO public.categories (name, slug, icon, description, sort_order, is_active) VALUES
('Restaurants', 'restaurants', 'utensils-crossed', 'Restaurants and dining establishments', 1, true),
('Hotels', 'hotels', 'bed', 'Hotels and accommodation', 2, true),
('Banks', 'banks', 'building', 'Banking and financial institutions', 3, true),
('Hospitals', 'hospitals', 'hospital', 'Hospitals and medical centers', 4, true),
('Schools', 'schools', 'graduation-cap', 'Educational institutions', 5, true),
('Shopping', 'shopping', 'shopping-bag', 'Shopping centers and retail', 6, true),
('Dentists', 'dentists', 'stethoscope', 'Dental care services', 7, true),
('Auto Repair', 'auto-repair', 'wrench', 'Automotive repair and maintenance', 8, true),
('Lawyers', 'lawyers', 'scale', 'Legal services and attorneys', 9, true),
('Pharmacies', 'pharmacies', 'pill', 'Pharmacies and drug stores', 10, true),
('Museums', 'museums', 'building-2', 'Cultural and historical museums', 11, true),
('Coffee Shops', 'coffee-shops', 'coffee', 'Specialty coffee and cafes', 12, true),
('Gyms & Fitness', 'gyms-fitness', 'dumbbell', 'Fitness centers and gyms', 13, true),
('Beauty Salons', 'beauty-salons', 'scissors', 'Hair and beauty services', 14, true),
('Pet Services', 'pet-services', 'heart', 'Pet care and veterinary services', 15, true),
('Airports', 'airports', 'plane', 'Airports and aviation services', 16, true),
('Bars', 'bars', 'wine', 'Bars and pubs', 17, true),
('Clinics', 'clinics', 'stethoscope', 'Medical clinics and health centers', 18, true),
('Real Estate', 'real-estate', 'home', 'Real estate agencies and properties', 19, true),
('Transportation', 'transportation', 'truck', 'Transport and logistics services', 20, true)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- STEP 3: AUTO-CATEGORIZE BUSINESSES
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=== STEP 3: AUTO-CATEGORIZING BUSINESSES ===';
END $$;

-- Create the auto-categorization function
CREATE OR REPLACE FUNCTION auto_categorize_businesses()
RETURNS void AS $$
BEGIN
    -- Restaurants
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'restaurants')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%restaurant%' OR
        LOWER(name) LIKE '%kitchen%' OR
        LOWER(name) LIKE '%cafe%' OR
        LOWER(name) LIKE '%bistro%' OR
        LOWER(name) LIKE '%dining%' OR
        LOWER(name) LIKE '%food%' OR
        LOWER(name) LIKE '%eat%' OR
        LOWER(name) LIKE '%grill%' OR
        LOWER(name) LIKE '%pizza%' OR
        LOWER(name) LIKE '%burger%'
    );

    -- Hotels
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'hotels')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%hotel%' OR
        LOWER(name) LIKE '%lodge%' OR
        LOWER(name) LIKE '%inn%' OR
        LOWER(name) LIKE '%resort%' OR
        LOWER(name) LIKE '%guesthouse%' OR
        LOWER(name) LIKE '%accommodation%'
    );

    -- Banks
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'banks')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%bank%' OR
        LOWER(name) LIKE '%finance%' OR
        LOWER(name) LIKE '%credit%' OR
        LOWER(name) LIKE '%savings%'
    );

    -- Hospitals
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'hospitals')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%hospital%' OR
        LOWER(name) LIKE '%medical center%' OR
        LOWER(name) LIKE '%health center%'
    );

    -- Schools
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'schools')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%school%' OR
        LOWER(name) LIKE '%academy%' OR
        LOWER(name) LIKE '%college%' OR
        LOWER(name) LIKE '%institute%'
    );

    -- Dentists
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'dentists')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%dental%' OR
        LOWER(name) LIKE '%dentist%' OR
        LOWER(name) LIKE '%orthodontist%'
    );

    -- Auto Repair
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'auto-repair')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%auto%' OR
        LOWER(name) LIKE '%car%' OR
        LOWER(name) LIKE '%mechanic%' OR
        LOWER(name) LIKE '%garage%' OR
        LOWER(name) LIKE '%repair%'
    );

    -- Lawyers
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'lawyers')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%law%' OR
        LOWER(name) LIKE '%attorney%' OR
        LOWER(name) LIKE '%legal%' OR
        LOWER(name) LIKE '%advocate%'
    );

    -- Pharmacies
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'pharmacies')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%pharmacy%' OR
        LOWER(name) LIKE '%drugstore%' OR
        LOWER(name) LIKE '%chemist%'
    );

    -- Museums
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'museums')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%museum%' OR
        LOWER(name) LIKE '%gallery%' OR
        LOWER(name) LIKE '%exhibition%'
    );

    -- Coffee Shops
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'coffee-shops')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%coffee%' OR
        LOWER(name) LIKE '%espresso%' OR
        LOWER(name) LIKE '%cafe%'
    );

    -- Gyms & Fitness
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'gyms-fitness')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%gym%' OR
        LOWER(name) LIKE '%fitness%' OR
        LOWER(name) LIKE '%workout%' OR
        LOWER(name) LIKE '%health club%'
    );

    -- Beauty Salons
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'beauty-salons')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%salon%' OR
        LOWER(name) LIKE '%beauty%' OR
        LOWER(name) LIKE '%spa%' OR
        LOWER(name) LIKE '%hair%'
    );

    -- Pet Services
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'pet-services')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%pet%' OR
        LOWER(name) LIKE '%veterinary%' OR
        LOWER(name) LIKE '%animal%' OR
        LOWER(name) LIKE '%vet%'
    );

    -- Airports
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'airports')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%airport%' OR
        LOWER(name) LIKE '%aviation%'
    );

    -- Bars
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'bars')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%bar%' OR
        LOWER(name) LIKE '%pub%' OR
        LOWER(name) LIKE '%nightclub%'
    );

    -- Clinics
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'clinics')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%clinic%' OR
        LOWER(name) LIKE '%medical%' OR
        LOWER(name) LIKE '%health%'
    );

    -- Real Estate
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'real-estate')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%real estate%' OR
        LOWER(name) LIKE '%property%' OR
        LOWER(name) LIKE '%housing%'
    );

    -- Transportation
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'transportation')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%transport%' OR
        LOWER(name) LIKE '%taxi%' OR
        LOWER(name) LIKE '%bus%' OR
        LOWER(name) LIKE '%shuttle%'
    );

    -- Shopping (default for retail businesses)
    UPDATE public.businesses 
    SET category_id = (SELECT id FROM public.categories WHERE slug = 'shopping')
    WHERE category_id IS NULL 
    AND status = 'active'
    AND (
        LOWER(name) LIKE '%shop%' OR
        LOWER(name) LIKE '%store%' OR
        LOWER(name) LIKE '%market%' OR
        LOWER(name) LIKE '%mall%'
    );

END;
$$ LANGUAGE plpgsql;

-- Execute the auto-categorization function
SELECT auto_categorize_businesses();

-- =============================================
-- STEP 4: CREATE PERFORMANCE INDEXES
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=== STEP 4: CREATING PERFORMANCE INDEXES ===';
END $$;

-- Create composite index for category-based queries
CREATE INDEX IF NOT EXISTS idx_businesses_category_status ON public.businesses(category_id, status);

-- Create index for category slug lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug_active ON public.categories(slug, is_active);

-- Create index for city-based queries
CREATE INDEX IF NOT EXISTS idx_businesses_city_status ON public.businesses(city_id, status);

-- =============================================
-- STEP 5: VERIFY RESULTS
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=== STEP 5: VERIFYING RESULTS ===';
END $$;

-- Check remaining uncategorized businesses
SELECT 'Remaining Uncategorized Businesses' as status, COUNT(*) as count
FROM public.businesses 
WHERE category_id IS NULL AND status = 'active';

-- Show business count by category
SELECT 
    c.slug,
    c.name as category_name,
    COUNT(b.id) as business_count
FROM public.categories c
LEFT JOIN public.businesses b ON c.id = b.category_id AND b.status = 'active'
WHERE c.is_active = true
GROUP BY c.id, c.slug, c.name
ORDER BY business_count DESC, c.sort_order;

-- =============================================
-- STEP 6: FINAL SUMMARY
-- =============================================

DO $$
BEGIN
    RAISE NOTICE '=== STEP 6: FINAL SUMMARY ===';
END $$;

-- Final summary
SELECT 
    'Total Categories' as metric,
    COUNT(*) as count
FROM public.categories 
WHERE is_active = true

UNION ALL

SELECT 
    'Total Active Businesses' as metric,
    COUNT(*) as count
FROM public.businesses 
WHERE status = 'active'

UNION ALL

SELECT 
    'Categorized Businesses' as metric,
    COUNT(*) as count
FROM public.businesses 
WHERE status = 'active' AND category_id IS NOT NULL

UNION ALL

SELECT 
    'Uncategorized Businesses' as metric,
    COUNT(*) as count
FROM public.businesses 
WHERE status = 'active' AND category_id IS NULL;

DO $$
BEGIN
    RAISE NOTICE '=== CATEGORIZATION SETUP COMPLETE ===';
    RAISE NOTICE 'Your businesses should now be properly categorized!';
    RAISE NOTICE 'Test the setup by running: database/test-categorization.sql';
END $$;
