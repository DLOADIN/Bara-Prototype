-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.background_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  title character varying,
  description text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_by character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  link_url text,
  CONSTRAINT background_images_pkey PRIMARY KEY (id)
);
CREATE TABLE public.careers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  location text NOT NULL,
  employment_type text,
  salary_range text,
  application_url text,
  apply_email text,
  posting_date date DEFAULT now(),
  closing_date date,
  description text NOT NULL,
  requirements text,
  responsibilities text,
  status text DEFAULT 'open'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT careers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.comments (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid,
  name text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT comments_pkey PRIMARY KEY (id),
  CONSTRAINT comments_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE TABLE public.consultation_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text NOT NULL,
  country_slug text NOT NULL,
  service_id text NOT NULL,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT consultation_requests_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contact_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT contact_submissions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.event_attendees (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid,
  name text NOT NULL,
  email text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT event_attendees_pkey PRIMARY KEY (id),
  CONSTRAINT event_attendees_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.event_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  caption text,
  is_primary boolean DEFAULT false,
  uploaded_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT event_images_pkey PRIMARY KEY (id),
  CONSTRAINT event_images_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  location text,
  start_at timestamp with time zone NOT NULL,
  end_at timestamp with time zone NOT NULL,
  image_url text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT events_pkey PRIMARY KEY (id)
);
CREATE TABLE public.likes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid,
  user_identifier text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT likes_pkey PRIMARY KEY (id),
  CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE TABLE public.post_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL,
  image_url text NOT NULL,
  display_order integer DEFAULT 0,
  caption text,
  is_primary boolean DEFAULT false,
  uploaded_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT post_images_pkey PRIMARY KEY (id),
  CONSTRAINT post_images_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id)
);
CREATE TABLE public.posts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  content text,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.services (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT services_pkey PRIMARY KEY (id)
);