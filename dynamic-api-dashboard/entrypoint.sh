#!/bin/sh
set -e

# Replace placeholder __VITE_API_URL__ with actual env value at container startup
: "${VITE_API_URL:=http://localhost:8080}"  # default fallback

echo "Injecting VITE_API_URL=$VITE_API_URL into frontend..."

find /usr/share/nginx/html -type f -exec \
  sed -i "s|__VITE_API_URL__|$VITE_API_URL|g" {} \;

# Start Nginx
exec nginx -g 'daemon off;'
