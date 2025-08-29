-- BARA APP SEED DATA
-- Initial data to populate the database with comprehensive business listings

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
('South Africa', 'SA', 'https://flagcdn.com/za.svg', 'https://en.wikipedia.org/wiki/South_Africa', 'Rainbow Nation', 59308690, 'Pretoria', 'ZAR', 'English, Afrikaans, Zulu'),
('Ethiopia', 'ET', 'https://flagcdn.com/et.svg', 'https://en.wikipedia.org/wiki/Ethiopia', 'Land of Origins', 114963588, 'Addis Ababa', 'ETB', 'Amharic, English'),
('Morocco', 'MA', 'https://flagcdn.com/ma.svg', 'https://en.wikipedia.org/wiki/Morocco', 'Kingdom of Morocco', 36910560, 'Rabat', 'MAD', 'Arabic, Berber'),
('Senegal', 'SN', 'https://flagcdn.com/sn.svg', 'https://en.wikipedia.org/wiki/Senegal', 'Teranga Nation', 16743927, 'Dakar', 'XOF', 'French, Wolof'),
('Ivory Coast', 'CI', 'https://flagcdn.com/ci.svg', 'https://en.wikipedia.org/wiki/Ivory_Coast', 'Land of Elephants', 26378274, 'Yamoussoukro', 'XOF', 'French'),
('Cameroon', 'CM', 'https://flagcdn.com/cm.svg', 'https://en.wikipedia.org/wiki/Cameroon', 'Africa in Miniature', 26545863, 'Yaoundé', 'XAF', 'French, English')
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- CITIES DATA
-- =============================================

INSERT INTO public.cities (name, country_id, latitude, longitude, population) VALUES
-- Rwanda Cities
('Kigali', (SELECT id FROM public.countries WHERE code = 'RW'), -1.9441, 30.0619, 1132686),
('Butare', (SELECT id FROM public.countries WHERE code = 'RW'), -2.5967, 29.7378, 89600),
('Gitarama', (SELECT id FROM public.countries WHERE code = 'RW'), -2.0744, 29.7567, 87613),
('Ruhengeri', (SELECT id FROM public.countries WHERE code = 'RW'), -1.4994, 29.6338, 86685),

-- Kenya Cities
('Nairobi', (SELECT id FROM public.countries WHERE code = 'KEN'), -1.2921, 36.8219, 4397073),
('Mombasa', (SELECT id FROM public.countries WHERE code = 'KEN'), -4.0435, 39.6682, 1200000),
('Kisumu', (SELECT id FROM public.countries WHERE code = 'KEN'), -0.1022, 34.7617, 409928),
('Nakuru', (SELECT id FROM public.countries WHERE code = 'KEN'), -0.3031, 36.0800, 307990),
('Eldoret', (SELECT id FROM public.countries WHERE code = 'KEN'), 0.5143, 35.2698, 289380),

-- Uganda Cities
('Kampala', (SELECT id FROM public.countries WHERE code = 'UG'), 0.3476, 32.5825, 1507080),
('Mbarara', (SELECT id FROM public.countries WHERE code = 'UG'), -0.6072, 30.6586, 195013),
('Jinja', (SELECT id FROM public.countries WHERE code = 'UG'), 0.4244, 33.2041, 76057),
('Gulu', (SELECT id FROM public.countries WHERE code = 'UG'), 2.7796, 32.2990, 152276),

-- Tanzania Cities
('Dodoma', (SELECT id FROM public.countries WHERE code = 'TZ'), -6.1730, 35.7469, 410956),
('Dar es Salaam', (SELECT id FROM public.countries WHERE code = 'TZ'), -6.8235, 39.2695, 4364541),
('Arusha', (SELECT id FROM public.countries WHERE code = 'TZ'), -3.3731, 36.6827, 416442),
('Mwanza', (SELECT id FROM public.countries WHERE code = 'TZ'), -2.5164, 32.9175, 706453),

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
('Ibadan', (SELECT id FROM public.countries WHERE code = 'NG'), 7.3775, 3.9470, 3649000),
('Port Harcourt', (SELECT id FROM public.countries WHERE code = 'NG'), 4.8156, 7.0498, 1865000),

-- Ghana Cities
('Accra', (SELECT id FROM public.countries WHERE code = 'GH'), 5.5600, -0.2057, 2388000),
('Kumasi', (SELECT id FROM public.countries WHERE code = 'GH'), 6.7000, -1.6167, 2035064),
('Tamale', (SELECT id FROM public.countries WHERE code = 'GH'), 9.4000, -0.8500, 371351),
('Cape Coast', (SELECT id FROM public.countries WHERE code = 'GH'), 5.1053, -1.2466, 169894),

-- Benin Cities
('Porto-Novo', (SELECT id FROM public.countries WHERE code = 'BJ'), 6.4969, 2.6283, 264320),
('Cotonou', (SELECT id FROM public.countries WHERE code = 'BJ'), 6.3667, 2.4333, 679012),
('Parakou', (SELECT id FROM public.countries WHERE code = 'BJ'), 9.3500, 2.6167, 255478),

-- South Africa Cities
('Cape Town', (SELECT id FROM public.countries WHERE code = 'SA'), -33.9249, 18.4241, 433688),
('Durban', (SELECT id FROM public.countries WHERE code = 'SA'), -29.8587, 31.0218, 595061),
('Johannesburg', (SELECT id FROM public.countries WHERE code = 'SA'), -26.2041, 28.0473, 957941),
('Pretoria', (SELECT id FROM public.countries WHERE code = 'SA'), -25.7479, 28.2293, 741651),

-- Ethiopia Cities
('Addis Ababa', (SELECT id FROM public.countries WHERE code = 'ET'), 9.0320, 38.7488, 3352000),
('Dire Dawa', (SELECT id FROM public.countries WHERE code = 'ET'), 9.5931, 41.8661, 440000),
('Mekelle', (SELECT id FROM public.countries WHERE code = 'ET'), 13.4967, 39.4753, 340859),

-- Morocco Cities
('Casablanca', (SELECT id FROM public.countries WHERE code = 'MA'), 33.5731, -7.5898, 3359818),
('Rabat', (SELECT id FROM public.countries WHERE code = 'MA'), 34.0209, -6.8416, 577827),
('Marrakech', (SELECT id FROM public.countries WHERE code = 'MA'), 31.6295, -7.9811, 928850),

-- Senegal Cities
('Dakar', (SELECT id FROM public.countries WHERE code = 'SN'), 14.7167, -17.4677, 1030594),
('Thiès', (SELECT id FROM public.countries WHERE code = 'SN'), 14.7886, -16.9260, 320000),
('Kaolack', (SELECT id FROM public.countries WHERE code = 'SN'), 14.1500, -16.0667, 233708),

-- Ivory Coast Cities
('Abidjan', (SELECT id FROM public.countries WHERE code = 'CI'), 5.3600, -4.0083, 4707404),
('Yamoussoukro', (SELECT id FROM public.countries WHERE code = 'CI'), 6.8276, -5.2893, 355573),
('Bouaké', (SELECT id FROM public.countries WHERE code = 'CI'), 7.6900, -5.0300, 567481),

-- Cameroon Cities
('Yaoundé', (SELECT id FROM public.countries WHERE code = 'CM'), 3.8480, 11.5021, 2440462),
('Douala', (SELECT id FROM public.countries WHERE code = 'CM'), 4.0511, 9.7679, 2768400),
('Bamenda', (SELECT id FROM public.countries WHERE code = 'CM'), 5.9631, 10.1591, 348766)
ON CONFLICT (name, country_id) DO NOTHING;

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
('Utilities', 'utilities', 'zap', 'Utility services and providers', 36),
('Auto Repair', 'auto-repair', 'wrench', 'Automotive repair and maintenance', 37),
('Gyms & Fitness', 'gyms-fitness', 'dumbbell', 'Fitness centers and gyms', 38),
('Spas & Wellness', 'spas-wellness', 'heart', 'Spas and wellness centers', 39),
('Tech Services', 'tech-services', 'laptop', 'Technology and IT services', 40)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- COMPREHENSIVE BUSINESSES DATA
-- =============================================

-- RESTAURANTS ACROSS AFRICA
INSERT INTO public.businesses (name, slug, description, category_id, city_id, country_id, phone, email, website, address, status, is_premium, is_verified, images, logo_url, hours_of_operation, services) VALUES

-- Rwanda Restaurants
('Kigali Delights', 'kigali-delights', 'Authentic Rwandan cuisine with modern twists featuring traditional dishes like ugali, nyama choma, and fresh tilapia', 
 (SELECT id FROM public.categories WHERE slug = 'restaurants'),
 (SELECT id FROM public.cities WHERE name = 'Kigali' AND country_id = (SELECT id FROM public.countries WHERE code = 'RW')),
 (SELECT id FROM public.countries WHERE code = 'RW'),
 '+250788123456', 'info@kigalidelights.rw', 'https://kigalidelights.rw', 'KN 4 Ave, Kigali', 'active', true, true,
 ARRAY['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'],
 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200',
 '{"monday": "08:00-22:00", "tuesday": "08:00-22:00", "wednesday": "08:00-22:00", "thursday": "08:00-22:00", "friday": "08:00-23:00", "saturday": "08:00-23:00", "sunday": "10:00-21:00"}',
 '["Dine-in", "Takeaway", "Delivery", "Catering", "Private Events"]'),

('Mama Nyirarukundo Kitchen', 'mama-nyirarukundo-kitchen', 'Traditional Rwandan home cooking in a warm family atmosphere, specializing in ibirayi, ubwoba, and fresh vegetables',
 (SELECT id FROM public.categories WHERE slug = 'restaurants'),
 (SELECT id FROM public.cities WHERE name = 'Kigali' AND country_id = (SELECT id FROM public.countries WHERE code = 'RW')),
 (SELECT id FROM public.countries WHERE code = 'RW'),
 '+250788234567', 'mama@nyirarukundo.rw', 'https://mamanyirarukundo.rw', 'Remera, Kigali', 'active', false, true,
 ARRAY['https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800'],
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
 '{"monday": "07:00-21:00", "tuesday": "07:00-21:00", "wednesday": "07:00-21:00", "thursday": "07:00-21:00", "friday": "07:00-21:00", "saturday": "07:00-21:00", "sunday": "08:00-20:00"}',
 '["Dine-in", "Takeaway", "Home Delivery", "Meal Prep"]'),

('The Hut Restaurant', 'the-hut-restaurant-kigali', 'Upscale dining experience featuring continental and traditional Rwandan fusion cuisine with panoramic city views',
 (SELECT id FROM public.categories WHERE slug = 'restaurants'),
 (SELECT id FROM public.cities WHERE name = 'Kigali' AND country_id = (SELECT id FROM public.countries WHERE code = 'RW')),
 (SELECT id FROM public.countries WHERE code = 'RW'),
 '+250788345678', 'reservations@thehut.rw', 'https://thehut.rw', 'Nyarutarama, Kigali', 'active', true, true,
 ARRAY['https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800', 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800', 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800'],
 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200',
 '{"monday": "11:00-23:00", "tuesday": "11:00-23:00", "wednesday": "11:00-23:00", "thursday": "11:00-23:00", "friday": "11:00-00:00", "saturday": "11:00-00:00", "sunday": "12:00-22:00"}',
 '["Fine Dining", "Wine Pairing", "Private Dining", "Corporate Events", "Wedding Receptions"]'),

-- Kenya Restaurants
('Nairobi Spice House', 'nairobi-spice-house', 'Authentic Kenyan and East African cuisine featuring nyama choma, ugali, sukuma wiki, and coastal specialties',
 (SELECT id FROM public.categories WHERE slug = 'restaurants'),
 (SELECT id FROM public.cities WHERE name = 'Nairobi' AND country_id = (SELECT id FROM public.countries WHERE code = 'KEN')),
 (SELECT id FROM public.countries WHERE code = 'KEN'),
 '+254700123456', 'hello@nairobispice.ke', 'https://nairobispice.ke', 'Westlands, Nairobi', 'active', true, true,
 ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800'],
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
 '{"monday": "10:00-22:00", "tuesday": "10:00-22:00", "wednesday": "10:00-22:00", "thursday": "10:00-22:00", "friday": "10:00-23:00", "saturday": "10:00-23:00", "sunday": "11:00-21:00"}',
 '["Dine-in", "Takeaway", "Delivery", "Catering", "Live Music"]'),

('Carnivore Restaurant', 'carnivore-restaurant-nairobi', 'World-famous meat restaurant offering exotic game meat and traditional Kenyan barbecue experience',
 (SELECT id FROM public.categories WHERE slug = 'restaurants'),
 (SELECT id FROM public.cities WHERE name = 'Nairobi' AND country_id = (SELECT id FROM public.countries WHERE code = 'KEN')),
 (SELECT id FROM public.countries WHERE code = 'KEN'),
 '+254700234567', 'info@carnivore.ke', 'https://carnivore.co.ke', 'Langata Road, Nairobi', 'active', true, true,
 ARRAY['https://images.unsplash.com/photo-1558030006-450675393462?w=800', 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800'],
 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200',
 '{"monday": "12:00-23:00", "tuesday": "12:00-23:00", "wednesday": "12:00-23:00", "thursday": "12:00-23:00", "friday": "12:00-00:00", "saturday": "12:00-00:00", "sunday": "12:00-22:00"}',
 '["All-You-Can-Eat", "Game Meat", "Live Entertainment", "Tour Groups", "Special Events"]'),

-- Ghana Restaurants
('Accra Golden Flavors', 'accra-golden-flavors', 'Traditional Ghanaian cuisine featuring jollof rice, banku, kelewele, and fresh palm nut soup',
 (SELECT id FROM public.categories WHERE slug = 'restaurants'),
 (SELECT id FROM public.cities WHERE name = 'Accra' AND country_id = (SELECT id FROM public.countries WHERE code = 'GH')),
 (SELECT id FROM public.countries WHERE code = 'GH'),
 '+233201234567', 'info@accragolden.gh', 'https://accragolden.gh', 'Osu, Accra', 'active', true, true,
 ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800'],
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
 '{"monday": "09:00-22:00", "tuesday": "09:00-22:00", "wednesday": "09:00-22:00", "thursday": "09:00-22:00", "friday": "09:00-23:00", "saturday": "09:00-23:00", "sunday": "10:00-21:00"}',
 '["Traditional Cuisine", "Vegetarian Options", "Takeaway", "Catering", "Cultural Events"]'),

-- Nigeria Restaurants
('Lagos Jollof Palace', 'lagos-jollof-palace', 'Authentic Nigerian cuisine specializing in jollof rice, suya, pounded yam, and pepper soup',
 (SELECT id FROM public.categories WHERE slug = 'restaurants'),
 (SELECT id FROM public.cities WHERE name = 'Lagos' AND country_id = (SELECT id FROM public.countries WHERE code = 'NG')),
 (SELECT id FROM public.countries WHERE code = 'NG'),
 '+234801234567', 'info@jollofpalace.ng', 'https://jollofpalace.ng', 'Victoria Island, Lagos', 'active', true, true,
 ARRAY['https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800'],
 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200',
 '{"monday": "10:00-23:00", "tuesday": "10:00-23:00", "wednesday": "10:00-23:00", "thursday": "10:00-23:00", "friday": "10:00-00:00", "saturday": "10:00-00:00", "sunday": "11:00-22:00"}',
 '["Nigerian Cuisine", "Live Music", "Private Events", "Catering", "Delivery"]'),

-- HOTELS ACROSS AFRICA
('Kigali Serena Hotel', 'kigali-serena-hotel', 'Luxury 5-crownhotel in the heart of Kigali offering world-class accommodation, spa services, and conference facilities',
 (SELECT id FROM public.categories WHERE slug = 'hotels'),
 (SELECT id FROM public.cities WHERE name = 'Kigali' AND country_id = (SELECT id FROM public.countries WHERE code = 'RW')),
 (SELECT id FROM public.countries WHERE code = 'RW'),
 '+250788456789', 'reservations@serena.co.rw', 'https://serenahotels.com/kigali', 'KN 3 Ave, Kigali', 'active', true, true,
 ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800'],
 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200',
 '{"reception": "24/7", "restaurant": "06:00-23:00", "spa": "08:00-20:00", "gym": "05:00-22:00"}',
 '["Luxury Accommodation", "Conference Facilities", "Spa & Wellness", "Fine Dining", "Airport Transfer", "Business Center"]'),

('Hotel des Mille Collines', 'hotel-des-mille-collines', 'Historic luxury hotel with modern amenities, famous for its role in Rwandan history and exceptional hospitality',
 (SELECT id FROM public.categories WHERE slug = 'hotels'),
 (SELECT id FROM public.cities WHERE name = 'Kigali' AND country_id = (SELECT id FROM public.countries WHERE code = 'RW')),
 (SELECT id FROM public.countries WHERE code = 'RW'),
 '+250788567890', 'info@millecollines.rw', 'https://millecollines.rw', 'KN 6 Ave, Kigali', 'active', true, true,
 ARRAY['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200',
 '{"reception": "24/7", "restaurant": "06:30-22:30", "bar": "17:00-01:00", "pool": "06:00-22:00"}',
 '["Historic Hotel", "Pool & Terrace", "Business Services", "Event
