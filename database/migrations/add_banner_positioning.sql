-- Migration: Add top/bottom positioning to sponsored banners
-- This migration adds display positioning controls for sponsored banners

-- Add positioning columns to sponsored_banners table
ALTER TABLE public.sponsored_banners 
ADD COLUMN IF NOT EXISTS display_on_top boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS display_on_bottom boolean DEFAULT false;

-- Add indexes for better performance on positioning queries
CREATE INDEX IF NOT EXISTS idx_sponsored_banners_display_on_top ON public.sponsored_banners(display_on_top);
CREATE INDEX IF NOT EXISTS idx_sponsored_banners_display_on_bottom ON public.sponsored_banners(display_on_bottom);

-- Add composite index for active banners with positioning
CREATE INDEX IF NOT EXISTS idx_sponsored_banners_active_positioning ON public.sponsored_banners(is_active, display_on_top, display_on_bottom);

-- Update existing banners to have default positioning (top only for now)
UPDATE public.sponsored_banners 
SET display_on_top = true, display_on_bottom = false 
WHERE display_on_top IS NULL OR display_on_bottom IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.sponsored_banners.display_on_top IS 'Controls if banner is displayed at the top of the page';
COMMENT ON COLUMN public.sponsored_banners.display_on_bottom IS 'Controls if banner is displayed at the bottom of the page';
