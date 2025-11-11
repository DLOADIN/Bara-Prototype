-- Enhanced Events Slideshow with Video Support and User Submissions
-- Run this in Supabase SQL Editor

-- Add video support to existing event_slideshow_images table
ALTER TABLE event_slideshow_images 
ADD COLUMN IF NOT EXISTS media_type VARCHAR DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
ADD COLUMN IF NOT EXISTS video_url VARCHAR,
ADD COLUMN IF NOT EXISTS video_duration INTEGER, -- in seconds
ADD COLUMN IF NOT EXISTS video_thumbnail VARCHAR;

-- Create user submitted slideshow media table
CREATE TABLE IF NOT EXISTS user_slideshow_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL,
  user_email VARCHAR NOT NULL,
  user_name VARCHAR NOT NULL,
  title VARCHAR,
  description TEXT,
  media_type VARCHAR NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  media_url VARCHAR NOT NULL,
  thumbnail_url VARCHAR, -- for videos or image preview
  alt_text VARCHAR,
  submission_status VARCHAR NOT NULL DEFAULT 'pending' CHECK (submission_status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  reviewed_by VARCHAR,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_slideshow_submissions_user_id ON user_slideshow_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_slideshow_submissions_status ON user_slideshow_submissions(submission_status);
CREATE INDEX IF NOT EXISTS idx_user_slideshow_submissions_created_at ON user_slideshow_submissions(created_at DESC);

-- Function to approve user submission and move to main slideshow
CREATE OR REPLACE FUNCTION approve_user_slideshow_submission(
  submission_id UUID,
  admin_user_id VARCHAR,
  sort_order_value INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  submission_record user_slideshow_submissions%ROWTYPE;
  new_sort_order INTEGER;
BEGIN
  -- Get the submission record
  SELECT * INTO submission_record 
  FROM user_slideshow_submissions 
  WHERE id = submission_id AND submission_status = 'pending';
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Calculate sort order if not provided
  IF sort_order_value IS NULL THEN
    SELECT COALESCE(MAX(sort_order), 0) + 1 INTO new_sort_order
    FROM event_slideshow_images;
  ELSE
    new_sort_order := sort_order_value;
  END IF;
  
  -- Insert into main slideshow table
  INSERT INTO event_slideshow_images (
    title,
    description,
    image_url,
    image_alt_text,
    media_type,
    video_url,
    video_thumbnail,
    is_active,
    sort_order
  ) VALUES (
    submission_record.title,
    submission_record.description,
    CASE WHEN submission_record.media_type = 'image' THEN submission_record.media_url ELSE submission_record.thumbnail_url END,
    submission_record.alt_text,
    submission_record.media_type,
    CASE WHEN submission_record.media_type = 'video' THEN submission_record.media_url ELSE NULL END,
    submission_record.thumbnail_url,
    true, -- Make it active by default when approved
    new_sort_order
  );
  
  -- Update submission status
  UPDATE user_slideshow_submissions 
  SET 
    submission_status = 'approved',
    reviewed_by = admin_user_id,
    reviewed_at = NOW(),
    updated_at = NOW()
  WHERE id = submission_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to reject user submission
CREATE OR REPLACE FUNCTION reject_user_slideshow_submission(
  submission_id UUID,
  admin_user_id VARCHAR,
  rejection_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE user_slideshow_submissions 
  SET 
    submission_status = 'rejected',
    admin_notes = rejection_reason,
    reviewed_by = admin_user_id,
    reviewed_at = NOW(),
    updated_at = NOW()
  WHERE id = submission_id AND submission_status = 'pending';
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON TABLE user_slideshow_submissions IS 'User submitted slideshow media pending admin approval';
COMMENT ON COLUMN event_slideshow_images.media_type IS 'Type of media: image or video';
COMMENT ON COLUMN event_slideshow_images.video_url IS 'URL for video content when media_type is video';
COMMENT ON COLUMN event_slideshow_images.video_thumbnail IS 'Thumbnail image URL for video content';
COMMENT ON FUNCTION approve_user_slideshow_submission IS 'Approves user submission and moves to main slideshow';
COMMENT ON FUNCTION reject_user_slideshow_submission IS 'Rejects user submission with optional reason';