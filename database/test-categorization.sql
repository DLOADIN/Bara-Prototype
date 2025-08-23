-- =============================================
-- TEST BUSINESS CATEGORIZATION
-- =============================================
-- This script tests that businesses are properly categorized
-- and that category-based queries work correctly

-- =============================================
-- 1. TEST CATEGORY QUERIES
-- =============================================

-- Test 1: Get all restaurants
SELECT 'Test 1: Restaurants' as test_name;
SELECT 
    b.name,
    b.slug,
    c.name as category_name,
    ci.name as city_name,
    co.name as country_name
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
JOIN public.cities ci ON b.city_id = ci.id
JOIN public.countries co ON b.country_id = co.id
WHERE c.slug = 'restaurants' 
AND b.status = 'active'
ORDER BY b.is_premium DESC, b.name;

-- Test 2: Get all hotels
SELECT 'Test 2: Hotels' as test_name;
SELECT 
    b.name,
    b.slug,
    c.name as category_name,
    ci.name as city_name,
    co.name as country_name
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
JOIN public.cities ci ON b.city_id = ci.id
JOIN public.countries co ON b.country_id = co.id
WHERE c.slug = 'hotels' 
AND b.status = 'active'
ORDER BY b.is_premium DESC, b.name;

-- Test 3: Get all banks
SELECT 'Test 3: Banks' as test_name;
SELECT 
    b.name,
    b.slug,
    c.name as category_name,
    ci.name as city_name,
    co.name as country_name
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
JOIN public.cities ci ON b.city_id = ci.id
JOIN public.countries co ON b.country_id = co.id
WHERE c.slug = 'banks' 
AND b.status = 'active'
ORDER BY b.is_premium DESC, b.name;

-- Test 4: Get all hospitals
SELECT 'Test 4: Hospitals' as test_name;
SELECT 
    b.name,
    b.slug,
    c.name as category_name,
    ci.name as city_name,
    co.name as country_name
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
JOIN public.cities ci ON b.city_id = ci.id
JOIN public.countries co ON b.country_id = co.id
WHERE c.slug = 'hospitals' 
AND b.status = 'active'
ORDER BY b.is_premium DESC, b.name;

-- =============================================
-- 2. TEST CITY-SPECIFIC CATEGORY QUERIES
-- =============================================

-- Test 5: Get restaurants in Kigali
SELECT 'Test 5: Restaurants in Kigali' as test_name;
SELECT 
    b.name,
    b.slug,
    c.name as category_name,
    ci.name as city_name,
    co.name as country_name
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
JOIN public.cities ci ON b.city_id = ci.id
JOIN public.countries co ON b.country_id = co.id
WHERE c.slug = 'restaurants' 
AND ci.name = 'Kigali'
AND b.status = 'active'
ORDER BY b.is_premium DESC, b.name;

-- Test 6: Get hotels in Nairobi
SELECT 'Test 6: Hotels in Nairobi' as test_name;
SELECT 
    b.name,
    b.slug,
    c.name as category_name,
    ci.name as city_name,
    co.name as country_name
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
JOIN public.cities ci ON b.city_id = ci.id
JOIN public.countries co ON b.country_id = co.id
WHERE c.slug = 'hotels' 
AND ci.name = 'Nairobi'
AND b.status = 'active'
ORDER BY b.is_premium DESC, b.name;

-- =============================================
-- 3. TEST CATEGORY COUNTS
-- =============================================

-- Test 7: Count businesses by category
SELECT 'Test 7: Business Count by Category' as test_name;
SELECT 
    c.slug,
    c.name as category_name,
    COUNT(b.id) as business_count,
    COUNT(CASE WHEN b.is_premium = true THEN 1 END) as premium_count,
    COUNT(CASE WHEN b.is_verified = true THEN 1 END) as verified_count
FROM public.categories c
LEFT JOIN public.businesses b ON c.id = b.category_id AND b.status = 'active'
WHERE c.is_active = true
GROUP BY c.id, c.slug, c.name
ORDER BY business_count DESC, c.sort_order;

-- =============================================
-- 4. TEST SEARCH FUNCTIONALITY
-- =============================================

-- Test 8: Search for restaurants
SELECT 'Test 8: Search for "restaurant"' as test_name;
SELECT 
    b.name,
    b.slug,
    c.name as category_name,
    ci.name as city_name
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
JOIN public.cities ci ON b.city_id = ci.id
WHERE (b.name ILIKE '%restaurant%' OR b.description ILIKE '%restaurant%')
AND b.status = 'active'
ORDER BY b.is_premium DESC, b.name;

-- Test 9: Search for hotels
SELECT 'Test 9: Search for "hotel"' as test_name;
SELECT 
    b.name,
    b.slug,
    c.name as category_name,
    ci.name as city_name
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
JOIN public.cities ci ON b.city_id = ci.id
WHERE (b.name ILIKE '%hotel%' OR b.description ILIKE '%hotel%')
AND b.status = 'active'
ORDER BY b.is_premium DESC, b.name;

-- =============================================
-- 5. TEST PREMIUM AND VERIFIED BUSINESSES
-- =============================================

-- Test 10: Premium businesses by category
SELECT 'Test 10: Premium Businesses by Category' as test_name;
SELECT 
    c.slug,
    c.name as category_name,
    COUNT(b.id) as premium_count,
    STRING_AGG(b.name, ', ' ORDER BY b.name) as premium_businesses
FROM public.categories c
LEFT JOIN public.businesses b ON c.id = b.category_id AND b.status = 'active' AND b.is_premium = true
WHERE c.is_active = true
GROUP BY c.id, c.slug, c.name
HAVING COUNT(b.id) > 0
ORDER BY premium_count DESC;

-- Test 11: Verified businesses by category
SELECT 'Test 11: Verified Businesses by Category' as test_name;
SELECT 
    c.slug,
    c.name as category_name,
    COUNT(b.id) as verified_count,
    STRING_AGG(b.name, ', ' ORDER BY b.name) as verified_businesses
FROM public.categories c
LEFT JOIN public.businesses b ON c.id = b.category_id AND b.status = 'active' AND b.is_verified = true
WHERE c.is_active = true
GROUP BY c.id, c.slug, c.name
HAVING COUNT(b.id) > 0
ORDER BY verified_count DESC;

-- =============================================
-- 6. TEST DATA INTEGRITY
-- =============================================

-- Test 12: Check for businesses without categories
SELECT 'Test 12: Uncategorized Businesses' as test_name;
SELECT 
    b.id,
    b.name,
    b.slug,
    b.status,
    ci.name as city_name
FROM public.businesses b
LEFT JOIN public.cities ci ON b.city_id = ci.id
WHERE b.category_id IS NULL 
AND b.status = 'active'
ORDER BY b.name;

-- Test 13: Check for invalid category references
SELECT 'Test 13: Invalid Category References' as test_name;
SELECT 
    b.id,
    b.name,
    b.slug,
    b.category_id,
    b.status
FROM public.businesses b
LEFT JOIN public.categories c ON b.category_id = c.id
WHERE b.category_id IS NOT NULL 
AND c.id IS NULL 
AND b.status = 'active'
ORDER BY b.name;

-- =============================================
-- 7. TEST PERFORMANCE
-- =============================================

-- Test 14: Performance test - Get all businesses with categories
SELECT 'Test 14: Performance Test - All Businesses with Categories' as test_name;
EXPLAIN (ANALYZE, BUFFERS) 
SELECT 
    b.name,
    c.name as category_name,
    ci.name as city_name
FROM public.businesses b
JOIN public.categories c ON b.category_id = c.id
JOIN public.cities ci ON b.city_id = ci.id
WHERE b.status = 'active'
ORDER BY c.sort_order, b.name
LIMIT 100;

-- =============================================
-- 8. SUMMARY REPORT
-- =============================================

-- Final summary
SELECT 'SUMMARY REPORT' as report_type;

-- Total counts
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
    'Premium Businesses' as metric,
    COUNT(*) as count
FROM public.businesses 
WHERE status = 'active' AND is_premium = true

UNION ALL

SELECT 
    'Verified Businesses' as metric,
    COUNT(*) as count
FROM public.businesses 
WHERE status = 'active' AND is_verified = true;

-- Top categories by business count
SELECT 
    'Top Categories by Business Count' as metric,
    c.name as category_name,
    COUNT(b.id) as business_count
FROM public.categories c
LEFT JOIN public.businesses b ON c.id = b.category_id AND b.status = 'active'
WHERE c.is_active = true
GROUP BY c.id, c.name
ORDER BY business_count DESC
LIMIT 10;
