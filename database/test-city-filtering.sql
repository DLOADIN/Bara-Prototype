-- =============================================
-- TEST CITY FILTERING FUNCTIONALITY
-- =============================================
-- This script tests that cities can be properly filtered by category
-- and that the business counts are accurate

-- =============================================
-- 1. TEST CITIES BY CATEGORY
-- =============================================

-- Test 1: Get cities with restaurants
SELECT 'Test 1: Cities with Restaurants' as test_name;
SELECT 
    c.name as city_name,
    co.name as country_name,
    COUNT(b.id) as business_count
FROM public.cities c
JOIN public.countries co ON c.country_id = co.id
JOIN public.businesses b ON c.id = b.city_id
JOIN public.categories cat ON b.category_id = cat.id
WHERE cat.slug = 'restaurants' 
AND b.status = 'active'
GROUP BY c.id, c.name, co.name
ORDER BY business_count DESC, c.name;

-- Test 2: Get cities with hotels
SELECT 'Test 2: Cities with Hotels' as test_name;
SELECT 
    c.name as city_name,
    co.name as country_name,
    COUNT(b.id) as business_count
FROM public.cities c
JOIN public.countries co ON c.country_id = co.id
JOIN public.businesses b ON c.id = b.city_id
JOIN public.categories cat ON b.category_id = cat.id
WHERE cat.slug = 'hotels' 
AND b.status = 'active'
GROUP BY c.id, c.name, co.name
ORDER BY business_count DESC, c.name;

-- Test 3: Get cities with banks
SELECT 'Test 3: Cities with Banks' as test_name;
SELECT 
    c.name as city_name,
    co.name as country_name,
    COUNT(b.id) as business_count
FROM public.cities c
JOIN public.countries co ON c.country_id = co.id
JOIN public.businesses b ON c.id = b.city_id
JOIN public.categories cat ON b.category_id = cat.id
WHERE cat.slug = 'banks' 
AND b.status = 'active'
GROUP BY c.id, c.name, co.name
ORDER BY business_count DESC, c.name;

-- =============================================
-- 2. TEST CITY-SPECIFIC CATEGORY QUERIES
-- =============================================

-- Test 4: Get restaurants in Kigali
SELECT 'Test 4: Restaurants in Kigali' as test_name;
SELECT 
    b.name as business_name,
    b.slug as business_slug,
    cat.name as category_name,
    c.name as city_name,
    co.name as country_name
FROM public.businesses b
JOIN public.categories cat ON b.category_id = cat.id
JOIN public.cities c ON b.city_id = c.id
JOIN public.countries co ON c.country_id = co.id
WHERE cat.slug = 'restaurants' 
AND c.name = 'Kigali'
AND b.status = 'active'
ORDER BY b.is_premium DESC, b.name;

-- Test 5: Get hotels in Nairobi
SELECT 'Test 5: Hotels in Nairobi' as test_name;
SELECT 
    b.name as business_name,
    b.slug as business_slug,
    cat.name as category_name,
    c.name as city_name,
    co.name as country_name
FROM public.businesses b
JOIN public.categories cat ON b.category_id = cat.id
JOIN public.cities c ON b.city_id = c.id
JOIN public.countries co ON c.country_id = co.id
WHERE cat.slug = 'hotels' 
AND c.name = 'Nairobi'
AND b.status = 'active'
ORDER BY b.is_premium DESC, b.name;

-- =============================================
-- 3. TEST CATEGORY STATISTICS BY CITY
-- =============================================

-- Test 6: Category distribution across cities
SELECT 'Test 6: Category Distribution Across Cities' as test_name;
SELECT 
    cat.name as category_name,
    c.name as city_name,
    co.name as country_name,
    COUNT(b.id) as business_count,
    COUNT(CASE WHEN b.is_premium = true THEN 1 END) as premium_count,
    COUNT(CASE WHEN b.is_verified = true THEN 1 END) as verified_count
FROM public.categories cat
JOIN public.businesses b ON cat.id = b.category_id
JOIN public.cities c ON b.city_id = c.id
JOIN public.countries co ON c.country_id = co.id
WHERE cat.is_active = true 
AND b.status = 'active'
GROUP BY cat.id, cat.name, c.id, c.name, co.name
ORDER BY cat.name, business_count DESC;

-- =============================================
-- 4. TEST PERFORMANCE OF CITY FILTERING
-- =============================================

-- Test 7: Performance test for city filtering
SELECT 'Test 7: Performance Test - City Filtering' as test_name;
EXPLAIN (ANALYZE, BUFFERS) 
SELECT 
    b.name,
    cat.name as category_name,
    c.name as city_name
FROM public.businesses b
JOIN public.categories cat ON b.category_id = cat.id
JOIN public.cities c ON b.city_id = c.id
WHERE cat.slug = 'restaurants' 
AND c.name = 'Kigali'
AND b.status = 'active'
ORDER BY b.is_premium DESC, b.name;

-- =============================================
-- 5. TEST EDGE CASES
-- =============================================

-- Test 8: Cities with no businesses in a category
SELECT 'Test 8: Cities with No Restaurants' as test_name;
SELECT 
    c.name as city_name,
    co.name as country_name
FROM public.cities c
JOIN public.countries co ON c.country_id = co.id
WHERE c.id NOT IN (
    SELECT DISTINCT b.city_id 
    FROM public.businesses b
    JOIN public.categories cat ON b.category_id = cat.id
    WHERE cat.slug = 'restaurants' 
    AND b.status = 'active'
    AND b.city_id IS NOT NULL
)
ORDER BY c.name;

-- Test 9: Categories with no city assignments
SELECT 'Test 9: Categories with No City Assignments' as test_name;
SELECT 
    cat.name as category_name,
    COUNT(b.id) as business_count
FROM public.categories cat
LEFT JOIN public.businesses b ON cat.id = b.category_id AND b.status = 'active'
WHERE cat.is_active = true
GROUP BY cat.id, cat.name
HAVING COUNT(b.id) = 0 OR COUNT(b.id) = COUNT(CASE WHEN b.city_id IS NULL THEN 1 END)
ORDER BY cat.name;

-- =============================================
-- 6. SUMMARY REPORT
-- =============================================

-- Final summary
SELECT 'CITY FILTERING SUMMARY REPORT' as report_type;

-- Total cities with businesses
SELECT 
    'Total Cities with Businesses' as metric,
    COUNT(DISTINCT c.id) as count
FROM public.cities c
JOIN public.businesses b ON c.id = b.city_id
WHERE b.status = 'active'

UNION ALL

-- Total categories with city assignments
SELECT 
    'Total Categories with City Assignments' as metric,
    COUNT(DISTINCT cat.id) as count
FROM public.categories cat
JOIN public.businesses b ON cat.id = b.category_id
WHERE cat.is_active = true 
AND b.status = 'active'
AND b.city_id IS NOT NULL

UNION ALL

-- Average businesses per city
SELECT 
    'Average Businesses per City' as metric,
    ROUND(AVG(business_count), 2) as count
FROM (
    SELECT COUNT(b.id) as business_count
    FROM public.cities c
    JOIN public.businesses b ON c.id = b.city_id
    WHERE b.status = 'active'
    GROUP BY c.id
) as city_counts;

-- Top cities by total businesses
SELECT 
    'Top Cities by Total Businesses' as metric,
    c.name as city_name,
    co.name as country_name,
    COUNT(b.id) as business_count
FROM public.cities c
JOIN public.countries co ON c.country_id = co.id
JOIN public.businesses b ON c.id = b.city_id
WHERE b.status = 'active'
GROUP BY c.id, c.name, co.name
ORDER BY business_count DESC
LIMIT 10;

-- Top categories by city coverage
SELECT 
    'Top Categories by City Coverage' as metric,
    cat.name as category_name,
    COUNT(DISTINCT c.id) as cities_count,
    COUNT(b.id) as total_businesses
FROM public.categories cat
JOIN public.businesses b ON cat.id = b.category_id
JOIN public.cities c ON b.city_id = c.id
WHERE cat.is_active = true 
AND b.status = 'active'
GROUP BY cat.id, cat.name
ORDER BY cities_count DESC, total_businesses DESC
LIMIT 10;
