-- Migration: Add user event tracking and verification system
-- Description: Enable users to create events and add verification badge system

-- Add user tracking to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by_user_id VARCHAR;
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by_email VARCHAR;
ALTER TABLE events ADD COLUMN IF NOT EXISTS created_by_name VARCHAR;

-- Create user verifications table for badge system
CREATE TABLE IF NOT EXISTS user_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR NOT NULL,
  verification_type VARCHAR NOT NULL,
  is_verified BOOLEAN DEFAULT false,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by VARCHAR,
  verification_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_verifications_user_id ON user_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_user_verifications_type ON user_verifications(verification_type);
CREATE INDEX IF NOT EXISTS idx_events_created_by_user ON events(created_by_user_id);

-- Add verification types as enum-like constraints
ALTER TABLE user_verifications ADD CONSTRAINT check_verification_type 
  CHECK (verification_type IN ('email', 'phone', 'business', 'trusted_organizer'));

-- Function to get user verification status
CREATE OR REPLACE FUNCTION get_user_verification_status(user_id_param VARCHAR)
RETURNS TABLE(
  verification_type VARCHAR,
  is_verified BOOLEAN,
  verified_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    uv.verification_type,
    uv.is_verified,
    uv.verified_at
  FROM user_verifications uv
  WHERE uv.user_id = user_id_param
  AND uv.is_verified = true
  ORDER BY uv.verified_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user has any verification
CREATE OR REPLACE FUNCTION user_has_verification(user_id_param VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM user_verifications 
    WHERE user_id = user_id_param 
    AND is_verified = true
  );
END;
$$ LANGUAGE plpgsql;

-- Function to get highest verification level
CREATE OR REPLACE FUNCTION get_user_verification_level(user_id_param VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
  verification_level VARCHAR := 'unverified';
BEGIN
  -- Check for trusted organizer (highest level)
  IF EXISTS(SELECT 1 FROM user_verifications WHERE user_id = user_id_param AND verification_type = 'trusted_organizer' AND is_verified = true) THEN
    verification_level := 'trusted_organizer';
  -- Check for business verification
  ELSIF EXISTS(SELECT 1 FROM user_verifications WHERE user_id = user_id_param AND verification_type = 'business' AND is_verified = true) THEN
    verification_level := 'business';
  -- Check for phone verification
  ELSIF EXISTS(SELECT 1 FROM user_verifications WHERE user_id = user_id_param AND verification_type = 'phone' AND is_verified = true) THEN
    verification_level := 'phone';
  -- Check for email verification
  ELSIF EXISTS(SELECT 1 FROM user_verifications WHERE user_id = user_id_param AND verification_type = 'email' AND is_verified = true) THEN
    verification_level := 'email';
  END IF;
  
  RETURN verification_level;
END;
$$ LANGUAGE plpgsql;

-- Insert default email verification for existing Clerk users (they already have verified emails)
-- This will be handled by the application when users first sign in

-- Add comment to track migration
COMMENT ON TABLE user_verifications IS 'User verification badges system - tracks email, phone, business, and trusted organizer verifications';
COMMENT ON COLUMN events.created_by_user_id IS 'Clerk user ID of the event creator';
COMMENT ON COLUMN events.created_by_email IS 'Email of the event creator';
COMMENT ON COLUMN events.created_by_name IS 'Display name of the event creator';