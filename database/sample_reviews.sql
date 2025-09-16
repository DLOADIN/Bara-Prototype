-- Sample Reviews Data for Testing
-- This script adds sample reviews to existing businesses

-- First, let's get some business IDs to work with
-- We'll add reviews for businesses that exist in the database

-- Sample reviews for testing the review history functionality
INSERT INTO reviews (id, business_id, user_id, rating, title, content, images, status, helpful_count, created_at, updated_at)
VALUES 
  -- Reviews for business 1 (if exists)
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 0), null, 5, 'Excellent Service!', 'Great experience, highly recommend this business. The staff was friendly and professional.', null, 'approved', 3, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 0), null, 4, 'Very Good', 'Good quality service, would visit again. Minor issues but overall satisfied.', null, 'approved', 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 0), null, 5, 'Outstanding!', 'Exceeded my expectations. Will definitely come back and tell my friends about this place.', null, 'approved', 5, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  
  -- Reviews for business 2 (if exists)
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 1), null, 3, 'Average Experience', 'It was okay, nothing special but not bad either. Could be better.', null, 'approved', 0, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 1), null, 4, 'Good Value', 'Good value for money. Service was decent and staff was helpful.', null, 'approved', 2, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 1), null, 5, 'Amazing!', 'Fantastic experience! Highly recommend to everyone. Great atmosphere and excellent service.', null, 'approved', 4, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  
  -- Reviews for business 3 (if exists)
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 2), null, 2, 'Not Impressed', 'Service was slow and quality was below expectations. Would not recommend.', null, 'approved', 0, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 2), null, 4, 'Pretty Good', 'Overall good experience. Some areas for improvement but generally satisfied.', null, 'approved', 1, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 2), null, 5, 'Perfect!', 'Everything was perfect! Great service, friendly staff, and excellent quality. Will definitely return.', null, 'approved', 6, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
  
  -- Additional reviews for more variety
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 0), null, 4, 'Good Experience', 'Had a good time here. Staff was knowledgeable and helpful.', null, 'approved', 2, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 1), null, 3, 'Decent', 'It was okay, nothing to write home about but not terrible either.', null, 'approved', 0, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 2), null, 5, 'Excellent!', 'One of the best experiences I have had. Highly recommend to everyone!', null, 'approved', 3, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
  
  -- Pending reviews
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 0), null, 4, 'Good Service', 'Service was good, waiting for approval.', null, 'pending', 0, NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'),
  (gen_random_uuid(), (SELECT id FROM businesses LIMIT 1 OFFSET 1), null, 5, 'Great Place', 'Really enjoyed my visit, waiting for review approval.', null, 'pending', 0, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 hours');

-- Update business ratings based on reviews
UPDATE businesses 
SET rating = (
  SELECT AVG(rating)::numeric(3,2) 
  FROM reviews 
  WHERE business_id = businesses.id 
  AND status = 'approved'
),
review_count = (
  SELECT COUNT(*) 
  FROM reviews 
  WHERE business_id = businesses.id 
  AND status = 'approved'
)
WHERE id IN (SELECT DISTINCT business_id FROM reviews);
