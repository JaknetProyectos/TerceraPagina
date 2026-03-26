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