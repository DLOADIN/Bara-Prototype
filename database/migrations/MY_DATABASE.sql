-- =============================================
-- Fully Corrected PostgreSQL Schema
-- Fixes applied:
--   • Bare ARRAY → text[]
--   • USER-DEFINED → proper ENUM types
--   • Table order respects foreign key dependencies
-- =============================================

-- Custom ENUM types (must be created first)
CREATE TYPE business_status AS ENUM ('pending', 'approved', 'rejected', 'active', 'inactive');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded', 'cancelled');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE user_role AS ENUM ('user', 'admin', 'organizer');  -- Adjust values as needed

-- Independent / Base tables first

CREATE TABLE public.countries (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  flag_url text,
  wikipedia_url text,
  description text,
  population bigint,
  capital text,
  currency text,
  language text,
  created_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  flag_emoji text,
  CONSTRAINT countries_pkey PRIMARY KEY (id)
);

CREATE TABLE public.cities (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  country_id uuid,
  latitude numeric,
  longitude numeric,
  population bigint,
  created_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  CONSTRAINT cities_pkey PRIMARY KEY (id),
  CONSTRAINT cities_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id)
);

CREATE TABLE public.categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  icon text,
  description text,
  parent_id uuid,
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id)
);

-- auth.users is assumed to exist (Supabase/Auth)
-- We reference it but don't create it

CREATE TABLE public.users (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  full_name text,
  phone text,
  avatar_url text,
  role user_role DEFAULT 'user',
  country text,
  city text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);

CREATE TABLE public.businesses (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  category_id uuid,
  owner_id uuid,
  city_id uuid,
  country_id uuid,
  phone text,
  email text,
  website text,
  whatsapp text,
  address text,
  hours_of_operation jsonb,
  services jsonb,
  images text[],
  logo_url text,
  status business_status DEFAULT 'pending',
  is_premium boolean DEFAULT false,
  is_verified boolean DEFAULT false,
  meta_title text,
  meta_description text,
  view_count integer DEFAULT 0,
  click_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  has_coupons boolean DEFAULT false,
  accepts_orders_online boolean DEFAULT false,
  is_kid_friendly boolean DEFAULT false,
  is_sponsored_ad boolean DEFAULT false,
  order_online_url text,
  website_visible boolean DEFAULT true,
  reviews_count integer DEFAULT 0,
  average_rating numeric DEFAULT 0,
  latitude numeric,
  longitude numeric,
  CONSTRAINT businesses_pkey PRIMARY KEY (id),
  CONSTRAINT businesses_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
  CONSTRAINT businesses_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.users(id),
  CONSTRAINT businesses_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id),
  CONSTRAINT businesses_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id)
);

-- Tables that depend on core tables

CREATE TABLE public.ad_campaigns (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_id uuid,
  campaign_name text NOT NULL,
  campaign_type text NOT NULL DEFAULT 'featured_listing',
  target_cities text[],
  target_categories text[],
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  budget numeric NOT NULL,
  spent_amount numeric DEFAULT 0,
  daily_budget_limit numeric,
  is_active boolean DEFAULT false,
  admin_approved boolean DEFAULT false,
  admin_notes text,
  performance_metrics jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ad_campaigns_pkey PRIMARY KEY (id),
  CONSTRAINT ad_campaigns_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id)
);

CREATE TABLE public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id character varying NOT NULL UNIQUE,
  email character varying NOT NULL UNIQUE,
  first_name character varying,
  last_name character varying,
  role character varying NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  permissions text[] DEFAULT ARRAY['read', 'write'],
  last_login timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  is_active boolean DEFAULT true,
  added_by text,
  CONSTRAINT admin_users_pkey PRIMARY KEY (id)
);

CREATE TABLE public.admin_activity_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_user_id text NOT NULL,
  admin_email text NOT NULL,
  action text NOT NULL,
  target_user_id text,
  target_email text,
  details jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT admin_activity_log_pkey PRIMARY KEY (id)
);

CREATE TABLE public.banner_ads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  image_url text NOT NULL,
  redirect_url text NOT NULL,
  alt_text character varying,
  is_active boolean DEFAULT false,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  total_views integer DEFAULT 0,
  total_clicks integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  CONSTRAINT banner_ads_pkey PRIMARY KEY (id),
  CONSTRAINT banner_ads_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);

CREATE TABLE public.banner_ad_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  banner_ad_id uuid,
  event_type character varying NOT NULL CHECK (event_type IN ('view', 'click')),
  user_agent text,
  ip_address inet,
  referrer text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT banner_ad_analytics_pkey PRIMARY KEY (id),
  CONSTRAINT banner_ad_analytics_banner_ad_id_fkey FOREIGN KEY (banner_ad_id) REFERENCES public.banner_ads(id)
);

CREATE TABLE public.business_click_events (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  business_id uuid NOT NULL,
  source text DEFAULT 'listings',
  city text,
  category text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT business_click_events_pkey PRIMARY KEY (id),
  CONSTRAINT business_click_events_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id)
);

CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);

CREATE TABLE public.country_info (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  country_id uuid NOT NULL UNIQUE,
  description text,
  capital text,
  currency text,
  language text,
  population bigint,
  area_sq_km numeric,
  president_name text,
  government_type text,
  formation_date date,
  gdp_usd numeric,
  gdp_per_capita numeric,
  currency_code text,
  latitude numeric,
  longitude numeric,
  timezone text,
  calling_code text,
  average_age numeric,
  largest_city text,
  largest_city_population bigint,
  capital_population bigint,
  hdi_score numeric,
  literacy_rate numeric,
  life_expectancy numeric,
  ethnic_groups jsonb,
  religions jsonb,
  national_holidays jsonb,
  flag_url text,
  coat_of_arms_url text,
  national_anthem_url text,
  climate text,
  natural_resources text,
  main_industries text,
  tourism_attractions text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  created_by uuid,
  updated_by uuid,
  leader_image_url text,
  monument_image_url text,
  ad_image_url text,
  ad_company_name text,
  ad_company_website text,
  ad_tagline text,
  ad_is_active boolean DEFAULT false,
  ad_click_count integer DEFAULT 0,
  ad_view_count integer DEFAULT 0,
  ad_created_at timestamp with time zone DEFAULT now(),
  ad_updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT country_info_pkey PRIMARY KEY (id),
  CONSTRAINT country_info_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id),
  CONSTRAINT country_info_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT country_info_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES auth.users(id)
);

CREATE TABLE public.event_categories (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  color text DEFAULT '#6366f1',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_categories_pkey PRIMARY KEY (id)
);

CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  description text,
  organizer_id uuid,
  city_id uuid,
  country_id uuid,
  venue text,
  address text,
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  images text[],
  category text,
  tags text[],
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  organizer_name text,
  organizer_handle text,
  organizer_email text,
  organizer_phone text,
  venue_name text,
  venue_address text,
  venue_latitude numeric CHECK (venue_latitude IS NULL OR (venue_latitude >= -90 AND venue_latitude <= 90)),
  venue_longitude numeric CHECK (venue_longitude IS NULL OR (venue_longitude >= -180 AND venue_longitude <= 180)),
  event_image_url text,
  event_images text[],
  capacity integer,
  registration_url text,
  website_url text,
  facebook_url text,
  twitter_url text,
  instagram_url text,
  event_status text DEFAULT 'upcoming' CHECK (event_status IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  is_public boolean DEFAULT true,
  requires_approval boolean DEFAULT false,
  approved_by uuid,
  approved_at timestamp with time zone,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid,
  view_count integer DEFAULT 0,
  registration_count integer DEFAULT 0,
  created_by_user_id character varying,
  created_by_email character varying,
  created_by_name character varying,
  latitude numeric,
  longitude numeric,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES public.users(id),
  CONSTRAINT events_city_id_fkey FOREIGN KEY (city_id) REFERENCES public.cities(id),
  CONSTRAINT events_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id)
);

CREATE TABLE public.event_tickets (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  event_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  is_default boolean DEFAULT false,
  max_quantity integer,
  registered_quantity integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_tickets_pkey PRIMARY KEY (id),
  CONSTRAINT event_tickets_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);

CREATE TABLE public.event_slideshow_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_url text NOT NULL,
  image_alt_text text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  media_type character varying DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  video_url character varying,
  video_duration integer,
  video_thumbnail character varying,
  CONSTRAINT event_slideshow_images_pkey PRIMARY KEY (id)
);

CREATE TABLE public.global_africa (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text UNIQUE,
  flag_emoji text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT global_africa_pkey PRIMARY KEY (id)
);

CREATE TABLE public.global_africa_info (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  global_africa_id uuid NOT NULL UNIQUE,
  description text,
  location text,
  population bigint,
  area_sq_km numeric,
  leader_name text,
  organization_type text,
  established_date text,
  average_age numeric,
  largest_city text,
  largest_city_population bigint,
  latitude numeric,
  longitude numeric,
  timezone text,
  primary_language text,
  cultural_heritage text,
  notable_institutions text,
  historical_significance text,
  flag_url text,
  emblem_url text,
  leader_image_url text,
  landmark_image_url text,
  key_contributions text,
  cultural_events text,
  notable_figures text,
  resources text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT global_africa_info_pkey PRIMARY KEY (id),
  CONSTRAINT global_africa_info_global_africa_id_fkey FOREIGN KEY (global_africa_id) REFERENCES public.global_africa(id)
);

CREATE TABLE public.listing_claims (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_id uuid,
  business_name text NOT NULL,
  business_address text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text,
  website text,
  reason_for_claim text NOT NULL,
  additional_info text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
  admin_notes text,
  verified_at timestamp with time zone,
  processed_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  business_registration_number text NOT NULL DEFAULT '' CHECK (char_length(business_registration_number) >= 5),
  registrant_title text,
  CONSTRAINT listing_claims_pkey PRIMARY KEY (id),
  CONSTRAINT listing_claims_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id),
  CONSTRAINT listing_claims_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.admin_users(id)
);

CREATE TABLE public.payments (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_id uuid,
  user_id uuid,
  amount numeric NOT NULL,
  currency text DEFAULT 'USD',
  payment_method text,
  status payment_status DEFAULT 'pending',
  stripe_payment_intent_id text,
  description text,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT payments_pkey PRIMARY KEY (id),
  CONSTRAINT payments_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id),
  CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.popup_ads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  link_url text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  starts_at timestamp with time zone,
  ends_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT popup_ads_pkey PRIMARY KEY (id)
);

CREATE TABLE public.premium_features (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_id uuid,
  feature_type text NOT NULL,
  is_active boolean DEFAULT true,
  expires_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT premium_features_pkey PRIMARY KEY (id),
  CONSTRAINT premium_features_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id)
);

CREATE TABLE public.products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  seller_id uuid,
  business_id uuid,
  title text NOT NULL,
  description text,
  price numeric NOT NULL,
  currency text DEFAULT 'USD',
  images text[],
  category text,
  condition text,
  stock_quantity integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.users(id),
  CONSTRAINT products_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id)
);

CREATE TABLE public.questions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  content text NOT NULL,
  user_name character varying NOT NULL,
  user_email character varying NOT NULL,
  category character varying NOT NULL,
  status character varying DEFAULT 'pending' CHECK (status IN ('pending', 'answered', 'closed')),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT questions_pkey PRIMARY KEY (id)
);

CREATE TABLE public.reviews (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  business_id uuid,
  user_id uuid,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text,
  images text[],
  status review_status DEFAULT 'pending',
  helpful_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reviews_pkey PRIMARY KEY (id),
  CONSTRAINT reviews_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id),
  CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);

CREATE TABLE public.rss_feed_sources (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  url text NOT NULL UNIQUE,
  country_code text,
  country_name text,
  category text,
  is_active boolean DEFAULT true,
  fetch_interval_minutes integer DEFAULT 60,
  last_fetched_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rss_feed_sources_pkey PRIMARY KEY (id)
);

CREATE TABLE public.rss_feeds (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title text NOT NULL,
  link text NOT NULL,
  description text,
  pub_date timestamp with time zone,
  source text NOT NULL,
  country_code text,
  country_name text,
  image_url text,
  author text,
  category text,
  guid text UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rss_feeds_pkey PRIMARY KEY (id)
);

CREATE TABLE public.slideshow_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text,
  description text,
  image_url text NOT NULL,
  image_alt_text text,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  uploaded_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  show_on_events boolean NOT NULL DEFAULT false,
  CONSTRAINT slideshow_images_pkey PRIMARY KEY (id),
  CONSTRAINT slideshow_images_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id)
);

CREATE TABLE public.sponsored_banners (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  country_id uuid NOT NULL,
  company_name text NOT NULL,
  company_website text NOT NULL,
  banner_image_url text NOT NULL,
  banner_alt_text text,
  is_active boolean DEFAULT false,
  submitted_by_user_id uuid,
  payment_status text DEFAULT 'pending',
  payment_id text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  payment_amount numeric,
  contact_name text,
  contact_email text,
  contact_phone text,
  show_on_country_detail boolean DEFAULT true,
  view_count integer DEFAULT 0,
  click_count integer DEFAULT 0,
  display_on_top boolean DEFAULT false,
  display_on_bottom boolean DEFAULT false,
  CONSTRAINT sponsored_banners_pkey PRIMARY KEY (id),
  CONSTRAINT sponsored_banners_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id)
);

CREATE TABLE public.sponsored_banner_countries (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  banner_id uuid NOT NULL,
  country_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sponsored_banner_countries_pkey PRIMARY KEY (id),
  CONSTRAINT sponsored_banner_countries_banner_id_fkey FOREIGN KEY (banner_id) REFERENCES public.sponsored_banners(id),
  CONSTRAINT sponsored_banner_countries_country_id_fkey FOREIGN KEY (country_id) REFERENCES public.countries(id)
);

CREATE TABLE public.sponsored_banner_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  banner_id uuid NOT NULL,
  event_type character varying NOT NULL CHECK (event_type IN ('view', 'click')),
  user_agent text,
  ip_address inet,
  referrer text,
  country_code text,
  city text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sponsored_banner_analytics_pkey PRIMARY KEY (id),
  CONSTRAINT sponsored_banner_analytics_banner_id_fkey FOREIGN KEY (banner_id) REFERENCES public.sponsored_banners(id)
);

CREATE TABLE public.user_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id character varying NOT NULL,
  user_email character varying NOT NULL,
  action character varying NOT NULL,
  resource_type character varying NOT NULL,
  resource_id character varying,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_logs_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_slideshow_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id character varying NOT NULL,
  user_email character varying NOT NULL,
  user_name character varying NOT NULL,
  title character varying,
  description text,
  media_type character varying NOT NULL DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
  media_url character varying NOT NULL,
  thumbnail_url character varying,
  alt_text character varying,
  submission_status character varying NOT NULL DEFAULT 'pending' CHECK (submission_status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  reviewed_by character varying,
  reviewed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_slideshow_submissions_pkey PRIMARY KEY (id)
);

CREATE TABLE public.user_verifications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id character varying NOT NULL,
  verification_type character varying NOT NULL CHECK (verification_type IN ('email', 'phone', 'business', 'trusted_organizer')),
  is_verified boolean DEFAULT false,
  verified_at timestamp with time zone,
  verified_by character varying,
  verification_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_verifications_pkey PRIMARY KEY (id)
);