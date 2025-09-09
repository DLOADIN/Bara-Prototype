-- Drop existing tables if they exist to avoid conflicts
DROP TABLE IF EXISTS banner_ad_analytics CASCADE;
DROP TABLE IF EXISTS banner_ads CASCADE;

-- Banner Ads Table with proper defaults and constraints
CREATE TABLE banner_ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL CHECK (char_length(title) > 0),
  image_url TEXT NOT NULL CHECK (char_length(image_url) > 0),
  redirect_url TEXT NOT NULL CHECK (char_length(redirect_url) > 0),
  alt_text TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  total_views INTEGER NOT NULL DEFAULT 0 CHECK (total_views >= 0),
  total_clicks INTEGER NOT NULL DEFAULT 0 CHECK (total_clicks >= 0),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  -- Ensure end_date is after start_date if both are provided
  CONSTRAINT valid_date_range CHECK (
    start_date IS NULL OR 
    end_date IS NULL OR 
    end_date >= start_date
  )
);

-- Banner Ad Analytics Table for detailed tracking
CREATE TABLE banner_ad_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  banner_ad_id UUID NOT NULL REFERENCES banner_ads(id) ON DELETE CASCADE,
  event_type VARCHAR(20) NOT NULL CHECK (event_type IN ('view', 'click')),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  -- Add index on banner_ad_id for faster lookups
  CONSTRAINT fk_banner_ad FOREIGN KEY (banner_ad_id) REFERENCES banner_ads(id)
);

-- Indexes for better performance
CREATE INDEX idx_banner_ads_active ON banner_ads(is_active);
CREATE INDEX idx_banner_ads_dates ON banner_ads(start_date, end_date);
CREATE INDEX idx_banner_ads_created_at ON banner_ads(created_at);
CREATE INDEX idx_banner_ad_analytics_banner_id ON banner_ad_analytics(banner_ad_id);
CREATE INDEX idx_banner_ad_analytics_event_type ON banner_ad_analytics(event_type);
CREATE INDEX idx_banner_ad_analytics_created_at ON banner_ad_analytics(created_at);

-- Create a composite index for common queries
CREATE INDEX idx_banner_ads_active_dates ON banner_ads(is_active, start_date, end_date);

-- RLS Policies
-- Enable RLS on both tables
ALTER TABLE banner_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE banner_ad_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow all access to banner_ads" ON banner_ads;
DROP POLICY IF EXISTS "Allow all access to banner_ad_analytics" ON banner_ad_analytics;
DROP POLICY IF EXISTS "Public can view active banner ads" ON banner_ads;
DROP POLICY IF EXISTS "Public can insert analytics" ON banner_ad_analytics;

-- Banner Ads Table Policies
-- Allow public SELECT (read) access to all banner ads
CREATE POLICY "Public can view all banner ads" ON banner_ads
  FOR SELECT USING (true);

-- Allow public INSERT (create) access to banner ads
CREATE POLICY "Public can insert banner ads" ON banner_ads
  FOR INSERT WITH CHECK (true);

-- Allow public UPDATE access to banner ads
CREATE POLICY "Public can update banner ads" ON banner_ads
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow public DELETE access to banner ads
CREATE POLICY "Public can delete banner ads" ON banner_ads
  FOR DELETE USING (true);

-- Banner Ad Analytics Table Policies
-- Allow public SELECT (read) access to analytics
CREATE POLICY "Public can view analytics" ON banner_ad_analytics
  FOR SELECT USING (true);

-- Allow public INSERT (create) access to analytics
CREATE POLICY "Public can insert analytics" ON banner_ad_analytics
  FOR INSERT WITH CHECK (true);

-- Allow public UPDATE access to analytics
CREATE POLICY "Public can update analytics" ON banner_ad_analytics
  FOR UPDATE USING (true) WITH CHECK (true);

-- Allow public DELETE access to analytics
CREATE POLICY "Public can delete analytics" ON banner_ad_analytics
  FOR DELETE USING (true);

-- Grant necessary permissions to the anon and authenticated roles
GRANT ALL ON banner_ads TO anon, authenticated;
GRANT ALL ON banner_ad_analytics TO anon, authenticated;
GRANT ALL ON SEQUENCE banner_ads_id_seq TO anon, authenticated;
GRANT ALL ON SEQUENCE banner_ad_analytics_id_seq TO anon, authenticated;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_banner_ads_updated_at BEFORE UPDATE ON banner_ads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to increment banner ad views
CREATE OR REPLACE FUNCTION increment_banner_ad_views(banner_ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE banner_ads 
  SET total_views = total_views + 1 
  WHERE id = banner_ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment banner ad clicks
CREATE OR REPLACE FUNCTION increment_banner_ad_clicks(banner_ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE banner_ads 
  SET total_clicks = total_clicks + 1 
  WHERE id = banner_ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
