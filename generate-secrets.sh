#!/bin/bash

ENV_FILE=.env

if grep -q "JWT_SECRET" "$ENV_FILE" 2>/dev/null; then
  echo "🔐 Secrets ya existen, no se regeneran"
  exit 0
fi

echo "⚡ Generando secrets..."

JWT_SECRET=$(openssl rand -hex 32)

# Crear JWT manualmente (header + payload + firma)
base64url() {
  openssl base64 -A | tr '+/' '-_' | tr -d '='
}

sign() {
  printf "%s" "$1" | openssl dgst -sha256 -hmac "$JWT_SECRET" -binary | base64url
}

make_jwt() {
  HEADER=$(printf '{"alg":"HS256","typ":"JWT"}' | base64url)
  PAYLOAD=$(printf "$1" | base64url)
  SIGNATURE=$(sign "$HEADER.$PAYLOAD")
  echo "$HEADER.$PAYLOAD.$SIGNATURE"
}

ANON_KEY=$(make_jwt '{"role":"anon"}')
SERVICE_KEY=$(make_jwt '{"role":"service_role"}')

cat <<EOF >> .env

JWT_SECRET=$JWT_SECRET
ANON_KEY=$ANON_KEY
SERVICE_KEY=$SERVICE_KEY
EOF

echo "✅ Secrets generados en .env"