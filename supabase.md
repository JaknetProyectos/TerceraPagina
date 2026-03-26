# Supabase Setup

Editar el .env

```sh
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 # cambiamos el puerto por el KONG_HTTP_PORT o el KONG_HTTPS_PORT
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5c

# Create supabase, cambiar el nombre del proyecto
PROJECT_NAME=adventure_trip

# Cambiar puertos para evitar conflictos
POSTGRES_PORT=54332
KONG_HTTP_PORT=8001
KONG_HTTPS_PORT=8444
STUDIO_PORT=54333

POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres

# las keys se generan con el script
```

Ejecutamos el script

```sh
bash generate-secrets.sh
```

Esto nos va a generar los tokens

```sh
JWT_SECRET=bc9551bbd0cbcf1013205455277864a303c5547b6c9763f55daa7c129009120b
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiJ9.cA6OwKS5yww5nJsHSFegOd_M4Hp-QoFqzexwyOjNq2k
SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.qKZTIq7muXfi_lrtWgUimtmIuKe-Qlowak6sy7jl7h8
```

Luego de esto ya iniciamos el docker-compose

```sh
docker-compose up -d
```

Y podemos acceder a la interfaz de supabase desde IPservidor:54333 STUDIO_PORT

# Esquemas


create table public.destinations_wondermx (
  id text not null,
  slug text null,
  name text null,
  short_description text null,
  description text null,
  hero_image text null,
  card_image text null,
  highlights text[] null,
  bg_color text null,
  constraint destinations_wondermx_pkey primary key (id),
  constraint destinations_wondermx_slug_key unique (slug)
) TABLESPACE pg_default;

create table public.experiences_wondermx (
  id text not null,
  destination_slug text null,
  destination_name text null,
  title text null,
  description text null,
  duration text null,
  price numeric null,
  price_formatted text null,
  image text null,
  category text null,
  rating numeric null,
  review_count integer null,
  images text[] null,
  caracteristicas_servicio text[] null,
  itinerario text null,
  incluido text[] null,
  no_incluido text[] null,
  accesibilidad text[] null,
  reservaciones_antelacion text null,
  constraint experiences_ournextrip_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists experiences_ournextrip_destination_slug_idx on public.experiences_wondermx using btree (destination_slug) TABLESPACE pg_default;

create table public.reservations_wondermx (
  id uuid not null default extensions.uuid_generate_v4 (),
  activity_title text not null,
  destination_name text not null,
  fecha date not null,
  personas integer not null,
  nombre text not null,
  email text not null,
  telefono text not null,
  price text not null,
  comentarios text null,
  status text null default 'pending'::text,
  created_at timestamp with time zone null default now(),
  constraint reservations_wondermx_pkey primary key (id),
  constraint status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'confirmed'::text,
          'completed'::text,
          'cancelled'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

# Datos