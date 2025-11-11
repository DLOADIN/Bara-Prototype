-- Add hashtags/tags support to events table
-- This migration adds a hashtags field to store multiple hashtags per event

-- Add hashtags column to events table
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create a GIN index on the hashtags array for fast searching
CREATE INDEX IF NOT EXISTS idx_events_tags ON public.events USING GIN(tags);

-- Create a function to get trending hashtags
CREATE OR REPLACE FUNCTION get_trending_hashtags(limit_count INTEGER DEFAULT 10)
RETURNS TABLE(hashtag TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    unnest(tags) as hashtag,
    COUNT(*) as count
  FROM public.events 
  WHERE tags IS NOT NULL 
    AND array_length(tags, 1) > 0
    AND event_status = 'upcoming'
    AND is_public = true
  GROUP BY unnest(tags)
  ORDER BY count DESC, hashtag ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create a function to search events by hashtags
CREATE OR REPLACE FUNCTION search_events_by_hashtags(search_hashtags TEXT[])
RETURNS TABLE(
  id UUID,
  title TEXT,
  description TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  tags TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    e.id,
    e.title,
    e.description,
    e.start_date,
    e.end_date,
    e.tags
  FROM public.events e
  WHERE e.tags && search_hashtags  -- Array overlap operator
    AND e.event_status = 'upcoming'
    AND e.is_public = true
  ORDER BY e.start_date ASC;
END;
$$ LANGUAGE plpgsql;

-- Add some sample hashtags to existing events (optional)
-- Update a few sample events with hashtags for testing
UPDATE public.events 
SET tags = CASE 
  WHEN category = 'technology' THEN ARRAY['tech', 'innovation', 'startup']
  WHEN category = 'music' THEN ARRAY['music', 'live', 'concert']
  WHEN category = 'business' THEN ARRAY['business', 'networking', 'entrepreneur']
  WHEN category = 'food' THEN ARRAY['food', 'culinary', 'restaurant']
  WHEN category = 'art' THEN ARRAY['art', 'creative', 'gallery']
  WHEN category = 'sports' THEN ARRAY['sports', 'fitness', 'competition']
  WHEN category = 'education' THEN ARRAY['education', 'learning', 'workshop']
  ELSE ARRAY['event', 'community']
END
WHERE tags IS NULL OR array_length(tags, 1) = 0;

-- Grant permissions for the new functions
GRANT EXECUTE ON FUNCTION get_trending_hashtags(INTEGER) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_events_by_hashtags(TEXT[]) TO anon, authenticated;