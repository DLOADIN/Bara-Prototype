-- =============================================
-- VERIFY AND FIX BUSINESS CATEGORIZATION
-- =============================================
-- This script ensures all businesses are properly categorized
-- and provides queries to verify the categorization

-- =============================================
-- 1. VERIFY CATEGORIES EXIST
-- =============================================

-- Check if all expected categories exist
SELECT 'Categories Check' as check_type, COUNT(*) as count, 'Expected: 20+ categories' as expected
FROM public.categories 
WHERE is_active = true;

-- List all active categories
SELECT slug, name, sort_order 
FROM public.categories 
WHERE is_active = true 
ORDER BY sort_order;

-- =============================================
-- 2. VERIFY BUSINESS CATEGORIZATION
-- =============================================

-- Check businesses without categories
SELECT 'Uncategorized Businesses' as issue_type, COUNT(*) as count
FROM public.businesses 
WHERE category_id IS NULL AND status = 'active';

-- List uncategorized businesses
SELECT id, name, slug, status
FROM public.businesses 
WHERE category_id IS NULL AND status = 'active';

-- Check businesses with invalid category references
SELECT 'Invalid Category References' as issue_type, COUNT(*) as count
FROM public.businesses b
LEFT JOIN public.categories c ON b.category_id = c.id
WHERE b.category_id IS NOT NULL AND c.id IS NULL AND b.status = 'active';

-- List businesses with invalid category references
SELECT b.id, b.name, b.slug, b.category_id, b.status
FROM public.businesses b
LEFT JOIN public.categories c ON b.category_id = c.id
WHERE b.category_id IS NOT NULL AND c.id IS NULL AND b.status = 'active';

-- =============================================
-- 3. BUSINESS COUNT BY CATEGORY
-- =============================================

-- Show business count per category
SELECT 
    c.slug,
    c.name,
    COUNT(b.id) as business_count
FROM public.categories c
LEFT JOIN public.businesses b ON c.id = b.category_id AND b.status = 'active'
WHERE c.is_active = true
GROUP BY c.id, c.slug, c.name
ORDER BY business_count DESC, c.sort_order;

-- =============================================
-- 4. AUTO-CATEGORIZE BUSINESSES BY NAME
-- =============================================

-- Function to auto-categorize businesses based on their names
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

-- =============================================
-- 5. RUN AUTO-CATEGORIZATION
-- =============================================

-- Execute the auto-categorization function
SELECT auto_categorize_businesses();

-- =============================================
-- 6. VERIFY RESULTS AFTER AUTO-CATEGORIZATION
-- =============================================

-- Check remaining uncategorized businesses
SELECT 'Remaining Uncategorized' as status, COUNT(*) as count
FROM public.businesses 
WHERE category_id IS NULL AND status = 'active';

-- Final business count by category
SELECT 
    c.slug,
    c.name,
    COUNT(b.id) as business_count
FROM public.categories c
LEFT JOIN public.businesses b ON c.id = b.category_id AND b.status = 'active'
WHERE c.is_active = true
GROUP BY c.id, c.slug, c.name
ORDER BY business_count DESC, c.sort_order;

-- =============================================
-- 7. CREATE INDEXES FOR BETTER PERFORMANCE
-- =============================================

-- Create composite index for category-based queries
CREATE INDEX IF NOT EXISTS idx_businesses_category_status ON public.businesses(category_id, status);

-- Create index for category slug lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug_active ON public.categories(slug, is_active);

-- =============================================
-- 8. VERIFICATION QUERIES FOR TESTING
-- =============================================

-- Test query: Get restaurants in Kigali
SELECT 
    b.name,
    b.slug,
    c.name as category_name,
    ci.name as city_name
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
JOIN public.cities ci ON b.city_id = ci.id
WHERE c.slug = 'restaurants' 
AND ci.name = 'Kigali'
AND b.status = 'active'
ORDER BY b.is_premium DESC, b.created_at DESC;

-- Test query: Get all businesses by category
SELECT 
    c.slug,
    c.name as category_name,
    COUNT(b.id) as business_count,
    STRING_AGG(b.name, ', ' ORDER BY b.name) as business_names
FROM public.categories c
LEFT JOIN public.businesses b ON c.id = b.category_id AND b.status = 'active'
WHERE c.is_active = true
GROUP BY c.id, c.slug, c.name
ORDER BY business_count DESC, c.sort_order;
