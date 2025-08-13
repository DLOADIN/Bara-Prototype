-- COMPREHENSIVE SEED DATA FOR BARA APP
-- This file combines and enhances data from both sample files with valid UUIDs

-- =============================================
-- COUNTRIES DATA (12 countries)
-- =============================================

INSERT INTO public.countries (id, name, code, flag_url, description, population, capital, currency, language) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Rwanda', 'RW', '🇷🇼', 'Land of a Thousand Hills', 13276544, 'Kigali', 'RWF', 'Kinyarwanda, French, English'),
('550e8400-e29b-41d4-a716-446655440002', 'Kenya', 'KE', '🇰🇪', 'Magical Kenya', 53771296, 'Nairobi', 'KES', 'Swahili, English'),
('550e8400-e29b-41d4-a716-446655440003', 'Uganda', 'UG', '🇺🇬', 'Pearl of Africa', 45741007, 'Kampala', 'UGX', 'English, Swahili'),
('550e8400-e29b-41d4-a716-446655440004', 'Tanzania', 'TZ', '🇹🇿', 'United Republic of Tanzania', 59734218, 'Dodoma', 'TZS', 'Swahili, English'),
('550e8400-e29b-41d4-a716-446655440005', 'Ethiopia', 'ET', '🇪🇹', 'Land of Origins', 114963588, 'Addis Ababa', 'ETB', 'Amharic, English'),
('550e8400-e29b-41d4-a716-446655440006', 'Ghana', 'GH', '🇬🇭', 'Gateway to Africa', 31072940, 'Accra', 'GHS', 'English'),
('550e8400-e29b-41d4-a716-446655440007', 'Nigeria', 'NG', '🇳🇬', 'Giant of Africa', 206139589, 'Abuja', 'NGN', 'English'),
('550e8400-e29b-41d4-a716-446655440008', 'Botswana', 'BW', '🇧🇼', 'Pula!', 2351627, 'Gaborone', 'BWP', 'English, Tswana'),
('550e8400-e29b-41d4-a716-446655440009', 'South Africa', 'ZA', '🇿🇦', 'Rainbow Nation', 59308690, 'Pretoria', 'ZAR', 'English, Afrikaans, Zulu, Xhosa'),
('550e8400-e29b-41d4-a716-446655440010', 'Egypt', 'EG', '🇪🇬', 'Land of the Pharaohs', 102334404, 'Cairo', 'EGP', 'Arabic, English'),
('550e8400-e29b-41d4-a716-446655440011', 'Morocco', 'MA', '🇲🇦', 'Gateway to Africa', 36910560, 'Rabat', 'MAD', 'Arabic, French, Berber'),
('550e8400-e29b-41d4-a716-446655440012', 'Senegal', 'SN', '🇸🇳', 'Gateway to West Africa', 16743927, 'Dakar', 'XOF', 'French, Wolof')
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- CITIES DATA (20 major cities)
-- =============================================

INSERT INTO public.cities (id, name, country_id, latitude, longitude, population) VALUES
-- Rwanda Cities
('660e8400-e29b-41d4-a716-446655440001', 'Kigali', '550e8400-e29b-41d4-a716-446655440001', -1.9441, 30.0619, 1132686),
('660e8400-e29b-41d4-a716-446655440002', 'Butare', '550e8400-e29b-41d4-a716-446655440001', -2.5967, 29.7378, 89600),

-- Kenya Cities
('660e8400-e29b-41d4-a716-446655440003', 'Nairobi', '550e8400-e29b-41d4-a716-446655440002', -1.2921, 36.8219, 4397073),
('660e8400-e29b-41d4-a716-446655440004', 'Mombasa', '550e8400-e29b-41d4-a716-446655440002', -4.0435, 39.6682, 1200000),

-- Uganda Cities
('660e8400-e29b-41d4-a716-446655440005', 'Kampala', '550e8400-e29b-41d4-a716-446655440003', 0.3476, 32.5825, 1507080),
('660e8400-e29b-41d4-a716-446655440006', 'Jinja', '550e8400-e29b-41d4-a716-446655440003', 0.4244, 33.2041, 76057),

-- Tanzania Cities
('660e8400-e29b-41d4-a716-446655440007', 'Dar es Salaam', '550e8400-e29b-41d4-a716-446655440004', -6.8235, 39.2695, 4364541),
('660e8400-e29b-41d4-a716-446655440008', 'Arusha', '550e8400-e29b-41d4-a716-446655440004', -3.3731, 36.6827, 416442),

-- Ethiopia Cities
('660e8400-e29b-41d4-a716-446655440009', 'Addis Ababa', '550e8400-e29b-41d4-a716-446655440005', 9.0320, 38.7488, 3352000),
('660e8400-e29b-41d4-a716-446655440010', 'Dire Dawa', '550e8400-e29b-41d4-a716-446655440005', 9.5931, 41.8661, 440000),

-- Ghana Cities
('660e8400-e29b-41d4-a716-446655440011', 'Accra', '550e8400-e29b-41d4-a716-446655440006', 5.5600, -0.2057, 2388000),
('660e8400-e29b-41d4-a716-446655440012', 'Kumasi', '550e8400-e29b-41d4-a716-446655440006', 6.7000, -1.6167, 2035064),

-- Nigeria Cities
('660e8400-e29b-41d4-a716-446655440013', 'Lagos', '550e8400-e29b-41d4-a716-446655440007', 6.5244, 3.3792, 14862000),
('660e8400-e29b-41d4-a716-446655440014', 'Abuja', '550e8400-e29b-41d4-a716-446655440007', 9.0820, 7.3986, 1235880),

-- South Africa Cities
('660e8400-e29b-41d4-a716-446655440015', 'Johannesburg', '550e8400-e29b-41d4-a716-446655440009', -26.2041, 28.0473, 9574414),
('660e8400-e29b-41d4-a716-446655440016', 'Cape Town', '550e8400-e29b-41d4-a716-446655440009', -33.9249, 18.4241, 433688),

-- Egypt Cities
('660e8400-e29b-41d4-a716-446655440017', 'Cairo', '550e8400-e29b-41d4-a716-446655440010', 30.0444, 31.2357, 9539000),
('660e8400-e29b-41d4-a716-446655440018', 'Alexandria', '550e8400-e29b-41d4-a716-446655440010', 31.2001, 29.9187, 5086290),

-- Morocco Cities
('660e8400-e29b-41d4-a716-446655440019', 'Casablanca', '550e8400-e29b-41d4-a716-446655440011', 33.5731, -7.5898, 3350000),
('660e8400-e29b-41d4-a716-446655440020', 'Marrakech', '550e8400-e29b-41d4-a716-446655440011', 31.6295, -7.9811, 928850)
ON CONFLICT (name, country_id) DO NOTHING;

-- =============================================
-- CATEGORIES DATA (20 core categories)
-- =============================================

INSERT INTO public.categories (id, name, slug, icon, description, sort_order, is_active) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Restaurants', 'restaurants', 'utensils-crossed', 'Restaurants and dining establishments', 1, true),
('770e8400-e29b-41d4-a716-446655440002', 'Hotels', 'hotels', 'bed', 'Hotels and accommodation', 2, true),
('770e8400-e29b-41d4-a716-446655440003', 'Banks', 'banks', 'building', 'Banking and financial institutions', 3, true),
('770e8400-e29b-41d4-a716-446655440004', 'Hospitals', 'hospitals', 'hospital', 'Hospitals and medical centers', 4, true),
('770e8400-e29b-41d4-a716-446655440005', 'Schools', 'schools', 'graduation-cap', 'Educational institutions', 5, true),
('770e8400-e29b-41d4-a716-446655440006', 'Shopping', 'shopping', 'shopping-bag', 'Shopping centers and retail', 6, true),
('770e8400-e29b-41d4-a716-446655440007', 'Dentists', 'dentists', 'stethoscope', 'Dental care services', 7, true),
('770e8400-e29b-41d4-a716-446655440008', 'Auto Repair', 'auto-repair', 'wrench', 'Automotive repair and maintenance', 8, true),
('770e8400-e29b-41d4-a716-446655440009', 'Lawyers', 'lawyers', 'scale', 'Legal services and attorneys', 9, true),
('770e8400-e29b-41d4-a716-446655440010', 'Pharmacies', 'pharmacies', 'pill', 'Pharmacies and drug stores', 10, true),
('770e8400-e29b-41d4-a716-446655440011', 'Museums', 'museums', 'building-2', 'Cultural and historical museums', 11, true),
('770e8400-e29b-41d4-a716-446655440012', 'Coffee Shops', 'coffee-shops', 'coffee', 'Specialty coffee and cafes', 12, true),
('770e8400-e29b-41d4-a716-446655440013', 'Gyms & Fitness', 'gyms-fitness', 'dumbbell', 'Fitness centers and gyms', 13, true),
('770e8400-e29b-41d4-a716-446655440014', 'Beauty Salons', 'beauty-salons', 'scissors', 'Hair and beauty services', 14, true),
('770e8400-e29b-41d4-a716-446655440015', 'Pet Services', 'pet-services', 'heart', 'Pet care and veterinary services', 15, true),
('770e8400-e29b-41d4-a716-446655440016', 'Airports', 'airports', 'plane', 'Airports and aviation services', 16, true),
('770e8400-e29b-41d4-a716-446655440017', 'Bars', 'bars', 'wine', 'Bars and pubs', 17, true),
('770e8400-e29b-41d4-a716-446655440018', 'Clinics', 'clinics', 'stethoscope', 'Medical clinics and health centers', 18, true),
('770e8400-e29b-41d4-a716-446655440019', 'Real Estate', 'real-estate', 'home', 'Real estate agencies and properties', 19, true),
('770e8400-e29b-41d4-a716-446655440020', 'Transportation', 'transportation', 'truck', 'Transport and logistics services', 20, true)
ON CONFLICT (slug) DO NOTHING; 