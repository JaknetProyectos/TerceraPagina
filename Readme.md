create table public.cotizaciones_wondermx (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  nombre text not null,
  price double precision null,
  email text not null,
  telefono text not null,
  personas text not null,
  experiencia_slug text not null,
  detalles text null,
  estado text null default 'pendiente'::text,
  experience_title text null,
  constraint cotizaciones_wondermx_pkey primary key (id)
) TABLESPACE pg_default;