-- ENSURE ALL CATEGORIES ARE PROPERLY SEEDED
-- This script ensures all categories from the image are available in the database

-- First, let's check what categories we currently have
-- SELECT slug, name FROM public.categories WHERE is_active = true ORDER BY sort_order;

-- Insert any missing categories that might not be in the comprehensive seed data
INSERT INTO public.categories (id, name, slug, icon, description, sort_order, is_active) VALUES
-- Core categories that should always be present
('770e8400-e29b-41d4-a716-446655440021', 'Restaurants', 'restaurants', 'utensils-crossed', 'Restaurants and dining establishments', 1, true),
('770e8400-e29b-41d4-a716-446655440022', 'Hotels', 'hotels', 'bed', 'Hotels and accommodation', 2, true),
('770e8400-e29b-41d4-a716-446655440023', 'Banks', 'banks', 'building', 'Banking and financial institutions', 3, true),
('770e8400-e29b-41d4-a716-446655440024', 'Hospitals', 'hospitals', 'hospital', 'Hospitals and medical centers', 4, true),
('770e8400-e29b-41d4-a716-446655440025', 'Schools', 'schools', 'graduation-cap', 'Educational institutions', 5, true),
('770e8400-e29b-41d4-a716-446655440026', 'Shopping', 'shopping', 'shopping-bag', 'Shopping centers and retail', 6, true),
('770e8400-e29b-41d4-a716-446655440027', 'Dentists', 'dentists', 'stethoscope', 'Dental care services', 7, true),
('770e8400-e29b-41d4-a716-446655440028', 'Auto Repair', 'auto-repair', 'wrench', 'Automotive repair and maintenance', 8, true),
('770e8400-e29b-41d4-a716-446655440029', 'Lawyers', 'lawyers', 'scale', 'Legal services and attorneys', 9, true),
('770e8400-e29b-41d4-a716-446655440030', 'Pharmacies', 'pharmacies', 'pill', 'Pharmacies and drug stores', 10, true),
('770e8400-e29b-41d4-a716-446655440031', 'Museums', 'museums', 'building-2', 'Cultural and historical museums', 11, true),
('770e8400-e29b-41d4-a716-446655440032', 'Coffee Shops', 'coffee-shops', 'coffee', 'Specialty coffee and cafes', 12, true),
('770e8400-e29b-41d4-a716-446655440033', 'Gyms & Fitness', 'gyms-fitness', 'dumbbell', 'Fitness centers and gyms', 13, true),
('770e8400-e29b-41d4-a716-446655440034', 'Beauty Salons', 'beauty-salons', 'scissors', 'Hair and beauty services', 14, true),
('770e8400-e29b-41d4-a716-446655440035', 'Pet Services', 'pet-services', 'heart', 'Pet care and veterinary services', 15, true),
('770e8400-e29b-41d4-a716-446655440036', 'Airports', 'airports', 'plane', 'Airports and aviation services', 16, true),
('770e8400-e29b-41d4-a716-446655440037', 'Bars', 'bars', 'wine', 'Bars and pubs', 17, true),
('770e8400-e29b-41d4-a716-446655440038', 'Clinics', 'clinics', 'stethoscope', 'Medical clinics and health centers', 18, true),
('770e8400-e29b-41d4-a716-446655440039', 'Real Estate', 'real-estate', 'home', 'Real estate agencies and properties', 19, true),
('770e8400-e29b-41d4-a716-446655440040', 'Transportation', 'transportation', 'truck', 'Transport and logistics services', 20, true),
('770e8400-e29b-41d4-a716-446655440041', 'Bars', 'bars', 'wine', 'Bars and pubs', 21, true),
('770e8400-e29b-41d4-a716-446655440042', 'Bookstores', 'bookstores', 'book-open', 'Bookstores and libraries', 22, true),
('770e8400-e29b-41d4-a716-446655440043', 'Cafes', 'cafes', 'coffee', 'Cafes and coffee shops', 23, true),
('770e8400-e29b-41d4-a716-446655440044', 'Cinemas & Theatres', 'cinemas-theatres', 'film', 'Movie theaters and performance venues', 24, true),
('770e8400-e29b-41d4-a716-446655440045', 'Clubs (Professional)', 'clubs-professional', 'users', 'Professional and business clubs', 25, true),
('770e8400-e29b-41d4-a716-446655440046', 'Clubs (Leisure)', 'clubs-leisure', 'users', 'Leisure and social clubs', 26, true),
('770e8400-e29b-41d4-a716-446655440047', 'Doctors', 'doctors', 'user', 'Medical doctors and physicians', 27, true),
('770e8400-e29b-41d4-a716-446655440048', 'Faith', 'faith', 'church', 'Religious institutions and places of worship', 28, true),
('770e8400-e29b-41d4-a716-446655440049', 'Farms', 'farms', 'leaf', 'Agricultural farms and services', 29, true),
('770e8400-e29b-41d4-a716-446655440050', 'Galleries (Art)', 'galleries-art', 'palette', 'Art galleries and exhibitions', 30, true),
('770e8400-e29b-41d4-a716-446655440051', 'Government', 'government', 'landmark', 'Government offices and services', 31, true),
('770e8400-e29b-41d4-a716-446655440052', 'Libraries', 'libraries', 'book', 'Public and private libraries', 32, true),
('770e8400-e29b-41d4-a716-446655440053', 'Markets', 'markets', 'shopping-bag', 'Local markets and bazaars', 33, true),
('770e8400-e29b-41d4-a716-446655440054', 'Parks', 'parks', 'trees', 'Public parks and recreational areas', 34, true),
('770e8400-e29b-41d4-a716-446655440055', 'Post Offices', 'post-offices', 'mail', 'Postal services and mail centers', 35, true),
('770e8400-e29b-41d4-a716-446655440056', 'Recreation', 'recreation', 'gamepad-2', 'Recreational facilities and activities', 36, true),
('770e8400-e29b-41d4-a716-446655440057', 'Salons', 'salons', 'scissors', 'Hair salons and beauty services', 37, true),
('770e8400-e29b-41d4-a716-446655440058', 'Services', 'services', 'wrench', 'General services and maintenance', 38, true),
('770e8400-e29b-41d4-a716-446655440059', 'Tours', 'tours', 'car', 'Tourism and travel services', 39, true),
('770e8400-e29b-41d4-a716-446655440060', 'Universities', 'universities', 'graduation-cap', 'Higher education institutions', 40, true),
('770e8400-e29b-41d4-a716-446655440061', 'Utilities', 'utilities', 'zap', 'Utility services and infrastructure', 41, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order,
  is_active = EXCLUDED.is_active;

-- Verify all categories are present
-- SELECT COUNT(*) as total_categories FROM public.categories WHERE is_active = true;
-- SELECT slug, name, sort_order FROM public.categories WHERE is_active = true ORDER BY sort_order; 