-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.destinations (
  id text NOT NULL,
  slug text UNIQUE,
  name text,
  short_description text,
  description text,
  hero_image text,
  card_image text,
  highlights ARRAY,
  bg_color text,
  CONSTRAINT destinations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.experiences (
  id text NOT NULL,
  destination_slug text,
  destination_name text,
  title text,
  description text,
  duration text,
  price numeric,
  price_formatted text,
  image text,
  category text,
  rating numeric,
  review_count integer,
  images ARRAY,
  CONSTRAINT experiences_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reservations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  activity_title text NOT NULL,
  destination_name text NOT NULL,
  fecha date NOT NULL,
  personas integer NOT NULL,
  nombre text NOT NULL,
  email text NOT NULL,
  telefono text NOT NULL,
  price text NOT NULL,
  comentarios text,
  status text DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'confirmed'::text, 'completed'::text, 'cancelled'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reservations_pkey PRIMARY KEY (id)
);