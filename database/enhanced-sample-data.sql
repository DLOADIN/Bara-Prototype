-- Enhanced Sample Data for Bara App
-- This script populates the database with comprehensive business data

-- Insert additional countries
INSERT INTO public.countries (id, name, code, flag_url, description, population, capital, currency, language) VALUES
('550e8400-e29b-41d4-a716-446655440009', 'South Africa', 'ZA', '🇿🇦', 'Rainbow Nation', 59308690, 'Pretoria', 'ZAR', 'English, Afrikaans, Zulu, Xhosa'),
('550e8400-e29b-41d4-a716-446655440010', 'Egypt', 'EG', '🇪🇬', 'Land of the Pharaohs', 102334404, 'Cairo', 'EGP', 'Arabic, English'),
('550e8400-e29b-41d4-a716-446655440011', 'Morocco', 'MA', '🇲🇦', 'Gateway to Africa', 36910560, 'Rabat', 'MAD', 'Arabic, French, Berber'),
('550e8400-e29b-41d4-a716-446655440012', 'Senegal', 'SN', '🇸🇳', 'Gateway to West Africa', 16743927, 'Dakar', 'XOF', 'French, Wolof')
ON CONFLICT (code) DO NOTHING;

-- Insert additional cities
INSERT INTO public.cities (id, name, country_id, latitude, longitude, population) VALUES
('660e8400-e29b-41d4-a716-446655440009', 'Johannesburg', '550e8400-e29b-41d4-a716-446655440009', -26.2041, 28.0473, 9574414),
('660e8400-e29b-41d4-a716-446655440010', 'Cape Town', '550e8400-e29b-41d4-a716-446655440009', -33.9249, 18.4241, 433688),
('660e8400-e29b-41d4-a716-446655440011', 'Cairo', '550e8400-e29b-41d4-a716-446655440010', 30.0444, 31.2357, 9539000),
('660e8400-e29b-41d4-a716-446655440012', 'Casablanca', '550e8400-e29b-41d4-a716-446655440011', 33.5731, -7.5898, 3350000),
('660e8400-e29b-41d4-a716-446655440013', 'Dakar', '550e8400-e29b-41d4-a716-446655440012', 14.7167, -17.4677, 3150000)
ON CONFLICT (name, country_id) DO NOTHING;

-- Insert additional businesses across different countries
INSERT INTO public.businesses (id, name, slug, description, category_id, city_id, country_id, phone, email, website, address, status, is_premium, is_verified) VALUES
-- Nairobi, Kenya - Restaurants
('880e8400-e29b-41d4-a716-446655440022', 'Carnivore Restaurant', 'carnivore-restaurant-nairobi', 'Famous meat restaurant serving game meat and traditional Kenyan dishes', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '+254 20 600 5933', 'info@carnivore.co.ke', 'www.carnivore.co.ke', 'Langata Road, Nairobi, Kenya', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440023', 'Tamarind Restaurant', 'tamarind-restaurant-nairobi', 'Elegant seafood restaurant with stunning city views', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '+254 20 221 0000', 'reservations@tamarind.co.ke', 'www.tamarind.co.ke', 'Herbert Macaulay Way, Nairobi, Kenya', 'active', true, true),

-- Nairobi, Kenya - Hotels
('880e8400-e29b-41d4-a716-446655440024', 'Nairobi Serena Hotel', 'nairobi-serena-hotel', 'Luxury 5-crownhotel in the heart of Nairobi', '770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '+254 20 284 2000', 'reservations@serena.co.ke', 'www.serenahotels.com', 'Central Park Road, Nairobi, Kenya', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440025', 'Fairmont The Norfolk', 'fairmont-norfolk-nairobi', 'Historic luxury hotel with colonial charm', '770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '+254 20 226 5000', 'norfolk@fairmont.com', 'www.fairmont.com', 'Harry Thuku Road, Nairobi, Kenya', 'active', true, true),

-- Kampala, Uganda - Restaurants
('880e8400-e29b-41d4-a716-446655440026', 'Cafe Javas', 'cafe-javas-kampala', 'Popular coffee shop and restaurant chain', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '+256 414 234 567', 'info@cafejavas.com', 'www.cafejavas.com', 'Garden City Mall, Kampala, Uganda', 'active', false, true),
('880e8400-e29b-41d4-a716-446655440027', 'Fang Fang Restaurant', 'fang-fang-kampala', 'Authentic Chinese cuisine in Kampala', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '+256 414 345 678', 'contact@fangfang.ug', 'www.fangfang.ug', 'Kampala Road, Kampala, Uganda', 'active', true, false),

-- Dar es Salaam, Tanzania - Banks
('880e8400-e29b-41d4-a716-446655440028', 'CRDB Bank', 'crdb-bank-dar', 'Leading commercial bank in Tanzania', '770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '+255 22 286 3000', 'info@crdb.co.tz', 'www.crdb.co.tz', 'Ohio Street, Dar es Salaam, Tanzania', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440029', 'NMB Bank', 'nmb-bank-dar', 'National Microfinance Bank of Tanzania', '770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '+255 22 232 3000', 'customercare@nmb.co.tz', 'www.nmb.co.tz', 'Ohio Street, Dar es Salaam, Tanzania', 'active', false, true),

-- Addis Ababa, Ethiopia - Hospitals
('880e8400-e29b-41d4-a716-446655440030', 'Tikur Anbessa Hospital', 'tikur-anbessa-hospital', 'Largest referral hospital in Ethiopia', '770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '+251 11 123 4567', 'info@tah.edu.et', 'www.tah.edu.et', 'Lideta, Addis Ababa, Ethiopia', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440031', 'Bethel Hospital', 'bethel-hospital-addis', 'Private hospital with modern facilities', '770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '+251 11 234 5678', 'contact@bethelhospital.et', 'www.bethelhospital.et', 'Bole, Addis Ababa, Ethiopia', 'active', true, false),

-- Accra, Ghana - Schools
('880e8400-e29b-41d4-a716-446655440032', 'Ghana International School', 'ghana-international-school', 'International school offering IB curriculum', '770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', '+233 30 277 5000', 'admissions@gis.edu.gh', 'www.gis.edu.gh', '2nd Circular Road, Accra, Ghana', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440033', 'Lincoln Community School', 'lincoln-community-school-accra', 'American international school in Accra', '770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', '+233 30 277 6000', 'info@lincoln.edu.gh', 'www.lincoln.edu.gh', 'Abelenkpe, Accra, Ghana', 'active', true, true),

-- Lagos, Nigeria - Shopping
('880e8400-e29b-41d4-a716-446655440034', 'Lagos City Mall', 'lagos-city-mall', 'Modern shopping center with international brands', '770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', '+234 1 234 5678', 'info@lagoscitymall.com', 'www.lagoscitymall.com', 'Victoria Island, Lagos, Nigeria', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440035', 'The Palms Shopping Mall', 'palms-shopping-mall-lagos', 'Luxury shopping destination in Lagos', '770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', '+234 1 345 6789', 'contact@thepalms.com.ng', 'www.thepalms.com.ng', 'Lekki, Lagos, Nigeria', 'active', true, true),

-- Johannesburg, South Africa - Restaurants
('880e8400-e29b-41d4-a716-446655440036', 'Moyo Restaurant', 'moyo-restaurant-johannesburg', 'African fusion cuisine with live entertainment', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440009', '+27 11 234 5678', 'info@moyo.co.za', 'www.moyo.co.za', 'Melrose Arch, Johannesburg, South Africa', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440037', 'The Butcher Shop', 'butcher-shop-johannesburg', 'Premium steakhouse and grill', '770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440009', '+27 11 345 6789', 'reservations@butchershop.co.za', 'www.butchershop.co.za', 'Sandton, Johannesburg, South Africa', 'active', true, true),

-- Cape Town, South Africa - Hotels
('880e8400-e29b-41d4-a716-446655440038', 'Mount Nelson Hotel', 'mount-nelson-hotel-cape-town', 'Historic luxury hotel with Table Mountain views', '770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440009', '+27 21 483 1000', 'reservations@mountnelson.co.za', 'www.mountnelson.co.za', '76 Orange Street, Cape Town, South Africa', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440039', 'One&Only Cape Town', 'one-only-cape-town', 'Ultra-luxury hotel on the V&A Waterfront', '770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440009', '+27 21 431 5888', 'reservations@oneandonlycapetown.com', 'www.oneandonlyresorts.com', 'V&A Waterfront, Cape Town, South Africa', 'active', true, true),

-- Cairo, Egypt - Museums
('880e8400-e29b-41d4-a716-446655440040', 'Egyptian Museum', 'egyptian-museum-cairo', 'World-famous museum of ancient Egyptian artifacts', '770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440010', '+20 2 2579 6948', 'info@egyptianmuseum.gov.eg', 'www.egyptianmuseum.gov.eg', 'Tahrir Square, Cairo, Egypt', 'active', true, true),
('880e8400-e29b-41d4-a716-446655440041', 'Grand Egyptian Museum', 'grand-egyptian-museum', 'New museum showcasing the complete Tutankhamun collection', '770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440010', '+20 2 2345 6789', 'info@gem.gov.eg', 'www.gem.gov.eg', 'Giza Plateau, Cairo, Egypt', 'active', true, true)
ON CONFLICT (slug) DO NOTHING;

-- Insert additional categories
INSERT INTO public.categories (id, name, slug, icon, description, sort_order, is_active) VALUES
('770e8400-e29b-41d4-a716-446655440011', 'Museums', 'museums', 'building-2', 'Cultural and historical museums', 11, true),
('770e8400-e29b-41d4-a716-446655440012', 'Coffee Shops', 'coffee-shops', 'coffee', 'Specialty coffee and cafes', 12, true),
('770e8400-e29b-41d4-a716-446655440013', 'Gyms & Fitness', 'gyms-fitness', 'dumbbell', 'Fitness centers and gyms', 13, true),
('770e8400-e29b-41d4-a716-446655440014', 'Beauty Salons', 'beauty-salons', 'scissors', 'Hair and beauty services', 14, true),
('770e8400-e29b-41d4-a716-446655440015', 'Pet Services', 'pet-services', 'heart', 'Pet care and veterinary services', 15, true)
ON CONFLICT (slug) DO NOTHING; 