-- BARA APP SEED DATA
-- Initial data to populate the database

-- =============================================
-- COUNTRIES DATA
-- =============================================

INSERT INTO public.countries (name, code, flag_url, wikipedia_url, description, population, capital, currency, language) VALUES
('Rwanda', 'RW', 'https://flagcdn.com/rw.svg', 'https://en.wikipedia.org/wiki/Rwanda', 'Land of a Thousand Hills', 13276544, 'Kigali', 'RWF', 'Kinyarwanda, English, French'),
('Kenya', 'KEN', 'https://flagcdn.com/ke.svg', 'https://en.wikipedia.org/wiki/Kenya', 'The Cradle of Mankind', 53771296, 'Nairobi', 'KES', 'English, Swahili'),
('Uganda', 'UG', 'https://flagcdn.com/ug.svg', 'https://en.wikipedia.org/wiki/Uganda', 'The Pearl of Africa', 45741007, 'Kampala', 'UGX', 'English, Swahili'),
('Tanzania', 'TZ', 'https://flagcdn.com/tz.svg', 'https://en.wikipedia.org/wiki/Tanzania', 'United Republic of Tanzania', 59734218, 'Dodoma', 'TZS', 'Swahili, English'),
('Botswana', 'BW', 'https://flagcdn.com/bw.svg', 'https://en.wikipedia.org/wiki/Botswana', 'Land of the Tswana', 2351627, 'Gaborone', 'BWP', 'English, Tswana'),
('Gabon', 'GA', 'https://flagcdn.com/ga.svg', 'https://en.wikipedia.org/wiki/Gabon', 'Land of the Forest', 2225728, 'Libreville', 'XAF', 'French'),
('Nigeria', 'NG', 'https://flagcdn.com/ng.svg', 'https://en.wikipedia.org/wiki/Nigeria', 'Giant of Africa', 206139589, 'Abuja', 'NGN', 'English'),
('Ghana', 'GH', 'https://flagcdn.com/gh.svg', 'https://en.wikipedia.org/wiki/Ghana', 'Land of Gold', 31072940, 'Accra', 'GHS', 'English'),
('Benin', 'BJ', 'https://flagcdn.com/bj.svg', 'https://en.wikipedia.org/wiki/Benin', 'Heart of Africa', 12123200, 'Porto-Novo', 'XOF', 'French'),
('South Africa', 'SA', 'https://flagcdn.com/za.svg', 'https://en.wikipedia.org/wiki/South_Africa', 'Rainbow Nation', 59308690, 'Pretoria', 'ZAR', 'English, Afrikaans, Zulu');

-- =============================================
-- CITIES DATA
-- =============================================

INSERT INTO public.cities (name, country_id, latitude, longitude, population) VALUES
-- Rwanda Cities
('Kigali', (SELECT id FROM public.countries WHERE code = 'RW'), -1.9441, 30.0619, 1132686),
('Butare', (SELECT id FROM public.countries WHERE code = 'RW'), -2.5967, 29.7378, 89600),
('Gitarama', (SELECT id FROM public.countries WHERE code = 'RW'), -2.0744, 29.7567, 87613),

-- Kenya Cities
('Nairobi', (SELECT id FROM public.countries WHERE code = 'KEN'), -1.2921, 36.8219, 4397073),
('Mombasa', (SELECT id FROM public.countries WHERE code = 'KEN'), -4.0435, 39.6682, 1200000),
('Kisumu', (SELECT id FROM public.countries WHERE code = 'KEN'), -0.1022, 34.7617, 409928),

-- Uganda Cities
('Kampala', (SELECT id FROM public.countries WHERE code = 'UG'), 0.3476, 32.5825, 1507080),
('Mbarara', (SELECT id FROM public.countries WHERE code = 'UG'), -0.6072, 30.6586, 195013),
('Jinja', (SELECT id FROM public.countries WHERE code = 'UG'), 0.4244, 33.2041, 76057),

-- Tanzania Cities
('Dodoma', (SELECT id FROM public.countries WHERE code = 'TZ'), -6.1730, 35.7469, 410956),
('Dar es Salaam', (SELECT id FROM public.countries WHERE code = 'TZ'), -6.8235, 39.2695, 4364541),
('Arusha', (SELECT id FROM public.countries WHERE code = 'TZ'), -3.3731, 36.6827, 416442),

-- Botswana Cities
('Gaborone', (SELECT id FROM public.countries WHERE code = 'BW'), -24.6282, 25.9231, 231592),
('Francistown', (SELECT id FROM public.countries WHERE code = 'BW'), -21.1702, 27.5078, 103417),
('Molepolole', (SELECT id FROM public.countries WHERE code = 'BW'), -24.4066, 25.4951, 67598),

-- Gabon Cities
('Libreville', (SELECT id FROM public.countries WHERE code = 'GA'), 0.4162, 9.4673, 703940),
('Port-Gentil', (SELECT id FROM public.countries WHERE code = 'GA'), -0.7167, 8.7833, 136462),
('Franceville', (SELECT id FROM public.countries WHERE code = 'GA'), -1.6333, 13.5833, 110568),

-- Nigeria Cities
('Abuja', (SELECT id FROM public.countries WHERE code = 'NG'), 9.0820, 7.3986, 1235880),
('Lagos', (SELECT id FROM public.countries WHERE code = 'NG'), 6.5244, 3.3792, 14862000),
('Kano', (SELECT id FROM public.countries WHERE code = 'NG'), 11.9914, 8.5313, 4180000),

-- Ghana Cities
('Accra', (SELECT id FROM public.countries WHERE code = 'GH'), 5.5600, -0.2057, 2388000),
('Kumasi', (SELECT id FROM public.countries WHERE code = 'GH'), 6.7000, -1.6167, 2035064),
('Tamale', (SELECT id FROM public.countries WHERE code = 'GH'), 9.4000, -0.8500, 371351),

-- Benin Cities
('Porto-Novo', (SELECT id FROM public.countries WHERE code = 'BJ'), 6.4969, 2.6283, 264320),
('Cotonou', (SELECT id FROM public.countries WHERE code = 'BJ'), 6.3667, 2.4333, 679012),
('Parakou', (SELECT id FROM public.countries WHERE code = 'BJ'), 9.3500, 2.6167, 255478),

-- South Africa Cities
('Cape Town', (SELECT id FROM public.countries WHERE code = 'SA'), -33.9249, 18.4241, 433688),
('Durban', (SELECT id FROM public.countries WHERE code = 'SA'), -29.8587, 31.0218, 595061),
('Johannesburg', (SELECT id FROM public.countries WHERE code = 'SA'), -26.2041, 28.0473, 957441);

-- =============================================
-- CATEGORIES DATA
-- =============================================

INSERT INTO public.categories (name, slug, icon, description, sort_order) VALUES
('Airports', 'airports', 'plane', 'Airports and aviation services', 1),
('Banks', 'banks', 'building', 'Banking and financial institutions', 2),
('Bars', 'bars', 'wine', 'Bars and pubs', 3),
('Barbers', 'barbers', 'scissors', 'Barber shops and grooming', 4),
('Bookstores', 'bookstores', 'book-open', 'Bookstores and libraries', 5),
('Cafes', 'cafes', 'coffee', 'Cafes and coffee shops', 6),
('Cinemas & Theatres', 'cinemas-theatres', 'film', 'Movie theaters and performance venues', 7),
('Clinics', 'clinics', 'stethoscope', 'Medical clinics and health centers', 8),
('Clubs (Professional / Private)', 'clubs-professional', 'users', 'Professional and private clubs', 9),
('Clubs (Leisure / Dance)', 'clubs-leisure', 'music', 'Leisure and dance clubs', 10),
('Dentists', 'dentists', 'tooth', 'Dental care services', 11),
('Doctors', 'doctors', 'user-md', 'Medical doctors and physicians', 12),
('Faith', 'faith', 'church', 'Religious institutions and places of worship', 13),
('Farms', 'farms', 'leaf', 'Agricultural farms and produce', 14),
('Galleries (Art)', 'galleries-art', 'palette', 'Art galleries and exhibitions', 15),
('Government', 'government', 'landmark', 'Government offices and services', 16),
('Hospitals', 'hospitals', 'hospital', 'Hospitals and medical centers', 17),
('Hotels', 'hotels', 'bed', 'Hotels and accommodation', 18),
('Lawyers', 'lawyers', 'scale', 'Legal services and attorneys', 19),
('Libraries', 'libraries', 'book', 'Public and private libraries', 20),
('Markets', 'markets', 'shopping-bag', 'Markets and shopping centers', 21),
('Museums', 'museums', 'museum', 'Museums and cultural centers', 22),
('Parks', 'parks', 'tree', 'Parks and recreational areas', 23),
('Pharmacies', 'pharmacies', 'pill', 'Pharmacies and drug stores', 24),
('Post Offices', 'post-offices', 'mail', 'Post offices and mail services', 25),
('Recreation', 'recreation', 'gamepad-2', 'Recreation and entertainment', 26),
('Real Estate', 'real-estate', 'home', 'Real estate agencies and properties', 27),
('Restaurants', 'restaurants', 'utensils-crossed', 'Restaurants and dining', 28),
('Salons', 'salons', 'scissors', 'Beauty salons and spas', 29),
('Schools', 'schools', 'graduation-cap', 'Primary and secondary schools', 30),
('Services', 'services', 'wrench', 'General services and maintenance', 31),
('Shopping', 'shopping', 'shopping-cart', 'Shopping centers and retail', 32),
('Tours', 'tours', 'map', 'Tourism and travel services', 33),
('Transportation', 'transportation', 'truck', 'Transport and logistics', 34),
('Universities', 'universities', 'graduation-cap', 'Universities and higher education', 35),
('Utilities', 'utilities', 'zap', 'Utility services and providers', 36);

-- =============================================
-- SAMPLE BUSINESSES DATA
-- =============================================

-- Sample Restaurants
INSERT INTO public.businesses (name, slug, description, category_id, city_id, country_id, phone, email, website, address, status, is_premium, is_verified) VALUES
('Kigali Delights', 'kigali-delights', 'Authentic Rwandan cuisine with modern twists', 
 (SELECT id FROM public.categories WHERE slug = 'restaurants'),
 (SELECT id FROM public.cities WHERE name = 'Kigali' AND country_id = (SELECT id FROM public.countries WHERE code = 'RW')),
 (SELECT id FROM public.countries WHERE code = 'RW'),
 '+250788123456', 'info@kigalidelights.rw', 'https://kigalidelights.rw', 'KN 4 Ave, Kigali', 'active', true, true),

('Nairobi Spice', 'nairobi-spice', 'Traditional Kenyan dishes with contemporary flair',
 (SELECT id FROM public.categories WHERE slug = 'restaurants'),
 (SELECT id FROM public.cities WHERE name = 'Nairobi' AND country_id = (SELECT id FROM public.countries WHERE code = 'KEN')),
 (SELECT id FROM public.countries WHERE code = 'KEN'),
 '+254700123456', 'hello@nairobispice.ke', 'https://nairobispice.ke', 'Westlands, Nairobi', 'active', false, true),

('Accra Flavors', 'accra-flavors', 'Ghanaian cuisine and traditional dishes',
 (SELECT id FROM public.categories WHERE slug = 'restaurants'),
 (SELECT id FROM public.cities WHERE name = 'Accra' AND country_id = (SELECT id FROM public.countries WHERE code = 'GH')),
 (SELECT id FROM public.countries WHERE code = 'GH'),
 '+233201234567', 'info@accraflavors.gh', 'https://accraflavors.gh', 'Osu, Accra', 'active', true, true);

-- Sample Banks
INSERT INTO public.businesses (name, slug, description, category_id, city_id, country_id, phone, email, website, address, status, is_premium, is_verified) VALUES
('Kigali Bank', 'kigali-bank', 'Leading banking services in Rwanda',
 (SELECT id FROM public.categories WHERE slug = 'banks'),
 (SELECT id FROM public.cities WHERE name = 'Kigali' AND country_id = (SELECT id FROM public.countries WHERE code = 'RW')),
 (SELECT id FROM public.countries WHERE code = 'RW'),
 '+250788234567', 'info@kigalibank.rw', 'https://kigalibank.rw', 'KG 123 St, Kigali', 'active', true, true),

('Nairobi Commercial Bank', 'nairobi-commercial-bank', 'Trusted banking solutions',
 (SELECT id FROM public.categories WHERE slug = 'banks'),
 (SELECT id FROM public.cities WHERE name = 'Nairobi' AND country_id = (SELECT id FROM public.countries WHERE code = 'KEN')),
 (SELECT id FROM public.countries WHERE code = 'KEN'),
 '+254700234567', 'contact@nairobibank.ke', 'https://nairobibank.ke', 'Westlands, Nairobi', 'active', true, true);

-- Sample Hotels
INSERT INTO public.businesses (name, slug, description, category_id, city_id, country_id, phone, email, website, address, status, is_premium, is_verified) VALUES
('Kigali Heights Hotel', 'kigali-heights-hotel', 'Luxury accommodation in the heart of Kigali',
 (SELECT id FROM public.categories WHERE slug = 'hotels'),
 (SELECT id FROM public.cities WHERE name = 'Kigali' AND country_id = (SELECT id FROM public.countries WHERE code = 'RW')),
 (SELECT id FROM public.countries WHERE code = 'RW'),
 '+250788345678', 'reservations@kigaliheights.rw', 'https://kigaliheights.rw', 'KG 456 Ave, Kigali', 'active', true, true),

('Lagos Grand Hotel', 'lagos-grand-hotel', 'Premium accommodation in Lagos',
 (SELECT id FROM public.categories WHERE slug = 'hotels'),
 (SELECT id FROM public.cities WHERE name = 'Lagos' AND country_id = (SELECT id FROM public.countries WHERE code = 'NG')),
 (SELECT id FROM public.countries WHERE code = 'NG'),
 '+234801234567', 'book@lagosgrand.ng', 'https://lagosgrand.ng', 'Victoria Island, Lagos', 'active', true, true);

-- Sample Universities
INSERT INTO public.businesses (name, slug, description, category_id, city_id, country_id, phone, email, website, address, status, is_premium, is_verified) VALUES
('University of Kigali', 'university-of-kigali', 'Leading higher education institution',
 (SELECT id FROM public.categories WHERE slug = 'universities'),
 (SELECT id FROM public.cities WHERE name = 'Kigali' AND country_id = (SELECT id FROM public.countries WHERE code = 'RW')),
 (SELECT id FROM public.countries WHERE code = 'RW'),
 '+250788456789', 'admissions@uok.rw', 'https://uok.rw', 'KG 789 St, Kigali', 'active', true, true),

('University of Ghana', 'university-of-ghana', 'Premier university in Ghana',
 (SELECT id FROM public.categories WHERE slug = 'universities'),
 (SELECT id FROM public.cities WHERE name = 'Accra' AND country_id = (SELECT id FROM public.countries WHERE code = 'GH')),
 (SELECT id FROM public.countries WHERE code = 'GH'),
 '+233201234568', 'info@ug.edu.gh', 'https://ug.edu.gh', 'Legon, Accra', 'active', true, true);

-- =============================================
-- SAMPLE EVENTS DATA
-- =============================================

INSERT INTO public.events (title, description, city_id, country_id, venue, address, start_date, end_date, category, is_featured) VALUES
('Kigali Food Festival 2024', 'Annual celebration of Rwandan cuisine and culture',
 (SELECT id FROM public.cities WHERE name = 'Kigali' AND country_id = (SELECT id FROM public.countries WHERE code = 'RW')),
 (SELECT id FROM public.countries WHERE code = 'RW'),
 'Kigali Convention Centre', 'KG 789 St, Kigali',
 '2024-06-15 10:00:00+00', '2024-06-17 22:00:00+00', 'Food & Culture', true),

('Accra Tech Summit', 'Leading technology conference in West Africa',
 (SELECT id FROM public.cities WHERE name = 'Accra' AND country_id = (SELECT id FROM public.countries WHERE code = 'GH')),
 (SELECT id FROM public.countries WHERE code = 'GH'),
 'Accra International Conference Centre', 'Osu, Accra',
 '2024-07-20 09:00:00+00', '2024-07-22 18:00:00+00', 'Technology', true),

('Lagos Business Expo', 'Premier business networking event in Nigeria',
 (SELECT id FROM public.cities WHERE name = 'Lagos' AND country_id = (SELECT id FROM public.countries WHERE code = 'NG')),
 (SELECT id FROM public.countries WHERE code = 'NG'),
 'Eko Hotel & Suites', 'Victoria Island, Lagos',
 '2024-08-10 09:00:00+00', '2024-08-12 18:00:00+00', 'Business & Networking', true);

-- =============================================
-- SAMPLE PRODUCTS DATA (Marketplace)
-- =============================================

-- Note: Products will be added when sellers register their businesses
-- This is just a placeholder structure

-- =============================================
-- UPDATE BUSINESS SLUGS TO BE UNIQUE
-- =============================================

-- Add unique constraints and update any duplicate slugs if needed
-- This ensures all business slugs are unique across the platform 