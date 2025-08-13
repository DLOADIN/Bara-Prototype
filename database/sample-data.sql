-- Sample data for Bara App testing
-- This script populates the database with sample businesses and categories

-- Insert sample countries
INSERT INTO public.countries (id, name, code, flag_url, description, population, capital, currency, language) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Rwanda', 'RW', '🇷🇼', 'Land of a Thousand Hills', 13276544, 'Kigali', 'RWF', 'Kinyarwanda, French, English'),
('550e8400-e29b-41d4-a716-446655440002', 'Kenya', 'KE', '🇰🇪', 'Magical Kenya', 53771296, 'Nairobi', 'KES', 'Swahili, English'),
('550e8400-e29b-41d4-a716-446655440003', 'Uganda', 'UG', '🇺🇬', 'Pearl of Africa', 45741007, 'Kampala', 'UGX', 'English, Swahili'),
('550e8400-e29b-41d4-a716-446655440004', 'Tanzania', 'TZ', '🇹🇿', 'United Republic of Tanzania', 59734218, 'Dodoma', 'TZS', 'Swahili, English'),
('550e8400-e29b-41d4-a716-446655440005', 'Ethiopia', 'ET', '🇪🇹', 'Land of Origins', 114963588, 'Addis Ababa', 'ETB', 'Amharic, English'),
('550e8400-e29b-41d4-a716-446655440006', 'Ghana', 'GH', '🇬🇭', 'Gateway to Africa', 31072940, 'Accra', 'GHS', 'English'),
('550e8400-e29b-41d4-a716-446655440007', 'Nigeria', 'NG', '🇳🇬', 'Giant of Africa', 206139589, 'Abuja', 'NGN', 'English'),
('550e8400-e29b-41d4-a716-446655440008', 'Botswana', 'BW', '🇧🇼', 'Pula!', 2351627, 'Gaborone', 'BWP', 'English, Tswana')
ON CONFLICT (code) DO NOTHING;

-- Insert sample cities
INSERT INTO public.cities (id, name, country_id, latitude, longitude, population) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Kigali', '550e8400-e29b-41d4-a716-446655440001', -1.9441, 30.0619, 1132686),
('660e8400-e29b-41d4-a716-446655440002', 'Nairobi', '550e8400-e29b-41d4-a716-446655440002', -1.2921, 36.8219, 4397073),
('660e8400-e29b-41d4-a716-446655440003', 'Kampala', '550e8400-e29b-41d4-a716-446655440003', 0.3476, 32.5825, 1507080),
('660e8400-e29b-41d4-a716-446655440004', 'Dar es Salaam', '550e8400-e29b-41d4-a716-446655440004', -6.8235, 39.2695, 4364541),
('660e8400-e29b-41d4-a716-446655440005', 'Addis Ababa', '550e8400-e29b-41d4-a716-446655440005', 9.0320, 38.7488, 3352000),
('660e8400-e29b-41d4-a716-446655440006', 'Accra', '550e8400-e29b-41d4-a716-446655440006', 5.5600, -0.2057, 2388000),
('660e8400-e29b-41d4-a716-446655440007', 'Lagos', '550e8400-e29b-41d4-a716-446655440007', 6.5244, 3.3792, 14862000),
('660e8400-e29b-41d4-a716-446655440008', 'Gaborone', '550e8400-e29b-41d4-a716-446655440008', -24.6282, 25.9231, 231592)
ON CONFLICT (name, country_id) DO NOTHING;

-- Insert sample categories
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

-- Insert sample businesses
INSERT INTO public.businesses (id, name, slug, description, category_id, city_id, country_id, phone, email, website, address, status, is_premium, is_verified) VALUES
-- Restaurants in Kigali
('880e8400-e29b-41d4-a716-446655440001', 'The Hut Restaurant', 'the-hut-restaurant', 'Exquisite dining experience featuring continental and traditional Rwandan cuisine', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 777 888', 'info@hutrestaurant.com', 'www.hutrestaurant.com', 'KN 2 Ave, Kigali, Rwanda', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440002', 'Mama''s Kitchen', 'mamas-kitchen', 'Traditional Rwandan cuisine in a family-friendly atmosphere', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 888 999', 'contact@mamaskitchen.com', 'www.mamaskitchen.com', 'Remera, Kigali, Rwanda', 'active', false, true),
('880e8400-e29b-41d4-a716-446655440003', 'Urban Bistro', 'urban-bistro', 'Modern bistro serving international cuisine with local flair', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 999 111', 'hello@urbanbistro.com', 'www.urbanbistro.com', 'Nyarutarama, Kigali, Rwanda', 'active', true, false),

-- Dentists in Kigali
('880e8400-e29b-41d4-a716-446655440004', 'Elite Dental Care', 'elite-dental-care', 'Premier dental service provider with state-of-the-art equipment', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 123 456', 'info@elitedentalrw.com', 'www.elitedentalrw.com', 'KN 4 Ave, Kigali, Rwanda', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440005', 'SmileCare Clinic', 'smilecare-clinic', 'Comprehensive dental care for the whole family', '770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 234 567', 'contact@smilecarerw.com', 'www.smilecarerw.com', 'Kimihurura, Kigali, Rwanda', 'active', false, true),

-- Auto Repair in Kigali
('880e8400-e29b-41d4-a716-446655440006', 'Elite Auto Service', 'elite-auto-service', 'Trusted automotive repair center with certified technicians', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 111 222', 'service@eliteautorw.com', 'www.eliteautorw.com', 'KN 3 Rd, Kigali, Rwanda', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440007', 'Quick Fix Garage', 'quick-fix-garage', 'Fast and reliable auto repair services', '770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 222 333', 'info@quickfixrw.com', 'www.quickfixrw.com', 'Kimisagara, Kigali, Rwanda', 'active', false, false),

-- Lawyers in Kigali
('880e8400-e29b-41d4-a716-446655440008', 'Kigali Legal Associates', 'kigali-legal-associates', 'Professional legal services for individuals and businesses', '770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 222 444', 'contact@kigalilegal.com', 'www.kigalilegal.com', 'KN 1 Ave, Kigali, Rwanda', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440009', 'Rwanda Law Chambers', 'rwanda-law-chambers', 'Comprehensive legal solutions and representation', '770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 333 555', 'info@rwandalaw.com', 'www.rwandalaw.com', 'Kacyiru, Kigali, Rwanda', 'active', false, true),

-- Hotels in Kigali
('880e8400-e29b-41d4-a716-446655440010', 'Kigali Serena Hotel', 'kigali-serena-hotel', 'Luxury hotel in the heart of Kigali', '770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 444 666', 'reservations@serena.co.rw', 'www.serenahotels.com', 'KN 3 Ave, Kigali, Rwanda', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440011', 'Hotel des Mille Collines', 'hotel-des-mille-collines', 'Historic hotel with modern amenities', '770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 555 777', 'info@millecollines.rw', 'www.millecollines.rw', 'KN 6 Ave, Kigali, Rwanda', 'active', true, true),

-- Banks in Kigali
('880e8400-e29b-41d4-a716-446655440012', 'Bank of Kigali', 'bank-of-kigali', 'Leading commercial bank in Rwanda', '770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 666 888', 'info@bk.rw', 'www.bk.rw', 'KN 4 Ave, Kigali, Rwanda', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440013', 'Ecobank Rwanda', 'ecobank-rwanda', 'Pan-African banking services', '770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 777 999', 'contact@ecobank.rw', 'www.ecobank.com', 'KN 2 Ave, Kigali, Rwanda', 'active', false, true),

-- Pharmacies in Kigali
('880e8400-e29b-41d4-a716-446655440014', 'Kigali Pharmacy', 'kigali-pharmacy', 'Full-service pharmacy with prescription and over-the-counter medications', '770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 888 000', 'info@kigalipharmacy.com', 'www.kigalipharmacy.com', 'Remera, Kigali, Rwanda', 'active', false, true),
('880e8400-e29b-41d4-a716-446655440015', 'Health Plus Pharmacy', 'health-plus-pharmacy', 'Your health and wellness partner', '770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 999 000', 'contact@healthplus.rw', 'www.healthplus.rw', 'Kimihurura, Kigali, Rwanda', 'active', true, false),

-- Schools in Kigali
('880e8400-e29b-41d4-a716-446655440016', 'Kigali International Community School', 'kigali-international-community-school', 'International education for expatriate and local families', '770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 000 111', 'admissions@kicsrw.org', 'www.kicsrw.org', 'Nyarutarama, Kigali, Rwanda', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440017', 'Green Hills Academy', 'green-hills-academy', 'Excellence in education since 1997', '770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 111 000', 'info@greenhillsacademy.rw', 'www.greenhillsacademy.rw', 'Kigali Heights, Kigali, Rwanda', 'active', true, true),

-- Hospitals in Kigali
('880e8400-e29b-41d4-a716-446655440018', 'King Faisal Hospital', 'king-faisal-hospital', 'Leading medical facility in Rwanda', '770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 222 000', 'info@kfh.rw', 'www.kfh.rw', 'KN 3 Rd, Kigali, Rwanda', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440019', 'Rwanda Military Hospital', 'rwanda-military-hospital', 'Comprehensive healthcare services', '770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 333 000', 'contact@rmh.rw', 'www.rmh.rw', 'Kanombe, Kigali, Rwanda', 'active', false, true),

-- Shopping in Kigali
('880e8400-e29b-41d4-a716-446655440020', 'Kigali City Tower', 'kigali-city-tower', 'Modern shopping center with international brands', '770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 444 000', 'info@kigalicitytower.com', 'www.kigalicitytower.com', 'KN 4 Ave, Kigali, Rwanda', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440021', 'Kigali Heights', 'kigali-heights', 'Luxury shopping and dining destination', '770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '+250 788 555 000', 'contact@kigaliheights.com', 'www.kigaliheights.com', 'KG 7 Ave, Kigali, Rwanda', 'active', true, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample reviews (for testing)
INSERT INTO public.reviews (id, business_id, user_id, rating, title, content, status, helpful_count) VALUES
('990e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000001', 5, 'Excellent dining experience', 'Amazing food and service. The atmosphere is perfect for both business meetings and romantic dinners.', 'approved', 12),
('990e8400-e29b-41d4-a716-446655440002', '880e8400-e29b-41d4-a716-446655440001', '00000000-0000-0000-0000-000000000002', 4, 'Great food, good service', 'The food was delicious and the staff was friendly. Would definitely recommend.', 'approved', 8),
('990e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440004', '00000000-0000-0000-0000-000000000003', 5, 'Professional dental care', 'Very professional and caring staff. The facility is modern and clean.', 'approved', 15),
('990e8400-e29b-41d4-a716-446655440004', '880e8400-e29b-41d4-a716-446655440006', '00000000-0000-0000-0000-000000000004', 4, 'Reliable auto service', 'Fixed my car quickly and professionally. Fair pricing and honest service.', 'approved', 6),
('990e8400-e29b-41d4-a716-446655440005', '880e8400-e29b-41d4-a716-446655440008', '00000000-0000-0000-0000-000000000005', 5, 'Excellent legal services', 'Very knowledgeable and professional. Helped me resolve my legal issues efficiently.', 'approved', 9)
ON CONFLICT (business_id, user_id) DO NOTHING; 