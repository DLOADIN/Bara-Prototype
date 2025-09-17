-- Test script to verify sponsored_banners RLS policies work for all CRUD operations

-- Test 1: INSERT - Check if we can insert a banner
INSERT INTO public.sponsored_banners (
  country_id, 
  company_name, 
  company_website, 
  banner_image_url,
  banner_alt_text,
  is_active,
  payment_status
) VALUES (
  (SELECT id FROM public.countries LIMIT 1), -- Use first available country
  'Test Company',
  'https://testcompany.com',
  'https://testcompany.com/banner.jpg',
  'Test banner for verification',
  false,
  'pending'
);

-- Test 2: SELECT - Check if we can select all banners
SELECT * FROM public.sponsored_banners;

-- Test 3: SELECT - Check if we can select active banners
SELECT * FROM public.sponsored_banners WHERE is_active = true;

-- Test 4: UPDATE - Check if we can update a banner
UPDATE public.sponsored_banners 
SET company_name = 'Updated Test Company', is_active = true 
WHERE company_name = 'Test Company';

-- Test 5: SELECT - Verify the update worked
SELECT * FROM public.sponsored_banners WHERE company_name = 'Updated Test Company';

-- Test 6: DELETE - Check if we can delete a banner
DELETE FROM public.sponsored_banners WHERE company_name = 'Updated Test Company';

-- Test 7: SELECT - Verify the delete worked
SELECT * FROM public.sponsored_banners WHERE company_name = 'Updated Test Company';

-- Test 8: Check current policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'sponsored_banners';

-- Test 9: Check table permissions
SELECT 
  grantee, 
  privilege_type 
FROM information_schema.table_privileges 
WHERE table_name = 'sponsored_banners' 
AND table_schema = 'public';
