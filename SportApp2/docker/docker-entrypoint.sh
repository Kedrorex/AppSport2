#!/bin/sh
set -eu

CERT_DIR="/etc/letsencrypt/live/app"

if [ ! -f "$CERT_DIR/fullchain.pem" ] || [ ! -f "$CERT_DIR/privkey.pem" ]; then
  echo "[entrypoint] No certificate found. Creating a temporary self-signed certificate..."
  mkdir -p "$CERT_DIR"
  openssl req -x509 -nodes -newkey rsa:2048 \
    -keyout "$CERT_DIR/privkey.pem" \
    -out "$CERT_DIR/fullchain.pem" \
    -subj "/CN=localhost" \
    -days 1 >/dev/null 2>&1
fi

exec nginx -g 'daemon off;'
