-- Test script for Admin CRUD operations
-- This script tests all Create, Read, Update, Delete operations

-- 1. TEST COUNTRIES CRUD OPERATIONS

-- Test CREATE - Add a new country
INSERT INTO public.countries (name, code, flag_emoji, is_active) 
VALUES ('Test Country', 'TC', '🏳️', true)
RETURNING id, name, code;

-- Test READ - Fetch all active countries
SELECT id, name, code, flag_emoji, is_active, created_at 
FROM public.countries 
WHERE is_active = true 
ORDER BY name;

-- Test UPDATE - Update the test country
UPDATE public.countries 
SET name = 'Updated Test Country', flag_emoji = '🏴' 
WHERE code = 'TC'
RETURNING id, name, code, flag_emoji;

-- Test DELETE (soft delete) - Set test country as inactive
UPDATE public.countries 
SET is_active = false 
WHERE code = 'TC'
RETURNING id, name, code, is_active;

-- Verify the country is now inactive
SELECT id, name, code, is_active 
FROM public.countries 
WHERE code = 'TC';

-- 2. TEST CITIES CRUD OPERATIONS

-- First, get a country ID to use for city tests
DO $$
DECLARE
    country_id uuid;
BEGIN
    SELECT id INTO country_id FROM public.countries WHERE code = 'RW' LIMIT 1;
    
    -- Test CREATE - Add a new city
    INSERT INTO public.cities (name, country_id, is_active) 
    VALUES ('Test City', country_id, true);
    
    RAISE NOTICE 'Created test city for country ID: %', country_id;
END $$;

-- Test READ - Fetch all active cities with country names
SELECT 
    c.id, 
    c.name, 
    c.is_active, 
    c.created_at,
    co.name as country_name,
    co.code as country_code
FROM public.cities c
JOIN public.countries co ON c.country_id = co.id
WHERE c.is_active = true 
ORDER BY c.name;

-- Test UPDATE - Update the test city
UPDATE public.cities 
SET name = 'Updated Test City' 
WHERE name = 'Test City'
RETURNING id, name, is_active;

-- Test DELETE (soft delete) - Set test city as inactive
UPDATE public.cities 
SET is_active = false 
WHERE name = 'Updated Test City'
RETURNING id, name, is_active;

-- Verify the city is now inactive
SELECT id, name, is_active 
FROM public.cities 
WHERE name = 'Updated Test City';

-- 3. TEST RELATIONSHIPS AND COUNTS

-- Test country with city counts
SELECT 
    co.id,
    co.name as country_name,
    co.code as country_code,
    COUNT(c.id) as city_count
FROM public.countries co
LEFT JOIN public.cities c ON co.id = c.country_id AND c.is_active = true
WHERE co.is_active = true
GROUP BY co.id, co.name, co.code
ORDER BY co.name;

-- 4. CLEANUP - Remove test data
DELETE FROM public.cities WHERE name LIKE '%Test%';
DELETE FROM public.countries WHERE code = 'TC';

-- 5. VERIFY FINAL STATE
SELECT 'Countries:' as table_name, COUNT(*) as count FROM public.countries WHERE is_active = true
UNION ALL
SELECT 'Cities:', COUNT(*) FROM public.cities WHERE is_active = true;
